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
    institution: "Coimbatore Institute of Technology",
    achievements: "CGPA: 7.92/10 (5th Sem)",
    description:
      "Deep Learning, Backend Architecture, Distributed Systems, Production Projects",
    icon: "🎓",
    color: "#14b8a6",
    skills: ["Deep Learning", "Django", "Spring Boot", "System Design"],
  },
  {
    year: "Aug 2024",
    logo: edutantr_logo,
    title: "MERN Stack Developer Internship",
    institution: "EduTantr (Certificate #EDT-2024-087)",
    achievements: "Full-Stack Development",
    description:
      "Production React + Node.js applications with MongoDB integration",
    icon: "💼",
    color: "#10b981",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    certLink:
      "https://drive.google.com/file/d/1kqxLNzzcZqgs6XTzJrZiDWD-sBsK-pkV/view",
  },
  {
    year: "2024",
    logo: ibm_logo,
    title: "Python for Data Science",
    institution: "IBM (Coursera)",
    achievements: "Professional Certificate",
    description:
      "Data manipulation, visualization, machine learning with Python",
    icon: "📜",
    color: "#2563eb",
    skills: ["Python", "Pandas", "NumPy", "Data Science"],
    certLink:
      "https://drive.google.com/file/d/1ldz79wJZYHnwgpwjm55W_LdAPdpqO-I_/view",
  },
  {
    year: "2022 - 2023",
    logo: national_model_logo,
    title: "Class XII (12th)",
    institution: "National Model Sr. Sec. School",
    achievements: "85% Aggregate",
    description:
      "Physics, Chemistry, Computer Science - Foundation for technical career",
    icon: "📘",
    color: "#f59e0b",
    skills: ["Mathematics", "Physics", "Computer Science"],
  },
  {
    year: "2020 - 2021",
    logo: national_model_logo,
    title: "Class X (10th)",
    institution: "National Model Sr. Sec. School",
    achievements: "100% - Perfect Score",
    description:
      "Built discipline, consistency, and problem-solving foundation",
    icon: "⭐",
    color: "#3b82f6",
    skills: ["Mathematics", "Science"],
  },
];

function Timeline() {
  return (
    <section id="timeline" className="timeline-section">
      {/* Header */}
      <div className="timeline-header">
        <h2 className="timeline-title">Timeline Journey</h2>
        <p className="timeline-subtitle">
          From perfect scores → IBM certified → internship → M.Sc.
          specialization
        </p>
        <div className="header-stats">
          <span>5 Milestones</span>
          <span>7.92 CGPA</span>
          <span>2 Certifications</span>
          <span>1 Internship</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-container">
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            className="timeline-entry"
            style={{ "--timeline-color": item.color }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* Logo */}
            <div className="entry-logo">
              <img src={item.logo} alt={item.institution} />
            </div>

            {/* Card */}
            <div className="timeline-card">
              <div className="card-header">
                <span className="year-badge">{item.year}</span>
                <span className="entry-icon">{item.icon}</span>
              </div>

              <h3 className="entry-title">{item.title}</h3>

              <p className="entry-institution">
                {item.institution}
                {item.certLink && (
                  <a
                    href={item.certLink}
                    target="_blank"
                    rel="noreferrer"
                    className="cert-link"
                  >
                    {" "}
                    📄
                  </a>
                )}
              </p>

              <div className="achievement-main">{item.achievements}</div>

              <p className="entry-description">{item.description}</p>

              {item.skills && (
                <div className="skills-tags">
                  {item.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Timeline;
