// src/components/MyWorld.jsx
import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiMap, FiBriefcase, FiImage, FiBook, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import profilePic from "../assets/PROFILE_PIC.png";
import post1 from "../assets/App-development-insights.jpg";
import post2 from "../assets/do-ai-machine-learning.png";
import post3 from "../assets/live-project.jpg";
import post4 from "../assets/SSRETAILS.png";
import post5 from "../assets/image2.png";
import post6 from "../assets/image3.png";
import "./MyWorld.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DAILY_LOG = [
  {
    date: "Apr 29, 2026",
    title: "Mastered JWT Refresh Token Rotation in Spring Boot",
    description: "Implemented a stateless refresh token strategy with Redis blacklist. Solved the concurrent-request invalidation bug that plagued the ERP project.",
    tags: ["Spring Boot", "Security", "Redis"],
    image: null,
  },
  {
    date: "Apr 26, 2026",
    title: "Explored RAG Pipelines with LangChain + Chroma",
    description: "Built a prototype document Q&A system. Learned about embedding chunking strategies and vector similarity trade-offs.",
    tags: ["LangChain", "AI", "Python"],
    image: null,
  },
  {
    date: "Apr 22, 2026",
    title: "Deep-dive into React Suspense & Concurrent Mode",
    description: "Rewrote lazy-loading boundaries across the portfolio. Performance improved significantly on low-end devices.",
    tags: ["React", "Performance"],
    image: null,
  },
  {
    date: "Apr 18, 2026",
    title: "AWS EC2 + NGINX Deployment — First Time",
    description: "Manually provisioned an EC2 instance, configured NGINX as a reverse proxy, and got a Spring Boot app running on HTTPS. Pain. Worth it.",
    tags: ["AWS", "DevOps", "NGINX"],
    image: null,
  },
  {
    date: "Apr 12, 2026",
    title: "Completed PostgreSQL Indexing & Query Planning Study",
    description: "EXPLAIN ANALYZE became my best friend. Rewrote 3 slow queries, reducing fetch time from 1.2s to ~80ms.",
    tags: ["PostgreSQL", "Database"],
    image: null,
  },
];



const ROADMAP = [
  { icon: "🎓", title: "M.Sc. Software Systems", desc: "CIT Coimbatore — CGPA 7.92", status: "done", year: "2023" },
  { icon: "🏅", title: "IBM Python Certification", desc: "Data Science & ML with Python", status: "done", year: "2024" },
  { icon: "💼", title: "MERN Stack Internship", desc: "EduTantr — Production-Ready Dev", status: "done", year: "2024" },
  { icon: "🌐", title: "Portfolio V2 — Ancient Series", desc: "3D Globe, Animations, Live Contact", status: "done", year: "2026" },
  { icon: "🔄", title: "Open Source Contributions", desc: "Contributing to Django & Spring ecosystems", status: "progress", year: "2026" },
  { icon: "🎯", title: "SaaS Product Launch", desc: "Full-Stack product solving a real problem", status: "planned", year: "2026–27" },
  { icon: "📄", title: "AI Research Publication", desc: "Computer Vision or NLP domain paper", status: "planned", year: "2027" },
  { icon: "☁️", title: "AWS Solutions Architect", desc: "Professional certification", status: "planned", year: "2027" },
];

const HIRE_DNA = {
  pitch: "I build systems that work — fast, clean, and maintainable. Whether it's a Django REST backend, a Spring Boot microservice, or a React interface with 60fps animations, I care about every layer.",
  pillars: [
    { icon: "⚡", title: "Ships Fast", desc: "From idea to working prototype in days, not weeks. I prioritize delivery without cutting corners on quality." },
    { icon: "🧩", title: "Systems Thinker", desc: "I design with the full stack in mind — DB schema, API contracts, UI state, and deployment — before writing a single line." },
    { icon: "📖", title: "Continuous Learner", desc: "Studying DDIA, LangChain, and AWS Architecture. I believe the best engineers are the ones who never stop being students." },
    { icon: "🤝", title: "Team-First", desc: "Clear communicator, thorough code reviewer, and someone who makes PRs easy to merge. I document what I build." },
  ],
  workStyle: [
    { label: "Problem Solving", style: "Start with the data model, then the API, then the UI." },
    { label: "Communication", style: "Async-first. I write detailed updates and clear commit messages." },
    { label: "Code Reviews", style: "Honest, constructive, and always backed by a reason." },
    { label: "Debugging", style: "Reproduce → Isolate → Hypothesize → Test. Every time." },
  ],
  thirtyDays: [
    "Read every line of the existing codebase and draw the system diagram.",
    "Set up local env, run all tests, identify flaky ones.",
    "Ship one small but meaningful feature — earning trust through delivery.",
    "Meet every team member and understand their pain points.",
  ],
  openTo: ["Full-Time SDE Roles", "Internships", "Backend-Heavy Projects", "AI Integration Work", "Remote / Hybrid"],
};

