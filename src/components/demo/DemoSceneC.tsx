"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshDistortMaterial,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { useMouseRef, type MouseRef } from "@/components/demo/demoCommon";

function GlassBox({
  position,
  size,
  factor,
  mouse,
}: {
  position: [number, number, number];
  size: [number, number, number];
  factor: number;
  mouse: MouseRef;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.x = t * 0.12 + position[1];
    ref.current.rotation.y = t * 0.18 + position[0];
    ref.current.position.x = position[0] + mouse.current.x * factor;
    ref.current.position.y =
      position[1] - mouse.current.y * factor + Math.sin(t * 0.6 + position[0]) * 0.12;
  });
  return (
    <group ref={ref} position={position}>
      <RoundedBox args={size} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          transparent
          transmission={0.96}
          thickness={1.2}
          roughness={0.06}
          ior={1.35}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#ffffff"
        />
      </RoundedBox>
    </group>
  );
}

function Blob({ mouse }: { mouse: MouseRef }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.y = t * 0.2;
    ref.current.position.x = -1.8 + mouse.current.x * 0.6;
    ref.current.position.y = 0.4 - mouse.current.y * 0.5 + Math.sin(t * 0.5) * 0.1;
  });
  return (
    <mesh ref={ref} position={[-1.8, 0.4, 0.6]}>
      <sphereGeometry args={[0.75, 64, 64]} />
      <MeshDistortMaterial
        color="#c77dff"
        transparent
        opacity={0.9}
        distort={0.38}
        speed={1.6}
        roughness={0.12}
        metalness={0.1}
      />
    </mesh>
  );
}

export function DemoSceneC() {
  const mouse = useMouseRef();
  return (
    <Canvas
      className="!fixed inset-0 !pointer-events-none"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 6, 4]} intensity={2} />
      <Environment resolution={64}>
        <Lightformer position={[0, 3, 3]} scale={6} intensity={2} color="#ffffff" />
        <Lightformer position={[-3, 1, 2]} scale={4} intensity={1.3} color="#dfe6ff" />
        <Lightformer position={[3, -1, 2]} scale={4} intensity={1.1} color="#ffe0ef" />
      </Environment>

      <Blob mouse={mouse} />
      <GlassBox position={[1.8, 0.7, 0]} size={[0.95, 0.95, 0.95]} factor={0.4} mouse={mouse} />
      <GlassBox position={[-2.0, -1.0, 0.4]} size={[1.3, 0.5, 0.5]} factor={0.6} mouse={mouse} />
      <GlassBox position={[1.3, -1.2, 0.6]} size={[0.6, 0.6, 0.6]} factor={0.5} mouse={mouse} />

      <ContactShadows
        position={[0, -2.3, 0]}
        opacity={0.22}
        scale={14}
        blur={3}
        far={4.5}
        color="#5b5b80"
      />
    </Canvas>
  );
}
