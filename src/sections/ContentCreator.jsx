// src/sections/ContentCreator.jsx
import "./ContentCreator.css";
import { motion } from "framer-motion";
import { FiYoutube, FiEdit3, FiMic } from "react-icons/fi";
import a1 from "../assets/App-development-insights.jpg";
import b1 from "../assets/do-ai-machine-learning.png";
import c1 from "../assets/live-project.jpg";

const contentItems = [
  {
    title: "Backend & System Design Breakdowns",
    icon: FiEdit3,
    image: { a1 }, // add your thumbnail here
    description:
      "Threads and deep‑dives explaining Spring Boot, Django, JWT‑based auth, and system design patterns in simple, visual ways.",
    tags: ["Spring Boot", "Django", "System Design"],
    link: "",
  },
  {
    title: "AI & Deep Learning Simplified",
    icon: FiYoutube,
    image: { b1 },
    description:
      "Short video explainers and walkthroughs of TensorFlow models, computer vision pipelines, and practical AI projects.",
    tags: ["TensorFlow", "OpenCV", "Face Recognition"],
    link: "",
  },
  {
    title: "Live Coding & Project Walkthroughs",
    icon: FiMic,
    image: { c1 },
    description:
      "Screen‑recorded sessions building REST APIs, dashboards, and complaint/retail systems from scratch.",
    tags: ["REST APIs", "Dashboards", "Full‑Stack"],
    link: "",
  },
];

function ContentCreator() {
  return (
    <motion.section
      id="content"
      className="content-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="content-header">
        <h2 className="content-title">Content creator side.</h2>
        <p className="content-subtitle">
          I turn complex backend and AI topics into high‑energy content—threads,
          breakdowns, and live coding sessions that help other developers learn
          faster.
        </p>
      </div>

      <div className="content-grid">
        {contentItems.map((item) => (
          <motion.article
            key={item.title}
            className="content-card"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            {/* Thumbnail */}
            {item.image && (
              <div className="content-thumb-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="content-thumb-img"
                />
                <div className="content-thumb-badge">
                  <item.icon size={18} />
                </div>
              </div>
            )}

            {/* Text area */}
            <div className="content-card-body">
              <div className="content-card-head">
                <div className="content-icon-circle">
                  <item.icon size={22} />
                </div>
                <h3 className="content-card-title">{item.title}</h3>
              </div>

              <p className="content-card-text">{item.description}</p>

              <div className="content-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="content-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="content-link"
                >
                  View content
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default ContentCreator;
