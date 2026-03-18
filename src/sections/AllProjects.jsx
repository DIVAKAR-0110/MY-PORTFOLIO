import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import "./Projects.css";

// Reusing the 3D Tilt Card design for consistency
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
        <div className="app-store-image-container">
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
          
          <div className="app-store-header">
            <h3 className="app-store-title">{project.title}</h3>
            <p className="app-store-subtitle">{project.subtitle}</p>
          </div>
        </div>

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

function AllProjects({ projects }) {
  const navigate = useNavigate();

  return (
    <motion.section
      className="projects-super-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: "2rem" }}
    >
      <div className="section-header" style={{ marginBottom: "3rem" }}>
        <button 
          className="hero-btn-secondary" 
          onClick={() => navigate(-1)}
          style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <FiArrowLeft /> Back to Home
        </button>
        <h2 className="section-title">All <span className="gradient-text">Projects</span></h2>
        <p className="section-subtitle">A comprehensive view of my development history.</p>
      </div>

      <div className="projects-grid-3d">
        {projects.map((project) => (
          <TiltProjectCard
            key={project.id}
            project={project}
            onClick={() => navigate(`/projects/${project.id}`)}
          />
        ))}
      </div>
    </motion.section>
  );
}

export default AllProjects;
