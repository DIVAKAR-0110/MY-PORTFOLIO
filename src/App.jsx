// src/App.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import BackgroundOrbs from "./components/BackgroundOrbs";
import Hero from "./sections/Hero";
import TechStack from "./sections/TechStack";
import Projects from "./sections/Projects";
import ContentCreator from "./sections/ContentCreator";
import About from "./sections/About";
import Timeline from "./sections/Timeline";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import "./App.css"; // Add loading styles here

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (adjust as needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); // 2.8 seconds for smooth experience

    return () => clearTimeout(timer);
  }, []);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loader-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated Logo */}
          <motion.div
            className="logo-circle"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
              borderRadius: ["20%", "50%", "20%"],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="logo-inner"
              animate={{
                scale: [1, 1.05, 1],
                backgroundColor: ["#14b8a6", "#22d3ee", "#3b82f6", "#14b8a6"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              DR
            </motion.div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            className="loading-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-line">
              <motion.span
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="gradient-text"
              >
                Loading Portfolio...
              </motion.span>
            </div>
            <div className="text-line">
              <span>Full-Stack Developer & AI Engineer</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="progress-container"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            <motion.div
              className="progress-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 0.92 }} // 92% to show it's almost done
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          {/* Floating Particles */}
          <div className="particles">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                animate={{
                  y: [-20, 20, -20],
                  x: [0, 15, -15, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Skill Sparks */}
          <div className="skill-sparks">
            {["React", "Django", "AI", "Spring"].map((skill, i) => (
              <motion.span
                key={skill}
                className="skill-spark"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Main App Content
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="app"
          className="app-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackgroundOrbs />
          <Navbar />
          <main className="container mx-auto px-4 pt-24 pb-16 space-y-24">
            <Hero />
            <TechStack />
            <Projects />
            <ContentCreator />
            <About />
            <Timeline />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
