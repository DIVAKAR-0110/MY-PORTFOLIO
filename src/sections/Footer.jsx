// src/sections/Footer.jsx
import "./Footer.css";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const quickLinks = [
  { id: "hero",     label: "Home"      },
  { id: "stats",    label: "Chronicles" },
  { id: "about",    label: "The Scribe" },
  { id: "stack",    label: "Arsenal"    },
  { id: "projects", label: "Conquests"  },
  { id: "contact",  label: "Envoys"     },
];

function Footer() {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-top-ornament" />
      
      <div className="footer-container container">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-ring">DR</div>
            <h2 className="footer-name">DIVAKAR R</h2>
          </div>
          <p className="footer-tagline">
            Building the legacies of tomorrow with the wisdom of the ancients.
          </p>
          <div className="footer-socials">
            <a href="https://github.com/DIVAKAR-0110" target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
            <a href="https://www.linkedin.com/in/r-divakar-482212303/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="mailto:rdivakar0110@gmail.com" aria-label="Email"><FiMail /></a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div className="footer-link-group">
            <h4>Quick Navigation</h4>
            <ul>
              {quickLinks.map(link => (
                <li key={link.id}>
                  <button onClick={() => handleScroll(link.id)}>{link.label}</button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-link-group">
            <h4>The Great Archive</h4>
            <ul>
              <li><a href="https://github.com/DIVAKAR-0110" target="_blank" rel="noreferrer">Open Source Scrolls</a></li>
              <li><a href="/divakar_resume.pdf" target="_blank" rel="noreferrer">The Scholar's Resume</a></li>
              <li><button onClick={() => handleScroll("contact")}>Dispatch Envoy</button></li>
            </ul>
          </div>
        </div>

        {/* Scroll To Top */}
        <button className="footer-scroll-top" onClick={scrollToTop} aria-label="Return to Zenith">
          <FiArrowUp />
          <span>Zenith</span>
        </button>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} &middot; Handcrafted by Divakar R &middot; Ancient Series V2</p>
          <div className="footer-ornament-leaf">❧ ❦ ❧</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
