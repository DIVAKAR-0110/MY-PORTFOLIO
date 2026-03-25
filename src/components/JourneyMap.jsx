// src/components/JourneyMap.jsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html, Text, Line, Float } from "@react-three/drei";
import { useState, useRef, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./JourneyMap.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMapPin } from "react-icons/fi";

const MODULES = [
  {
    id: "about", num: 1, label: "The Scholar", icon: "📚", pos: [-12, 0.5, 8], color: "#b71c1c",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🎓 The Scholar’s Origins</h3>
        <p className="script-paragraph">In the year of 2023, the quest began at the great halls of CIT Coimbatore. A specialized focus in AI/ML and Fullstack sorcery guided the path to a 7.92 CGPA in M.Sc. Software Systems.</p>
        <ul className="script-list">
          <li>Master of Science (Software Systems) — 2023-2025.</li>
          <li>Residing in the coastal lands of Chennai, Tamil Nadu.</li>
          <li>Devoted to crafting logic and breathing life into UI.</li>
        </ul>
      </div>
    )
  },
  {
    id: "stack", num: 2, label: "Tech Arsenal", icon: "💻", pos: [-4, 0.5, 3], color: "#c62828",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🛠️ The Armory of Codes</h3>
        <p className="script-paragraph">A traveler must be equipped with the sharpest of tools to survive the digital ocean. The arsenal includes front-end mastery and back-end fortresses.</p>
        <div className="rune-grid">
          <span>React & Next.js</span><span>Spring Boot</span><span>Django Python</span>
          <span>TensorFlow AI</span><span>Three.js 3D</span><span>Tailwind CSS</span>
          <span>PostgreSQL</span><span>Docker Containers</span>
        </div>
      </div>
    )
  },
  {
    id: "projects", num: 3, label: "Epic Projects", icon: "⭐", pos: [2, 0.5, -4], color: "#d32f2f",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🚀 Monuments Built</h3>
        <p className="script-paragraph">Great monuments were erected using the tech arsenal. Each structure pushed the boundaries of modern engineering and design.</p>
        <div className="script-project">
          <h4>🌐 The Ancient Orb Portfolio</h4>
          <p>A magical 3D experience blending React Three Fiber with Framer Motion.</p>
        </div>
        <div className="script-project">
          <h4>⚙️ The ERP Dashboard Citadel</h4>
          <p>A towering administrative fortress built on Spring Boot & PostgreSQL.</p>
        </div>
        <div className="script-project">
          <h4>🤖 AI Sentinel Complaint System</h4>
          <p>A cognitive network filtering citizen grievances using Django and TensorFlow.</p>
        </div>
      </div>
    )
  },
  {
    id: "certs", num: 4, label: "Certifications", icon: "🏆", pos: [9, 0.5, -10], color: "#e53935",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">📜 Scrolls of Mastery</h3>
        <p className="script-paragraph">The masters of the realm bestowed these certificates upon completing arduous trials of knowledge.</p>
        <ul className="script-list">
          <li>IBM AI Engineering Professional Certificate</li>
          <li>Master of the MERN Stack</li>
          <li>AWS Cloud Practitioner Ascension</li>
          <li>Google TensorFlow Developer Recognition</li>
        </ul>
      </div>
    )
  },
  {
    id: "awards", num: 5, label: "Triumphs", icon: "🎖️", pos: [16, 0.5, -16], color: "#f44336",
    scrollContent: (
      <div className="ancient-script-content">
        <h3 className="script-title">🏅 Triumphs in Battle</h3>
        <p className="script-paragraph">Songs are sung across the lands of these great victories in the arenas of logic and speed.</p>
        <ul className="script-list">
          <li>🥇 Victor of the 2025 Grand Hackathon</li>
          <li>⭐ Crowned GitHub Star Developer</li>
          <li>⚡ Ascended to LeetCode Top 2% Rankings</li>
          <li>🎓 Acknowledged in Published Research Archives</li>
        </ul>
      </div>
    )
  }
];

// --- ENHANCED 3D TOPOGRAPHY COMPONENTS & ORIGINAL LOADERS ---

