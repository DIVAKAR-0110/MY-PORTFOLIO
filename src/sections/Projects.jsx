// src/sections/Projects.jsx
import "./Projects.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiExternalLink,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import g1 from "../assets/SSRETAILS.png";

const projects = [
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
    image: "/images/projects/face-analytics-1.jpg",
    gradient: "from-purple-500 to-pink-500",
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
    image: "/images/projects/complaints-1.jpg",
    gradient: "from-blue-500 to-indigo-500",
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
    image: "/images/projects/rbac-1.jpg",
    gradient: "from-orange-500 to-red-500",
    github: "",
    live: "",
    stats: { Uptime: "99.9%", LOC: "18K", Security: "Zero-Trust" },
  },
];

function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <section id="projects">
      <div className="section-header">
        <h2 className="section-title">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="section-subtitle">
          Production-grade systems showcasing my backend, AI/ML, and full-stack
          expertise
        </p>
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            key="detail"
            className="projects-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.button
              className="back-btn"
              onClick={() => setSelectedId(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft /> Top Projects
            </motion.button>

            <div className="detail-container">
              <div className="detail-media">
                <motion.div
                  className="hero-image"
                  style={{ backgroundImage: `url(${selectedProject.image})` }}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="image-overlay" />
              </div>

              <div className="detail-content">
                <h1>{selectedProject.title}</h1>
                <p className="project-subtitle">{selectedProject.subtitle}</p>

                <div className="project-stats">
                  {Object.entries(selectedProject.stats).map(([key, value]) => (
                    <div key={key} className="stat-item">
                      <span className="stat-value">{value}</span>
                      <span className="stat-label">{key}</span>
                    </div>
                  ))}
                </div>

                <div className="detail-sections">
                  <div className="detail-section">
                    <h3>Overview</h3>
                    <p>{selectedProject.description}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Impact</h3>
                    <motion.div
                      className="highlights-grid"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.15 } },
                      }}
                    >
                      {selectedProject.highlights.map((h, idx) => (
                        <motion.div
                          key={idx}
                          className="highlight-card"
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          whileHover={{ y: -4 }}
                        >
                          <div className="highlight-number">{idx + 1}</div>
                          <span>{h}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="detail-section">
                    <h3>Tech Stack</h3>
                    <div className="stack-grid">
                      {selectedProject.stack.map((tech) => (
                        <motion.span
                          key={tech}
                          className="stack-chip"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="detail-actions">
                  {selectedProject.github && (
                    <motion.a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn github"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiGithub /> View Code
                    </motion.a>
                  )}
                  {selectedProject.live && (
                    <motion.a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn live"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiExternalLink /> Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="projects-grid"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {projects.map((project) => (
              <motion.article
                key={project.id}
                className={`project-card ${project.gradient}`}
                onClick={() => setSelectedId(project.id)}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-visual">
                  <div
                    className="visual-bg"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="visual-overlay" />
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <p>{project.subtitle}</p>
                  </div>
                </div>

                <div className="card-body">
                  <p>{project.description}</p>
                  <div className="stack-preview">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="tech-preview">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <div className="explore-btn">
                      Explore Project <FiArrowRight />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;
