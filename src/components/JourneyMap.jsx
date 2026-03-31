// src/components/JourneyMap.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html, Text, Line, Float, useGLTF, Sparkles, ContactShadows, Cloud } from "@react-three/drei";
import { useState, useRef, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";
import "./JourneyMap.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMapPin } from "react-icons/fi";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";

// --- CUSTOM SHADERS & MATERIALS ---

const WaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#51a9ad") },
    uAlpha: { value: 0.4 }
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + uTime) * 0.1 + cos(pos.y * 2.0 + uTime) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uAlpha;
    void main() {
      float noise = sin(vUv.x * 20.0 + uTime) * 0.1 + sin(vUv.y * 20.0 - uTime) * 0.1;
      gl_FragColor = vec4(uColor + noise, uAlpha);
    }
  `
};

const MODULES = [
  {
    id: "about", num: 1, label: "Starting Shore", icon: "🏝️", pos: [-12, 0.5, 15], color: "#b71c1c",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🎓 The Journey Begins</h3>
        <p className="script-paragraph">In the year of 2023, the quest began at the great halls of CIT Coimbatore. A specialized focus in AI/ML and Fullstack sorcery guided the path to a 7.92 CGPA in M.Sc. Software Systems.</p>
        <ul className="script-list">
          <li>Master of Science (Software Systems) — 2023-2025.</li>
          <li>Residing in the coastal lands of Chennai, Tamil Nadu.</li>
        </ul>
      </div>
    )
  },
  {
    id: "stack", num: 2, label: "Tech Jungle", icon: "⚔️", pos: [-6, 0.5, 6], color: "#c62828",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🛠️ The Armory of Codes</h3>
        <p className="script-paragraph">A traveler must be equipped with the sharpest of tools. The arsenal includes front-end mastery and back-end fortresses.</p>
        <div className="rune-grid">
          <span>React & Next.js</span><span>Spring Boot</span><span>Django Python</span>
          <span>TensorFlow AI</span><span>Three.js 3D</span><span>Tailwind CSS</span>
        </div>
      </div>
    )
  },
  {
    id: "exp", num: 3, label: "Pirate's Cove", icon: "⚓", pos: [-16, 0.5, -4], color: "#d32f2f",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">💼 Professional Quests</h3>
        <p className="script-paragraph">Arduous journeys through the professional realm, solving real-world problems with code and logic.</p>
        <ul className="script-list">
          <li>Fullstack Developer Intern — Tech Solutions (2024)</li>
          <li>AI/ML Research Assistant — CIT Archives (2023)</li>
          <li>Freelance Sorcerer — Global Kingdoms (2022-Present)</li>
        </ul>
      </div>
    )
  },
  {
    id: "projects", num: 4, label: "Monument Valley", icon: "🔱", pos: [-4, 0.5, -10], color: "#e53935",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🚀 Monuments Built</h3>
        <p className="script-paragraph">Great monuments were erected using the tech arsenal. Each structure pushed the boundaries of modern engineering.</p>
        <div className="script-project">
          <h4>🌐 Ancient Orb Portfolio</h4>
          <p>A magical 3D experience blending R3F with Framer Motion.</p>
        </div>
        <div className="script-project">
          <h4>🤖 AI Sentinel System</h4>
          <p>A cognitive network for grievances using Django and TensorFlow.</p>
        </div>
      </div>
    )
  },
  {
    id: "skills", num: 5, label: "Crystal Caves", icon: "⚡", pos: [6, 0.5, -12], color: "#f44336",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">⚡ Innate Abilities</h3>
        <p className="script-paragraph">Specialized skills honed through years of practice and deep focus.</p>
        <ul className="script-list">
          <li>Algorithm Mastery (LeetCode 500+)</li>
          <li>System Design & Architecture Thinking</li>
          <li>UI/UX Empathy & Responsive Design</li>
        </ul>
      </div>
    )
  },
  {
    id: "certs", num: 6, label: "Mount Wisdom", icon: "📜", pos: [16, 0.5, -5], color: "#ff5252",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">📜 Scrolls of Mastery</h3>
        <p className="script-paragraph">The masters of the realm bestowed these certificates upon completing arduous trials.</p>
        <ul className="script-list">
          <li>IBM AI Engineering Professional</li>
          <li>Master of the MERN Stack</li>
          <li>Google TensorFlow Developer</li>
        </ul>
      </div>
    )
  },
  {
    id: "hobbies", num: 7, label: "Zen Island", icon: "🏔️", pos: [10, 0.5, 5], color: "#ff1744",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">❤️ Life Beyond Code</h3>
        <p className="script-paragraph">Even a mage needs to rest and seek inspiration from other realms.</p>
        <ul className="script-list">
          <li>🏔️ Trekking through pixelated mountains</li>
          <li>📸 Capturing the beauty of digital light</li>
          <li> estrategic duels and reading philosophy</li>
        </ul>
      </div>
    )
  },
  {
    id: "awards", num: 8, label: "Victory Valley", icon: "🏅", pos: [5, 0.5, 15], color: "#d50000",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🏅 Triumphs in Battle</h3>
        <p className="script-paragraph">Songs are sung of these great victories in the arenas of logic and speed.</p>
        <ul className="script-list">
          <li>🥇 Victor of 2025 Grand Hackathon</li>
          <li>⭐ GitHub Star Developer</li>
          <li>⚡ LeetCode Top 2% Rankings</li>
        </ul>
      </div>
    )
  },
  {
    id: "cont", num: 9, label: "The X Mark", icon: "🦅", pos: [18, 0.5, 18], color: "#b71c1c",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">⚔️ Join the Quest</h3>
        <p className="script-paragraph">If you wish to embark on a quest together, send a raven to my citadel.</p>
        <ul className="script-list">
          <li>📧 Email: divakar.dev@quest.com</li>
          <li>📱 LinkedIn: /in/divakarmagic</li>
          <li>🔗 GitHub: github.com/divakar-ai</li>
        </ul>
      </div>
    )
  },
  {
    id: "secret", num: "?", label: "Hidden Cove", icon: "💎", pos: [-25, 0.5, 25], color: "#ffab00",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">💎 The Hidden Gem</h3>
        <p className="script-paragraph drop-cap">Did you know? I once built a full 3D game engine inside a browser just for fun! This map is a glimpse into that passion for the "extra mile".</p>
      </div>
    )
  }
];

// --- ENHANCED 3D TOPOGRAPHY COMPONENTS & LOADERS ---

function Model({ path, scale = 1, position, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} position={position} rotation={rotation} scale={[scale, scale, scale]} />;
}

function VolcanoSmoke() {
  const particles = useRef();
  useFrame(() => {
    if (particles.current) {
      particles.current.children.forEach((p) => {
        p.position.y += 0.05 + Math.random() * 0.02;
        p.scale.x = p.scale.y = p.scale.z += 0.01;
        p.material.opacity -= 0.005;
        if (p.position.y > 6) {
          p.position.y = 0; p.scale.set(1, 1, 1); p.material.opacity = 0.6;
        }
      });
    }
  });
  return (
    <group ref={particles} position={[0, 5, 0]}>
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 2, Math.random() * 5, (Math.random() - 0.5) * 2]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color="#555555" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Fireflies() {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((fly, i) => {
        fly.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;
        fly.position.x += Math.cos(state.clock.elapsedTime * 1.5 + i) * 0.01;
      });
    }
  });
  return (
    <group ref={group}>
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 12, Math.random() * 5, (Math.random() - 0.5) * 12]}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshBasicMaterial color="#b2ff59" />
          <pointLight color="#b2ff59" intensity={0.5} distance={2} />
        </mesh>
      ))}
    </group>
  );
}

function MountainRange({ position }) {
  return (
    <group position={position}>
      <Model path="/models/useGLTF/Volcano.glb" position={[0, 0, 0]} scale={0.8} />
      <Text position={[0, 4, 0]} fontSize={0.5} color="#d84315" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>Mount Wisdom</Text>
    </group>
  );
}

function Desert({ position }) {
  return (
    <group position={position}>
      <Model path="/models/useGLTF/Desert scene.glb" position={[0, 0, 0]} scale={0.4} rotation={[0, Math.PI / 4, 0]} />
      <Text position={[0, 2.5, 0]} fontSize={0.5} color="#e65100" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>Victory Valley</Text>
    </group>
  );
}

function HauntedForest({ position }) {
  return (
    <group position={position}>
      <Model path="/models/useGLTF/Log.glb" position={[0, 0, 0]} scale={0.8} rotation={[0, Math.PI / 3, 0]} />
      <Text position={[0, 2, 0]} fontSize={0.5} color="#1b5e20" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>Log Cabin</Text>
    </group>
  );
}

function RealisticPirateShip({ position }) {
  return (
    <group position={position}>
      <Model path="/models/useGLTF/Small Ship.glb" position={[0, 0, 0]} scale={1.2} rotation={[0, Math.PI / 2, 0]} />
      <Text position={[0, 2.5, -1]} fontSize={0.5} color="#000000" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>Pirate's Cove</Text>
    </group>
  );
}

function FrightfulFalls({ position }) {
  return (
    <group position={position}>
      <Model path="/models/useGLTF/Waterfall.glb" position={[0, 0, 0]} scale={1} rotation={[0, Math.PI, 0]} />
      <Text position={[0, 3, 0]} fontSize={0.5} color="#0288d1" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>Monument Falls</Text>
    </group>
  );
}

function ProximityLabel({ text, position, color }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const dist = state.camera.position.distanceTo(new THREE.Vector3(...position));
    // Feature 9: Fade in only when close
    ref.current.style.opacity = THREE.MathUtils.clamp(1.5 - dist / 30, 0, 1);
  });
  return (
    <Html position={position} center transform ref={ref}>
      <div className="proximity-label-text" style={{ color }}>{text}</div>
    </Html>
  );
}

function ScholarIsland({ position, label = "Scholar's Isle", isHovered }) {
  return (
    <group position={position}>
      <Float speed={isHovered ? 5 : 1} rotationIntensity={isHovered ? 1 : 0.2}>
        <Model path="/models/useGLTF/Island.glb" position={[0, 0, 0]} scale={0.8} />
      </Float>
      <ProximityLabel text={label} position={[0, 2.5, 0]} color="#5d4037" />
    </group>
  );
}

function TechRobot({ position, label = "Arsenal AI" }) {
  return (
    <group position={position}>
      <Model path="/models/useGLTF/Robot.glb" position={[0, 0, 0]} scale={0.5} rotation={[0, Math.PI / 4, 0]} />
      <Text position={[0, 1.8, 0]} fontSize={0.5} color="#c62828" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>{label}</Text>
    </group>
  );
}

function SnowyPeaks({ position }) {
  return (
    <group position={position}>
      <Model path="/models/useGLTF/TerrainSnow01.glb" position={[0, 0, 0]} scale={0.7} />
      <Text position={[0, 2.8, 0]} fontSize={0.5} color="#b0bec5" anchorX="center" rotation={[0, -Math.PI / 4, 0]}>Frozen Frontier</Text>
    </group>
  );
}

// --- PRELOAD MODELS ---
useGLTF.preload("/models/useGLTF/Volcano.glb");
useGLTF.preload("/models/useGLTF/Desert scene.glb");
useGLTF.preload("/models/useGLTF/Log.glb");
useGLTF.preload("/models/useGLTF/Small Ship.glb");
useGLTF.preload("/models/useGLTF/Waterfall.glb");
useGLTF.preload("/models/useGLTF/Island.glb");
useGLTF.preload("/models/useGLTF/Robot.glb");
useGLTF.preload("/models/useGLTF/TerrainSnow01.glb");
useGLTF.preload("/models/useGLTF/Pirate Captain.glb");

// --- CORE MAP ---

function SecretChest({ position, isHovered }) {
  return (
    <group position={position}>
      <Float speed={isHovered ? 10 : 2} rotationIntensity={isHovered ? 2 : 0.5}>
        <TreasurePin module={{ pos: [0, 0, 0], num: "?" }} active={isHovered} onClick={() => { }} isVisited={true} />
      </Float>
      <ProximityLabel text="???" position={[0, 2, 0]} color="#ffab00" />
    </group>
  );
}

function MapSurface() {
  const waterRef = useRef();
  const parchmentRef = useRef();

  useFrame((state) => {
    if (waterRef.current) waterRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (parchmentRef.current) {
      parchmentRef.current.position.y = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      // Subtle edge flutter via vertex displacement if we had a raw shader, 
      // but for now we'll float the whole plane for 'parallax'.
    }
  });

  const parchmentTex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const ctx = c.getContext('2d');

    // Parchment Base with "Grit & Age" (Batch 1, Feature 6)
    ctx.fillStyle = '#f4e4bc'; ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.08})`;
      ctx.beginPath(); ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 50, 0, Math.PI * 2); ctx.fill();
    }
    // Ink Splats for UX Recruiter WOW
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = "rgba(62, 39, 35, 0.4)";
      ctx.beginPath(); ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 15 + 5, 0, Math.PI * 2); ctx.fill();
    }

    // Island Shape
    ctx.strokeStyle = "#5d4037"; ctx.lineWidth = 15; ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.bezierCurveTo(100, 300, 100, 700, 300, 800); ctx.bezierCurveTo(500, 900, 800, 850, 900, 700);
    ctx.bezierCurveTo(1000, 500, 800, 200, 600, 150); ctx.bezierCurveTo(400, 100, 350, 150, 300, 200);
    ctx.stroke(); ctx.fillStyle = "#eec295"; ctx.fill();

    // Interior Details
    ctx.strokeStyle = "rgba(93, 64, 55, 0.3)"; ctx.lineWidth = 4;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath(); ctx.moveTo(Math.random() * 600 + 200, Math.random() * 600 + 200);
      ctx.lineTo(Math.random() * 600 + 250, Math.random() * 600 + 250); ctx.stroke();
    }

    // Red X & Compass
    ctx.strokeStyle = "#b71c1c"; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(710, 710); ctx.lineTo(770, 770); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(770, 710); ctx.lineTo(710, 770); ctx.stroke();

    ctx.save(); ctx.translate(150, 150); ctx.scale(0.8, 0.8);
    ctx.strokeStyle = "#5d4037"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, 30); ctx.lineTo(0, 90); ctx.lineTo(-10, 30); ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#5d4037" : "#b71c1c"; ctx.fill();
    }
    ctx.restore();

    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Lower Water Layer (Dynamic Shader) */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[100, 100]} />
        <shaderMaterial attach="material" args={[WaterShader]} ref={waterRef} transparent />
      </mesh>

      {/* Upper Parchment Layer (Parallax) */}
      <mesh ref={parchmentRef} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshLambertMaterial map={parchmentTex} side={THREE.DoubleSide} transparent />
      </mesh>
    </group>
  );
}

