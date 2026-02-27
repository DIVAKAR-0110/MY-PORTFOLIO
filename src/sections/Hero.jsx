// src/sections/Hero.jsx
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiMousePointer,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState } from "react";
import "./Hero.css";

import img1 from "../assets/PROFILE_PIC.png";
import img2 from "../assets/PROFILE_PIC.png";
import img3 from "../assets/PROFILE_PIC.png";

function Hero() {
  const images = [img1, img2, img3];
  const [current, setCurrent] = useState(0);

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <motion.section
      id="hero"
      className="hero-section"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
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
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <br />
          <br />
          <div className="hero-badge">
            <span>SOFTWARE ENGINEER</span>
            <span>AI DEVELOPER</span>
            <span>CONTENT CREATOR</span>
          </div>
          <h1 className="hero-title">
            Hi, I'm <span className="hero-name">DIVAKAR R</span>
            <span className="hero-subtitle">
              I build{" "}
              <span className="gradient-text">scalable backend systems</span>{" "}
              and <span className="gradient-text">AI-driven products</span>.
            </span>
          </h1>
          <p className="hero-description">
            M.Sc. Software Systems @{" "}
            <span className="highlight">CIT Coimbatore</span> | Deep Learning |
            Backend Architecture | Full-Stack
          </p>
          <div className="hero-cta">
            <button
              className="hero-btn-primary"
              onClick={() => handleScroll("projects")}
            >
              View Projects <FiArrowRight />
            </button>

            <button
              className="hero-btn-secondary"
              onClick={() => handleScroll("content")}
            >
              Explore Content
            </button>
          </div>
          <div className="hero-tech-tags">
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
          </div>
        </motion.div>

        {/* RIGHT PROFILE + SLIDER */}
        <motion.div
          className="hero-profile"
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="profile-container">
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
          </div>

          <div className="scroll-indicator">
            <FiMousePointer />
            <span>Scroll</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Hero;
