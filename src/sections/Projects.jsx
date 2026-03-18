// src/sections/Projects.jsx
import "./Projects.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  FiGithub,
  FiExternalLink,
  FiArrowRight,
  FiArrowLeft,
  FiX
} from "react-icons/fi";
import g1 from "../assets/SSRETAILS.png";
import g2 from "../assets/image2.png";
import g3 from "../assets/image3.png";
import g4 from "../assets/imga.png";
import { useNavigate } from "react-router-dom";

export const projects = [
  {
    id: "face-analytics",
    title: "AI‑Powered Face Recognition Platform",
    subtitle: "Deep Learning · Computer Vision",
    description:
      "Real-time face recognition with TensorFlow CNN models, OpenCV streams, Django backend, and analytics dashboards.",
    highlights: [
      "95% accuracy on diverse datasets",
      "500+ faces/minute processing",
      "Role-based analytics dashboards",
    ],
    stack: ["Python", "TensorFlow", "OpenCV", "Django", "PostgreSQL"],
    image: g3,
    gradient: "from-purple-500 to-pink-500",
    themeColor: "#ec4899",
    github: "",
    live: "",
    stats: { Accuracy: "95%", Speed: "500+/min", Users: "100+" },
  },
  {
    id: "ssretails",
    title: "SSRetails - Textile ERP System",
    subtitle: "Enterprise · Full-Stack Retail",
    description:
      "Complete inventory, billing, supplier management with RBAC for textile operations.",
    highlights: [
      "5 user roles with full RBAC",
      "Real-time inventory sync",
      "70% faster billing process",
    ],
    stack: ["Django", "PostgreSQL", "Tailwind", "JavaScript"],
    image: g1,
    gradient: "from-emerald-500 to-teal-500",
    themeColor: "#14b8a6",
    github: "",
    live: "",
    stats: { Efficiency: "70%", Warehouses: "3", Rating: "4.8/5" },
  },
  {
    id: "complaints",
    title: "GovTech Complaint Management Portal",
    subtitle: "SaaS · Civic Technology",
    description:
      "Citizen complaint lifecycle with admin dashboards, REST APIs, and automated workflows.",
    highlights: [
      "Full CRUD + status tracking",
      "Multi-tenant ready architecture",
      "PDF reports & audit trails",
    ],
    stack: ["Django", "MySQL", "REST APIs", "Bootstrap"],
    image: g2,
    gradient: "from-blue-500 to-indigo-500",
    themeColor: "#6366f1",
    github: "",
    live: "",
    stats: { Complaints: "50+", LOC: "12K", Status: "Complete" },
  },
  {
    id: "rbac",
    title: "Enterprise RBAC Security Platform",
    subtitle: "Microservices · Zero-Trust Security",
    description:
      "Production JWT auth system with Spring Security, policy engine, and role-based permissions.",
    highlights: [
      "OAuth2 + JWT hybrid auth",
      "Policy-based access control",
      "99.9% uptime guarantee",
    ],
    stack: ["Spring Boot", "Spring Security", "JWT", "MySQL"],
    image: g4,
    gradient: "from-orange-500 to-red-500",
    themeColor: "#f97316",
    github: "",
    live: "",
    stats: { Uptime: "99.9%", LOC: "18K", Security: "Zero-Trust" },
  },
];

// 3D Tilt Card Component
const TiltProjectCard = ({ project, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [12, -12]);
  const rotateY = useTransform(x, [-200, 200], [-12, 12]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layoutId={`project-container-${project.id}`}
      className={`app-store-card ${project.gradient}`}
      onClick={onClick}
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="app-store-card-inner"
        style={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          layoutId={`project-image-${project.id}`}
          className="app-store-image-container"
        >
          <img
            src={project.image}
            alt={project.title}
            className="app-store-image fallback-bg"
            onError={(e) => {
              e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
              e.target.className = "app-store-image fallback-grad";
            }}
          />
          <div className="app-store-image-overlay" />

          <motion.div layoutId={`project-header-${project.id}`} className="app-store-header">
            <h3 className="app-store-title">{project.title}</h3>
            <p className="app-store-subtitle">{project.subtitle}</p>
          </motion.div>
        </motion.div>

        <div className="app-store-card-footer">
          <p className="app-store-desc-preview">{project.description}</p>
          <div className="app-store-cta">
            <span>Explore Project</span>
            <FiArrowRight />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // Block scroll on body when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedId]);

  return (
    <section id="projects" className="projects-super-section">
      <div className="section-header">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured <span className="gradient-text">Projects</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Production-grade systems showcasing my backend, AI/ML, and full-stack expertise
        </motion.p>
      </div>

      <div className="projects-grid-3d">
        {projects.map((project) => (
          <TiltProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedId(project.id)}
          />
        ))}
      </div>

      <div className="view-all-container">
        <button className="hero-btn-secondary" onClick={() => navigate('/projects')}>
          View All Projects <FiArrowRight />
        </button>
      </div>

      {/* MASSIVE APP-STORE EXPANSION MODAL */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="app-modal-backdrop"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={() => setSelectedId(null)}
          >
            <div className="app-modal-scroll-area">
              {projects
                .filter((p) => p.id === selectedId)
                .map((project) => (
                  <motion.div
                    key={project.id}
                    layoutId={`project-container-${project.id}`}
                    className="app-modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.button
                      className="app-modal-close"
                      onClick={() => setSelectedId(null)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <FiX size={24} />
                    </motion.button>

                    <motion.div
                      layoutId={`project-image-${project.id}`}
                      className="app-modal-hero"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="app-modal-hero-img fallback-bg"
                        onError={(e) => {
                          e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                          e.target.className = "app-modal-hero-img fallback-grad";
                        }}
                      />
                      <div className="app-modal-hero-overlay" />
                      <motion.div layoutId={`project-header-${project.id}`} className="app-modal-hero-text">
                        <h2 className="app-modal-title">{project.title}</h2>
                        <p className="app-modal-subtitle" style={{ color: project.themeColor }}>
                          {project.subtitle}
                        </p>
                      </motion.div>
                    </motion.div>

                    <div className="app-modal-body">
                      {/* STATS */}
                      <div className="app-stats-row">
                        {Object.entries(project.stats).map(([key, value], idx) => (
                          <motion.div
                            key={key}
                            className="app-stat-chip"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                          >
                            <span className="stat-value" style={{ color: project.themeColor }}>
                              {value}
                            </span>
                            <span className="stat-label">{key}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* MAIN CONTENT GRID */}
                      <div className="app-modal-grid">
                        <div className="app-modal-main">
                          <h3>Overview</h3>
                          <p className="app-desc-large">{project.description}</p>

                          <h3>Key Architectural Highlights</h3>
                          <ul className="app-highlights-list">
                            {project.highlights.map((h, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                              >
                                <span className="highlight-bullet" style={{ background: project.themeColor }} />
                                {h}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div className="app-modal-sidebar">
                          <div className="app-sidebar-card">
                            <h3>Tech Stack</h3>
                            <div className="app-stack-chips">
                              {project.stack.map((tech) => (
                                <span key={tech} className="app-tech-chip">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="app-sidebar-actions">
                            <motion.a
                              href={project.github || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="app-action-btn secondary"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiGithub /> Source Code
                            </motion.a>
                            <motion.a
                              href={project.live || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="app-action-btn primary"
                              style={{ background: project.themeColor, borderColor: project.themeColor }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiExternalLink /> Live Demo
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;
