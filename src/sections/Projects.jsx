// src/sections/Projects.jsx
import "./Projects.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { FiGithub, FiExternalLink, FiArrowRight, FiX, FiLayers, FiZap } from "react-icons/fi";
import g1 from "../assets/SSRETAILS.png";
import g2 from "../assets/image2.png";
import g3 from "../assets/image3.png";
import g4 from "../assets/imga.png";

export const projects = [
  {
    id: "face-analytics",
    num: "I",
    title: "AI Face Recognition Realm",
    subtitle: "Deep Learning · Computer Vision",
    description: "Real-time identification with TensorFlow CNN models, OpenCV streams, and Django analytics.",
    fullDescription: "A sophisticated platform for real-time face identification. Integrates deep learning models with a robust backend for instant verification and historical tracking.",
    features: ["Real-time verification", "Demographic analytics", "Attendance logging"],
    stack: ["Python", "TensorFlow", "OpenCV", "Django"],
    image: g3,
    color: "#8B3A1E",
    stats: { Accuracy: "95%", Latency: "<1s" },
  },
  {
    id: "ssretails",
    num: "II",
    title: "SSRetails — Textile ERP",
    subtitle: "Enterprise · Retail Operations",
    description: "Complete inventory, billing, and supplier management with RBAC for textile commerce.",
    fullDescription: "An ERP system tailored for textile retail. Automates inventory, billing with barcodes, and provides detailed financial chronicles.",
    features: ["Barcode billing", "Supplier portal", "Multi-user auditing"],
    stack: ["Django", "PostgreSQL", "Tailwind"],
    image: g1,
    color: "#2E5820",
    stats: { Efficiency: "70%", Scales: "3" },
  },
  {
    id: "complaints",
    num: "III",
    title: "GovTech Complaint Scroll",
    subtitle: "SaaS · Civic Technology",
    description: "Citizen grievance lifecycle with admin dashboards and automated resolution workflows.",
    fullDescription: "A transparent platform for citizens to report grievances. Bridges the gap between public administration and the people.",
    features: ["Citizen dashboard", "Admin workflow", "Automated updates"],
    stack: ["Django", "MySQL", "REST APIs"],
    image: g2,
    color: "#4A2010",
    stats: { Reports: "50+", Status: "Live" },
  },
  {
    id: "rbac",
    num: "IV",
    title: "Enterprise RBAC Bastion",
    subtitle: "Security · Zero-Trust",
    description: "Production JWT auth system with Spring Security, policy engine, and role permissions.",
    fullDescription: "A secure authentication service for enterprise microservices. Implements Zero-Trust principles for centralized identity management.",
    features: ["Stateless JWT", "Granular policies", "Audit logging"],
    stack: ["Spring Boot", "JWT", "MySQL"],
    image: g4,
    color: "#7A3020",
    stats: { Uptime: "99.9%", Safety: "High" },
  },
];

const ManuscriptCard = ({ project, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      layoutId={`proj-${project.id}`}
      className="manuscript-proj-card"
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="manuscript-proj-header">
        <span className="manuscript-proj-num">{project.num}</span>
        <div className="manuscript-proj-badge" style={{ backgroundColor: project.color }}>
          <FiLayers size={14} />
        </div>
      </div>
      
      <div className="manuscript-proj-image">
        <img src={project.image} alt={project.title} />
        <div className="manuscript-proj-overlay" />
      </div>

      <div className="manuscript-proj-body">
        <h3 className="manuscript-proj-title">{project.title}</h3>
        <p className="manuscript-proj-sub">{project.subtitle}</p>
        <p className="manuscript-proj-desc">{project.description}</p>
        <div className="manuscript-proj-footer">
          <span>Read Chronicles</span>
          <FiArrowRight />
        </div>
      </div>
    </motion.div>
  );
};

function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const project = projects.find(p => p.id === selectedId);

  useEffect(() => {
    document.body.style.overflow = selectedId ? "hidden" : "auto";
  }, [selectedId]);

  return (
    <section id="projects" className="projects-section">
      <div className="section-eyebrow">Great Conquests</div>
      <h2 className="section-title">The Master's Chronicles</h2>
      <div className="section-ornament" />

      <div className="projects-manuscript-grid">
        {projects.map((p) => (
          <ManuscriptCard key={p.id} project={p} onClick={() => setSelectedId(p.id)} />
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="proj-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`proj-${selectedId}`}
              className="proj-modal-content"
              onClick={e => e.stopPropagation()}
            >
              <button className="proj-modal-close" onClick={() => setSelectedId(null)}>
                <FiX size={20} />
              </button>

              <div className="proj-modal-hero">
                <img src={project.image} alt={project.title} />
                <div className="proj-modal-hero-overlay" />
                <div className="proj-modal-header-text">
                  <span className="proj-modal-num">{project.num}</span>
                  <h2>{project.title}</h2>
                  <p>{project.subtitle}</p>
                </div>
              </div>

              <div className="proj-modal-body">
                <div className="proj-modal-main">
                  <h3 className="modal-section-h">Chronicle Narrative</h3>
                  <p className="modal-p">{project.fullDescription}</p>
                  
                  <h3 className="modal-section-h">Featured Artifacts</h3>
                  <ul className="modal-u">
                    {project.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <div className="modal-stats">
                    {Object.entries(project.stats).map(([k, v]) => (
                      <div key={k} className="modal-stat-box">
                        <span className="modal-stat-v">{v}</span>
                        <span className="modal-stat-k">{k}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="proj-modal-sidebar">
                  <div className="sidebar-scroll-box">
                    <h4 className="sidebar-h">Alchemical Stack</h4>
                    <div className="sidebar-tags">
                      {project.stack.map(s => <span key={s}>{s}</span>)}
                    </div>
                  </div>

                  <div className="sidebar-actions">
                    <a href="https://github.com/DIVAKAR-0110" target="_blank" rel="noreferrer" className="modal-action-btn">
                      <FiGithub /> Source Scroll
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;
