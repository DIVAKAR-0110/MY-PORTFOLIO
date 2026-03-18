import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const mailOptions = {
    from: `Portfolio Contact <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // Send it to yourself
    replyTo: email,
    subject: `New Portfolio Message from ${name}`,
    text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <h2 style="color: #22d3ee; margin: 0;">New Portfolio Transmission</h2>
        </div>
        <div style="padding: 20px;">
          <h3 style="color: #0f172a; margin-top: 0;">Sender Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #14b8a6;">${email}</a></p>
          
          <h3 style="color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 20px;">Message payload:</h3>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 0.85rem; color: #64748b;">
          <p style="margin: 0;">This transmission was sent securely from your AI Portfolio Interface.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Nodemailer server running on http://localhost:${PORT}`);
});
