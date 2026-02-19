import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatingPlanet({ mobileOptimized }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;

    // 🧠 Slow animation = less CPU
    ref.current.rotation.y += 0.005 * delta;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 10) * 0.03;
  });

  return (
    <mesh ref={ref} position={[1.6, 0.4, -3]}>
      {/* 🔥 Reduce geometry complexity */}
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color={mobileOptimized ? "#777" : "#999"}
        metalness={0.2}
        roughness={0.7}
      />
    </mesh>
  );
}

function MovingLight() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    // 🧠 Slower movement
    const t = clock.getElapsedTime() * 0.3;
    ref.current.position.x = Math.sin(t) * 4;
    ref.current.position.z = Math.cos(t) * 4;
  });

  return <pointLight ref={ref} intensity={1.2} color="#ff7a18" />;
}

export default function GalaxyCanvas({ maxStars = 120, mobileOptimized = false }) {
  const starsCount = mobileOptimized ? 40 : maxStars;

  return (
    <div className="absolute inset-0 -z-20">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        
        // 🔥 HUGE PERFORMANCE BOOST
        frameloop="demand"

        gl={{
          powerPreference: "low-power",
          antialias: false,
        }}
      >
        <color attach="background" args={["#020203"]} />

        <ambientLight intensity={0.25} />
        <MovingLight />

        <Suspense fallback={null}>
          <Stars
            radius={120}
            depth={30}
            count={starsCount}
            factor={1}
            saturation={0}
            fade
          />
          <FloatingPlanet mobileOptimized={mobileOptimized} />
        </Suspense>
      </Canvas>
    </div>
  );
}