// src/sections/Contact.jsx
import "./Contact.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub, FiLinkedin, FiMail, FiSend,
  FiAlertCircle, FiFeather, FiCheckCircle,
  FiLock, FiCompass, FiRefreshCw, FiInfo, FiMapPin
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const DISPLAY_EMAIL = atob("cmRpdmFrYXIwMTEwQGdtYWlsLmNvbQ==");
const EMAIL_REGEX   = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const COOLDOWN_SECONDS = 60;
const MSG_MAX  = 3000;
const NAME_MAX = 100;

function Contact() {
  const [formData, setFormData]           = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot]           = useState("");
  const [gpsData,  setGpsData]            = useState(null);
  const [locationState, setLocationState] = useState("prompt"); // "prompt" | "granted" | "denied"
  const [showHelp, setShowHelp]           = useState(false);
  const [status,   setStatus]             = useState("idle");      // idle | sending | success | error
  const [errorMSG, setErrorMSG]           = useState("");
  const [typedText, setTypedText]         = useState("");
  const [cooldown,  setCooldown]          = useState(0);
  const cooldownRef = useRef(null);

  // ── Capture Device GPS (HTML5 Geolocation) ──────────────────────────────────
  const requestGPS = () => {
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }
    setLocationState("prompt");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsData({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lon: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLocationState("granted");
        setShowHelp(false);
        setErrorMSG("");
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
    if (status === "idle")         msg = "Awakening the Labyrinth... \nCipher verified. \nReady to scribe your dispatch.";
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
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(cooldownRef.current), []);

  const handleChange = (e) => {
    if (locationState === "denied") requestGPS();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMSG) setErrorMSG("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (locationState !== "granted" || !gpsData) {
      setErrorMSG("🔒 Location verification required. Enable location access in browser settings to dispatch.");
      setShowHelp(true);
      requestGPS();
      return;
    }

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
            <div
              className="lore-orb"
              style={{
                borderColor: status === "success" ? "#2E5820" : status === "error" ? "#8B3A1E" : "var(--accent)"
              }}
            />
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
            <p>Your message shall be carried securely to the inner vault.</p>
          </div>

          {/* ── Location Verification Status Banner ── */}
          <div className={`loc-banner loc-banner--${locationState}`}>
            {locationState === "granted" && (
              <div className="loc-banner-content">
                <FiCheckCircle className="loc-icon green" />
                <div className="loc-text">
                  <strong>LOCATION VERIFIED</strong>
                  <span>Exact Building Pin Attached (±{gpsData?.accuracy || 0}m precision)</span>
                </div>
              </div>
            )}

            {locationState === "denied" && (
              <div className="loc-banner-content flex-col">
                <div className="loc-banner-row">
                  <FiLock className="loc-icon red" />
                  <div className="loc-text">
                    <strong>LOCATION REQUIRED TO DISPATCH</strong>
                    <span>Browser permission was blocked. Allow location to unlock.</span>
                  </div>
                </div>
                <div className="loc-actions">
                  <button
                    type="button"
                    className="loc-retry-btn"
                    onClick={() => { requestGPS(); setShowHelp((h) => !h); }}
                  >
                    <FiRefreshCw size={12} /> Retry / Fix Location
                  </button>
                  <button
                    type="button"
                    className="loc-help-btn"
                    onClick={() => setShowHelp((h) => !h)}
                  >
                    <FiInfo size={12} /> How to unblock?
                  </button>
                </div>
              </div>
            )}

            {locationState === "prompt" && (
              <div className="loc-banner-content">
                <FiCompass className="loc-icon amber spinning-slow" />
                <div className="loc-text">
                  <strong>LOCATION VERIFICATION PENDING</strong>
                  <span>Click <strong>'Allow'</strong> in your browser prompt to enable dispatching.</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Step-by-Step Unblock Helper Card ── */}
          <AnimatePresence>
            {showHelp && locationState === "denied" && (
              <motion.div
                className="loc-help-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h4>🔒 How to Allow Location in 2 Simple Steps:</h4>
                <ol>
                  <li>
                    Click the <strong>🔒 Padlock / Site Settings icon</strong> next to the URL in your browser address bar:
                    <br /><code>divakar-dev-portfolio.netlify.app</code>
                  </li>
                  <li>
                    Change <strong>Location</strong> setting from <em>Block</em> to <strong>Allow</strong>.
                  </li>
                  <li>
                    Click <button type="button" className="inline-refresh-link" onClick={() => window.location.reload()}>Refresh Page</button> to unlock the form!
                  </li>
                </ol>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Honeypot (bot trap) ── */}
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

          {/* Name Field */}
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

          {/* Email Field */}
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

          {/* Message Field */}
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
            <span
              className="char-counter"
              style={{ color: charsLeft < 100 ? "#f87171" : "var(--text-faint)" }}
            >
              {charsLeft} / {MSG_MAX}
            </span>
          </div>

          {/* Submit Button */}
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
              : locationState !== "granted"
              ? "🔒 ALLOW LOCATION TO SEND"
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