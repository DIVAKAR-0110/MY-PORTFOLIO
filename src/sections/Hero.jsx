// src/sections/Hero.jsx
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiMousePointer,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiDownload,
  FiX
} from "react-icons/fi";
import { useState } from "react";
import "./Hero.css";

import img1 from "../assets/PROFILE_PIC.png";
import img2 from "../assets/PROFILE_PIC.png";
import img3 from "../assets/PROFILE_PIC.png";

function Hero() {
  const images = [img1, img2, img3];
  const [current, setCurrent] = useState(0);
  const [showResume, setShowResume] = useState(false);

  // 3D Parallax logic for profile image
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Stagger variants for the title
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.section
        id="hero"
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Particles */}
        <div className="hero-particles">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
        </div>

        <div className="hero-container">
          {/* LEFT CONTENT */}
          <div className="hero-content">
            <br />
            <br />
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              <span>SOFTWARE ENGINEER</span>
              <span>AI DEVELOPER</span>
              <span>CONTENT CREATOR</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={itemVariants}>Hi, I'm </motion.span>
              <motion.span variants={itemVariants} className="hero-name">DIVAKAR R</motion.span>
              <motion.span variants={itemVariants} className="hero-subtitle">
                I build <span className="gradient-text">scalable backend systems</span>{" "}
                and <span className="gradient-text">AI-driven products</span>.
              </motion.span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              M.Sc. Software Systems @{" "}
              <span className="highlight">CIT Coimbatore</span> | Deep Learning |
              Backend Architecture | Full-Stack
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                className="hero-btn-primary"
                onClick={() => setShowResume(true)}
              >
                View Resume <FiFileText />
              </button>

              <button
                className="hero-btn-secondary"
                onClick={() => handleScroll("projects")}
              >
                View Projects
              </button>
            </motion.div>

            <motion.div
              className="hero-tech-tags"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                "Spring Boot",
                "Django",
                "TensorFlow",
                "React",
                "System Design",
              ].map((tech, i) => (
                <span key={i} className="tech-tag">
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT PROFILE + SLIDER (3D Parallax Container) */}
          <motion.div
            className="hero-profile"
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Framer Motion perspective wrapper */}
            <motion.div
              className="profile-container"
              onMouseMove={handleMouse}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: 1000 }}
            >
              {/* The element that physically rotates */}
              <motion.div
                className="profile-interactive"
                style={{ rotateX, rotateY }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="profile-glow" />
                <div className="profile-ring" />

                <div className="profile-image">
                  <motion.div
                    className="slider-track"
                    animate={{ x: `-${current * 100}%` }}
                    transition={{ type: "spring", stiffness: 60 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -100) nextSlide();
                      if (info.offset.x > 100) prevSlide();
                    }}
                  >
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`slide-${index}`}
                        className="slider-image"
                      />
                    ))}
                  </motion.div>

                  <button className="slider-btn left" onClick={prevSlide}>
                    <FiChevronLeft />
                  </button>

                  <button className="slider-btn right" onClick={nextSlide}>
                    <FiChevronRight />
                  </button>

                  <div className="slider-dots">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`dot ${current === index ? "active" : ""}`}
                        onClick={() => setCurrent(index)}
                      />
                    ))}
                  </div>

                  <div className="profile-status">
                    <div className="status-dot" />
                    <span>Available for work</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="scroll-indicator">
              <FiMousePointer />
              <span>Scroll or Drag</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FULL-SCREEN RESUME MODAL */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            className="resume-modal-backdrop"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
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
                  <FiFileText size={24} color="#22d3ee" />
                  <h3>DIVAKAR R. - Resume</h3>
                </div>
                <div className="resume-modal-actions">
                  <a
                    href="/divakar_resume.pdf"
                    download="DIVAKAR_R_Resume.pdf"
                    className="modal-btn download"
                  >
                    <FiDownload size={18} /> Download
                  </a>
                  <button
                    className="modal-btn close"
                    onClick={() => setShowResume(false)}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
              <div className="resume-modal-body">
                <iframe
                  src="/divakar_resume.pdf"
                  title="Divakar Resume"
                  className="resume-iframe"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Hero;
