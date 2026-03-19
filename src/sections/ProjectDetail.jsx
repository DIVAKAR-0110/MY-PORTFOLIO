import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiGithub, FiExternalLink } from "react-icons/fi";
import "./Projects.css";

function ProjectDetail({ projects }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (!project) return (
    <div className="flex items-center justify-center min-vh-100 bg-slate-950 text-white">
      <div className="text-center p-12">
        <h1 className="text-4xl font-black mb-6">Project Archive Not Found</h1>
        <button className="hero-btn-secondary" onClick={() => navigate(-1)}>Return to Base</button>
      </div>
    </div>
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="project-detail-page"
    >
      {/* HEADER NAV */}
      <header className="detail-nav container">
        <motion.button 
          onClick={() => navigate(-1)} 
          className="back-btn"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft size={20} /> <span>Return to Projects</span>
        </motion.button>
      </header>

        {/* HERO SECTION */}
        <section className="detail-hero">
          <div className="detail-hero-bg">
            <img src={project.image} alt={project.title} className="hero-img" />
            <div className="hero-overlay" />
          </div>

          <div className="container hero-content-wrapper">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-text-content"
            >
              <span className="category-badge" style={{ background: `${project.themeColor}22`, color: project.themeColor, borderColor: `${project.themeColor}44` }}>
                {project.subtitle}
              </span>
              <h1 className="detail-title">{project.title}</h1>
              <p className="detail-tagline">{project.description}</p>

              <div className="hero-actions">
                <a href={project.github || "#"} target="_blank" rel="noreferrer" className="action-btn github">
                  <FiGithub /> View Source
                </a>
                <a href={project.live || "#"} target="_blank" rel="noreferrer" className="action-btn live" style={{ background: project.themeColor }}>
                  <FiExternalLink /> Live Demo
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CONTENT GRID */}
        <section className="detail-content container">
          <div className="content-grid">
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div className="main-content">
              <div className="content-block">
                <h3>Project Overview</h3>
                <p>{project.fullDescription}</p>
              </div>

              <div className="content-block features">
                <h3>Core Features</h3>
                <div className="features-grid">
                  {project.features?.map((feature, i) => (
                    <div key={i} className="feature-item">
                      <div className="feature-dot" style={{ background: project.themeColor }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="challenges-solution">
                <div className="content-block challenge">
                  <h3>Technical Challenges</h3>
                  <ul>
                    {project.challenges?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div className="content-block solution">
                  <h3>The Solution</h3>
                  <p>{project.solution}</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <aside className="sidebar">
              <div className="sidebar-block stats-card">
                <h4>Project Stats</h4>
                <div className="stats-list">
                  {project.stats && Object.entries(project.stats).map(([label, value]) => (
                    <div key={label} className="stat-row">
                      <span className="label">{label}</span>
                      <span className="value" style={{ color: project.themeColor }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-block stack-card">
                <h4>Technology Stack</h4>
                <div className="tech-pills">
                  {project.stack.map(tech => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* CTA FOOTER */}
        <footer className="detail-footer container">
          <div className="footer-card">
            <h3>Interested in this project?</h3>
            <p>Let's discuss how I can bring similar expertise to your team.</p>
            <button onClick={() => navigate('/#contact')} className="footer-contact-btn">Get In Touch</button>
          </div>
        </footer>
    </motion.main>
  );
}

export default ProjectDetail;
