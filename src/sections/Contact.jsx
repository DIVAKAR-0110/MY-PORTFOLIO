// src/sections/Contact.jsx
import "./Contact.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiSend, FiCheckCircle, FiAlertCircle, FiFeather, FiBookOpen } from "react-icons/fi";
import { useState, useEffect } from "react";

const DISPLAY_EMAIL = atob("cmRpdmFrYXIwMTEwQGdtYWlsLmNvbQ==");

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMSG, setErrorMSG] = useState("");
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let msg = "";
    if (status === "idle") msg = "Awakening the Labyrinth... \nCipher verified. \nReady to scribe your dispatch.";
    else if (status === "sending") msg = "Sealing the scroll... \nDispatching messenger birds to the Citadel... \nCross-referencing historical archives...";
    else if (status === "success") msg = "Dispatch received! \nDivakar's Chronicles have been updated. \nExpect a reply through the carrier network.";
    else if (status === "error") msg = `FALLBACK PROTOCOL: Carrier lost. \nDirect your scroll via ${DISPLAY_EMAIL}.`;

    let i = 0;
    const interval = setInterval(() => {
      if (i <= msg.length) { setTypedText(msg.slice(0, i)); i++; }
      else clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMSG) setErrorMSG("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMSG("Alas! Every parchment field must be inscribed.");
      return;
    }
    setStatus("sending");
    try {
      const resp = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!resp.ok) throw new Error("The scroll was rejected by the oracle.");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setErrorMSG(err.message);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="section-eyebrow">Dispatch a Scroll</div>
      <h2 className="section-title">Envoys & Messages</h2>
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
            <div className="lore-orb" style={{ borderColor: status === 'success' ? '#2E5820' : status === 'error' ? '#8B3A1E' : 'var(--accent)' }} />
            <div className="lore-status">
              <FiFeather /> {status.toUpperCase()}
            </div>
          </div>

          <div className="mystic-scroll-box">
            <div className="scroll-dots">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
            <div className="scroll-content">
              {typedText.split('\n').map((line, j) => <p key={j}>{line}</p>)}
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
        >
          <div className="form-legend">
            <h3>Dispatch Your Scroll 📜</h3>
            <p>Your message shall be carried to the inner vault.</p>
          </div>

          <div className="scroll-field">
            <input name="name" type="text" placeholder=" " value={formData.name} onChange={handleChange} disabled={status === "sending"} />
            <label>The Envoy's Name</label>
            <div className="line" />
          </div>

          <div className="scroll-field">
            <input name="email" type="email" placeholder=" " value={formData.email} onChange={handleChange} disabled={status === "sending"} />
            <label>Return Destination (Email)</label>
            <div className="line" />
          </div>

          <div className="scroll-field">
            <textarea name="message" placeholder=" " value={formData.message} onChange={handleChange} disabled={status === "sending"} />
            <label>The Message Content</label>
            <div className="line" />
          </div>

          <button type="submit" className="scroll-submit-btn" disabled={status === "sending"}>
            {status === "sending" ? "DISPATCHING..." : status === "success" ? "RECEIVED" : "SEND DISPATCH"}
            {status === "idle" && <FiSend />}
          </button>

          <AnimatePresence>
            {errorMSG && <motion.div className="scroll-alert error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FiAlertCircle /> {errorMSG}</motion.div>}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;