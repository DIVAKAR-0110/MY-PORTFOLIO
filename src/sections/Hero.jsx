// src/sections/Hero.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FiFileText, FiDownload, FiX } from "react-icons/fi";
import { useState } from "react";
import "./Hero.css";
import AncientGlobe from "../components/AncientGlobe";
import JourneyMap from "../components/JourneyMap";

function Hero() {
  const [showResume, setShowResume] = useState(false);
  const [showJourney, setShowJourney] = useState(false);

  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.section
        id="hero"
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* ── IDENTITY ── */}
        <motion.div
          className="hero-identity"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="ornament-line">
            <span className="ornament-symbol">❧</span>
          </div>

          <div className="hero-badges">
            <span className="hero-badge">Software Engineer</span>
            <span className="hero-badge-dot">✦</span>
            <span className="hero-badge">AI Developer</span>
            <span className="hero-badge-dot">✦</span>
            <span className="hero-badge">Content Creator</span>
          </div>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            DIVAKAR R
          </motion.h1>

          <p className="hero-subtitle">
            M.Sc. Software Systems &middot;{" "}
            <span className="hero-accent">CIT Coimbatore</span>
          </p>

          <div className="ornament-line">
            <span className="ornament-symbol">❦</span>
          </div>
        </motion.div>

        {/* ── UNIVERSE BLOCK ── */}
        <motion.div
          className="universe-block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <div className="universe-deco-line" />
          <h2 className="universe-heading">
            <span className="universe-scroll-left">⸻</span>
            &nbsp;GO TO MY UNIVERSE&nbsp;
            <span className="universe-scroll-right">⸻</span>
          </h2>
          <div className="universe-deco-line" />
          <p className="universe-description">
            Explore the chronicles of my craft — built with code,<br />
            shaped by passion, and told across time.
          </p>
        </motion.div>

        {/* ── 3D GLOBE ── */}
        <motion.div
          className="globe-wrapper"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.9 }}
        >
          <div className="globe-glow" />
          <AncientGlobe />
          <p className="globe-caption">✦ Drag to spin &middot; a real Earth awaits ✦</p>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="hero-cta-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {/* Primary: Journey Map */}
          <button className="btn-journey" onClick={() => setShowJourney(true)}>
            <span className="btn-journey-icon">⚜</span>
            <span>View My Universe</span>
            <span className="btn-journey-icon">⚜</span>
          </button>

          {/* Secondary: Resume */}
          <button className="btn-resume" onClick={() => setShowResume(true)}>
            <FiFileText size={16} /> View Resume
          </button>
        </motion.div>

        {/* ── TECH TAGS ── */}
        <motion.div
          className="hero-tech-tags"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {["Spring Boot", "Django", "TensorFlow", "React", "System Design"].map((tech, i) => (
            <span key={i} className="tech-tag">{tech}</span>
          ))}
        </motion.div>
      </motion.section>

      {/* ── JOURNEY MAP UNIVERSE ── */}
      <AnimatePresence>
        {showJourney && (
          <JourneyMap onClose={() => setShowJourney(false)} />
        )}
      </AnimatePresence>

      {/* ── RESUME MODAL ── */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            className="resume-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResume(false)}
          >
            <motion.div
              className="resume-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="resume-modal-header">
                <div className="resume-modal-title">
                  <FiFileText size={22} color="var(--accent)" />
                  <h3>DIVAKAR R. — Résumé</h3>
                </div>
                <div className="resume-modal-actions">
                  <a href="/divakar_resume.pdf" download="DIVAKAR_R_Resume.pdf" className="modal-btn download">
                    <FiDownload size={16} /> Download
                  </a>
                  <button className="modal-btn close" onClick={() => setShowResume(false)}>
                    <FiX size={18} />
                  </button>
                </div>
              </div>
              <div className="resume-modal-body">
                <iframe src="/divakar_resume.pdf" title="Divakar Resume" className="resume-iframe" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Hero;
