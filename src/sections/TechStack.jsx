// src/sections/TechStack.jsx - LEGENDARY TECH SHRINE (No Planets/No %)
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Sparkles, Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import "./TechStack.css";

const TECH_SHRINE = [
  { name: "React", icon: "⚛️", category: "Frontend", color: "#61DAFB", shrine: 1 },
  { name: "Spring Boot", icon: "🔥", category: "Backend", color: "#6DB33F", shrine: 2 },
  { name: "Django", icon: "🐍", category: "Backend", color: "#092E20", shrine: 2 },
  { name: "TensorFlow", icon: "🧠", category: "AI", color: "#FF6F00", shrine: 3 },
  { name: "Python", icon: "🐍", category: "Core", color: "#3776AB", shrine: 1 },
  { name: "TailwindCSS", icon: "🎨", category: "Frontend", color: "#38BDF8", shrine: 1 },
  { name: "PostgreSQL", icon: "💎", category: "Database", color: "#4169E1", shrine: 3 },
  { name: "MongoDB", icon: "📊", category: "Database", color: "#47A248", shrine: 3 },
  { name: "Node.js", icon: "⚡", category: "Backend", color: "#68A063", shrine: 2 },
  { name: "Three.js", icon: "🌐", category: "3D", color: "#000000", shrine: 1 },
  { name: "Git", icon: "⚔️", category: "Tools", color: "#F05032", shrine: 4 },
  { name: "Framer Motion", icon: "✨", category: "Animation", color: "#FF4F92", shrine: 1 }
];

const CATEGORIES = ["All", "Frontend", "Backend", "AI", "Database", "Core", "Tools", "3D", "Animation"];

function MysticParticleAura({ intensity = 1 }) {
  return Array.from({ length: 100 }, (_, i) => (
    <Sparkles
      key={`aura-${i}`}
      count={2}
      size={0.15}
      position={[
        (Math.random() - 0.5) * 30,
        Math.random() * 15,
        (Math.random() - 0.5) * 30
      ]}
      speed={0.8}
      color="#FFD700"
    />
  ));
}

function TechRelic({ tech, isActive, onClick }) {
  const groupRef = useRef();
  const time = useRef(0);

  useFrame((state) => {
    time.current += 0.02;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.y = Math.sin(time.current * 2 + tech.shrine) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <group
        ref={groupRef}
        position={[0, 0, 0]}
        onClick={onClick}
        scale={isActive ? 1.4 : 1}
      >
        {/* Ancient Tech Relic */}
        <mesh>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color={tech.color}
            emissive={tech.color}
            emissiveIntensity={isActive ? 0.9 : 0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Relic Glow Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.6, 0.06, 8, 64]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={isActive ? 0.9 : 0.5}
          />
        </mesh>

        {/* Tech Icon Display */}
        <Billboard position={[0, 0, 1.4]}>
          <Html
            center
            transform
            distanceFactor={5}
            className={`relic-label ${isActive ? 'active' : ''}`}
          >
            <div className="tech-relic-display" style={{ color: tech.color }}>
              <div className="relic-icon">{tech.icon}</div>
              <div className="relic-name">{tech.name}</div>
            </div>
          </Html>
        </Billboard>
      </group>
    </Float>
  );
}

function TechStack() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTech, setSelectedTech] = useState(null);
  const sectionRef = useRef();

  const filteredTech = TECH_SHRINE.filter(
    tech => activeFilter === "All" || tech.category === activeFilter
  );

  return (
    <section ref={sectionRef} id="stack" className="tech-shrine-section">
      {/* Shrine Legend */}
      <div className="shrine-legend">
        <div className="legend-scroll">
          <h3>🛠️ The Sacred Arsenal</h3>
          <div className="legend-grid">
            {filteredTech.map(tech => (
              <div key={tech.name} className="legend-item">
                <div className="legend-icon" style={{ background: tech.color }}>
                  {tech.icon}
                </div>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechStack;
