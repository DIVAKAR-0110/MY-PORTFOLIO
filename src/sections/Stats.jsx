// src/sections/Stats.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./Stats.css";

const STATS = [
  { value: 16, suffix: "+", label: "Projects Completed", icon: "🏰", desc: "From SOA to AI portals" },
  { value: 14, suffix: "+", label: "Technologies Mastered", icon: "⚔️", desc: "Backend, AI, Frontend" },
  { value: 7.92, suffix: "", label: "CGPA", icon: "📖", dec: 2, desc: "M.Sc. Software Systems" },
  { value: 2,  suffix: "+", label: "Years of Coding", icon: "⚓", desc: "Building since 2023" },
];

function useCounter(target, dec = 0, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const steps = 60;
    const step  = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(parseFloat(cur.toFixed(dec)));
      if (cur >= target) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [start, target, dec]);
  return val;
}

function StatCard({ stat, index, started }) {
  const count = useCounter(stat.value, stat.dec || 0, started);
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <div className="stat-card-icon">{stat.icon}</div>
      <div className="stat-card-value">
        {count}{stat.suffix}
      </div>
      <div className="stat-card-label">{stat.label}</div>
      <div className="stat-card-desc">{stat.desc}</div>
      <div className="stat-card-glow" />
    </motion.div>
  );
}

function Stats() {
  const [started, setStarted] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" className="stats-section" ref={ref}>
      <div className="section-eyebrow">Carved in Stone</div>
      <h2 className="section-title">Chronicles of Achievement</h2>
      <div className="section-ornament" />
      <div className="stats-grid">
        {STATS.map((s, i) => (
          <StatCard key={i} stat={s} index={i} started={started} />
        ))}
      </div>
    </section>
  );
}

export default Stats;
