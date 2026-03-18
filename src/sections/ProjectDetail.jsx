import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiGithub, FiExternalLink } from "react-icons/fi";
import "./Projects.css";

function ProjectDetail({ projects }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (!project) return (
    <div style={{ textAlign: "center", padding: "10rem", color: "white" }}>
      <h1>Project not found.</h1>
      <button className="hero-btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: "2rem" }}>Go Back</button>
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: "100vh", background: "#020617", padding: "2rem 1rem", display: "flex", justifyContent: "center" }}
    >
      <div className="app-modal-content" style={{ margin: "0 auto", boxShadow: "none", border: "1px solid rgba(255,255,255,0.05)" }}>
        
        {/* Navigation Bar */}
        <div style={{ padding: "1.5rem 2rem", background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center" }}>
          <button 
            className="hero-btn-secondary" 
            onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="app-modal-hero">
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
          <div className="app-modal-hero-text">
            <h2 className="app-modal-title">{project.title}</h2>
            <p className="app-modal-subtitle" style={{ color: project.themeColor || "#22d3ee" }}>
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Details Body */}
        <div className="app-modal-body">
          {/* STATS */}
          <div className="app-stats-row">
            {project.stats && Object.entries(project.stats).map(([key, value], idx) => (
              <motion.div
                key={key}
                className="app-stat-chip"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <span className="stat-value" style={{ color: project.themeColor || "#22d3ee" }}>
                  {value}
                </span>
                <span className="stat-label">{key}</span>
              </motion.div>
            ))}
          </div>

          <div className="app-modal-grid">
            <div className="app-modal-main">
              <h3>Overview</h3>
              <p className="app-desc-large">{project.description}</p>

              <h3>Key Architectural Highlights</h3>
              <ul className="app-highlights-list">
                {project.highlights?.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <span className="highlight-bullet" style={{ background: project.themeColor || "#22d3ee" }} />
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
                  style={{ background: project.themeColor || "#14b8a6", borderColor: project.themeColor || "#14b8a6" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiExternalLink /> Live Demo
                </motion.a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
}

export default ProjectDetail;
