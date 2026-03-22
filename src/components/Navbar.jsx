// src/components/Navbar.jsx
import "./Navbar.css";
import { useState, useEffect } from "react";
import { FiGithub, FiLinkedin, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { id: "hero",     label: "Home"      },
  { id: "stack",    label: "Skills"    },
  { id: "projects", label: "Projects"  },
  { id: "about",    label: "About"     },
  { id: "contact",  label: "Contact"   },
];

function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleScroll = (id) => {
    if (location.pathname !== "/") { navigate(`/#${id}`); setOpen(false); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner container">
        {/* Brand */}
        <button className="navbar-logo" onClick={() => handleScroll("hero")} aria-label="Home">
          <div className="navbar-logo-circle">DR</div>
          <span className="navbar-logo-text">DIVAKAR R</span>
        </button>

        {/* Desktop links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button className="navbar-link" onClick={() => handleScroll(link.id)}>
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <a href="https://github.com/DIVAKAR-0110" target="_blank" rel="noreferrer" className="navbar-link" aria-label="GitHub">
              <FiGithub size={17} />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/r-divakar-482212303/" target="_blank" rel="noreferrer" className="navbar-link" aria-label="LinkedIn">
              <FiLinkedin size={17} />
            </a>
          </li>
          {/* Theme Toggle */}
          <li>
            <button
              className="navbar-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <FiMoon size={17} /> : <FiSun size={17} />}
            </button>
          </li>
        </ul>

        {/* Mobile controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button className="navbar-theme-toggle mobile-theme" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>
          <button className="navbar-hamburger" onClick={() => setOpen(p => !p)} aria-label="Toggle menu">
            <span style={open ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
            <span style={open ? { opacity: 0 }                                   : {}} />
            <span style={open ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="navbar-mobile-menu">
          {navLinks.map((link) => (
            <button key={link.id} className="navbar-mobile-link" onClick={() => handleScroll(link.id)}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;