function DashedTrail() {
  const points = MODULES.map(m => new THREE.Vector3(m.pos[0], 0.6, m.pos[2]));
  const curve = new THREE.CatmullRomCurve3(points);
  const linePoints = curve.getPoints(200);

  return (
    <Line
      points={linePoints}
      color="#8e0000"
      lineWidth={4}
      dashed
      dashSize={0.8}
      gapSize={0.5}
    />
  );
}

function TreasurePin({ module, active, onClick, isVisited }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    if (!active && !isVisited) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={module.pos} onClick={() => onClick(module)}>
      {active || isVisited ? (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
          <group position={[0, 0.4, 0]}>
            {/* Detailed Chest base */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.4, 0.9, 1.1]} />
              <meshLambertMaterial color="#4e342e" />
            </mesh>
            {/* Curved Lid */}
            <mesh position={[0, 0.45, 0]} rotation={[active ? -Math.PI / 3 : 0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.55, 0.55, 1.4, 16, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
              <meshLambertMaterial color="#3e2723" />
            </mesh>
            {/* Gold lock and bands */}
            <mesh position={[0, 0, 0.56]}>
              <boxGeometry args={[0.25, 0.35, 0.05]} />
              <meshLambertMaterial color="#ffd700" />
            </mesh>
            {active && (
              <pointLight position={[0, 1, 0]} color="#ffea00" intensity={2.5} distance={6} />
            )}
          </group>
        </Float>
      ) : (
        <group ref={ref} position={[0, 0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
            <boxGeometry args={[2.5, 0.5, 0.15]} />
            <meshLambertMaterial color="#b71c1c" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, -Math.PI / 4]}>
            <boxGeometry args={[2.5, 0.5, 0.15]} />
            <meshLambertMaterial color="#b71c1c" />
          </mesh>
        </group>
      )}

      {!active && (
        <Html position={[0, 2.5, 0]} center>
          <motion.div
            className={`treasure-marker ${isVisited ? "visited" : ""}`}
            whileHover={{ scale: 1.2 }}
          >
            {module.num}
          </motion.div>
        </Html>
      )}
    </group>
  );
}

