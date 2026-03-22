// src/components/JourneyMap.jsx - COMPLETE TREASURE MAP (500+ lines)
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html, Text, Sky } from "@react-three/drei";
import { useState, useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import "./JourneyMap.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMapPin, FiArrowRight } from "react-icons/fi";

const MODULES = [
  {
    id: "about", num: 1, label: "The Scholar", icon: "📚", pos: [-8, 0.5, 3], color: "#ff7a18",
    detail: "CIT Coimbatore | CGPA 7.92 | M.Sc. Software Systems",
    scrollContent: (
      <div className="scroll-section">
        <h3>🎓 Academic Journey</h3>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-number">7.92</div><div>CGPA</div></div>
          <div className="stat-card"><div className="stat-number">2023-2025</div><div>M.Sc.</div></div>
        </div>
        <ul className="detail-list">
          <li>M.Sc. Software Systems - CGPA 7.92</li>
          <li>CIT Coimbatore</li>
          <li>AI/ML + Fullstack Specialization</li>
          <li>Chennai, Tamil Nadu</li>
        </ul>
      </div>
    )
  },
  {
    id: "stack", num: 2, label: "Tech Arsenal", icon: "💻", pos: [6, 0.5, 5], color: "#00c9ff",
    detail: "React • Spring Boot • Django • TensorFlow • Three.js",
    scrollContent: (
      <div className="scroll-section">
        <h3>🛠️ Technology Stack</h3>
        <div className="tech-grid">
          <span>React + Next.js</span><span>Spring Boot</span><span>Django</span>
          <span>TensorFlow</span><span>Three.js</span><span>Tailwind</span>
          <span>PostgreSQL</span><span>Docker</span>
        </div>
      </div>
    )
  },
  {
    id: "projects", num: 3, label: "Epic Projects", icon: "⭐", pos: [12, 0.5, -1], color: "#ffd700",
    detail: "ERP Dashboard • AI Complaint System • Portfolio",
    scrollContent: (
      <div className="scroll-section">
        <h3>🚀 Showcase Projects</h3>
        <div className="project-list">
          <div className="project-item">
            <h4>🌐 Ancient Orb Portfolio</h4>
            <p>React Three Fiber + Framer Motion</p>
          </div>
          <div className="project-item">
            <h4>⚙️ ERP Dashboard</h4>
            <p>Spring Boot + React + PostgreSQL</p>
          </div>
          <div className="project-item">
            <h4>🤖 AI Complaint System</h4>
            <p>Django + TensorFlow Analytics</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "certs", num: 4, label: "Certifications", icon: "🏆", pos: [3, 0.5, -7], color: "#7cffcb",
    detail: "IBM AI • MERN Stack • AWS",
    scrollContent: (
      <div className="scroll-section">
        <h3>📜 Certifications</h3>
        <ul className="cert-list">
          <li>IBM AI Engineering Professional</li>
          <li>MERN Stack Developer</li>
          <li>AWS Cloud Practitioner</li>
          <li>Google TensorFlow Developer</li>
        </ul>
      </div>
    )
  },
  {
    id: "awards", num: 5, label: "Triumphs", icon: "🎖️", pos: [-11, 0.5, -9], color: "#ff4ecd",
    detail: "Hackathon Winner • GitHub Star • LeetCode Top 2%",
    scrollContent: (
      <div className="scroll-section">
        <h3>🏅 Achievements</h3>
        <ul className="award-list">
          <li>🥇 Hackathon Winner 2025</li>
          <li>⭐ GitHub Star Developer</li>
          <li>⚡ LeetCode Top 2%</li>
          <li>🎓 Published Research Paper</li>
        </ul>
      </div>
    )
  }
];

function ProfileTreasure() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.3;
    ref.current.position.y = Math.sin(t * 1.5) * 0.2;
  });
  return (
    <group ref={ref} position={[-12, 1.5, 8]}>
      <mesh><cylinderGeometry args={[1.2, 1.2, 0.1, 32]} /><meshLambertMaterial color="#d4af37" emissive="#8b7355" emissiveIntensity={0.2} /></mesh>
      <Text position={[0, 0.1, 0.51]} fontSize={0.25} color="#1a0f08" anchorX="center">👨‍💻</Text>
      <Text position={[0, -1.4, 0.01]} fontSize={0.18} color="gold" anchorX="center">DIVAKAR R</Text>
    </group>
  );
}

