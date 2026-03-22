// src/sections/Certifications.jsx
import { motion } from "framer-motion";
import "./Certifications.css";

import college_logo from "../assets/Coimbatore_Institute_of_Technology_logo.png";
import ibm_logo from "../assets/02_8-bar-reverse.svg";
import edutantr_logo from "../assets/edutantr.jpg";

const CERTS = [
  {
    icon: "🏅",
    title: "Python for Data Science",
    issuer: "IBM — Coursera",
    year: "2024",
    skills: ["Python", "Pandas", "NumPy", "Data Science"],
    link: "https://drive.google.com/file/d/1ldz79wJZYHnwgpwjm55W_LdAPdpqO-I_/view",
    logo: ibm_logo,
    color: "#2563eb",
  },
  {
    icon: "💼",
    title: "MERN Stack Development",
    issuer: "EduTantr (EDT-2024-087)",
    year: "Aug 2024",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    link: "https://drive.google.com/file/d/1kqxLNzzcZqgs6XTzJrZiDWD-sBsK-pkV/view",
    logo: edutantr_logo,
    color: "#059669",
  },
  {
    icon: "🥈",
    title: "Code Relay — 2nd Prize",
    issuer: "CIT Coimbatore",
    year: "2024",
    skills: ["Competitive Programming", "Algorithms"],
    logo: college_logo,
    color: "#C8922A",
  },
  {
    icon: "⌛",
    title: "24-Hour Hackathon",
    issuer: "SREC — Participant",
    year: "2024",
    skills: ["Problem Solving", "Teamwork", "Full-Stack"],
    logo: college_logo,
    color: "#8B3A1E",
  },
  {
    icon: "🏛️",
    title: "FIT India Club Secretary",
    issuer: "CIT Coimbatore",
    year: "2023 – Now",
    skills: ["Leadership", "Event Management", "Community"],
    logo: college_logo,
    color: "#4A6741",
  },
];

function CertCard({ cert, index }) {
  return (
    <motion.div
      className="cert-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      style={{ "--cert-color": cert.color }}
    >
      {/* Wax seal */}
      <div className="cert-seal">
        <div className="cert-seal-inner" style={{ background: cert.color }}>
          {cert.icon}
        </div>
      </div>

      {/* Logo */}
      <div className="cert-logo-wrapper">
        <img src={cert.logo} alt={cert.issuer} className="cert-logo" />
      </div>

      <div className="cert-body">
        <h3 className="cert-title">{cert.title}</h3>
        <p className="cert-issuer">{cert.issuer}</p>
        <span className="cert-year">{cert.year}</span>

        <div className="cert-skills">
          {cert.skills.map((s, i) => (
            <span key={i} className="cert-skill-tag">{s}</span>
          ))}
        </div>

        {cert.link && (
          <a href={cert.link} target="_blank" rel="noreferrer" className="cert-view-btn">
            View Certificate →
          </a>
        )}
      </div>

      <div className="cert-parchment-edge top" />
      <div className="cert-parchment-edge bottom" />
    </motion.div>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="certs-section">
      <div className="section-eyebrow">Honours & Achievements</div>
      <h2 className="section-title">Hall of Parchments</h2>
      <div className="section-ornament" />
      <div className="certs-grid">
        {CERTS.map((cert, i) => (
          <CertCard key={i} cert={cert} index={i} />
        ))}
      </div>
    </section>
  );
}

export default Certifications;