function SafeModel({ path, fallback, scale = 1, position, rotation = [0,0,0] }) {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        gltf.scene.traverse((node) => {
          if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
        });
        setModel(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn(`Original Model not found at ${path}, using enhanced visual fallback.`);
        setError(true);
      }
    );
  }, [path]);

  if (error || !model) {
    return <group position={position} rotation={rotation} scale={scale}>{fallback()}</group>;
  }
  return <primitive object={model} position={position} rotation={rotation} scale={scale} />;
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
          p.position.y = 0; p.scale.set(1,1,1); p.material.opacity = 0.6;
        }
      });
    }
  });
  return (
    <group ref={particles} position={[0, 9, 0]}>
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[(Math.random()-0.5)*2, Math.random()*5, (Math.random()-0.5)*2]}>
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
        <mesh key={i} position={[(Math.random()-0.5)*12, Math.random()*5, (Math.random()-0.5)*12]}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshBasicMaterial color="#b2ff59" />
          <pointLight color="#b2ff59" intensity={0.5} distance={2} />
        </mesh>
      ))}
    </group>
  );
}

function PalmTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.1, 0.2, 2, 6]} /><meshLambertMaterial color="#5d4037" /></mesh>
      <group position={[0.4, 2, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2.5, (i * Math.PI * 2) / 5, 0]}>
            <sphereGeometry args={[0.4, 8, 4]} /><meshLambertMaterial color="#2e7d32" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function MountainRange({ position }) {
  const fallback = () => (
    <group>
      <mesh position={[0, 4, 0]} castShadow><coneGeometry args={[4, 8, 5]} /><meshLambertMaterial color="#4e342e" /></mesh>
      <mesh position={[0, 6.5, 0]} castShadow><coneGeometry args={[1.5, 3, 5]} /><meshLambertMaterial color="#e0e0e0" /></mesh>
      <mesh position={[-3, 2.5, 2]} rotation={[0.1, 0, -0.2]} castShadow><coneGeometry args={[3, 5, 4]} /><meshLambertMaterial color="#3e2723" /></mesh>
      <mesh position={[3, 3, -1]} rotation={[-0.1, 0.5, 0.1]} castShadow><coneGeometry args={[3.5, 6, 6]} /><meshLambertMaterial color="#5d4037" /></mesh>
      <VolcanoSmoke />
      <Text position={[0, 12, 0]} fontSize={0.8} color="#d84315" anchorX="center" rotation={[0, -Math.PI/4, 0]}>Victory Volcano</Text>
    </group>
  );
  return <SafeModel path="/models/volcano.glb" position={position} fallback={fallback} scale={2} />;
}

