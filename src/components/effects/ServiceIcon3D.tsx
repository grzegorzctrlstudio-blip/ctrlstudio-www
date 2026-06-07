"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Real-time 3D pillar icons — transparent canvas (no background), chrome PBR
 * with RoomEnvironment reflections, and the SAME global mouse-orbit as the hero
 * logo. Each pillar gets a distinct form. Canvases lazy-mount on scroll so we
 * don't hold more WebGL contexts than needed.
 */
export type IconShape = "flow" | "network" | "panels";

/** Global cursor in -1..1 (same mapping as the hero logo). */
function usePointer() {
  const p = useRef({ tx: 0, ty: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      p.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return p;
}
type Pointer = ReturnType<typeof usePointer>;

function StudioEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    return () => {
      env.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function useChrome() {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e7ebf4"),
        metalness: 1,
        roughness: 0.16,
        envMapIntensity: 1.35,
        side: THREE.DoubleSide,
      }),
    [],
  );
}

function IconMesh({ shape, pointer }: { shape: IconShape; pointer: Pointer }) {
  const group = useRef<THREE.Group>(null);
  const chrome = useChrome();
  const e = useRef({ x: 0, y: 0 });
  const t0 = useRef<number | null>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (t0.current === null) t0.current = t;
    const p = Math.min(1, (t - t0.current) / 1.1);
    const ease = 1 - Math.pow(1 - p, 3); // grow + spin in, like the logo

    g.scale.setScalar(1.15 * ease);
    e.current.x += (pointer.current.tx - e.current.x) * 0.06;
    e.current.y += (pointer.current.ty - e.current.y) * 0.06;
    g.rotation.y =
      (1 - ease) * -Math.PI * 0.5 + e.current.x * 0.6 + t * 0.16; // mouse + slow auto-spin
    g.rotation.x = -e.current.y * 0.32 + Math.sin(t * 0.5) * 0.05;
    g.position.y = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group} scale={0.001}>
      {shape === "flow" && (
        <mesh material={chrome}>
          <torusKnotGeometry args={[0.58, 0.2, 220, 32, 2, 3]} />
        </mesh>
      )}

      {shape === "network" && (
        <>
          <mesh material={chrome}>
            <icosahedronGeometry args={[0.62, 1]} />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.98, 1]} />
            <meshBasicMaterial
              wireframe
              color="#6b79ff"
              transparent
              opacity={0.55}
            />
          </mesh>
        </>
      )}

      {shape === "panels" &&
        [-1, 0, 1].map((i) => (
          <mesh
            key={i}
            material={chrome}
            position={[i * 0.12, i * 0.06, i * 0.24]}
            rotation={[0, i * 0.34, 0]}
          >
            <boxGeometry args={[0.86, 1.16, 0.06]} />
          </mesh>
        ))}
    </group>
  );
}

function Scene({ shape, pointer }: { shape: IconShape; pointer: Pointer }) {
  return (
    <>
      <StudioEnv />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-5, -1, 2]} intensity={0.7} color="#b06bff" />
      <pointLight position={[0, 1, 5]} intensity={1.2} color="#9aa6ff" />
      <Suspense fallback={null}>
        <IconMesh shape={shape} pointer={pointer} />
      </Suspense>
    </>
  );
}

export function ServiceIcon3D({ shape }: { shape: IconShape }) {
  const pointer = usePointer();
  const holder = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={holder}
      className="pointer-events-none relative aspect-[4/3] w-full"
      aria-hidden
    >
      {shown && (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 4], fov: 35 }}
        >
          <Scene shape={shape} pointer={pointer} />
        </Canvas>
      )}
    </div>
  );
}

export default ServiceIcon3D;
