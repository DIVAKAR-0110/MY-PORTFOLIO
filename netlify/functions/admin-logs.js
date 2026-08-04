import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ── Firebase Admin (singleton) ────────────────────────────────────────────────
function getDB() {
  const app =
    getApps().length === 0
      ? initializeApp({
          credential: cert({
            projectId:   process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
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
  // CORS headers for preflight (admin page is same origin in prod, but useful for local dev)
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

  const db = getDB();

  // ════════════════════════════════════════════════════════════════════════════
  // GET — Fetch all logs + IP summaries
  // ════════════════════════════════════════════════════════════════════════════
  if (event.httpMethod === "GET") {
    try {
      const params  = event.queryStringParameters || {};
      const { status, flagged, limit = "500" } = params;

      // Fetch up to `limit` logs ordered by timestamp desc
      // No composite index needed — filter in memory
      const logsSnap = await db
        .collection("contact_logs")
        .orderBy("timestamp", "desc")
        .limit(parseInt(limit, 10))
        .get();

      let logs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // In-memory filters (avoids needing composite Firestore indexes)
      if (status)          logs = logs.filter(l => l.status  === status);
      if (flagged === "true") logs = logs.filter(l => l.flagged === true);

      // Fetch ALL ip_summary docs (usually < 1000 for a portfolio) then sort in memory
      const ipSnap = await db.collection("ip_summary").get();
      const ipSummaries = ipSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
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
        body: JSON.stringify({ error: "Failed to fetch logs." }),
      };
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PATCH — Toggle flagged status for an IP (and all its log entries)
  // ════════════════════════════════════════════════════════════════════════════
  if (event.httpMethod === "PATCH") {
    try {
      const { ip, flagged } = JSON.parse(event.body || "{}");
      if (!ip) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "ip is required." }) };
      }

      const ipKey = ip.replace(/[.:]/g, "_");

      // Update ip_summary
      await db.collection("ip_summary").doc(ipKey).update({ flagged });

      // Update all contact_logs from this IP in batches of 500 (Firestore batch limit)
      const logsSnap = await db.collection("contact_logs").where("ip", "==", ip).get();
      const docs     = logsSnap.docs;
      const BATCH_SIZE = 490;

      for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = db.batch();
        docs.slice(i, i + BATCH_SIZE).forEach(doc => batch.update(doc.ref, { flagged }));
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
        body: JSON.stringify({ error: "Failed to update flag." }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: cors,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
