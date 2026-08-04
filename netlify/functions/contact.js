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
async function logToFirestore({ ip, name, email, message, userAgent, status, honeypotValue, gpsData }) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return;

    const db     = getDB();
    const ipKey  = (ip || "unknown").replace(/[.:]/g, "_");
    const ipRef  = db.collection("ip_summary").doc(ipKey);
    const ipSnap = await ipRef.get();

    const geo = ipSnap.exists && ipSnap.data().geo?.country
      ? ipSnap.data().geo
      : await getGeo(ip);

    const timestamp = new Date().toISOString();

    const exactGps = gpsData && typeof gpsData.lat === "number" && typeof gpsData.lon === "number"
      ? { lat: gpsData.lat, lon: gpsData.lon, accuracy: gpsData.accuracy || 0, source: "DEVICE_GPS" }
      : null;

    const logEntry = {
      timestamp,
      ip:            ip            || "unknown",
      name:          name          || "",
      email:         email         || "",
      message:       message       || "",
      userAgent:     userAgent     || "",
      status,
      honeypotValue: honeypotValue || "",
      flagged:       false,
      geo,
      exactGps,
    };

    const batch = db.batch();

    batch.set(db.collection("contact_logs").doc(), logEntry);

    const ipDataUpdate = {
      lastSeen:         timestamp,
      totalSubmissions: FieldValue.increment(1),
      successCount:     FieldValue.increment(status === "SUCCESS" ? 1 : 0),
      blockedCount:     FieldValue.increment(status !== "SUCCESS" ? 1 : 0),
      lastEmail:        email || "",
      lastName:         name  || "",
    };
    if (exactGps) ipDataUpdate.lastExactGps = exactGps;

    if (!ipSnap.exists) {
      batch.set(ipRef, {
        firstSeen: timestamp,
        flagged:   false,
        geo,
        ...ipDataUpdate,
      });
    } else {
      batch.update(ipRef, ipDataUpdate);
    }

    await batch.commit();
  } catch (err) {
    console.error("Firestore log error:", err.message);
  }
}

// ── Netlify Handler ───────────────────────────────────────────────────────────
export const handler = async (event) => {
  const ip = (
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    ""
  ).split(",")[0].trim().replace(/^::ffff:/, "") || "unknown";

  const userAgent = event.headers["user-agent"] || "";

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  if (!event.body) {
    await logToFirestore({ ip, name: "", email: "", message: "", userAgent, status: "INVALID", honeypotValue: "", gpsData: null });
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request: Missing body." }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    await logToFirestore({ ip, name: "", email: "", message: "", userAgent, status: "INVALID", honeypotValue: "", gpsData: null });
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request: Body is not valid JSON." }) };
  }

  const { name, email, message, honeypot, gpsData } = body;

  if (honeypot) {
    console.warn(`Honeypot triggered — IP: ${ip}`);
    await logToFirestore({ ip, name: name || "", email: email || "", message: message || "", userAgent, status: "BOT_BLOCKED", honeypotValue: honeypot, gpsData });
    return { statusCode: 200, body: JSON.stringify({ success: true, message: "Message sent successfully." }) };
  }

  // ── Mandatory Location Check ────────────────────────────────────────────────
  if (!gpsData || typeof gpsData.lat !== "number" || typeof gpsData.lon !== "number") {
    await logToFirestore({ ip, name: name || "", email: email || "", message: message || "", userAgent, status: "INVALID", honeypotValue: "", gpsData: null });
    return { statusCode: 400, body: JSON.stringify({ error: "Location verification required. Please enable location permissions in your browser to dispatch a scroll." }) };
  }

  if (!name || !email || !message) {
    await logToFirestore({ ip, name: name || "", email: email || "", message: message || "", userAgent, status: "INVALID", honeypotValue: "", gpsData });
    return { statusCode: 400, body: JSON.stringify({ error: "All fields are required (name, email, message)." }) };
  }

  if (name.trim().length > 100) {
    await logToFirestore({ ip, name: name.trim(), email, message, userAgent, status: "INVALID", honeypotValue: "", gpsData });
    return { statusCode: 400, body: JSON.stringify({ error: "Name must be 100 characters or fewer." }) };
  }
  if (message.trim().length > 3000) {
    await logToFirestore({ ip, name: name.trim(), email, message: message.trim(), userAgent, status: "INVALID", honeypotValue: "", gpsData });
    return { statusCode: 400, body: JSON.stringify({ error: "Message must be 3000 characters or fewer." }) };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    await logToFirestore({ ip, name: name.trim(), email: email.trim(), message: message.trim(), userAgent, status: "INVALID", honeypotValue: "", gpsData });
    return { statusCode: 400, body: JSON.stringify({ error: "Please enter a valid email address." }) };
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Missing Gmail environment variables!");
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error. Please try again later." }) };
  }

  const safeName    = escapeHtml(name.trim());
  const safeEmail   = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim());

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const gpsInfoText = gpsData && gpsData.lat && gpsData.lon
    ? `Device GPS Pin: https://maps.google.com?q=${gpsData.lat},${gpsData.lon} (Accuracy: ±${gpsData.accuracy || 0}m)`
    : "Device GPS: Denied/Not available";

  const mailOptions = {
    from:    `Portfolio Contact <${process.env.GMAIL_USER}>`,
    to:      process.env.GMAIL_USER,
    replyTo: email.trim(),
    subject: `New Portfolio Message from ${safeName}`,
    text:    `New message from your portfolio.\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nIP: ${ip}\n${gpsInfoText}\n\nMessage:\n${message.trim()}`,
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
          ${gpsData && gpsData.lat && gpsData.lon ? `<p><strong>🎯 Exact Device GPS Pin:</strong> <a href="https://maps.google.com?q=${gpsData.lat},${gpsData.lon}" target="_blank" style="color: #4ade80; font-weight: bold;">View Physical Location (±${gpsData.accuracy || 0}m)</a></p>` : ''}
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
    await logToFirestore({
      ip, name: name.trim(), email: email.trim(), message: message.trim(), userAgent, status: "SUCCESS", honeypotValue: "", gpsData,
    });
    return { statusCode: 200, body: JSON.stringify({ success: true, message: "Message sent successfully." }) };
  } catch (error) {
    console.error("Email send error:", error);
    await logToFirestore({
      ip, name: name.trim(), email: email.trim(), message: message.trim(), userAgent, status: "MAIL_ERROR", honeypotValue: "", gpsData,
    });
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send message. Please try again later." }) };
  }
};
