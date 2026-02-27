import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AllProjects({ projects }) {
  const navigate = useNavigate();

  return (
    <motion.section
      className="all-projects-section"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="section-title">All Projects</h2>

      <div className="projects-grid">
        {projects.map((project) => (
          <motion.article
            key={project.id}
            className={`project-card ${project.gradient}`}
            onClick={() => navigate(`/projects/${project.id}`)}
            whileHover={{ y: -10, scale: 1.05 }}
          >
            <div
              className="card-visual"
              style={{ backgroundImage: `url(${project.image})` }}
            >
              <div className="visual-overlay" />
              <h3 className="project-name">{project.title}</h3>
              <p className="project-type">{project.subtitle}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default AllProjects;
