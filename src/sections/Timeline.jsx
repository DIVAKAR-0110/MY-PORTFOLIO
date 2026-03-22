// src/sections/Timeline.jsx
import { motion } from "framer-motion";
import "./Timeline.css";

import college_logo from "../assets/Coimbatore_Institute_of_Technology_logo.png";
import national_model_logo from "../assets/National_Model_Matric.jpg";
import edutantr_logo from "../assets/edutantr.jpg";
import ibm_logo from "../assets/02_8-bar-reverse.svg";

const timeline = [
  {
    year: "2023 - Present",
    logo: college_logo,
    title: "M.Sc. Software Systems",
    institution: "CIT Coimbatore",
    achievements: "CGPA: 7.92/10",
    description: "Deep Learning, Backend Architecture, Distributed Systems",
    icon: "🎓",
    color: "#8B3A1E",
  },
  {
    year: "Aug 2024",
    logo: edutantr_logo,
    title: "MERN Internship",
    institution: "EduTantr",
    achievements: "Full-Stack Prod-Ready Dev",
    description: "React + Node.js with MongoDB integration",
    icon: "💼",
    color: "#059669",
    certLink: "https://drive.google.com/file/d/1kqxLNzzcZqgs6XTzJrZiDWD-sBsK-pkV/view",
  },
  {
    year: "2024",
    logo: ibm_logo,
    title: "Python for Data Science",
    institution: "IBM Certified",
    achievements: "Professional Certificate",
    description: "Data manipulation & ML with Python",
    icon: "🏅",
    color: "#2563eb",
    certLink: "https://drive.google.com/file/d/1ldz79wJZYHnwgpwjm55W_LdAPdpqO-I_/view",
  },
  {
    year: "2022 - 2023",
    logo: national_model_logo,
    title: "Class XII (12th)",
    institution: "National Model School",
    achievements: "85% Aggregate",
    description: "Physics, Chem, CS Foundation",
    icon: "📘",
    color: "#C8922A",
  },
];

function Timeline() {
  return (
    <section id="timeline" className="timeline-section">
      <div className="section-eyebrow">The Chronicle</div>
      <h2 className="section-title">Timeline of Legacies</h2>
      <div className="section-ornament" />

      <div className="timeline-journey">
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            className="timeline-manuscript"
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="manuscript-indicator" style={{ background: item.color }}>
              {item.icon}
            </div>
            
            <div className="manuscript-card">
              <div className="manuscript-header">
                <span className="manuscript-year">{item.year}</span>
                <img src={item.logo} alt={item.institution} className="manuscript-logo" />
              </div>
              
              <h3 className="manuscript-title">{item.title}</h3>
              <p className="manuscript-institution">
                {item.institution}
                {item.certLink && (
                  <a href={item.certLink} target="_blank" rel="noreferrer" className="manuscript-cert">📜</a>
                )}
              </p>
              
              <div className="manuscript-achieve">{item.achievements}</div>
              <p className="manuscript-desc">{item.description}</p>
            </div>
            
            {/* Connecting line for cinematic feel */}
            <div className="manuscript-line" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Timeline;
