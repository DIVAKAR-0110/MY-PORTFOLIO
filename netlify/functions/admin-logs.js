import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ── Private Key Normalizer ───────────────────────────────────────────────────
function parsePrivateKey(key) {
  if (!key) return undefined;
  // Remove wrapping quotes if user included them in Netlify UI
  let formatted = key.trim().replace(/^["']|["']$/g, "");
  // Convert literal \n to actual newlines
  formatted = formatted.replace(/\\n/g, "\n");
  return formatted;
}

// ── Firebase Admin (singleton) ────────────────────────────────────────────────
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

// ── Validate Admin Password ───────────────────────────────────────────────────
function isAuthorized(event) {
  const auth = event.headers["authorization"] || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  return process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export const handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  // ── Auth check ──────────────────────────────────────────────────────────────
  if (!isAuthorized(event)) {
    return {
      statusCode: 401,
      headers: cors,
      body: JSON.stringify({ error: "Unauthorized — invalid cipher." }),
    };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // GET — Fetch all logs + IP summaries
  // ════════════════════════════════════════════════════════════════════════════
  if (event.httpMethod === "GET") {
    try {
      const db = getDB();
      const params = event.queryStringParameters || {};
      const { status, flagged, limit = "500" } = params;

      // Fetch docs without orderBy to avoid index errors, sort in memory
      const logsSnap = await db.collection("contact_logs").get();
      let logs = logsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Sort newest first
      logs.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));

      // Limit results
      logs = logs.slice(0, parseInt(limit, 10));

      // In-memory filters
      if (status)          logs = logs.filter((l) => l.status === status);
      if (flagged === "true") logs = logs.filter((l) => l.flagged === true);

      // Fetch IP summaries
      const ipSnap = await db.collection("ip_summary").get();
      const ipSummaries = ipSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.totalSubmissions || 0) - (a.totalSubmissions || 0));

      return {
        statusCode: 200,
        headers: { ...cors, "Content-Type": "application/json" },
        body: JSON.stringify({ logs, ipSummaries }),
      };
    } catch (err) {
      console.error("admin-logs GET error:", err);
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({ error: `Failed to fetch logs: ${err.message}` }),
      };
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PATCH — Toggle flagged status for an IP
  // ════════════════════════════════════════════════════════════════════════════
  if (event.httpMethod === "PATCH") {
    try {
      const db = getDB();
      const { ip, flagged } = JSON.parse(event.body || "{}");
      if (!ip) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "ip is required." }) };
      }

      const ipKey = ip.replace(/[.:]/g, "_");

      await db.collection("ip_summary").doc(ipKey).update({ flagged });

      const logsSnap = await db.collection("contact_logs").where("ip", "==", ip).get();
      const docs     = logsSnap.docs;
      const BATCH_SIZE = 490;

      for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = db.batch();
        docs.slice(i, i + BATCH_SIZE).forEach((doc) => batch.update(doc.ref, { flagged }));
        await batch.commit();
      }

      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({ success: true, updated: docs.length }),
      };
    } catch (err) {
      console.error("admin-logs PATCH error:", err);
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({ error: `Failed to update flag: ${err.message}` }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: cors,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
