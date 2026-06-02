"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

const COUNT = 540;
const SHELL_RADIUS = 1.95;
const MAX_DISPERSION = 1.15;

/** Evenly distributed directions on a sphere (Fibonacci lattice). */
function fibonacciDirections(count: number) {
  const dirs: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    dirs.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r),
    );
  }
  return dirs;
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Per-node base direction + individual scatter weight/scale.
  const nodes = useMemo(() => {
    const dirs = fibonacciDirections(COUNT);
    return dirs.map((dir) => ({
      dir,
      push: 0.4 + Math.random() * 1, // how far it flies out
      scale: 0.4 + Math.random() * 1.1,
      spin: (Math.random() - 0.5) * 2,
    }));
  }, []);

  // Pointer in normalized screen space (-1..1), tracked window-wide so the
  // object reacts even though the canvas itself ignores pointer events.
  const pointer = useRef({ x: 0, y: 0 });
  const dispersion = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const { x, y } = pointer.current;

    // Closeness of cursor to the centre → fragmentation target.
    const dist = Math.min(1, Math.hypot(x, y) / 0.9);
    const target = (1 - dist) * MAX_DISPERSION;
    dispersion.current += (target - dispersion.current) * Math.min(1, d * 5);
    const disp = dispersion.current;

    if (group.current) {
      // Parallax tilt toward the cursor + slow idle spin.
      group.current.rotation.y +=
        (x * 0.5 - group.current.rotation.y) * Math.min(1, d * 2) + d * 0.12;
      group.current.rotation.x += (y * 0.3 - group.current.rotation.x) *
        Math.min(1, d * 2);
    }

    if (shell.current) {
      const t = state.clock.elapsedTime;
      nodes.forEach((n, i) => {
        const radius = SHELL_RADIUS + disp * n.push;
        const wobble = Math.sin(t * 0.8 + i) * 0.04;
        dummy.position
          .copy(n.dir)
          .multiplyScalar(radius + wobble);
        const s = 0.05 * n.scale * (1 + disp * 0.4);
        dummy.scale.setScalar(s);
        dummy.rotation.set(t * n.spin * 0.3, t * n.spin * 0.2, 0);
        dummy.updateMatrix();
        shell.current!.setMatrixAt(i, dummy.matrix);
      });
      shell.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      {/* faceted core — the "control" node */}
      <mesh>
        <icosahedronGeometry args={[1.12, 0]} />
        <meshStandardMaterial
          color="#121119"
          metalness={0.55}
          roughness={0.32}
          emissive="#6b79ff"
          emissiveIntensity={0.12}
        />
        <Edges threshold={12} color="#8a96ff" />
      </mesh>

      {/* inner glow */}
      <mesh scale={0.65}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#6b79ff" transparent opacity={0.06} />
      </mesh>

      {/* node shell */}
      <instancedMesh ref={shell} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#cdd2ff" />
      </instancedMesh>
    </group>
  );
}

export function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 6]} intensity={2.4} />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#6b79ff" />
      <Rig />
    </Canvas>
  );
}
