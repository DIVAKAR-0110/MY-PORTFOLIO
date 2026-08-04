// src/sections/Contact.jsx
import "./Contact.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiSend, FiAlertCircle, FiFeather } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const DISPLAY_EMAIL = atob("cmRpdmFrYXIwMTEwQGdtYWlsLmNvbQ==");

/** RFC-5322-ish email format — mirrors server-side check */
const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const COOLDOWN_SECONDS = 60; // prevent rapid re-submissions
const MSG_MAX = 3000;
const NAME_MAX = 100;

function Contact() {
  const [formData, setFormData]       = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot]       = useState("");          // invisible to real users
  const [gpsData,  setGpsData]        = useState(null);        // HTML5 Device GPS coordinates
  const [locationState, setLocationState] = useState("prompt"); // "prompt" | "granted" | "denied"
  const [status,   setStatus]         = useState("idle");      // idle | sending | success | error
  const [errorMSG, setErrorMSG]       = useState("");
  const [typedText, setTypedText]     = useState("");
  const [cooldown,  setCooldown]      = useState(0);           // seconds remaining
  const cooldownRef = useRef(null);

  // ── Capture Device GPS (HTML5 Geolocation) ──────────────────────────────────
  const requestGPS = () => {
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsData({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lon: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLocationState("granted");
      },
      (err) => {
        console.log("GPS prompt declined or unavailable:", err.message);
        setLocationState("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestGPS();
  }, []);

  // ── Typing terminal effect ──────────────────────────────────────────────────
  useEffect(() => {
    let msg = "";
    if (status === "idle")    msg = "Awakening the Labyrinth... \nCipher verified. \nReady to scribe your dispatch.";
    else if (status === "sending") msg = "Sealing the scroll... \nDispatching messenger birds to the Citadel... \nCross-referencing historical archives...";
    else if (status === "success") msg = "Dispatch received! \nDivakar's Chronicles have been updated. \nExpect a reply through the carrier network.";
    else if (status === "error")   msg = `FALLBACK PROTOCOL: Carrier lost. \nDirect your scroll via ${DISPLAY_EMAIL}.`;

    let i = 0;
    const interval = setInterval(() => {
      if (i <= msg.length) { setTypedText(msg.slice(0, i)); i++; }
      else clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [status]);

  // ── Cooldown timer ───────────────────────────────────────────────────────────
  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(cooldownRef.current), []);

  // ── Field change handler ─────────────────────────────────────────────────────
  const handleChange = (e) => {
    requestGPS();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMSG) setErrorMSG("");
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    requestGPS();

    // Mandatory location check
    if (locationState !== "granted" || !gpsData) {
      setErrorMSG("🔒 Location verification is required to dispatch your scroll. Please allow location access in your browser site settings.");
      requestGPS();
      return;
    }

    // Client-side guards (mirrors server-side checks)
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMSG("Alas! Every parchment field must be inscribed.");
      return;
    }
    if (formData.name.trim().length > NAME_MAX) {
      setErrorMSG(`Name must be ${NAME_MAX} characters or fewer.`);
      return;
    }
    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setErrorMSG("That doesn't look like a valid email address.");
      return;
    }
    if (formData.message.trim().length > MSG_MAX) {
      setErrorMSG(`Message must be ${MSG_MAX} characters or fewer.`);
      return;
    }
    if (cooldown > 0) {
      setErrorMSG(`Please wait ${cooldown}s before sending another dispatch.`);
      return;
    }

    setStatus("sending");
    setErrorMSG("");

    try {
      const resp = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, honeypot, gpsData }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.error || "The scroll was rejected by the oracle.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      startCooldown();
    } catch (err) {
      setErrorMSG(err.message);
      setStatus("error");
    }
  };

  const charsLeft = MSG_MAX - formData.message.length;
  const isSubmitDisabled = status === "sending" || cooldown > 0 || locationState !== "granted";

  return (
    <section id="contact" className="contact">
      <div className="section-eyebrow">Dispatch a Scroll</div>
      <h2 className="section-title">Envoys &amp; Messages</h2>
      <div className="section-ornament" />

      <div className="contact-grid">
        {/* Left: Mystical Terminal */}
        <motion.div
          className="contact-lore-box"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="lore-orb-header">
            <div className="lore-orb" style={{ borderColor: status === "success" ? "#2E5820" : status === "error" ? "#8B3A1E" : "var(--accent)" }} />
            <div className="lore-status">
              <FiFeather /> {status.toUpperCase()}
            </div>
          </div>

          <div className="mystic-scroll-box">
            <div className="scroll-dots">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
            <div className="scroll-content">
              {typedText.split("\n").map((line, j) => <p key={j}>{line}</p>)}
              <span className="quill-cursor"></span>
            </div>
          </div>

          <div className="lore-links">
            <h4 className="lore-h">The Direct Path</h4>
            <div className="lore-email">
              <FiMail className="lore-icon" /> <span>{DISPLAY_EMAIL}</span>
            </div>
            <div className="lore-socials">
              <a href="https://github.com/DIVAKAR-0110" target="_blank" rel="noreferrer"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/r-divakar-482212303/" target="_blank" rel="noreferrer"><FiLinkedin /></a>
            </div>
          </div>
        </motion.div>

        {/* Right: Scroll Form */}
        <motion.form
          className="contact-manuscript-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          noValidate
        >
          <div className="form-legend">
            <h3>Dispatch Your Scroll 📜</h3>
            <p>Your message shall be carried to the inner vault.</p>
          </div>

          {/* ── Location Verification Status Banner ── */}
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "4px",
              fontSize: "0.78rem",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s",
              border: locationState === "granted"
                ? "1px solid rgba(46, 88, 32, 0.5)"
                : locationState === "denied"
                ? "1px solid rgba(139, 58, 30, 0.5)"
                : "1px solid rgba(200, 146, 42, 0.4)",
              background: locationState === "granted"
                ? "rgba(46, 88, 32, 0.12)"
                : locationState === "denied"
                ? "rgba(139, 58, 30, 0.12)"
                : "rgba(200, 146, 42, 0.08)",
              color: locationState === "granted"
                ? "#4ade80"
                : locationState === "denied"
                ? "#f87171"
                : "#C8922A",
            }}
          >
            {locationState === "granted" && (
              <>🎯 LOCATION VERIFIED · Exact Building Pin Ready (±{gpsData?.accuracy || 0}m)</>
            )}
            {locationState === "denied" && (
              <>
                🔒 LOCATION REQUIRED · Permission Blocked.{" "}
                <button
                  type="button"
                  onClick={requestGPS}
                  style={{
                    background: "none",
                    border: "underline",
                    color: "#f87171",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: "bold",
                    marginLeft: "0.3rem"
                  }}
                >
                  Click to Retry
                </button>
              </>
            )}
            {locationState === "prompt" && (
              <>🛰️ REQUESTING LOCATION · Please allow browser prompt to enable dispatching.</>
            )}
          </div>

          {/* ── Honeypot — hidden from real users, traps bots ── */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
            <label htmlFor="contact-trap">Leave this empty</label>
            <input
              id="contact-trap"
              name="honeypot"
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="scroll-field">
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder=" "
              autoComplete="name"
              maxLength={NAME_MAX}
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitDisabled}
            />
            <label htmlFor="contact-name">The Envoy's Name</label>
            <div className="line" />
          </div>

          <div className="scroll-field">
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder=" "
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitDisabled}
            />
            <label htmlFor="contact-email">Return Destination (Email)</label>
            <div className="line" />
          </div>

          <div className="scroll-field">
            <textarea
              id="contact-message"
              name="message"
              placeholder=" "
              autoComplete="off"
              maxLength={MSG_MAX}
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitDisabled}
            />
            <label htmlFor="contact-message">The Message Content</label>
            <div className="line" />
            {/* Character counter */}
            <span
              className="char-counter"
              style={{ color: charsLeft < 100 ? "var(--accent-dark)" : "var(--text-faint)" }}
            >
              {charsLeft} / {MSG_MAX}
            </span>
          </div>

          <button
            type="submit"
            className="scroll-submit-btn"
            disabled={isSubmitDisabled}
          >
            {status === "sending"
              ? "DISPATCHING..."
              : status === "success"
              ? cooldown > 0
                ? `RECEIVED · Wait ${cooldown}s`
                : "RECEIVED"
              : cooldown > 0
              ? `WAIT ${cooldown}s`
              : "SEND DISPATCH"}
            {!isSubmitDisabled && status === "idle" && <FiSend />}
          </button>

          <AnimatePresence>
            {errorMSG && (
              <motion.div
                className="scroll-alert error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FiAlertCircle /> {errorMSG}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;