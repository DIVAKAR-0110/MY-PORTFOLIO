// src/sections/TechStack.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Html, View, Preload } from "@react-three/drei";
import "./TechStack.css";
import {
  SiReact, SiJavascript, SiHtml5, SiCss3, SiSpringboot, SiDjango, SiPython,
  SiTensorflow, SiMysql, SiPostgresql, SiNodedotjs, SiGit, SiTailwindcss, SiFigma, SiMongodb
} from "react-icons/si";

const skills = [
  { category: "Backend", name: "Spring Boot", icon: SiSpringboot, color: "#8B3A1E" },
  { category: "Backend", name: "Django", icon: SiDjango, color: "#2E5820" },
  { category: "Backend", name: "Python", icon: SiPython, color: "#C8922A" },
  { category: "AI", name: "TensorFlow", icon: SiTensorflow, color: "#8B3A1E" },
  { category: "AI", name: "Deep Learning", icon: SiPython, color: "#6B4226" },
  { category: "Frontend", name: "React", icon: SiReact, color: "#2C1810" },
  { category: "Frontend", name: "Tailwind CSS", icon: SiTailwindcss, color: "#2E5820" },
  { category: "Frontend", name: "JavaScript", icon: SiJavascript, color: "#C8922A" },
  { category: "Database", name: "MySQL", icon: SiMysql, color: "#2C1810" },
  { category: "Database", name: "PostgreSQL", icon: SiPostgresql, color: "#8B3A1E" },
  { category: "Database", name: "MongoDB", icon: SiMongodb, color: "#2E5820" },
  { category: "Tools", name: "Git", icon: SiGit, color: "#8B3A1E" },
  { category: "Tools", name: "Node.js", icon: SiNodedotjs, color: "#2E5820" },
];

const categories = ["All", "Frontend", "Backend", "AI", "Database", "Tools"];

function ThreeDIcon({ icon: Icon, color }) {
  const ref = useRef();
  return (
    <div ref={ref} className="tech-icon-wrapper">
      <View track={ref}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
          <mesh>
            <octahedronGeometry args={[1.6, 0]} />
            <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.6} />
            <Html center transform distanceFactor={8}>
              <div className="tech3d-icon" style={{ color }}>
                <Icon size={46} />
              </div>
            </Html>
          </mesh>
        </Float>
      </View>
    </div>
  );
}

function TechStack() {
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useRef();
  const filteredSkills = skills.filter((s) => activeFilter === "All" || s.category === activeFilter);

  return (
    <section ref={sectionRef} id="stack" className="techstack-section">
      <div className="section-eyebrow">The Master's Arsenal</div>
      <h2 className="section-title">Knowledge of the Ages</h2>
      <div className="section-ornament" />

      <div className="tech-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`tech-filter-btn ${activeFilter === cat ? "active" : ""}`}
          >
            {cat}
            {activeFilter === cat && <motion.div layoutId="filterNav" className="filter-nav-bg" />}
          </button>
        ))}
      </div>

      <motion.div layout className="tech-grid">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="tech-slate-card"
            >
              <ThreeDIcon icon={skill.icon} color={skill.color} />
              <div className="tech-slate-info">
                <h3 className="tech-slate-name">{skill.name}</h3>
                <span className="tech-slate-cat">{skill.category}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Canvas className="tech-global-canvas" eventSource={sectionRef}>
        <View.Port />
        <Preload all />
      </Canvas>
    </section>
  );
}

export default TechStack;
