// src/sections/Footer.jsx
import "./Footer.css";
import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiTwitter,
  FiInstagram,
  FiChevronUp,
} from "react-icons/fi";

function Footer() {
  const quickLinks = [
    { label: "Home", href: "#hero" },
    { label: "Projects", href: "#projects" },
    { label: "Content", href: "#content" },
    { label: "Tech Stack", href: "#stack" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Main content row */}
          <div className="footer-main">
            {/* Logo & Brand */}
            <motion.div
              className="footer-brand"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="footer-logo-circle">D</div>
              <div>
                <h3 className="footer-name">DIVAKAR R</h3>
                <p className="footer-tagline">
                  Full‑Stack Developer | AI Engineer | Content Creator
                </p>
              </div>
            </motion.div>

            {/* Quick links */}
            <div className="footer-links">
              <h4 className="footer-section-title">Quick Links</h4>
              <ul className="footer-link-list">
                {quickLinks.map((link, index) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div className="footer-contact">
              <h4 className="footer-section-title">Get in touch</h4>
              <div className="footer-contact-items">
                <a
                  href="mailto:rdivakar0110@gmail.com"
                  className="footer-contact-item"
                >
                  <FiMail /> rdivakar0110@gmail.com
                </a>
                <a href="tel:+919876543210" className="footer-contact-item">
                  <FiMail /> +91 80151 65547
                </a>
              </div>
            </div>

            {/* Social media */}
            <div className="footer-social">
              <h4 className="footer-section-title">Connect</h4>
              <div className="footer-social-links">
                <a
                  href="https://github.com/DIVAKAR-0110"
                  className="footer-social-link"
                  aria-label="GitHub"
                >
                  <FiGithub />
                </a>
                <a
                  href="https://linkedin.com/in/divakar-r"
                  className="footer-social-link"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin />
                </a>
                <a
                  href="https://twitter.com/divakar_r"
                  className="footer-social-link"
                  aria-label="Twitter"
                >
                  <FiTwitter />
                </a>
                <a
                  href="https://instagram.com/divakar_r"
                  className="footer-social-link"
                  aria-label="Instagram"
                >
                  <FiInstagram />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider" />

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © 2026 DIVAKAR R. Built with React. All rights reserved.
            </p>
            <button
              className="footer-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <FiChevronUp />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