function Mountains() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`mtn-${i}`} position={[(i - 6) * 3.5, 0, -14 + i * 0.8]} scale={[1.8 + i * 0.2, 4 + i * 0.5, 1.8 + i * 0.2]}>
          <coneGeometry args={[1.2, 5, 12]} />
          <meshLambertMaterial color="#6b4e31" emissive="#3c2f1f" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </>
  );
}

function River() {
  const ref = useRef();
  useFrame((state) => ref.current && (ref.current.rotation.z += 0.001));
  return (
    <mesh ref={ref} position={[0, 0.1, 0]}>
      <torusGeometry args={[9, 0.35, 8, 36]} />
      <meshBasicMaterial color="#4169e1" transparent opacity={0.7} />
    </mesh>
  );
}

function Compass() {
  const ref = useRef();
  useFrame((state) => ref.current && (ref.current.rotation.z = state.clock.elapsedTime * 0.15));
  return (
    <group ref={ref} position={[0, 4.2, 0]}>
      <mesh rotation={[0, 0, -Math.PI / 4]}><ringGeometry args={[2.3, 2.6, 20]} /><meshBasicMaterial color="#ffd700" /></mesh>
      <Text position={[0, 0.35, 0]} fontSize={0.28} color="white" anchorX="center">N</Text>
      <Text position={[1.8, 0, 0]} fontSize={0.18} color="white" rotation={[0, 0, Math.PI / 4]} anchorX="center">E</Text>
    </group>
  );
}

function MapSurface() {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const ctx = c.getContext('2d');
    const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    gradient.addColorStop(0, '#8B7355'); gradient.addColorStop(0.4, '#D2B48C');
    gradient.addColorStop(0.7, '#654321'); gradient.addColorStop(1, '#2F4F2F');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath(); ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
      ctx.lineTo(Math.random() * 1024, Math.random() * 1024); ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  }, []);
  return <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[45, 35]} /><meshLambertMaterial map={canvas} /></mesh>;
}

function TreasurePin({ module, active, onClick }) {
  const ref = useRef(), chestRef = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = module.pos[1] + Math.sin(t * 2) * 0.12;
    ref.current.rotation.y = t * 0.6;
    if (chestRef.current && active) chestRef.current.rotation.x = Math.sin(t * 5) * 0.25;
  });
  return (
    <group ref={ref} position={module.pos} onClick={() => onClick(module)}>
      <mesh ref={chestRef} position={[0, 0.3, 0]}>
        <boxGeometry args={[0.85, 0.42, 0.65]} />
        <meshLambertMaterial color={active ? "#ffd700" : module.color} emissive={module.color} emissiveIntensity={active ? 1 : 0.3} />
      </mesh>
      <mesh position={[0, 0.65, 0]}><boxGeometry args={[0.9, 0.22, 0.7]} /><meshLambertMaterial color={active ? "#ffed4a" : "#d4af37"} emissive={module.color} emissiveIntensity={active ? 1.2 : 0.4} /></mesh>
      <mesh position={[0, 0.42, 0.35]}><cylinderGeometry args={[0.09, 0.11, 0.18, 8]} /><meshBasicMaterial color="#c0c0c0" /></mesh>
      <mesh scale={active ? [2.2, 1.8, 2.2] : [1.6, 1.2, 1.6]}>
        <sphereGeometry args={[0.55, 18, 18]} />
        <meshBasicMaterial color={module.color} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <Html center rotation={[0, Math.PI, 0]}>
        <motion.div className={`treasure-number ${active ? "active" : ""}`} animate={{ scale: active ? 1.4 : 1, rotateY: active ? 360 : 0 }} transition={{ duration: 0.6 }}>
          {module.num}
        </motion.div>
      </Html>
    </group>
  );
}

