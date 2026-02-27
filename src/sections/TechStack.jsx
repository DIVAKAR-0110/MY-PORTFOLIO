// src/sections/TechStack.jsx
import { motion } from "framer-motion";
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
} from "react-icons/si";
import { Center } from "@react-three/drei";

const skills = [
  // Backend
  {
    category: "backend",
    name: "Spring Boot",
    icon: SiSpringboot,
    level: 90,
    color: "#f97316",
  },
  {
    category: "backend",
    name: "Django",
    icon: SiDjango,
    level: 88,
    color: "#059669",
  },
  {
    category: "backend",
    name: "Python",
    icon: SiPython,
    level: 92,
    color: "#eab308",
  },

  // AI/ML
  {
    category: "ai",
    name: "TensorFlow",
    icon: SiTensorflow,
    level: 85,
    color: "#ef4444",
  },
  {
    category: "ai",
    name: "Deep Learning",
    icon: SiPython,
    level: 82,
    color: "#8b5cf6",
  },

  // Frontend
  {
    category: "frontend",
    name: "React",
    icon: SiReact,
    level: 95,
    color: "#3b82f6",
  },
  {
    category: "frontend",
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    level: 90,
    color: "#06b6d4",
  },
  {
    category: "frontend",
    name: "JavaScript",
    icon: SiJavascript,
    level: 92,
    color: "#f59e0b",
  },

  // Database
  {
    category: "database",
    name: "MySQL",
    icon: SiMysql,
    level: 88,
    color: "#0ea5e9",
  },
  {
    category: "database",
    name: "PostgreSQL",
    icon: SiPostgresql,
    level: 85,
    color: "#7c3aed",
  },

  // Tools
  {
    category: "tools",
    name: "Git",
    icon: SiGit,
    level: 95,
    color: "#ef4444",
  },
  {
    category: "tools",
    name: "Node.js",
    icon: SiNodedotjs,
    level: 87,
    color: "#10b981",
  },
];

function TechStack() {
  return (
    <motion.section
      id="stack"
      className="techstack-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="techstack-header">
        <h2 className="techstack-title">
          Tech Stack & <span className="gradient-text">Core Skills</span>.
        </h2>
        <p className="techstack-subtitle">
          Full-stack development with backend & AI specialization. Each skill
          includes hands-on project experience.
        </p>
      </div>

      <div className="techstack-grid">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className={`tech-card ${skill.category}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Icon & Name */}
            <div className="tech-header">
              <motion.div
                className="tech-icon"
                style={{ "--icon-color": skill.color }}
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.1,
                }}
              >
                <skill.icon size={28} />
              </motion.div>
              <div>
                <h3 className="tech-name">{skill.name}</h3>
                <div className="tech-level-bar">
                  <motion.div
                    className="tech-level-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ "--fill-color": skill.color }}
                  />
                </div>
                <span className="tech-level-text">{skill.level}%</span>
              </div>
            </div>

            {/* Category badges */}
            <div className="tech-categories">
              {skill.category === "backend" && (
                <span className="cat-backend">Backend</span>
              )}
              {skill.category === "ai" && <span className="cat-ai">AI/ML</span>}
              {skill.category === "frontend" && (
                <span className="cat-frontend">Frontend</span>
              )}
              {skill.category === "database" && (
                <span className="cat-database">Database</span>
              )}
              {skill.category === "tools" && (
                <span className="cat-tools">Tools</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary stats */}
      <motion.div
        className="tech-summary"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="summary-item">
          <div className="summary-number">12+</div>
          <div className="summary-label">Technologies</div>
        </div>

        <div className="summary-item">
          <div className="summary-number">16+</div>
          <div className="summary-label">Projects</div>
        </div>

        <h4 style={{ textAlign: "center", marginTop: "15px" }}>
          Known Languages: Tamil, Kannada, English
        </h4>
      </motion.div>
    </motion.section>
  );
}

export default TechStack;