const POSTS = [
  {
    id: 1, image: post1,
    caption: "Breaking down Backend architecture — Spring Boot, JWT, and the art of building scalable REST APIs.",
    tags: ["#SpringBoot", "#Backend", "#SystemDesign"],
    date: "Apr 28, 2026",
  },
  {
    id: 2, image: post2,
    caption: "AI & Deep Learning simplified — from raw tensors to production-ready TensorFlow models.",
    tags: ["#TensorFlow", "#AI", "#DeepLearning"],
    date: "Apr 20, 2026",
  },
  {
    id: 3, image: post3,
    caption: "Live coding session: Building a full complaint management system from scratch in 3 hours.",
    tags: ["#Django", "#LiveCoding", "#FullStack"],
    date: "Apr 12, 2026",
  },
  {
    id: 4, image: post4,
    caption: "SS Retails — A real-world retail management platform with auth, inventory, and analytics.",
    tags: ["#Project", "#React", "#NodeJS"],
    date: "Mar 30, 2026",
  },
  {
    id: 5, image: post5,
    caption: "System design sketch: designing a scalable notification service at 100K req/sec.",
    tags: ["#SystemDesign", "#Architecture"],
    date: "Mar 18, 2026",
  },
  {
    id: 6, image: post6,
    caption: "Exploring vector databases & RAG pipelines using LangChain + Chroma for document Q&A.",
    tags: ["#LangChain", "#RAG", "#GenAI"],
    date: "Mar 5, 2026",
  },
];

const READING_SHELF = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", type: "Book", status: "reading", emoji: "📖" },
  { title: "AWS Solutions Architect", author: "A Cloud Guru", type: "Course", status: "progress", emoji: "🎓" },
  { title: "Attention Is All You Need", author: "Vaswani et al.", type: "Paper", status: "done", emoji: "📄" },
  { title: "Clean Architecture", author: "Robert C. Martin", type: "Book", status: "done", emoji: "📗" },
  { title: "LangChain for LLM Apps", author: "DeepLearning.AI", type: "Course", status: "reading", emoji: "🤖" },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", type: "Book", status: "done", emoji: "⚒️" },
];

const TABS = [
  { id: "forge", label: "Daily Forge", icon: FiCalendar, emoji: "📅" },
  { id: "roadmap", label: "Roadmap", icon: FiMap, emoji: "🗺️" },
  { id: "hire", label: "Hire Brief", icon: FiBriefcase, emoji: "💼" },
  { id: "posts", label: "My Posts", icon: FiImage, emoji: "📸" },
  { id: "shelf", label: "Shelf", icon: FiBook, emoji: "📚" },
];

// ─── TABS CONTENT ─────────────────────────────────────────────────────────────

