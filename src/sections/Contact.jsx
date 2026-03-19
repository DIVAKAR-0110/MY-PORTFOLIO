// src/sections/Contact.jsx
import "./Contact.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiTerminal,
  FiCpu
} from "react-icons/fi";
import { useState, useEffect } from "react";

const DISPLAY_EMAIL = "rdivakar0110" + "@" + "gmail.com";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMSG, setErrorMSG] = useState("");
  const [aiText, setAiText] = useState("");
  const [typedText, setTypedText] = useState("");


  // AI Typing Effect Logic
  useEffect(() => {
    let messageToType = "";
    if (status === "idle") {
      messageToType = "Connecting to Divakar's grid... \nIdentity verified. \nReady to receive your transmission.";
    } else if (status === "sending") {
      messageToType = "Encrypting data... \nEstablishing secure uplink to core servers... \nDeploying payload...";
    } else if (status === "success") {
      messageToType = "Transmission successful! \nDivakar's Neural Net has received your message. \nExpect a response shortly.";
    } else if (status === "error") {
      messageToType = `CRITICAL ERROR: Uplink failed. \nPlease bypass frontend protocols and email directly via ${DISPLAY_EMAIL}.`;
    }

    setAiText(messageToType);
    setTypedText("");

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= messageToType.length) {
        setTypedText(messageToType.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40); // Type speed

    return () => clearInterval(interval);
  }, [status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMSG) setErrorMSG("");
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMSG("Error: All mission-critical fields must be filled.");
      return false;
    }
    
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMSG("Error: Invalid return address format.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      // In production (Netlify), this hits the serverless function seamlessly.
      // In local dev, it requires `netlify dev` to run, but we can hit it easily.
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      let data;
      const responseText = await response.text();
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Non-JSON Response received:", responseText);
        let errorMsg = `Invalid server response (Status: ${response.status}).`;
        if (response.status === 500 || response.status === 504 || response.status === 404) {
          if (window.location.hostname === "localhost") {
            errorMsg = "Local server is unreachable. Please ensure 'npm run dev' started both frontend and backend.";
          } else {
            errorMsg = "Netlify Function error. Check your Netlify Dashboard Environment Variables (GMAIL_USER & GMAIL_APP_PASSWORD).";
          }
        }
        throw new Error(errorMsg);
      }

      if (!response.ok) {
        console.error("Backend Error Response:", data);
        throw new Error(data.details || data.error || 'Network response was not ok');
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Auto-reset after success
      setTimeout(() => setStatus("idle"), 8000);
    } catch (err) {
      console.error("CRITICAL CONTACT ERROR:", err);
      setStatus("error");
      const finalMsg = err.message || "Uplink failure. Please try again later.";
      setErrorMSG(`System Failure: ${finalMsg}`);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };



  return (
    <section id="contact" className="contact">
      <div className="contact-container">

        {/* LEFT SIDE: AI ASSISTANT */}
        <motion.div
          className="ai-assistant-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="ai-orb-container">
            <div className="ai-orb" />
            <div className="ai-status">
              <FiCpu /> {status === 'sending' ? 'PROCESSING' : status === 'success' ? 'ONLINE' : status === 'error' ? 'FAULT' : 'ACTIVE'}
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot r"></div>
              <div className="terminal-dot y"></div>
              <div className="terminal-dot g"></div>
            </div>
            <div className="terminal-content">
              <p>
                {typedText.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
                <span className="cursor-blink"></span>
              </p>
            </div>
          </div>

          <div className="contact-direct-info">
            <h4 style={{ color: '#e5e7eb', marginBottom: '0.2rem', fontSize: '1.2rem' }}>Direct Links</h4>
            <div className="contact-direct-item">
              <div className="contact-icon-box"><FiMail size={20} /></div>
              <span>{DISPLAY_EMAIL}</span>
            </div>

            <div className="contact-socials-advanced">
              <a href="https://github.com/DIVAKAR-0110" target="_blank" rel="noreferrer" className="social-glass-btn" title="GitHub">
                <FiGithub />
              </a>
              <a href="https://www.linkedin.com/in/r-divakar-482212303/" target="_blank" rel="noreferrer" className="social-glass-btn" title="LinkedIn">
                <FiLinkedin />
              </a>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE: ADVANCED FORM */}
        <motion.form
          onSubmit={handleSubmit}
          className="contact-form-advanced"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="form-header" variants={itemVariants}>
            <h3>Initialize Contact</h3>
            <p>Send a message through the secure quantum channel.</p>
          </motion.div>

          <motion.div className="input-group-advanced" variants={itemVariants}>
            <input
              type="text"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              disabled={status === "sending"}
              className="advanced-input"
            />
            <label>Identification (Name)</label>
            <div className="input-highlight"></div>
          </motion.div>

          <motion.div className="input-group-advanced" variants={itemVariants}>
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              disabled={status === "sending"}
              className="advanced-input"
            />
            <label>Return Address (Email)</label>
            <div className="input-highlight"></div>
          </motion.div>

          <motion.div className="input-group-advanced" variants={itemVariants}>
            <textarea
              name="message"
              placeholder=" "
              value={formData.message}
              onChange={handleChange}
              disabled={status === "sending"}
              className="advanced-textarea"
            />
            <label>Transmission Payload (Message)</label>
            <div className="input-highlight"></div>
          </motion.div>

          <motion.button
            type="submit"
            className={`btn-submit-advanced ${status}`}
            disabled={status === "sending"}
            variants={itemVariants}
          >
            {status === "sending" && <FiCpu className="spin" size={20} />}
            {status === "success" && <FiCheckCircle size={20} />}
            {status === "error" && <FiAlertCircle size={20} />}

            <span className="btn-text">
              {status === "sending"
                ? "TRANSMITTING..."
                : status === "success"
                  ? "TRANSMISSION SECURED"
                  : "SEND TRANSMISSION"}
            </span>
            {status === "idle" && <FiSend className="btn-icon" />}
          </motion.button>

          <AnimatePresence>
            {errorMSG && (
              <motion.div
                className={`contact-alert error`}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
              >
                <FiAlertCircle /> {errorMSG}
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                className={`contact-alert success`}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
              >
                <FiCheckCircle /> Transmission Successful!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;