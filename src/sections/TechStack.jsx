// src/sections/TechStack.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import "./TechStack.css";

import pythonIcon from "../assets/python.png";
import spring from "../assets/springboot.jpg";
import nodejs from "../assets/node.jpg";
import django from "../assets/django.jpg";
import git from "../assets/git.jpg";
import tensor from "../assets/tensorflow.jpg";
import tail from "../assets/tailwindcss.jpg";
import pga from "../assets/postgresql.png";
import mongo from "../assets/mongodb.jpg";
import mysql from "../assets/mysql.png";
import aws from "../assets/aws.png";

const TECH_SHRINE = [
  {
    name: "React",
    icon: "⚛️",
    category: "Frontend",
    color: "#61DAFB",
    shrine: 1,
  },
  {
    name: "Angular",
    icon: "🅰️",
    category: "Frontend",
    color: "#DD0031",
    shrine: 1,
  },

  {
    name: "Spring Boot",
    icon: spring,
    category: "Backend",
    color: "#6DB33F",
    shrine: 2,
  },
  {
    name: "Django",
    icon: django,
    category: "Backend",
    color: "#092E20",
    shrine: 2,
  },
  {
    name: "Node.js",
    icon: nodejs,
    category: "Backend",
    color: "#68A063",
    shrine: 2,
  },
  {
    name: "Firebase",
    icon: "🔥",
    category: "Backend",
    color: "#FFCA28",
    shrine: 2,
  },

  {
    name: "TensorFlow",
    icon: tensor,
    category: "AI",
    color: "#FF6F00",
    shrine: 3,
  },
  {
    name: "Machine Learning",
    icon: "🤖",
    category: "AI",
    color: "#8A2BE2",
    shrine: 3,
  },

  {
    name: "Python",
    icon: pythonIcon,
    category: "Core",
    color: "#3776AB",
    shrine: 1,
  },
  {
    name: "MongoDB",
    icon: mongo,
    category: "Core",
    color: "#47A248",
    shrine: 1,
  },
  { name: "MySQL", icon: mysql, category: "Core", color: "#5d838f", shrine: 1 },

  {
    name: "TailwindCSS",
    icon: tail,
    category: "Frontend",
    color: "#38BDF8",
    shrine: 1,
  },

  {
    name: "PostgreSQL",
    icon: pga,
    category: "Database",
    color: "#4169E1",
    shrine: 3,
  },
  {
    name: "MongoDB DB",
    icon: mongo,
    category: "Database",
    color: "#47A248",
    shrine: 3,
  },

  { name: "AWS", icon: aws, category: "Cloud", color: "#000000", shrine: 1 },

  { name: "GitHub", icon: git, category: "Tools", color: "#F05032", shrine: 4 },
  {
    name: "Framer Motion",
    icon: "✨",
    category: "Animation",
    color: "#FF4F92",
    shrine: 1,
  },
];

const CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "AI",
  "Database",
  "Core",
  "Tools",
  "Cloud",
  "Animation",
];

// ✅ Reusable icon renderer (FIX)
const RenderIcon = ({ icon, name }) => {
  const isEmoji = typeof icon === "string" && icon.length <= 3;

  return isEmoji ? (
    <span>{icon}</span>
  ) : (
    <img src={icon} alt={name} className="tech-img" />
  );
};

function MysticParticleAura() {
  return Array.from({ length: 100 }, (_, i) => (
    <Sparkles
      key={i}
      count={2}
      size={0.15}
      position={[
        (Math.random() - 0.5) * 30,
        Math.random() * 15,
        (Math.random() - 0.5) * 30,
      ]}
      speed={0.8}
      color="#FFD700"
    />
  ));
}

function TechRelic({ tech, isActive, onClick }) {
  const groupRef = useRef();
  const time = useRef(0);

  useFrame(() => {
    time.current += 0.02;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.y =
        Math.sin(time.current * 2 + tech.shrine) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={groupRef} onClick={onClick} scale={isActive ? 1.4 : 1}>
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

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.6, 0.06, 8, 64]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={isActive ? 0.9 : 0.5}
          />
        </mesh>

        <Billboard position={[0, 0, 1.4]}>
          <Html center transform distanceFactor={5}>
            <div className="tech-relic-display" style={{ color: tech.color }}>
              <div className="relic-icon">
                <RenderIcon icon={tech.icon} name={tech.name} />
              </div>
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

  const filteredTech = TECH_SHRINE.filter(
    (tech) => activeFilter === "All" || tech.category === activeFilter,
  );

  return (
    <section id="stack" className="tech-shrine-section">
      <div className="shrine-legend">
        <div className="legend-scroll">
          <h3>🛠️ The Sacred Arsenal</h3>

          <div className="legend-grid">
            {filteredTech.map((tech) => (
              <div key={tech.name} className="legend-item">
                <div className="legend-icon" style={{ background: tech.color }}>
                  <RenderIcon icon={tech.icon} name={tech.name} />
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
