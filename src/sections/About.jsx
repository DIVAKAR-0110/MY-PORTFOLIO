// src/sections/About.jsx
import { motion } from "framer-motion";
import "./About.css";

function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-eyebrow">The Scribe's Tale</div>
      <h2 className="section-title">An Ancient Soul in a Modern Era</h2>
      <div className="section-ornament" />

      <div className="about-grid">
        {/* Left: Bio */}
        <motion.div
          className="about-parchment-card"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="parchment-inner">
            <h3 className="parchment-title">The Scholar's Journey</h3>
            <p className="parchment-text">
              I am <span className="parchment-highlight">Divakar R</span>, a scholar of 
              <span className="parchment-highlight"> M.Sc. Software Systems</span> at the 
              illustrious <span className="parchment-highlight">CIT Coimbatore</span>. 
              My path is one of discovery, weaving complex backend architectures and 
              AI‑driven legends.
            </p>
            <p className="parchment-text">
              From building secure retail platforms to crafting AI complaint portals, 
              I master the arts of <span className="parchment-highlight">Deep Learning</span> 
              and <span className="parchment-highlight">System Design</span>.
            </p>
            <p className="parchment-text">
              Beyond the code, I lead as the <span className="parchment-highlight">FIT India Club Secretary</span>, 
              guiding others through the digital and physical wilderness.
            </p>
          </div>
          <div className="parchment-seal">⚜</div>
        </motion.div>

        {/* Right: Stats & Highlights */}
        <div className="about-highlights-col">
          <motion.div
            className="highlight-stone"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="stone-title">Achievements</h4>
            <ul className="stone-list">
              <li><span>🏆</span> Code Relay — 2nd Prize</li>
              <li><span>⌛</span> 24h Hackathon Participant</li>
              <li><span>🏅</span> IBM Python Certified</li>
              <li><span>🏛️</span> FIT India Secretary</li>
            </ul>
          </motion.div>

          <motion.div
            className="highlight-stone"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h4 className="stone-title">Areas of Mastery</h4>
            <div className="stone-tags">
              {["LLMs", "Backend", "Deep Learning", "Testing", "Big Data", "DBMS"].map((tag) => (
                <span key={tag} className="stone-tag">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
