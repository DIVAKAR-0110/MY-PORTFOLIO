import nodemailer from "nodemailer";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ── Private Key Normalizer ───────────────────────────────────────────────────
function parsePrivateKey(key) {
  if (!key) return undefined;
  let formatted = key.trim().replace(/^["']|["']$/g, "");
  return formatted.replace(/\\n/g, "\n");
}

// ── Firebase Admin (singleton — safe for warm serverless starts) ──────────────
function getCredentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    let str = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
    if (!str.startsWith("{")) {
      str = Buffer.from(str, "base64").toString("utf-8");
    }
    return cert(JSON.parse(str));
  }

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `Missing Firebase environment variables! Received: projectId=${!!projectId}, clientEmail=${!!clientEmail}, privateKey=${!!privateKey}`
    );
  }

  return cert({ projectId, clientEmail, privateKey });
}

function getDB() {
  const app =
    getApps().length === 0
      ? initializeApp({
          credential: getCredentials(),
        })
      : getApp();
  return getFirestore(app);
}

// ── HTML Escaper ──────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Email Regex ───────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

// ── Geo Lookup (ip-api.com — free, no key needed) ────────────────────────────
async function getGeo(ip) {
  try {
    const isLocal =
      !ip ||
      ip === "::1" ||
      ip.startsWith("127.") ||
      ip.startsWith("10.") ||
      ip.startsWith("192.168.") ||
      ip === "unknown";
    if (isLocal) {
      return { country: "Local", countryCode: "LO", region: "Local", city: "Local", isp: "Local", lat: 0, lon: 0 };
    }
    const resp = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,lat,lon`,
      { signal: AbortSignal.timeout(3000) }
    );
    const data = await resp.json();
    if (data.status !== "success") throw new Error("geo failed");
    return {
      country:     data.country      || "Unknown",
      countryCode: data.countryCode  || "??",
      region:      data.regionName   || "Unknown",
      city:        data.city         || "Unknown",
      isp:         data.isp          || "Unknown",
      lat:         data.lat          || 0,
      lon:         data.lon          || 0,
    };
  } catch {
    return { country: "Unknown", countryCode: "??", region: "Unknown", city: "Unknown", isp: "Unknown", lat: 0, lon: 0 };
  }
}

// ── Firestore Logger ──────────────────────────────────────────────────────────
async function logToFirestore({ ip, name, email, message, userAgent, status, honeypotValue }) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) return; // Skip if Firebase not configured

    const db     = getDB();
    // Firestore doc keys can't contain dots — use underscores
    const ipKey  = (ip || "unknown").replace(/[.:]/g, "_");
    const ipRef  = db.collection("ip_summary").doc(ipKey);
    const ipSnap = await ipRef.get();

    // Reuse cached geo if this IP has been seen before, else fetch
    const geo = ipSnap.exists && ipSnap.data().geo?.country
      ? ipSnap.data().geo
      : await getGeo(ip);

    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      ip:            ip            || "unknown",
      name:          name          || "",
      email:         email         || "",
      message:       message       || "",
      userAgent:     userAgent     || "",
      status,
      honeypotValue: honeypotValue || "",
      flagged:       false,          // top-level — easier to query than nested geo.flagged
      geo,
    };

    const batch = db.batch();

    // 1. New log entry (auto-id)
    batch.set(db.collection("contact_logs").doc(), logEntry);

    // 2. Upsert ip_summary
    if (!ipSnap.exists) {
      batch.set(ipRef, {
        firstSeen:        timestamp,
        lastSeen:         timestamp,
        totalSubmissions: 1,
        successCount:     status === "SUCCESS" ? 1 : 0,
        blockedCount:     status !== "SUCCESS" ? 1 : 0,
        flagged:          false,
        lastEmail:        email || "",
        lastName:         name  || "",
        geo,
      });
    } else {
      batch.update(ipRef, {
        lastSeen:         timestamp,
        totalSubmissions: FieldValue.increment(1),
        successCount:     FieldValue.increment(status === "SUCCESS" ? 1 : 0),
        blockedCount:     FieldValue.increment(status !== "SUCCESS" ? 1 : 0),
        lastEmail:        email || "",
        lastName:         name  || "",
      });
    }

    await batch.commit();
  } catch (err) {
    // Firestore failure must NEVER break email delivery
    console.error("Firestore log error:", err.message);
  }
}

// ── Netlify Handler ───────────────────────────────────────────────────────────
export const handler = async (event) => {
  // Extract metadata from every request (used by the logger)
  const ip = (
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    ""
  ).split(",")[0].trim().replace(/^::ffff:/, "") || "unknown";

  const userAgent = event.headers["user-agent"] || "";

  // ── 1. Only POST ────────────────────────────────────────────────────────────
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  // ── 2. Parse body ───────────────────────────────────────────────────────────
  if (!event.body) {
    await logToFirestore({ ip, name: "", email: "", message: "", userAgent, status: "INVALID", honeypotValue: "" });
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request: Missing body." }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    await logToFirestore({ ip, name: "", email: "", message: "", userAgent, status: "INVALID", honeypotValue: "" });
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request: Body is not valid JSON." }) };
  }

  const { name, email, message, honeypot } = body;

  // ── 3. Honeypot — bots fill hidden fields, real users never do ──────────────
  if (honeypot) {
    console.warn(`Honeypot triggered — IP: ${ip}`);
    await logToFirestore({ ip, name: name || "", email: email || "", message: message || "", userAgent, status: "BOT_BLOCKED", honeypotValue: honeypot });
    // Return fake 200 so bots think they succeeded
    return { statusCode: 200, body: JSON.stringify({ success: true, message: "Message sent successfully." }) };
  }

  // ── 4. Required field presence ──────────────────────────────────────────────
  if (!name || !email || !message) {
    await logToFirestore({ ip, name: name || "", email: email || "", message: message || "", userAgent, status: "INVALID", honeypotValue: "" });
    return { statusCode: 400, body: JSON.stringify({ error: "All fields are required (name, email, message)." }) };
  }

  // ── 5. Input length limits ──────────────────────────────────────────────────
  if (name.trim().length > 100) {
    await logToFirestore({ ip, name: name.trim(), email, message, userAgent, status: "INVALID", honeypotValue: "" });
    return { statusCode: 400, body: JSON.stringify({ error: "Name must be 100 characters or fewer." }) };
  }
  if (message.trim().length > 3000) {
    await logToFirestore({ ip, name: name.trim(), email, message: message.trim(), userAgent, status: "INVALID", honeypotValue: "" });
    return { statusCode: 400, body: JSON.stringify({ error: "Message must be 3000 characters or fewer." }) };
  }

  // ── 6. Email format validation ──────────────────────────────────────────────
  if (!EMAIL_REGEX.test(email.trim())) {
    await logToFirestore({ ip, name: name.trim(), email: email.trim(), message: message.trim(), userAgent, status: "INVALID", honeypotValue: "" });
    return { statusCode: 400, body: JSON.stringify({ error: "Please enter a valid email address." }) };
  }

  // ── 7. Server credentials check ─────────────────────────────────────────────
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Missing Gmail environment variables!");
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error. Please try again later." }) };
  }

  // ── 8. Sanitise inputs ──────────────────────────────────────────────────────
  const safeName    = escapeHtml(name.trim());
  const safeEmail   = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim());

  // ── 9. Send email ───────────────────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from:    `Portfolio Contact <${process.env.GMAIL_USER}>`,
    to:      process.env.GMAIL_USER,
    replyTo: email.trim(),
    subject: `New Portfolio Message from ${safeName}`,
    text:    `New message from your portfolio.\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nIP: ${ip}\n\nMessage:\n${message.trim()}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2C1810; padding: 20px; text-align: center;">
          <h2 style="color: #C8922A; margin: 0; font-family: Georgia, serif;">⚔ New Portfolio Dispatch ⚔</h2>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #2C1810; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Sender Details</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #C8922A;">${safeEmail}</a></p>
          <p><strong>IP Address:</strong> <code>${ip}</code></p>
          <h3 style="color: #2C1810; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 20px;">Message</h3>
          <div style="background-color: #F5E6C8; padding: 15px; border-radius: 6px; border-left: 4px solid #C8922A;">
            <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 0.85rem; color: #64748b;">
          <p style="margin: 0;">Sent securely from your Portfolio · Divakar R · Intel Vault logged</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // Log success AFTER the email is confirmed sent
    await logToFirestore({
      ip, name: name.trim(), email: email.trim(), message: message.trim(), userAgent, status: "SUCCESS", honeypotValue: "",
    });
    return { statusCode: 200, body: JSON.stringify({ success: true, message: "Message sent successfully." }) };
  } catch (error) {
    console.error("Email send error:", error);
    await logToFirestore({
      ip, name: name.trim(), email: email.trim(), message: message.trim(), userAgent, status: "MAIL_ERROR", honeypotValue: "",
    });
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send message. Please try again later." }) };
  }
};
