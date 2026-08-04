import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Escape special HTML characters to prevent injection in email body */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** RFC-5322-ish email format check */
const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

// ── Rate limiting (simple in-memory store) ────────────────────────────────────
// Stores { ip: lastSubmitTimestamp }. Resets on server restart.
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 60_000; // 1 submission per IP per minute

// ── App setup ─────────────────────────────────────────────────────────────────

const app = express();

// Restrict CORS to your own origin in production
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  methods: ['POST'],
}));

app.use(express.json({ limit: '16kb' })); // limit body size

// ── Transporter (created once at startup) ─────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ── Contact route ─────────────────────────────────────────────────────────────

app.post('/api/contact', async (req, res) => {
  const { name, email, message, honeypot } = req.body;

  // 1. Honeypot check — bots fill hidden fields, real users never do
  if (honeypot) {
    console.warn(`Honeypot triggered from IP: ${req.ip}`);
    // Return a fake 200 — don't tip bots off that they were blocked
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  // 2. Simple IP-based rate limit
  const ip = req.ip;
  const lastSubmit = rateLimitMap.get(ip);
  if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment before sending again.' });
  }

  // 3. Required field presence
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // 4. Input length limits
  if (name.trim().length > 100) {
    return res.status(400).json({ error: 'Name must be 100 characters or fewer.' });
  }
  if (message.trim().length > 3000) {
    return res.status(400).json({ error: 'Message must be 3000 characters or fewer.' });
  }

  // 5. Email format validation
  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // 6. Sanitise inputs before embedding in HTML
  const safeName    = escapeHtml(name.trim());
  const safeEmail   = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim());

  // 7. Build mail options
  const mailOptions = {
    from: `Portfolio Contact <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email.trim(),   // raw email safe in headers
    subject: `New Portfolio Message from ${safeName}`,
    text: `New message from your portfolio.\n\nName: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2C1810; padding: 20px; text-align: center;">
          <h2 style="color: #C8922A; margin: 0; font-family: Georgia, serif;">⚔ New Portfolio Dispatch ⚔</h2>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #2C1810; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Sender Details</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #C8922A;">${safeEmail}</a></p>
          <h3 style="color: #2C1810; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 20px;">Message</h3>
          <div style="background-color: #F5E6C8; padding: 15px; border-radius: 6px; border-left: 4px solid #C8922A;">
            <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 0.85rem; color: #64748b;">
          <p style="margin: 0;">Sent securely from your Portfolio · Divakar R</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    // Record this IP's last submit time
    rateLimitMap.set(ip, Date.now());
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    // Log full error server-side only — never expose internal details to the client
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Nodemailer server running on http://localhost:${PORT}`);
});
