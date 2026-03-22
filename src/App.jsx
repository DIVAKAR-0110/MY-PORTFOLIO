// src/App.jsx
import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";

import Navbar from "./components/Navbar";
import LeafBackground from "./components/LeafBackground";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import TechStack from "./sections/TechStack";
import Projects from "./sections/Projects";
import Certifications from "./sections/Certifications";
import Timeline from "./sections/Timeline";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import "./App.css";

// ─── LOADING SCREEN COMPONENT ───
const LoadingScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="loading-screen">
      <motion.div className="scroll-wrapper">
        {/* Top Roller */}
        <motion.div
          className="scroll-roller top"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
        />

        {/* Parchment Paper */}
        <motion.div
          className="scroll-paper"
          initial={{ height: 0 }}
          animate={{ height: 200 }}
          transition={{ duration: 1.2, ease: "circOut" }}
        >
          <motion.div
            className="loading-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="loading-logo">DR</div>
            <p className="loading-text">Chronicling Ancient Legends...</p>
            <div className="loading-progress-container">
              <motion.div
                className="loading-progress-bar"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.5, duration: 1.8, ease: "easeInOut" }}
              />
              <motion.span
                className="quill-loader"
                initial={{ left: 0 }}
                animate={{ left: "100%" }}
                transition={{ delay: 1.5, duration: 1.8, ease: "easeInOut" }}
              >
                ✒️
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Roller */}
        <motion.div
          className="scroll-roller bottom"
          initial={{ y: -90 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
        />
      </motion.div>
    </div>
  );
};

// ─── MAIN LAYOUT ───
const MainLayout = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="app-root">
      {/* Background Effects */}
      <LeafBackground />
      <div className="grain-overlay" />
      <div
        className="mouse-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <Navbar />

      <main className="container">
        <Hero />
        <Stats />
        <About />
        <TechStack />
        <Projects />
        <Certifications />
        <Timeline />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

// ─── APP ENTRY ───
function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" onFinish={() => setLoading(false)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Router>
              <Routes>
                <Route path="/" element={<MainLayout />} />
              </Routes>
            </Router>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