function Desert({ position }) {
  const fallback = () => (
    <group>
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><sphereGeometry args={[6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} /><meshLambertMaterial color="#fbc02d" /></mesh>
      <mesh position={[4, 0.3, -3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><sphereGeometry args={[4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} /><meshLambertMaterial color="#f57f17" /></mesh>
      <group position={[2, 1.5, 1]}>
        <mesh castShadow><cylinderGeometry args={[0.2, 0.2, 3, 8]} /><meshLambertMaterial color="#1b5e20" /></mesh>
        <mesh position={[0.5, 0.2, 0]} rotation={[0,0,-Math.PI/2]} castShadow><cylinderGeometry args={[0.15, 0.15, 1, 8]} /><meshLambertMaterial color="#1b5e20" /></mesh>
      </group>
      <Text position={[0, 4.5, 0]} fontSize={0.8} color="#e65100" anchorX="center" rotation={[0, -Math.PI/4, 0]}>Dry Gulch Desert</Text>
    </group>
  );
  return <SafeModel path="/models/desert.glb" position={position} fallback={fallback} scale={1.5} />;
}

function HauntedForest({ position }) {
  const fallback = () => (
    <group>
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[(Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6]}>
          <mesh position={[0, 1.5, 0]} rotation={[0, 0, (Math.random()-0.5)*0.3]}><cylinderGeometry args={[0.1, 0.3, 3, 5]} /><meshLambertMaterial color="#261b17" /></mesh>
          <mesh position={[0, 3.2, 0]} rotation={[(Math.random()-0.5), Math.random() * Math.PI, (Math.random()-0.5)]} castShadow><coneGeometry args={[1.2, 2.5, 4]} /><meshLambertMaterial color="#0d2b10" opacity={0.9} transparent /></mesh>
        </group>
      ))}
      <Fireflies />
      <Text position={[0, 6, 0]} fontSize={0.8} color="#1b5e20" anchorX="center" rotation={[0, -Math.PI/4, 0]}>Haunted Forest</Text>
    </group>
  );
  return <SafeModel path="/models/forest.glb" position={position} fallback={fallback} scale={1.5} />;
}

function RealisticPirateShip({ position }) {
  const fallback = () => {
    const shipRef = useRef();
    useFrame((state) => {
      if (shipRef.current) {
        shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
        shipRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    });
    return (
      <group>
        <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[6, 32]} /><meshLambertMaterial color="#0277bd" transparent opacity={0.8} /></mesh>
        <group ref={shipRef} position={[-1, 0.5, 1]} rotation={[0, -Math.PI/6, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[1, 0.6, 3, 8, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI/2]} /><meshLambertMaterial color="#212121" /></mesh>
          <mesh position={[-1.8, 1.2, 0]} rotation={[0, 0, Math.PI/4]} castShadow><cylinderGeometry args={[0.05, 0.1, 1.5]} /><meshLambertMaterial color="#000000" /></mesh>
          <mesh position={[-0.2, 2, 0]} castShadow><cylinderGeometry args={[0.08, 0.1, 4]} /><meshLambertMaterial color="#000000" /></mesh>
          <mesh position={[-0.1, 1.5, 0]} rotation={[0, Math.PI/2, 0]} castShadow><cylinderGeometry args={[1, 1, 1.5, 16, 1, true, 0, Math.PI/1.5]} /><meshLambertMaterial color="#1a1a1a" side={THREE.DoubleSide} /></mesh>
          <mesh position={[-0.2, 4.2, 0.3]} rotation={[0, Math.PI/2, 0]}><planeGeometry args={[0.6, 0.4]} /><meshLambertMaterial color="#b71c1c" side={THREE.DoubleSide} /></mesh>
        </group>
        <PalmTree position={[3, 0, -3]} scale={1.5} />
        <PalmTree position={[4, 0, -1]} scale={1.2} />
        <Text position={[0, 5, -2]} fontSize={0.8} color="#000000" anchorX="center" rotation={[0, -Math.PI/4, 0]}>Pirate's Cove</Text>
      </group>
    );
  };
  return <SafeModel path="/models/ship.glb" position={position} fallback={fallback} scale={2} rotation={[0, Math.PI/6, 0]} />;
}

function FrightfulFalls() {
  const fallback = () => (
    <group position={[3, 0, -6]}>
      <mesh position={[0, 2, 0]} castShadow><boxGeometry args={[5, 4, 3]} /><meshLambertMaterial color="#4e342e" /></mesh>
      <mesh position={[0, 2, 1.6]}><planeGeometry args={[2.5, 4.2]} /><meshBasicMaterial color="#4fc3f7" transparent opacity={0.85} /></mesh>
      <group position={[0, 0.2, 2]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[(Math.random()-0.5)*3, Math.random()*0.5, Math.random()*1]}>
            <sphereGeometry args={[0.2, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.15, 8]} rotation={[-Math.PI / 2, 0, Math.PI/12]} receiveShadow><planeGeometry args={[2, 16]} /><meshBasicMaterial color="#0288d1" transparent opacity={0.7} /></mesh>
      <Text position={[0, 5, 0]} fontSize={0.8} color="#0288d1" anchorX="center" rotation={[0, -Math.PI/4, 0]}>Frightful Falls</Text>
    </group>
  );
  return <SafeModel path="/models/waterfall.glb" position={[0,0,0]} fallback={fallback} scale={1.5} />;
}

// --- CORE MAP ---

function MapSurface() {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const ctx = c.getContext('2d');
    
    // Ancient dirty parchment background
    ctx.fillStyle = '#f4e4bc'; 
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add grit and age
    for(let i=0; i<300; i++) {
        ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.05})`;
        ctx.beginPath();
        ctx.arc(Math.random()*1024, Math.random()*1024, Math.random()*40, 0, Math.PI*2);
        ctx.fill();
    }
    
    // Burnt edges
    const grad1 = ctx.createRadialGradient(512, 512, 200, 512, 512, 750);
    grad1.addColorStop(0, "rgba(139, 69, 19, 0)");
    grad1.addColorStop(0.8, "rgba(93, 64, 55, 0.4)");
    grad1.addColorStop(1, "rgba(62, 39, 35, 0.9)");
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Detailed Compass Rose
    ctx.save();
    ctx.translate(150, 150);
    ctx.strokeStyle = "#5d4037"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, 30); ctx.lineTo(0, 90); ctx.lineTo(-10, 30); ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? "#5d4037" : "#b71c1c";
        ctx.fill();
    }
    ctx.restore();

    return new THREE.CanvasTexture(c);
  }, []);

  const planeGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 50, 60, 50);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // More jagged rough parchment wave
      const z = Math.sin(x * 0.15) * 0.8 + Math.cos(y * 0.15) * 0.8 + Math.sin(x*y*0.05)*0.2;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={planeGeo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshLambertMaterial map={canvas} side={THREE.DoubleSide} />
    </mesh>
  );
}

function DashedTrail() {
  const points = MODULES.map(m => new THREE.Vector3(m.pos[0], 0.6, m.pos[2]));
  const curve = new THREE.CatmullRomCurve3(points);
  const linePoints = curve.getPoints(120);
  
  return (
    <Line
      points={linePoints}
      color="#8e0000"
      lineWidth={5}
      dashed
      dashSize={0.6}
      dashScale={2}
      gapSize={0.6}
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

      <Html position={[0, 2.5, 0]} center>
        <motion.div 
          className={`treasure-marker ${active ? "active" : ""} ${isVisited ? "visited" : ""}`}
          whileHover={{ scale: 1.2 }}
        >
          {module.num}
        </motion.div>
      </Html>
    </group>
  );
}

function CameraController({ target }) {
  useFrame((state) => {
    if (!target) {
      state.camera.position.lerp(new THREE.Vector3(0, 28, 28), 0.03);
      state.camera.lookAt(0, 0, 0); 
      return;
    }
    const desired = new THREE.Vector3(target[0], target[1] + 10, target[2] + 12);
    state.camera.position.lerp(desired, 0.08); 
    state.camera.lookAt(target[0], target[1], target[2]);
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

  return (
    <div className="journey-map-overlay">
      <div className="journey-map-bg document-style" />

      <Canvas className="journey-map-canvas" shadows camera={{ fov: 50, position: [0, 28, 28] }}>
        <PerspectiveCamera makeDefault />
        <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2.2} minDistance={10} maxDistance={40} enableDamping dampingFactor={0.05} />
        
        <ambientLight intensity={0.5} color="#fff1e6" />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffd8a8" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-10, 10, -10]} intensity={0.8} color="#ffcc80" />
        <fog attach="fog" args={["#d7ccc8", 20, 70]} />

        <Suspense fallback={
          <Html center><div className="map-loading map-ink-title">Unrolling Map...</div></Html>
        }>
          <MapSurface />
          <DashedTrail />
          
          <MountainRange position={[12, 0, -12]} />
          <Desert position={[16, 0, -2]} />
          <HauntedForest position={[-5, 0, -2]} />
          <RealisticPirateShip position={[-14, 0, 10]} />
          <FrightfulFalls />

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
      </Canvas>

      <div className="journey-nav-top">
        <motion.div className="journey-title map-ink-text" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          ☠️ DIVAKAR'S TREASURE MAP
        </motion.div>
        <motion.button className="btn-seal map-wax-seal" onClick={onClose} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
          <FiX />
        </motion.button>
      </div>

      <div className="journey-menu-glass map-parchment-menu">
        <div className="menu-header map-ink-title">🧭 MAP LEGEND</div>
        {MODULES.map((module) => (
          <motion.div
            key={module.id}
            className={`map-legend-item ${selected?.id === module.id ? 'active' : ''} ${visited.has(module.id) ? 'conquered' : ''}`}
            onClick={() => handleSelect(module)}
            whileHover={{ x: 10 }}
          >
            <div className="map-marker-num" style={{ background: visited.has(module.id) ? '#b71c1c' : '#5d4037' }}>{module.num}</div>
            <div className="label-text map-ink-text"><span className="module-icon">{module.icon}</span>{module.label}</div>
            {visited.has(module.id) && <FiMapPin className="award-icon red-ink" />}
          </motion.div>
        ))}
      </div>

      <div className="map-progress-banner">
        ⚜️ Chests Discovered: <strong>{visited.size}/{MODULES.length}</strong>
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
                {selectedModule.scrollContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