function CameraController({ target }) {
  const lastTarget = useRef(new THREE.Vector3(0, 45, 10));

  useFrame((state) => {
    const currentTarget = target ? new THREE.Vector3(...target) : new THREE.Vector3(0, 0, 0);
    const desiredPos = target ?
      new THREE.Vector3(target[0], target[1] + 12, target[2] + 15) :
      new THREE.Vector3(0, 50, 20);

    // Feature 12: Cinematic Fly-through
    state.camera.position.lerp(desiredPos, 0.05);
    state.camera.lookAt(currentTarget);
  });
  return null;
}

function NauticalCursor() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.mouse;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x * 20, 0.1);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, -y * 20, 0.1);
    ref.current.rotation.y = state.clock.elapsedTime * 2.5;
  });
  return (
    <group ref={ref} position={[0, 1.2, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color="#b71c1c" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.4, 4]} />
        <meshBasicMaterial color="#b71c1c" />
      </mesh>
    </group>
  );
}

function Weather() {
  return (
    <group>
      {/* Feature 4: Rainfall/Sparkles */}
      <Sparkles count={150} scale={45} size={2.5} color="#f4e4bc" opacity={0.3} speed={0.5} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Cloud opacity={0.08} speed={0.4} width={25} depth={1.5} segments={15} position={[0, 10, 0]} />
      </Float>
    </group>
  );
}

