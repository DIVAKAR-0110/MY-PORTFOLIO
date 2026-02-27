// src/sections/Contact.jsx
import "./Contact.css";
import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiChevronRight,
  FiCheck,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";
import emailjs from "@emailjs/browser";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [error, setError] = useState("");

  const email = "rdivakar0110@gmail.com";

  const EMAILJS_CONFIG = {
    service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    public_key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      // Send via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.service_id,
        EMAILJS_CONFIG.template_id,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: email,
          reply_to: formData.email,
        },
        EMAILJS_CONFIG.public_key,
      );

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setError(
        "Failed to send message. Please try again or email me directly.",
      );
    }
  };

  return (
    <motion.section
      id="contact"
      className="contact-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="contact-grid">
        {/* Left: Info */}
        <div className="contact-info">
          <div className="contact-header">
            <h2 className="contact-title">Let's build something together.</h2>
            <p className="contact-subtitle">
              Whether it's backend architecture, AI‑driven features, or content
              collaborations, I'm open to internships, freelance work, and
              interesting side projects.
            </p>
          </div>

          <div className="contact-details">
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <div>
                <p className="contact-label">Email me directly</p>
                <a href={`mailto:${email}`} className="contact-email">
                  {email}
                </a>
              </div>
            </div>

            <div className="contact-social">
              <a
                href="https://github.com/DIVAKAR-0110"
                target="_blank"
                rel="noreferrer"
                className="contact-social-link"
              >
                <FiGithub />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="contact-social-link"
              >
                <FiLinkedin />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-field">
            <label className="contact-label">Full name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="contact-input"
              placeholder="What's your name?"
              disabled={status === "sending"}
            />
          </div>

          <div className="contact-field">
            <label className="contact-label">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="contact-input"
              placeholder="your@email.com"
              disabled={status === "sending"}
            />
          </div>

          <div className="contact-field">
            <label className="contact-label">Tell me about your project</label>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="contact-textarea"
              placeholder="I need help with a backend system, AI feature, or want to collaborate on..."
              disabled={status === "sending"}
            />
          </div>

          <button
            type="submit"
            className="contact-submit"
            disabled={status === "sending" || status === "success"}
          >
            {status === "sending" ? (
              <>
                <FiSend size={16} />
                <span>Sending...</span>
              </>
            ) : status === "success" ? (
              <>
                <FiCheck size={16} />
                <span>Message sent! 🎉</span>
              </>
            ) : (
              <>
                Send message
                <FiChevronRight size={16} />
              </>
            )}
          </button>

          {status === "error" && <p className="contact-error">{error}</p>}
        </form>
      </div>
    </motion.section>
  );
}

export default Contact;