const TabForge = memo(function TabForge() {
  return (
    <div className="mw-tab-content">
      <div className="mw-section-header">
        <div className="mw-eyebrow">The Scholar's Daily Journal</div>
        <h3 className="mw-title">Daily Forge</h3>
        <p className="mw-subtitle">What was built, broken, and learned — one log at a time.</p>
      </div>
      <div className="forge-feed">
        {DAILY_LOG.map((entry, i) => (
          <motion.div
            key={i}
            className="forge-entry"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className="forge-gutter">
              <div className="forge-date-badge">
                <span className="forge-day">{entry.date.split(" ")[1].replace(",", "")}</span>
                <span className="forge-month">{entry.date.split(" ")[0]}</span>
              </div>
              <div className="forge-spine" />
            </div>
            <div className="forge-card">
              {entry.image ? (
                <img src={entry.image} alt={entry.title} className="forge-img" />
              ) : (
                <div className="forge-img-placeholder">
                  <span className="forge-img-placeholder-icon">🖼️</span>
                  <span className="forge-img-placeholder-text">No image yet</span>
                </div>
              )}
              <h4 className="forge-title">{entry.title}</h4>
              <p className="forge-desc">{entry.description}</p>
              <div className="forge-tags">
                {entry.tags.map(t => <span key={t} className="forge-tag">#{t}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

const TabRoadmap = memo(function TabRoadmap() {
  const statusMeta = {
    done: { label: "Complete", cls: "rm-done", icon: "✅" },
    progress: { label: "In Progress", cls: "rm-progress", icon: "🔄" },
    planned: { label: "Planned", cls: "rm-planned", icon: "🎯" },
  };

  return (
    <div className="mw-tab-content">
      <div className="mw-section-header">
        <div className="mw-eyebrow">Where the Journey Goes</div>
        <h3 className="mw-title">The Roadmap</h3>
        <p className="mw-subtitle">Past conquests, current battles, and future quests.</p>
      </div>
      <div className="roadmap-track">
        {ROADMAP.map((item, i) => {
          const meta = statusMeta[item.status];
          return (
            <motion.div
              key={i}
              className={`rm-item ${i % 2 === 0 ? "rm-left" : "rm-right"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="rm-connector">
                <div className="rm-node">{item.icon}</div>
                {i < ROADMAP.length - 1 && <div className="rm-line" />}
              </div>
              <div className={`rm-card ${meta.cls}`}>
                <div className="rm-card-top">
                  <span className="rm-year">{item.year}</span>
                  <span className={`rm-badge ${meta.cls}`}>{meta.icon} {meta.label}</span>
                </div>
                <h4 className="rm-card-title">{item.title}</h4>
                <p className="rm-card-desc">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

const TabHire = memo(function TabHire() {
  return (
    <div className="mw-tab-content">
      <div className="mw-section-header">
        <div className="mw-eyebrow">The Recruiter's Page</div>
        <h3 className="mw-title">Hire Brief</h3>
        <p className="mw-subtitle">Everything a hiring manager needs — in one scroll.</p>
      </div>

      {/* Pitch */}
      <motion.div className="hire-pitch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="hire-pitch-quote">&ldquo;</div>
        <p className="hire-pitch-text">{HIRE_DNA.pitch}</p>
      </motion.div>

      {/* 4 Pillars */}
      <div className="hire-pillars">
        {HIRE_DNA.pillars.map((p, i) => (
          <motion.div key={i} className="hire-pillar"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
          >
            <div className="hire-pillar-icon">{p.icon}</div>
            <h4 className="hire-pillar-title">{p.title}</h4>
            <p className="hire-pillar-desc">{p.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="hire-two-col">
        {/* Work Style */}
        <motion.div className="hire-box" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h4 className="hire-box-title">⚙️ Work Style</h4>
          {HIRE_DNA.workStyle.map((ws, i) => (
            <div key={i} className="hire-style-row">
              <span className="hire-style-label">{ws.label}</span>
              <span className="hire-style-val">{ws.style}</span>
            </div>
          ))}
        </motion.div>

        {/* First 30 Days */}
        <motion.div className="hire-box" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h4 className="hire-box-title">🗓️ First 30 Days</h4>
          <ol className="hire-thirty-list">
            {HIRE_DNA.thirtyDays.map((item, i) => (
              <li key={i} className="hire-thirty-item">{item}</li>
            ))}
          </ol>
        </motion.div>
      </div>

      {/* Open To */}
      <motion.div className="hire-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <h4 className="hire-open-label">✦ Open To</h4>
        <div className="hire-open-tags">
          {HIRE_DNA.openTo.map(t => <span key={t} className="hire-open-tag">{t}</span>)}
        </div>
      </motion.div>
    </div>
  );
});

// ─── MY POSTS TAB ─────────────────────────────────────────────────────────────

const TabPosts = memo(function TabPosts() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mw-tab-content">
      <div className="mw-section-header">
        <div className="mw-eyebrow">Divakar R · Dev Posts</div>
        <h3 className="mw-title">My Posts</h3>
        <p className="mw-subtitle">Projects, AI breakdowns &amp; dev content — all in one place.</p>
      </div>

      {/* Post Grid */}
      <div className="posts-grid">
        {POSTS.map((post, i) => (
          <motion.div
            key={post.id}
            className="post-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setSelected(post)}
            whileHover={{ y: -4 }}
          >
            <div className="post-img-wrap">
              <img src={post.image} alt={post.caption} className="post-img" loading="lazy" />
              <div className="post-overlay">
                <span className="post-overlay-icon">🔍</span>
              </div>
            </div>
            <div className="post-body">
              <p className="post-caption">{post.caption}</p>
              <div className="post-tags">
                {post.tags.map(t => <span key={t} className="post-tag">{t}</span>)}
              </div>
              <span className="post-date">{post.date}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="post-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="post-lightbox-inner"
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="post-lb-close" onClick={() => setSelected(null)}>✕</button>
              <img src={selected.image} alt={selected.caption} className="post-lb-img" />
              <div className="post-lb-caption">
                <p>{selected.caption}</p>
                <div className="post-tags" style={{ marginTop: '0.6rem' }}>
                  {selected.tags.map(t => <span key={t} className="post-tag">{t}</span>)}
                </div>
                <span className="post-date" style={{ marginTop: '0.4rem', display: 'block' }}>{selected.date}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const TabShelf = memo(function TabShelf() {
  const statusMeta = {
    reading: { label: "Reading Now", cls: "shelf-reading" },
    progress: { label: "In Progress", cls: "shelf-progress" },
    done: { label: "Completed", cls: "shelf-done" },
  };

  return (
    <div className="mw-tab-content">
      <div className="mw-section-header">
        <div className="mw-eyebrow">The Codex Currently Open</div>
        <h3 className="mw-title">Reading Shelf</h3>
        <p className="mw-subtitle">Books, courses, and papers shaping the craft.</p>
      </div>
      <div className="shelf-grid">
        {READING_SHELF.map((book, i) => {
          const meta = statusMeta[book.status];
          return (
            <motion.div
              key={i}
              className={`shelf-book ${meta.cls}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ y: -6 }}
            >
              <div className="shelf-emoji">{book.emoji}</div>
              <div className="shelf-body">
                <h4 className="shelf-title">{book.title}</h4>
                <p className="shelf-author">{book.author}</p>
                <div className="shelf-meta">
                  <span className="shelf-type">{book.type}</span>
                  <span className={`shelf-status ${meta.cls}`}>{meta.label}</span>
                </div>
              </div>
              {book.status === "reading" && <div className="shelf-bookmark" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

const TAB_COMPONENTS = {
  forge: TabForge,
  roadmap: TabRoadmap,
  hire: TabHire,
  posts: TabPosts,
  shelf: TabShelf,
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function MyWorld({ onClose }) {
  const [activeTab, setActiveTab] = useState("forge");
  const ActivePanel = TAB_COMPONENTS[activeTab];

  return (
    <motion.div
      className="mw-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Click outside to close */}
      <div className="mw-backdrop-click" onClick={onClose} />

      <motion.div
        className="mw-panel"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
      >
        {/* Header */}
        <div className="mw-header">
          <div className="mw-header-left">
            <div className="mw-header-ornament">⚜</div>
            <div>
              <div className="mw-header-eyebrow">DIVAKAR R · CODEX</div>
              <h2 className="mw-header-title">My World</h2>
            </div>
          </div>
          <button className="mw-close-btn" onClick={onClose} aria-label="Close My World">
            <FiX size={22} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="mw-profile-card">
          <div className="mw-profile-img-wrap">
            <div className="mw-profile-ring" />
            <img src={profilePic} alt="Divakar R" className="mw-profile-img" loading="lazy" />
            <div className="mw-profile-status">
              <span className="mw-status-dot" />
              <span>Open to Work</span>
            </div>
          </div>
          <div className="mw-profile-info">
            <h2 className="mw-profile-name">Divakar R</h2>
            <p className="mw-profile-role">Full Stack Developer &middot; AI Engineer</p>
            <p className="mw-profile-location">📍 Coimbatore, Tamil Nadu · CIT Coimbatore</p>
            <div className="mw-profile-links">
              <a href="https://github.com/DIVAKAR-0110" target="_blank" rel="noreferrer" className="mw-plink" aria-label="GitHub">
                <FiGithub size={16} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/r-divakar-482212303/" target="_blank" rel="noreferrer" className="mw-plink" aria-label="LinkedIn">
                <FiLinkedin size={16} /> LinkedIn
              </a>
              <a href="mailto:rdivakar0110@gmail.com" className="mw-plink" aria-label="Email">
                <FiMail size={16} /> Email
              </a>
            </div>
          </div>
          <div className="mw-profile-quick-stats">
            <div className="mw-qstat">
              <span className="mw-qstat-val">16+</span>
              <span className="mw-qstat-label">Projects</span>
            </div>
            <div className="mw-qstat-divider" />
            <div className="mw-qstat">
              <span className="mw-qstat-val">7.92</span>
              <span className="mw-qstat-label">CGPA</span>
            </div>
            <div className="mw-qstat-divider" />
            <div className="mw-qstat">
              <span className="mw-qstat-val">14+</span>
              <span className="mw-qstat-label">Tech Stack</span>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mw-tab-bar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`mw-tab-btn ${isActive ? "mw-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mw-tab-emoji">{tab.emoji}</span>
                <span className="mw-tab-label">{tab.label}</span>
                {isActive && (
                  <motion.div className="mw-tab-underline" layoutId="mw-tab-underline" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mw-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mw-panel-inner"
            >
              <ActivePanel />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Ornament */}
        <div className="mw-footer">
          <span>❧</span>
          <span className="mw-footer-text">Crafted by · Divakar R Portfolio</span>
          <span>❦</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
