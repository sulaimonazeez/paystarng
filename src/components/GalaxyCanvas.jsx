import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function FloatingPlanet() {
const ref = useRef();
const [texture, setTexture] = useState(null);

useEffect(() => {
const loader = new THREE.TextureLoader();
loader.load(
"/planet.jpg",
(loadedTexture) => setTexture(loadedTexture), // success
undefined,
(err) => {
console.warn("Planet texture failed to load, using fallback color", err);
setTexture(null); // fallback
}
);
}, []);

useFrame((state, delta) => {
if (!ref.current) return;
ref.current.rotation.y += 0.02 * delta;
ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 8) * 0.05;
});

return (
<mesh ref={ref} position={[1.8, 0.6, -3]}>
<sphereGeometry args={[1.05, 64, 64]} />
<meshStandardMaterial
map={texture || null} // use texture if loaded
color={texture ? undefined : "#888888"} // fallback gray
metalness={0.4}
roughness={0.6}
/>
</mesh>
);
}

function MovingLight() {
const ref = useRef();
useFrame(({ clock }) => {
const t = clock.getElapsedTime();
if (!ref.current) return;
ref.current.position.x = Math.sin(t * 0.6) * 5;
ref.current.position.z = Math.cos(t * 0.6) * 5;
});
return <pointLight ref={ref} intensity={1.6} color="#ff7a18" />;
}

export default function GalaxyCanvas() {
return (
<div className="absolute inset-0 -z-20">
<Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
<color attach="background" args={["#020203"]} />
<ambientLight intensity={0.3} />
<MovingLight />
<Suspense fallback={null}>
<Stars radius={200} depth={60} count={2000} factor={2} saturation={0} fade />
<FloatingPlanet />
</Suspense>
<OrbitControls
enableZoom={false}
enablePan={false}
minPolarAngle={Math.PI / 3}
maxPolarAngle={Math.PI / 1.9}
autoRotate
autoRotateSpeed={0.02}
/>
</Canvas>
</div>
);
}