function CameraController({ target }) {
  useFrame((state) => {
    if (!target) {
      state.camera.position.lerp(new THREE.Vector3(0, 16, 28), 0.04);
      state.camera.lookAt(0, 0, 0); return;
    }
    const desired = new THREE.Vector3(target[0] * 1.3, target[1] + 9, target[2] + 11);
    state.camera.position.lerp(desired, 0.1); state.camera.lookAt(...target);
  });
  return null;
}

export default function JourneyMap({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [visited, setVisited] = useState(new Set());

  const handleSelect = (module) => {
    setSelected(module);
    setVisited(prev => new Set([...prev, module.id]));
  };

  const selectedModule = MODULES.find(m => m.id === selected?.id);
  const nextModule = selected ? MODULES[(MODULES.findIndex(m => m.id === selected.id) + 1) % MODULES.length] : null;

  return (
    <div className="journey-map-overlay">
      <div className="journey-map-bg biome-style" />

      <Canvas className="journey-map-canvas" camera={{ fov: 65, position: [0, 16, 28] }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault />
        <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} enableDamping dampingFactor={0.06} />
        <Sky sunPosition={[150, 30, 100]} />
        <fog attach="fog" args={["#a8b8d8", 12, 70]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[12, 25, 8]} intensity={1.8} castShadow />
        <directionalLight position={[-8, 12, -6]} intensity={0.9} color="#f6c595" />

        <Suspense fallback={null}>
          <MapSurface />
          <River /><Mountains /><Compass /><ProfileTreasure />
          <CameraController target={selected?.pos} />
          {MODULES.map(module => (
            <TreasurePin key={module.id} module={module} active={selected?.id === module.id} onClick={handleSelect} />
          ))}
        </Suspense>
      </Canvas>

      <div className="journey-nav-top">
        <motion.div className="journey-title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          🗺️ DIVAKAR'S TREASURE QUEST
        </motion.div>
        <motion.button className="btn-seal" onClick={onClose} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
          <FiX />
        </motion.button>
      </div>

      <div className="journey-menu-glass">
        <div className="menu-header">🧭 TREASURE LEGEND</div>
        {MODULES.map((module, i) => (
          <motion.div
            key={module.id}
            className={`menu-glass-item ${selected?.id === module.id ? 'active' : ''} ${visited.has(module.id) ? 'conquered' : ''}`}
            onClick={() => handleSelect(module)}
            whileHover={{ x: 15, scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
          >
            <div className="serial-num" style={{ backgroundColor: visited.has(module.id) ? '#ffd700' : '#8B3A1E' }}>{module.num}</div>
            <div className="label-text"><span className="module-icon">{module.icon}</span>{module.label}</div>
            {visited.has(module.id) && <FiMapPin className="award-icon" />}
          </motion.div>
        ))}
      </div>

      <div className="jm-progress">
        🏆 Quest: <strong>{visited.size}/{MODULES.length}</strong> Treasures Found
      </div>

      <AnimatePresence>
        {selectedModule && (
          <motion.div className="jm-scroll-panel" initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
            <div className="scroll-header">
              <div className="scroll-badge">{selectedModule.num}</div>
              <h2>{selectedModule.icon} {selectedModule.label}</h2>
              <motion.button className="scroll-close" onClick={() => setSelected(null)} whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FiX />
              </motion.button>
            </div>
            <div className="scroll-content">
              {selectedModule.scrollContent}
            </div>
            <div className="scroll-footer">
              <span>Treasure #{visited.size} of {MODULES.length}</span>
              <motion.button className="scroll-next" onClick={() => handleSelect(nextModule)} whileHover={{ x: 10 }} whileTap={{ scale: 0.98 }}>
                {nextModule ? `→ ${nextModule.icon} ${nextModule.label}` : 'Complete!'} <FiArrowRight />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
