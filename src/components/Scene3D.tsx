import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Knot() {
  const ref = useRef<Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * 0.2;
      ref.current.rotation.y += d * 0.15;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.6}>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <MeshDistortMaterial color="#dc2626" roughness={0.15} metalness={0.85} distort={0.32} speed={1.6} />
      </mesh>
    </Float>
  );
}

function Spheres() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-3.2, 1.4, -1]} scale={0.5}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.3} metalness={0.7} />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={1.3} floatIntensity={1.8}>
        <mesh position={[3, -1.2, -1]} scale={0.4}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={1.4}>
        <mesh position={[2.6, 1.8, -2]} scale={0.3}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#dc2626" roughness={0.1} metalness={0.9} />
        </mesh>
      </Float>
    </>
  );
}

export function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -3, -5]} color="#ff3030" intensity={2} />
          <Knot />
          <Spheres />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
