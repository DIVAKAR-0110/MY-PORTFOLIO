// src/sections/TechStack.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiTerminal, FiLayers, FiDatabase, FiCloud, FiCpu, FiCode, FiArrowRight } from "react-icons/fi";
import "./TechStack.css";

const TECH_STATIONS = [
  { name: "C", icon: <FiTerminal />, color: "#A8B9CC", yOffset: 120 },
  { name: "C++", icon: <FiTerminal />, color: "#00599C", yOffset: 80 },
  { name: "Python", icon: <FiTerminal />, color: "#3776AB", yOffset: 40 },
  { name: "HTML+CSS", icon: <FiLayers />, color: "#E34F26", yOffset: 20 },
  { name: "JAVA", icon: <FiCode />, color: "#007396", yOffset: 40 },
  { name: "Django", icon: <FiLayers />, color: "#092E20", yOffset: 100 },
  { name: "PostgreSQL", icon: <FiDatabase />, color: "#336791", yOffset: 180 },
  { name: "MySQL", icon: <FiDatabase />, color: "#4479A1", yOffset: 240 },
  { name: "ML", icon: <FiCpu />, color: "#9C27B0", yOffset: 260 },
  { name: "React", icon: <FiLayers />, color: "#61DAFB", yOffset: 240 },
  { name: "Angular", icon: <FiLayers />, color: "#DD0031", yOffset: 180 },
  { name: "AWS", icon: <FiCloud />, color: "#FF9900", yOffset: 100 },
  { name: "MongoDB", icon: <FiDatabase />, color: "#47A248", yOffset: 40 },
  { name: "SpringBoot", icon: <FiLayers />, color: "#6DB33F", yOffset: 20 },
];

function TechStack() {
  return (
    <section id="stack" className="infinite-erp-roadmap">
      <div className="erp-roadmap-header">
        <div className="erp-indicator">
          <span className="erp-pulse" />
          <span className="erp-label">LIVE_ROADMAP_FEED</span>
        </div>
        <h2 className="erp-roadmap-title">Technical <span>Evolution</span></h2>
        <div className="erp-scroll-hint">Scroll Horizontal →</div>
      </div>

      <div className="infinite-road-canvas">
        <div className="road-scroll-wrapper">
          {/* The Infinite Road SVG */}
          <svg className="infinite-road-svg" viewBox="0 0 2500 300" preserveAspectRatio="none">
            {/* Dark Tech Base */}
            <path
              d="M0 150 C 200 150, 300 50, 500 50 C 700 50, 800 250, 1000 250 C 1200 250, 1300 50, 1500 50 C 1700 50, 1800 250, 2000 250 C 2200 250, 2300 150, 2500 150"
              fill="none"
              stroke="#111"
              strokeWidth="60"
            />
            {/* Glowing Neon Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 5, ease: "linear" }}
              d="M0 150 C 200 150, 300 50, 500 50 C 700 50, 800 250, 1000 250 C 1200 250, 1300 50, 1500 50 C 1700 50, 1800 250, 2000 250 C 2200 250, 2300 150, 2500 150"
              fill="none"
              stroke="#ffd700"
              strokeWidth="2"
              className="road-neon-center"
            />
          </svg>

          {/* Stations mapped to the road curve */}
          <div className="curved-stations">
            {TECH_STATIONS.map((tech, index) => {
              const leftPos = (index / (TECH_STATIONS.length)) * 2500;
              
              return (
                <motion.div 
                  key={tech.name}
                  className="curved-node"
                  style={{ 
                    left: `${leftPos}px`,
                    top: `${tech.yOffset}px`,
                    "--node-color": tech.color
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="node-glow-ring" />
                  <motion.div 
                    className="node-box"
                    whileHover={{ y: -10, boxShadow: `0 0 25px ${tech.color}` }}
                  >
                    <span className="node-icon">{tech.icon}</span>
                    <span className="node-name">{tech.name}</span>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* "To Be Continued" Finale */}
            <motion.div 
              className="curved-node finale"
              style={{ left: "2350px", top: "150px" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="finale-card">
                <div className="finale-glow" />
                <span className="finale-text">Exploring Next...</span>
                <FiArrowRight className="finale-arrow" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="erp-roadmap-decor">
        <div className="grid-line horizontal" />
        <div className="grid-line vertical" />
        <div className="decor-system-stats">
          <span>PATH_STABILITY: 99.8%</span>
          <span>STATION_SYNC: ACTIVE</span>
        </div>
      </div>
    </section>
  );
}

export default TechStack;
