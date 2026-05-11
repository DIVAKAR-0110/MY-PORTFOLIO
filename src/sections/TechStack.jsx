// src/sections/TechStack.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./TechStack.css";

// — 3D asset images as decoration statues —
import shipImg from "../assets/glb/11199303.jpg";       // ship / boat scene
import sentinelImg from "../assets/glb/11199324.jpg";      // stone warrior scene
import dolphinImg from "../assets/glb/3d-dolphin-with-vibrant-coloring.jpg"; // ocean finale

// — Tech logos (local — avoids CDN tracking prevention) —
import logoC from "../assets/images/tech-c.svg";
import logoCpp from "../assets/images/tech-cpp.svg";
import logoPython from "../assets/images/tech-python.svg";
import logoHtml from "../assets/images/tech-html5.svg";
import logoJava from "../assets/images/tech-java.svg";
import logoDjango from "../assets/images/tech-django.svg";
import logoPostgres from "../assets/images/tech-postgres.svg";
import logoMysql from "../assets/images/tech-mysql.svg";
import logoTf from "../assets/images/tech-tensorflow.svg";
import logoReact from "../assets/images/tech-react.svg";
import logoAngular from "../assets/images/tech-angular.svg";
import logoAws from "../assets/images/tech-aws.svg";
import logoMongo from "../assets/images/tech-mongodb.svg";
import logoSpring from "../assets/images/tech-spring.svg";

/* ════════════════════════════════════════════════════════
   TECH GROUPS  –  each gets a decoration statue next to it
   ════════════════════════════════════════════════════════ */
const TECH_GROUPS = [
  {
    id: "foundations",
    title: "Foundations",
    direction: "ltr",           // snake: left → right
    deco: { img: shipImg, label: "The Pioneer Vessel", side: "right", alt: "Ship" },
    techs: [
      { name: "C", color: "#A8B9CC", logo: logoC },
      { name: "C++", color: "#00599C", logo: logoCpp },
      { name: "Python", color: "#3776AB", logo: logoPython },
      { name: "HTML/CSS", color: "#E34F26", logo: logoHtml },
    ],
  },
  {
    id: "backend",
    title: "Backend Realm",
    direction: "rtl",           // snake: right → left
    deco: { img: sentinelImg, label: "The Stone Sentinel", side: "left", alt: "Sentinel" },
    techs: [
      { name: "Java", color: "#007396", logo: logoJava },
      { name: "Django", color: "#44B78B", logo: logoDjango },
      { name: "PostgreSQL", color: "#336791", logo: logoPostgres },
      { name: "MySQL", color: "#4479A1", logo: logoMysql },
    ],
  },
  {
    id: "intelligence",
    title: "Intelligence & Cloud",
    direction: "ltr",           // snake: left → right
    deco: { img: dolphinImg, label: "The Ocean Voyager", side: "right", alt: "Dolphin" },
    techs: [
      { name: "ML / AI", color: "#FF6F00", logo: logoTf },
      { name: "React", color: "#61DAFB", logo: logoReact },
      { name: "Angular", color: "#DD0031", logo: logoAngular },
      { name: "AWS", color: "#FF9900", logo: logoAws },
      { name: "MongoDB", color: "#47A248", logo: logoMongo },
      { name: "SpringBoot", color: "#6DB33F", logo: logoSpring },
    ],
  },
];

/* ════════════════════════════════════════════════════════
   SNAKE CONNECTOR SVG
   Draws a wavy snake path between cards within a row.
   dir = "ltr" | "rtl"
   ════════════════════════════════════════════════════════ */
function SnakeLine({ count, dir }) {
  // One curve per gap between cards: (count - 1) humps
  const gaps = count - 1;
  if (gaps <= 0) return null;

  // Build horizontal path across the row
  // Total width = 100%, height wave ±18px around centre (50)
  const segW = 100 / count; // % width per card
  const mid = 50;           // centre y in viewBox 0–100
  const amp = 22;           // wave amplitude

  let d = `M ${segW * 0.5} ${mid}`;
  for (let i = 0; i < gaps; i++) {
    const x1 = segW * (i + 0.5);
    const x2 = segW * (i + 1.5);
    const cx = (x1 + x2) / 2;
    const cy = i % 2 === 0 ? mid - amp : mid + amp;
    d += ` Q ${cx} ${cy}, ${x2} ${mid}`;
  }

  return (
    <svg
      className="ts-snake-line"
      viewBox={`0 0 100 100`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* shadow/glow road */}
      <path d={d} fill="none" stroke="rgba(107,66,38,0.18)" strokeWidth="8" />
      {/* animated gold dashes */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="6 5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 4px var(--accent-glow))" }}
      />
    </svg>
  );
}

