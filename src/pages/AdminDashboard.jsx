// src/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiRefreshCw, FiDownload, FiShield, FiClock,
  FiLogOut, FiSearch, FiUser, FiMail, FiGlobe,
  FiWifi, FiCpu, FiAlertTriangle, FiCheckCircle,
  FiXCircle, FiFilter,
} from "react-icons/fi";
import "./AdminDashboard.css";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  SUCCESS:      { label: "SUCCESS",      color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.3)",  icon: "✅" },
  BOT_BLOCKED:  { label: "BOT BLOCKED",  color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)", icon: "🤖" },
  RATE_LIMITED: { label: "RATE LIMITED", color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.3)",  icon: "⏱" },
  INVALID:      { label: "INVALID",      color: "#facc15", bg: "rgba(250,204,21,0.08)",  border: "rgba(250,204,21,0.3)",  icon: "⚠" },
  MAIL_ERROR:   { label: "MAIL ERROR",   color: "#c084fc", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.3)", icon: "📭" },
};

// ── Utilities ─────────────────────────────────────────────────────────────────
function countryFlag(code) {
  if (!code || code.length !== 2 || code === "LO" || code === "??") return "🌍";
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
}

function parseBrowser(ua = "") {
  if (ua.includes("Edg"))    return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome") && !ua.includes("Chromium")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Browser";
}

function parseOS(ua = "") {
  if (ua.includes("Windows")) return "Win";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Mac"))     return "macOS";
  if (ua.includes("Linux"))   return "Linux";
  return "OS?";
}

function formatTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function maskIp(ip) {
  if (!ip || ip === "unknown") return "unknown";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.xxx.xxx`;
  return ip; // IPv6 — show as-is
}

// ── Password Gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pw.trim()) return;
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/.netlify/functions/admin-logs?limit=1", {
        headers: { Authorization: `Bearer ${pw}` },
      });
      if (resp.status === 401) {
        setError("Invalid cipher. The vault remains sealed.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("admin_token", pw);
      onAuth(pw);
    } catch {
      setError("Cannot reach the vault. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="vault-gate">
      <motion.div
        className="vault-gate-card"
        initial={{ opacity: 0, scale: 0.88, y: 48 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="vault-gate-emblem">⚔</div>
        <h1 className="vault-gate-title">INTEL VAULT</h1>
        <p className="vault-gate-subtitle">The Watcher's Chronicle</p>
        <p className="vault-gate-desc">Portfolio Security Intelligence System</p>

        <form onSubmit={handleSubmit} className="vault-gate-form">
          <div className="vault-pw-wrap">
            <FiShield className="vault-pw-icon" />
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              placeholder="Enter cipher to proceed..."
              className="vault-pw-input"
              autoFocus
            />
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                className="vault-gate-error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FiAlertTriangle size={13} /> {error}
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className="vault-gate-btn" disabled={loading || !pw.trim()}>
            {loading ? (
              <><FiRefreshCw className="spinning" size={14} /> VERIFYING...</>
            ) : (
              <><FiShield size={14} /> ENTER THE VAULT</>
            )}
          </button>
        </form>
        <p className="vault-gate-hint">DR · Portfolio Intel · {new Date().getFullYear()}</p>
      </motion.div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color, accent }) {
  return (
    <motion.div
      className="vault-stat-card"
      style={{ "--sc": color, "--sa": accent || color }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="vault-stat-icon">{icon}</span>
      <span className="vault-stat-value">{value}</span>
      <span className="vault-stat-label">{label}</span>
    </motion.div>
  );
}

// ── IP Summary Item ───────────────────────────────────────────────────────────
function IPSummaryItem({ doc, isSelected, onSelect, onFlag, flagLoading }) {
  const ip = doc.id.replace(/_/g, ".");
  const threat = doc.blockedCount >= 5 ? "high" : doc.blockedCount >= 2 ? "medium" : "low";

  return (
    <motion.div
      className={`ip-item threat-${threat} ${isSelected ? "ip-item--selected" : ""} ${doc.flagged ? "ip-item--flagged" : ""}`}
      onClick={() => onSelect(ip)}
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="ip-item-top">
        <span className="ip-item-addr">{maskIp(ip)}</span>
        <span className="ip-item-badges">
          {doc.flagged   && <span className="badge badge--flagged">🚩 FLAGGED</span>}
          {threat === "high" && !doc.flagged && <span className="badge badge--threat">⚠ HIGH</span>}
        </span>
      </div>

      <div className="ip-item-geo">
        {countryFlag(doc.geo?.countryCode)}{" "}
        {doc.geo?.city !== "Unknown" ? doc.geo?.city : ""}{doc.geo?.city !== "Unknown" && doc.geo?.country !== "Unknown" ? ", " : ""}
        {doc.geo?.country}
      </div>

      <div className="ip-item-isp">{doc.geo?.isp || "—"}</div>

      <div className="ip-item-stats">
        <span className="ip-stat total">📊 {doc.totalSubmissions}</span>
        <span className="ip-stat blocked">🚫 {doc.blockedCount}</span>
        <span className="ip-stat success">✅ {doc.successCount}</span>
      </div>

      <div className="ip-item-last">{doc.lastEmail}</div>

      <button
        className={`ip-flag-btn ${doc.flagged ? "ip-flag-btn--unflag" : "ip-flag-btn--flag"}`}
        disabled={flagLoading === ip}
        onClick={(e) => { e.stopPropagation(); onFlag(ip, doc.flagged); }}
      >
        {flagLoading === ip
          ? <FiRefreshCw className="spinning" size={11} />
          : doc.flagged ? "🏳 Unflag" : "🚩 Flag IP"}
      </button>
    </motion.div>
  );
}

// ── Log Entry ─────────────────────────────────────────────────────────────────
function LogEntry({ log, onFlag, flagLoading }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.INVALID;

  return (
    <motion.div
      className={`log-entry ${log.flagged ? "log-entry--flagged" : ""}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ── Summary Row ── */}
      <div className="log-summary" onClick={() => setOpen((o) => !o)}>
        {/* Status */}
        <div
          className="log-status"
          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
        >
          <span>{cfg.icon}</span>
          <span>{cfg.label}</span>
        </div>

        {/* IP + Identity */}
        <div className="log-identity">
          <div className="log-ip">
            <FiGlobe size={10} /> {log.ip}
          </div>
          <div className="log-name">
            <FiUser size={10} /> {log.name || <em>—</em>}
          </div>
          <div className="log-email">
            <FiMail size={10} /> {log.email || <em>—</em>}
          </div>
        </div>

        {/* Geo */}
        <div className="log-geo">
          <div>
            {countryFlag(log.geo?.countryCode)} {log.geo?.city}, {log.geo?.country}
          </div>
          <div className="log-isp">
            <FiWifi size={10} /> {log.geo?.isp || "—"}
          </div>
        </div>

        {/* Browser + Time */}
        <div className="log-meta">
          <div className="log-browser">
            <FiCpu size={10} /> {parseBrowser(log.userAgent)} · {parseOS(log.userAgent)}
          </div>
          <div className="log-time">
            <FiClock size={10} /> {formatTime(log.timestamp)}
          </div>
        </div>

        {/* Flag */}
        <button
          className={`log-flag-btn ${log.flagged ? "log-flag-btn--unflag" : ""}`}
          disabled={flagLoading === log.ip}
          title={log.flagged ? "Unflag this IP" : "Flag this IP as suspicious"}
          onClick={(e) => { e.stopPropagation(); onFlag(log.ip, log.flagged); }}
        >
          {flagLoading === log.ip ? <FiRefreshCw className="spinning" size={11} /> : log.flagged ? "🏳" : "🚩"}
        </button>

        {/* Expand chevron */}
        <span className={`log-chevron ${open ? "open" : ""}`}>▸</span>
      </div>

      {/* ── Expanded Detail ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="log-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="log-detail-grid">
              <div className="log-detail-item">
                <span className="log-detail-key">Full IP</span>
                <code className="log-detail-val">{log.ip}</code>
              </div>
              <div className="log-detail-item">
                <span className="log-detail-key">Coordinates</span>
                <code className="log-detail-val">
                  {log.geo?.lat}, {log.geo?.lon}
                  {log.geo?.lat && log.geo?.lon && (
                    <a
                      href={`https://maps.google.com?q=${log.geo.lat},${log.geo.lon}`}
                      target="_blank" rel="noreferrer"
                      className="log-map-link"
                      onClick={(e) => e.stopPropagation()}
                    > 📍 View Map</a>
                  )}
                </code>
              </div>
              <div className="log-detail-item">
                <span className="log-detail-key">Region</span>
                <code className="log-detail-val">{log.geo?.region}</code>
              </div>
              <div className="log-detail-item">
                <span className="log-detail-key">User Agent</span>
                <code className="log-detail-val small">{log.userAgent || "—"}</code>
              </div>
              {log.honeypotValue && (
                <div className="log-detail-item">
                  <span className="log-detail-key">🍯 Honeypot Value</span>
                  <code className="log-detail-val">{log.honeypotValue}</code>
                </div>
              )}
              {log.message && (
                <div className="log-detail-item full">
                  <span className="log-detail-key">Message</span>
                  <pre className="log-detail-msg">{log.message}</pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [token,        setToken]        = useState(() => sessionStorage.getItem("admin_token") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [logs,         setLogs]         = useState([]);
  const [ipSummaries,  setIpSummaries]  = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [lastRefresh,  setLastRefresh]  = useState(null);
  const [selectedIP,   setSelectedIP]   = useState(null);  // dot-format IP
  const [filters,      setFilters]      = useState({ status: "", flagged: false, search: "" });
  const [flagLoading,  setFlagLoading]  = useState(null);  // IP string being flagged
  const [livePulse,    setLivePulse]    = useState(true);
  const intervalRef = useRef(null);

  // ── Fetch logs from admin-logs function ──────────────────────────────────────
  const fetchLogs = useCallback(
    async (t = token) => {
      if (!t) return;
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (filters.status)  qs.set("status",  filters.status);
        if (filters.flagged) qs.set("flagged", "true");

        const resp = await fetch(`/.netlify/functions/admin-logs?${qs}`, {
          headers: { Authorization: `Bearer ${t}` },
        });

        if (resp.status === 401) {
          sessionStorage.removeItem("admin_token");
          setAuthenticated(false);
          return;
        }

        const data = await resp.json();
        setLogs(data.logs         || []);
        setIpSummaries(data.ipSummaries || []);
        setLastRefresh(new Date());
        setLivePulse((p) => !p); // toggle to animate live dot
      } catch (err) {
        console.error("fetchLogs error:", err);
      }
      setLoading(false);
    },
    [token, filters.status, filters.flagged]
  );

  // ── Auth ─────────────────────────────────────────────────────────────────────
  const handleAuth = (t) => {
    setToken(t);
    setAuthenticated(true);
    fetchLogs(t);
  };

  // On mount — restore session
  useEffect(() => {
    if (token) {
      setAuthenticated(true);
      fetchLogs(token);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!authenticated) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => fetchLogs(), 30_000);
    return () => clearInterval(intervalRef.current);
  }, [authenticated, fetchLogs]);

  // ── Flag/Unflag ──────────────────────────────────────────────────────────────
  const handleFlag = async (ip, currentlyFlagged) => {
    setFlagLoading(ip);
    try {
      await fetch("/.netlify/functions/admin-logs", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ip, flagged: !currentlyFlagged }),
      });
      await fetchLogs();
    } catch (err) {
      console.error("Flag error:", err);
    }
    setFlagLoading(null);
  };

  // ── IP select (sidebar → filter logs) ───────────────────────────────────────
  const handleIPSelect = (ip) => setSelectedIP((prev) => (prev === ip ? null : ip));

  // ── Export CSV ───────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Timestamp","IP","Name","Email","Status","Country","City","Region","ISP","Lat","Lon","Browser","OS","Flagged","UserAgent"];
    const rows = displayedLogs.map((l) => [
      l.timestamp, l.ip, l.name, l.email, l.status,
      l.geo?.country, l.geo?.city, l.geo?.region, l.geo?.isp,
      l.geo?.lat, l.geo?.lon,
      parseBrowser(l.userAgent), parseOS(l.userAgent),
      l.flagged ? "YES" : "NO",
      l.userAgent,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: `intel-vault-${Date.now()}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    clearInterval(intervalRef.current);
    setToken(""); setAuthenticated(false); setLogs([]); setIpSummaries([]);
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const displayedLogs = logs.filter((l) => {
    if (selectedIP && l.ip !== selectedIP) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        l.ip?.includes(q) ||
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.geo?.city?.toLowerCase().includes(q) ||
        l.geo?.country?.toLowerCase().includes(q) ||
        l.geo?.isp?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total:   logs.length,
    success: logs.filter((l) => l.status === "SUCCESS").length,
    blocked: logs.filter((l) => l.status !== "SUCCESS" && l.status !== "MAIL_ERROR").length,
    flagged: ipSummaries.filter((ip) => ip.flagged).length,
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (!authenticated) return <PasswordGate onAuth={handleAuth} />;

  return (
    <div className="vault-root">

      {/* ── Header ── */}
      <header className="vault-header">
        <div className="vault-brand">
          <span className="vault-brand-icon">⚔</span>
          <div>
            <h1 className="vault-brand-name">INTEL VAULT</h1>
            <p className="vault-brand-sub">The Watcher's Chronicle · DR Portfolio</p>
          </div>
        </div>

        <div className="vault-header-right">
          <div className={`vault-live ${livePulse ? "vault-live--on" : ""}`}>
            <span className="vault-live-dot" /> LIVE
          </div>
          {lastRefresh && (
            <span className="vault-refresh-ts">
              <FiClock size={11} /> {lastRefresh.toLocaleTimeString("en-IN")}
            </span>
          )}
          <button className="vault-btn" onClick={() => fetchLogs()} disabled={loading}>
            <FiRefreshCw size={13} className={loading ? "spinning" : ""} /> Refresh
          </button>
          <button className="vault-btn vault-btn--accent" onClick={exportCSV}>
            <FiDownload size={13} /> Export CSV
          </button>
          <button className="vault-btn vault-btn--danger" onClick={handleLogout}>
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* ── Stats ── */}
      <div className="vault-stats">
        <StatCard icon="📊" value={stats.total}   label="Total Logs"   color="#C8922A" />
        <StatCard icon="✅" value={stats.success}  label="Successful"   color="#4ade80" />
        <StatCard icon="🚫" value={stats.blocked}  label="Blocked"      color="#f87171" />
        <StatCard icon="🚩" value={stats.flagged}  label="Flagged IPs"  color="#fb923c" />
      </div>

      {/* ── Filter Bar ── */}
      <div className="vault-filters">
        <FiFilter size={13} className="vault-filter-icon" />

        <select
          className="vault-select"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="SUCCESS">✅ Success</option>
          <option value="BOT_BLOCKED">🤖 Bot Blocked</option>
          <option value="RATE_LIMITED">⏱ Rate Limited</option>
          <option value="INVALID">⚠ Invalid</option>
          <option value="MAIL_ERROR">📭 Mail Error</option>
        </select>

        <label className="vault-check">
          <input
            type="checkbox"
            checked={filters.flagged}
            onChange={(e) => setFilters((f) => ({ ...f, flagged: e.target.checked }))}
          />
          🚩 Flagged Only
        </label>

        <div className="vault-search">
          <FiSearch size={12} />
          <input
            type="text"
            placeholder="Search IP, name, email, city, ISP…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>

        {(filters.status || filters.flagged || filters.search || selectedIP) && (
          <button
            className="vault-btn vault-btn--sm"
            onClick={() => { setFilters({ status: "", flagged: false, search: "" }); setSelectedIP(null); }}
          >
            <FiXCircle size={12} /> Clear All
          </button>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="vault-body">

        {/* Left: IP Summary Panel */}
        <aside className="vault-ip-panel">
          <div className="vault-panel-hdr">
            <FiShield size={13} /> IP SUMMARIES
            <span className="vault-panel-count">{ipSummaries.length}</span>
          </div>
          <div className="vault-ip-list">
            {ipSummaries.length === 0 && !loading && (
              <p className="vault-empty">No IP data yet.<br /><small>Submit the contact form to begin logging.</small></p>
            )}
            {ipSummaries.map((doc) => (
              <IPSummaryItem
                key={doc.id}
                doc={doc}
                isSelected={selectedIP === doc.id.replace(/_/g, ".")}
                onSelect={handleIPSelect}
                onFlag={handleFlag}
                flagLoading={flagLoading}
              />
            ))}
          </div>
        </aside>

        {/* Right: Log Entries Panel */}
        <main className="vault-log-panel">
          <div className="vault-panel-hdr">
            <FiCpu size={13} /> LOG ENTRIES
            <span className="vault-panel-count">{displayedLogs.length}</span>
            {selectedIP && (
              <button className="vault-ip-filter-pill" onClick={() => setSelectedIP(null)}>
                IP: {selectedIP} <FiXCircle size={11} />
              </button>
            )}
          </div>

          <div className="vault-log-list">
            {loading && (
              <div className="vault-loading">
                <FiRefreshCw className="spinning" size={18} />
                <span>Fetching intel from the vault…</span>
              </div>
            )}
            {!loading && displayedLogs.length === 0 && (
              <p className="vault-empty">
                The vault is quiet.<br />
                <small>No logs match your current filters.</small>
              </p>
            )}
            {displayedLogs.map((log) => (
              <LogEntry
                key={log.id}
                log={log}
                onFlag={handleFlag}
                flagLoading={flagLoading}
              />
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}