export default function JourneyMap({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);
  const [shake, setShake] = useState(false);

  const handleSelect = (module) => {
    setSelected(module);
    setVisited(prev => new Set([...prev, module.id]));
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const selectedModule = MODULES.find(m => m.id === selected?.id);

  return (
    <div className={`journey-map-overlay ${shake ? 'shake-fx' : ''}`}>
      <div className="journey-map-bg document-style" />

      {/* Feature 11: Contextual Mini-Map */}
      <div className="mini-map-container">
        <div className="mini-map-island">
          {MODULES.map(m => (
            <div key={m.id} className={`mini-map-dot ${visited.has(m.id) ? 'active' : ''}`} style={{ left: `${(m.pos[0] + 40) / 80 * 100}%`, top: `${(m.pos[2] + 40) / 80 * 100}%` }} />
          ))}
        </div>
      </div>

      <Canvas className="journey-map-canvas" shadows camera={{ fov: 45, position: [0, 50, 20] }}>
        <PerspectiveCamera makeDefault />
        <OrbitControls
          enablePan={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={70}
          enableDamping={true}
          dampingFactor={0.06}
        />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 30, 20]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {selectedModule && (
          <pointLight
            position={[selectedModule.pos[0], 5, selectedModule.pos[2]]}
            color={selectedModule.color}
            intensity={5}
            distance={25}
          />
        )}

        <Suspense fallback={
          <Html center><div className="map-loading map-ink-title">Unrolling Map...</div></Html>
        }>
          <MapSurface />
          <DashedTrail />
          <Weather />
          <NauticalCursor />

          {/* Feature 3: Grounded Shadows */}
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.4}
            scale={80}
            blur={2.4}
            far={10}
            color="#3e2723"
          />

          {/* Main Landmarks - Island Map Icons */}
          <ScholarIsland position={[-12, 0, 15]} label="Starting Shore" isHovered={hoveredId === 'about'} />
          <TechRobot position={[-6, 0, 6]} label="Tech Jungle" isHovered={hoveredId === 'stack'} />
          <RealisticPirateShip position={[-16, 0, -4]} isHovered={hoveredId === 'exp'} />
          <FrightfulFalls position={[-4, 0, -10]} isHovered={hoveredId === 'projects'} />
          <TechRobot position={[6, 0, -12]} label="Crystal Caves" isHovered={hoveredId === 'skills'} />
          <MountainRange position={[16, 0, -5]} isHovered={hoveredId === 'certs'} />
          <ScholarIsland position={[10, 0, 5]} label="Zen Island" isHovered={hoveredId === 'hobbies'} />
          <Desert position={[5, 0, 15]} label="Victory Valley" isHovered={hoveredId === 'awards'} />
          <SnowyPeaks position={[18, 0, 18]} isHovered={hoveredId === 'cont'} />
          <SecretChest position={[-25, 0, 25]} isHovered={hoveredId === 'secret'} />

          <CameraController target={selected?.pos} />

          {MODULES.map(module => (
            <TreasurePin
              key={module.id}
              module={module}
              active={selected?.id === module.id}
              isVisited={visited.has(module.id)}
              onClick={handleSelect}
            />
          ))}
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} intensity={1.2} radius={0.5} />
          <Noise opacity={0.08} />
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
        </EffectComposer>
      </Canvas>

      <div className="journey-nav-top">
        <motion.div
  className="journey-title map-ink-text"
  initial={{ opacity: 0, y: -40, scale: 0.9 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <span className="elite-highlight">'R'</span>
  <span className="elite-text"> ELITE UNIVERSE</span>
</motion.div>
        <motion.button className="btn-seal map-wax-seal" onClick={onClose} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
          <FiX />
        </motion.button>
      </div>

      <AnimatePresence>
        {selectedModule && (
          <motion.div className="captains-log-overlay" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}>
            <div className="log-stamp">⚓ LOG ENTRY</div>
            <div className="log-text">"We have arrived at {selectedModule.label}. The air is thick with {selectedModule.id === 'about' ? 'history' : 'innovation'}..."</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="journey-menu-glass map-parchment-menu">
        <div className="menu-header map-ink-title">🧭 MAP LEGEND</div>
        {MODULES.map((module) => (
          <motion.div
            key={module.id}
            className={`map-legend-item ${selected?.id === module.id ? 'active' : ''} ${visited.has(module.id) ? 'conquered' : ''}`}
            onClick={() => handleSelect(module)}
            onMouseEnter={() => setHoveredId(module.id)}
            onMouseLeave={() => setHoveredId(null)}
            whileHover={{ x: 15 }}
          >
            <div className="map-marker-num" style={{ background: visited.has(module.id) ? '#b71c1c' : '#5d4037' }}>{module.num}</div>
            <div className="label-text map-ink-text"><span className="module-icon">{module.icon}</span>{module.label}</div>
            {visited.has(module.id) && <FiMapPin className="award-icon red-ink" />}
          </motion.div>
        ))}
      </div>

      {/* Discovery Percentage Banner */}
      <div className="map-progress-banner">
        <div className="discovery-label">🗺️ DISCOVERY PROGRESS</div>
        <div className="discovery-bar-bg">
          <div className="discovery-bar-fill" style={{ width: `${(visited.size / MODULES.length) * 100}%` }}></div>
        </div>
        <div className="discovery-count">{visited.size} / {MODULES.length} CHESTS FOUND</div>
      </div>

      {/* --- ANCIENT UNROLLING SCRIPT UI --- */}
      <AnimatePresence>
        {selectedModule && (
          <div className="scroll-unroll-container">
            <motion.div
              className="ancient-scroll-paper"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {/* Left and right wooden rollers */}
              <div className="scroll-roller left" />
              <div className="scroll-roller right" />

              <div className="ancient-scroll-inner">
                <button className="ancient-close-btn" onClick={() => setSelected(null)}>
                  <FiX />
                </button>
                <div className="drop-cap-wrapper">
                  {selectedModule.scrollContent}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
