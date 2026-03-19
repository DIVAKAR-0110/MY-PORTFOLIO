// src/sections/TechStack.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Html, View, Preload } from "@react-three/drei";
import "./TechStack.css";
import {
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiSpringboot,
  SiDjango,
  SiPython,
  SiTensorflow,
  SiMysql,
  SiPostgresql,
  SiNodedotjs,
  SiGit,
  SiTailwindcss,
  SiFigma,
  SiMongodb
} from "react-icons/si";

const skills = [
  // Backend
  { category: "Backend", name: "Spring Boot", icon: SiSpringboot, colorRgb: "249, 115, 22" /* #f97316 */ },
  { category: "Backend", name: "Django", icon: SiDjango, colorRgb: "5, 150, 105" /* #059669 */ },
  { category: "Backend", name: "Python", icon: SiPython, colorRgb: "234, 179, 8" /* #eab308 */ },

  // AI/ML
  { category: "AI", name: "TensorFlow", icon: SiTensorflow, colorRgb: "239, 68, 68" /* #ef4444 */ },
  { category: "AI", name: "Deep Learning", icon: SiPython, colorRgb: "139, 92, 246" /* #8b5cf6 */ },

  // Frontend
  { category: "Frontend", name: "React", icon: SiReact, colorRgb: "59, 130, 246" /* #3b82f6 */ },
  { category: "Frontend", name: "Tailwind CSS", icon: SiTailwindcss, colorRgb: "6, 182, 212" /* #06b6d4 */ },
  { category: "Frontend", name: "JavaScript", icon: SiJavascript, colorRgb: "245, 158, 11" /* #f59e0b */ },

  // Database
  { category: "Database", name: "MySQL", icon: SiMysql, colorRgb: "14, 165, 233" /* #0ea5e9 */ },
  { category: "Database", name: "PostgreSQL", icon: SiPostgresql, colorRgb: "124, 58, 237" /* #7c3aed */ },
  { category: "Database", name: "MongoDB", icon: SiMongodb, colorRgb: "34, 197, 94" /* #22c55e */ },

  // Tools
  { category: "Tools", name: "Git", icon: SiGit, colorRgb: "239, 68, 68" /* #ef4444 */ },
  { category: "Tools", name: "Node.js", icon: SiNodedotjs, colorRgb: "16, 185, 129" /* #10b981 */ },
  { category: "Tools", name: "Figma", icon: SiFigma, colorRgb: "244, 114, 182" /* #f472b6 */ },
];

const categories = ["All", "Frontend", "Backend", "AI", "Database", "Tools"];

// --- 3D INTERACTIVE ICON COMPONENT ---
// Uses View from @react-three/drei to "portal" 3D content into a single global Canvas
function ThreeDIcon({ icon: Icon, colorRgb }) {
  const ref = useRef();
  const hexColor = `rgb(${colorRgb})`;
  
  return (
    <div ref={ref} className="tech-icon-wrapper is-3d">
      <View track={ref}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
          <mesh>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color={hexColor} wireframe={true} emissive={hexColor} emissiveIntensity={0.5} />
            <Html center transform distanceFactor={9}>
              <div style={{ color: hexColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={50} />
              </div>
            </Html>
          </mesh>
        </Float>
      </View>
    </div>
  );
}

// --- SPOTLIGHT CARD COMPONENT ---
const SpotlightCard = ({ children, colorRgb }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
      className="tech-card"
      style={{
        "--mouse-x": `${position.x}px`,
        "--mouse-y": `${position.y}px`,
        "--icon-color-rgb": colorRgb,
      }}
    >
      <div className="tech-card-inner">{children}</div>
    </motion.div>
  );
};

// --- MAIN TECHSTACK COMPONENT ---
function TechStack() {
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useRef();

  const filteredSkills = skills.filter((skill) =>
    activeFilter === "All" ? true : skill.category === activeFilter
  );

  return (
    <motion.section
      ref={sectionRef}
      id="stack"
      className="techstack-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="techstack-header">
        <motion.h2
          className="techstack-title"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Tech Stack & <span className="gradient-text">Core Skills</span>.
        </motion.h2>
        <motion.p
          className="techstack-subtitle"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Full-stack development with backend & AI specialization. Each skill
          includes hands-on project experience.
        </motion.p>
      </div>

      {/* Modern Filter Navigation */}
      <div className="tech-filters">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`filter-btn ${activeFilter === category ? "active" : ""}`}
          >
            {activeFilter === category && (
              <motion.div
                layoutId="activeFilterBg"
                className="filter-active-bg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {category}
          </button>
        ))}
      </div>

      {/* Grid with Spotlight Cards & 3D Icons */}
      <motion.div layout className="techstack-grid">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <SpotlightCard key={skill.name} colorRgb={skill.colorRgb}>
              {/* Insert the stunning interactive 3D icon right here */}
              <ThreeDIcon icon={skill.icon} colorRgb={skill.colorRgb} />
              
              <div className="tech-info">
                <h3 className="tech-name">{skill.name}</h3>
                <span className="tech-category">{skill.category}</span>
              </div>
            </SpotlightCard>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Refined Summary Stats */}
      <motion.div
        className="tech-summary"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="summary-item">
          <div className="summary-number">14+</div>
          <div className="summary-label">TECHNOLOGIES</div>
        </div>

        <div className="summary-item">
          <div className="summary-number">16+</div>
          <div className="summary-label">PROJECTS COMPLETED</div>
        </div>
      </motion.div>
      {/* GLOBAL BACKGROUND CANVAS - Shared context for all View components */}
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
        eventSource={sectionRef}
      >
        <View.Port />
        <Preload all />
      </Canvas>
    </motion.section>
  );
}

export default TechStack;
