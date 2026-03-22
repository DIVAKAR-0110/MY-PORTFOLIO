// src/components/AncientGlobe.jsx
import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

function InteractiveEarthMesh({ setHovered }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const pinsRef = useRef([]);
  const [clickedLocation, setClickedLocation] = useState(null);

  // ✅ Stable color (prevents re-creation every render)
  const specularColor = useMemo(() => new THREE.Color(0x333333), []);

  // ✅ Load textures safely
  const [earthMap, earthBump, earthSpec, cloudMap] = useLoader(
    THREE.TextureLoader,
    [
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png",
    ]
  );

  // 🌍 Animation loop
  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.02;
      earthRef.current.rotation.x = mouse.y * 0.3;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * 0.025;
    }

    // Animate pins
    pinsRef.current.forEach((pin, i) => {
      if (pin) {
        pin.scale.setScalar(1 + Math.sin(t * 3 + i) * 0.3);
        pin.rotation.y += 0.02;
      }
    });
  });

  // 🖱️ Click on globe
  const onGlobeClick = (event) => {
    event.stopPropagation();
    const point = event.point.clone().normalize();

    if (earthRef.current) {
      earthRef.current.rotation.x = Math.asin(point.y);
      earthRef.current.rotation.y = Math.atan2(point.z, point.x);
    }

    setClickedLocation({
      lat: (Math.asin(point.y) * 180) / Math.PI,
      lon: (Math.atan2(point.z, point.x) * 180) / Math.PI,
    });
  };

  // 📍 Locations
  const locations = [
    { name: "New York", lat: 40.7, lon: -74.0, color: "#FF4444" },
    { name: "London", lat: 51.5, lon: -0.1, color: "#44FF44" },
    { name: "Tokyo", lat: 35.7, lon: 139.7, color: "#4444FF" },
    { name: "Mumbai", lat: 19.1, lon: 72.9, color: "#FF44FF" },
    { name: "Sydney", lat: -33.9, lon: 151.2, color: "#FFFF44" },
  ];

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 🌍 Earth */}
      <Sphere ref={earthRef} args={[1.4, 128, 128]} onClick={onGlobeClick}>
        <meshPhongMaterial
          map={earthMap}
          bumpMap={earthBump}
          bumpScale={0.04}
          specularMap={earthSpec}
          specular={specularColor}
          shininess={12}
        />
      </Sphere>

      {/* ☁️ Clouds */}
      <Sphere ref={cloudsRef} args={[1.43, 128, 128]}>
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </Sphere>

      {/* 🌌 Atmosphere */}
      <Sphere args={[1.58, 64, 64]}>
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* 📍 Pins */}
      {locations.map((loc, i) => {
        const phi = (90 - loc.lat) * (Math.PI / 180);
        const theta = (loc.lon + 180) * (Math.PI / 180);

        const x = -1.45 * Math.sin(phi) * Math.cos(theta);
        const y = 1.45 * Math.cos(phi);
        const z = 1.45 * Math.sin(phi) * Math.sin(theta);

        return (
          <group
            key={i}
            ref={(el) => (pinsRef.current[i] = el)}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              setClickedLocation(loc);
            }}
          >
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
              <meshBasicMaterial color={loc.color} />
            </mesh>

            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshBasicMaterial color={loc.color} />
            </mesh>
          </group>
        );
      })}

      {/* 📝 Info */}
      {clickedLocation && (
        <Text position={[0, 0, 2]} fontSize={0.2} color="white">
          {clickedLocation.name ||
            `Lat: ${clickedLocation.lat.toFixed(
              1
            )}, Lon: ${clickedLocation.lon.toFixed(1)}`}
        </Text>
      )}
    </group>
  );
}

// 🔄 Fallback
function GlobeFallback() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <Sphere args={[1.4, 64, 64]}>
        <meshStandardMaterial color="#D4A55A" />
      </Sphere>
    </group>
  );
}

// 🌍 Main Component
export default function AncientGlobe() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative w-full h-[500px] group">


      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        dpr={[1, 1.5]} // ✅ safer for GPU
        gl={{ antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={2} />

        <Stars />

        <Suspense fallback={<GlobeFallback />}>
          <InteractiveEarthMesh setHovered={setHovered} />
        </Suspense>

        <OrbitControls enableZoom enableDamping />
      </Canvas>
    </div>
  );
}