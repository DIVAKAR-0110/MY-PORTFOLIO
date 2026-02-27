// src/components/Navbar.jsx
import "./Navbar.css";
import { useState } from "react";
import { FiGithub, FiLinkedin, FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "content", label: "Content" },
  { id: "stack", label: "Tech Stack" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className="navbar">
      <nav className="container navbar-inner">
        {/* Brand */}
        <button onClick={() => handleScroll("hero")} className="navbar-brand">
          <div className="navbar-logo-circle">D</div>
          <span className="navbar-title">
            DIVAKAR <span>R</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className="nav-link-btn"
            >
              {link.label}
            </button>
          ))}

          <div className="nav-icons">
            <a
              href="https://github.com/DIVAKAR-0110"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="nav-icon-link"
            >
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="nav-menu-btn" onClick={() => setOpen((p) => !p)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`nav-mobile ${open ? "open" : ""}`}>
        <div className="container nav-mobile-inner">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className="nav-mobile-btn"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