/* vertical connector between snake rows */
function VerticalJoin({ dir }) {
  // Arrow points down from end of prev row to start of next
  // SVG path d only accepts unitless numbers — no % allowed
  const x = dir === "ltr" ? 94 : 6;
  return (
    <div className="ts-vjoin-wrap">
      <svg className="ts-vjoin-svg" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path d={`M ${x} 0 L ${x} 60`} fill="none" stroke="rgba(107,66,38,0.2)" strokeWidth="8" />
        <motion.path
          d={`M ${x} 0 L ${x} 60`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 3px var(--accent-glow))" }}
        />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SINGLE TECH CARD
   ════════════════════════════════════════════════════════ */
function TechCard({ tech, globalIndex }) {
  return (
    <motion.div
      className="ts-card"
      style={{ "--c": tech.color }}
      initial={{ opacity: 0, y: 24, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.42, delay: globalIndex * 0.06, ease: "easeOut" }}
      whileHover={{ y: -9, scale: 1.08, transition: { duration: 0.18 } }}
    >
      <div className="ts-card-glow" />
      <div className="ts-card-inner">
        <div className="ts-logo-wrap">
          <img
            src={tech.logo}
            alt={tech.name}
            className="ts-logo"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              const fb = e.target.nextElementSibling;
              if (fb) fb.style.display = "flex";
            }}
          />
          <div className="ts-logo-fallback" style={{ color: tech.color }}>
            {tech.name.charAt(0)}
          </div>
          <div className="ts-logo-ring" />
        </div>
        <span className="ts-name">{tech.name}</span>
      </div>
      <div className="ts-card-bar" />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   DECORATION IMAGE (statue / ship / dolphin)
   ════════════════════════════════════════════════════════ */
function DecoImage({ img, label, side, delay = 0, size = 140 }) {
  return (
    <motion.div
      className={`ts-deco ts-deco--${side}`}
      initial={{ opacity: 0, x: side === "left" ? -50 : 50, scale: 0.85 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      <motion.div
        className="ts-deco-frame"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={img}
          alt={label}
          className="ts-deco-img"
          style={{ width: size, height: size }}
          draggable={false}
        />
        <div className="ts-deco-halo" />
        <span className="ts-deco-label">{label}</span>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   TECH GROUP ROW  (snake row + deco)
   ════════════════════════════════════════════════════════ */
function TechGroupRow({ group, globalOffset }) {
  return (
    <div className={`ts-group ts-group--${group.direction}`}>
      {/* Group label */}
      <motion.div
        className="ts-group-label"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        {group.title}
      </motion.div>

      {/* Cards + snake line overlay */}
      <div className="ts-group-track">
        <SnakeLine count={group.techs.length} dir={group.direction} />
        <div className={`ts-group-cards ts-group-cards--${group.direction}`}>
          {group.techs.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} globalIndex={globalOffset + i} />
          ))}
        </div>
      </div>

      {/* Floating deco image */}
      <DecoImage
        img={group.deco.img}
        label={group.deco.label}
        side={group.deco.side}
        delay={0.2}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OCEAN FINALE CARD (end of the road)
   ════════════════════════════════════════════════════════ */
function OceanFinale() {
  return (
    <motion.div
      className="ts-ocean-finale"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Ocean image backdrop */}
      <div className="ts-ocean-img-wrap">
        <img src={dolphinImg} alt="The Ocean Ahead" className="ts-ocean-img" />
        <div className="ts-ocean-overlay" />
      </div>

      {/* Text */}
      <div className="ts-ocean-content">
        <motion.span
          className="ts-finale-text"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          ⚓ Exploring Next…
        </motion.span>
        <motion.span
          className="ts-finale-arrow"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */
export default function TechStack() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  /* cumulative card index for staggered animation */
  let offset = 0;

  return (
    <section id="stack" ref={sectionRef} className="ts-section">

      {/* Parchment parallax */}
      <motion.div className="ts-parchment-layer" style={{ y: bgY }} aria-hidden="true" />

      {/* Header */}
      <header className="ts-header">
        <motion.div
          className="section-eyebrow"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          My Armory of Codes
        </motion.div>
        <motion.h2
          className="section-title ts-title"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          Technical <span className="gradient-text">Arsenal</span>
        </motion.h2>
        <motion.div
          className="section-ornament"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
        />
        <motion.p
          className="ts-subtitle"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
        >
          Myself as a traveler equipped with my interest and with responsibility.
          These are the weapons forged through years for my goals.
        </motion.p>
      </header>

      {/* Snake road of tech groups */}
      <div className="ts-snake-road">
        {TECH_GROUPS.map((group, gi) => {
          const node = (
            <React.Fragment key={group.id}>
              <TechGroupRow group={group} globalOffset={offset} />
              {/* vertical join between rows (not after last) */}
              {gi < TECH_GROUPS.length - 1 && (
                <VerticalJoin dir={group.direction} />
              )}
            </React.Fragment>
          );
          offset += group.techs.length;
          return node;
        })}

        {/* Ocean finale */}
        <OceanFinale />
      </div>

      {/* Scroll progress bar */}
      <motion.div className="ts-progress-bar" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </section>
  );
}
