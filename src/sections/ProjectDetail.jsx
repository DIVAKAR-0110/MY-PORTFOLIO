import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ProjectDetail({ projects }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (!project) return <p>Project not found</p>;

  return (
    <motion.section
      className="project-detail-section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Projects
      </button>

      <h1>{project.title}</h1>
      <p>{project.subtitle}</p>
      <div className="project-images">
        {/* You can map multiple images here if available */}
        <img src={project.image} alt={project.title} />
      </div>

      <p>{project.description}</p>

      <h3>Highlights</h3>
      <ul>
        {project.highlights?.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      <h3>Tech Stack</h3>
      <div>
        {project.stack.map((tech) => (
          <span key={tech} className="tech-chip">
            {tech}
          </span>
        ))}
      </div>

      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer">
          View Code on GitHub
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer">
          Live Demo
        </a>
      )}
    </motion.section>
  );
}

export default ProjectDetail;
