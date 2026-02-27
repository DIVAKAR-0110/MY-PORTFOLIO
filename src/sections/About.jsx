// src/sections/About.jsx
import { motion } from "framer-motion";
import "./About.css";

function About() {
  return (
    <motion.section
      id="about"
      className="about-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left: Bio + Stats */}
      <div className="about-left">
        <div className="about-header">
          <h2 className="about-title">About me.</h2>
          <div className="about-title-glow" />
        </div>

        <div className="about-bio">
          <p className="about-text">
            I'm a{" "}
            <span className="about-highlight">M.Sc. Software Systems</span>{" "}
            student at
            <span className="about-highlight">
              {" "}
              Coimbatore Institute of Technology
            </span>
            , building strong foundations in deep learning, system design, and
            full‑stack development.
          </p>
          <p className="about-text">
            I craft{" "}
            <span className="about-highlight">backend architectures</span>,
            AI‑driven features, and production systems like retail platforms,
            complaint portals, and RBAC services.
          </p>
          <p className="about-text">
            Outside code, I compete in hackathons, lead the{" "}
            <span className="about-highlight">FIT India Club</span>, and create
            technical content for fellow developers.
          </p>
        </div>

        {/* Colorful Stats Cards */}
        <div className="about-stats-grid">
          <motion.div
            className="about-stat-card gradient-blue"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">🎓</div>
            <p className="stat-label">Degree</p>
            <p className="stat-value">M.Sc. Software Systems</p>
            <p className="stat-sub">Coimbatore Institute of Technology</p>
          </motion.div>

          <motion.div
            className="about-stat-card gradient-teal"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">📊</div>
            <p className="stat-label">CGPA</p>
            <p className="stat-value">7.92</p>
            <p className="stat-sub">Till 5th Semester</p>
          </motion.div>

          <motion.div
            className="about-stat-card gradient-purple"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">📍</div>
            <p className="stat-label">Location</p>
            <p className="stat-value">Coimbatore, India</p>
            <p className="stat-sub">Tamil Nadu</p>
          </motion.div>
        </div>
      </div>

      {/* Right: Highlights + Interests */}
      <div className="about-right">
        {/* Highlights */}
        <motion.div
          className="about-card gradient-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card-header">
            <h3 className="card-title">🏆 Highlights</h3>
          </div>
          <ul className="about-highlights">
            <li>
              Code Relay –{" "}
              <span className="highlight-accent">Second Prize (CIT)</span>
            </li>
            <li>
              24‑Hour Hackathon –{" "}
              <span className="highlight-accent">SREC Participant</span>
            </li>
            <li>
              FIT India Club –{" "}
              <span className="highlight-accent">Secretary</span>
            </li>
            <li>
              Python Data Science –{" "}
              <span className="highlight-accent">IBM Certified</span>
            </li>
            <li>
              MERN Stack –{" "}
              <span className="highlight-accent">EduTantr Internship</span>
            </li>
          </ul>
        </motion.div>

        {/* Interests */}
        <motion.div
          className="about-card gradient-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card-header">
            <h3 className="card-title">🎯 Areas of Interest</h3>
          </div>
          <div className="about-interests">
            {[
              "Deep Learning",
              "LLMs",
              "Backend Systems",
              "Data Engineering",
              "Big Data",
              "DBMS",
              "Web Services",
              "Full‑Stack",
              "Software Testing",
            ].map((item, index) => (
              <motion.span
                key={item}
                className="interest-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default About;
