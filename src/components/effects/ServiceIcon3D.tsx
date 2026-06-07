"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DragControls, stepDrag, useDrag, type DragRef } from "./drag3d";

/**
 * Real-time 3D pillar icons — transparent canvas (no background), chrome PBR
 * with RoomEnvironment reflections, global mouse-orbit AND grab-to-spin (drag).
 * Shapes match each pillar:
 *   play   → Content & animation (a "play" wedge)
 *   gimbal → interactive apps / realtime systems (nested spinning rings)
 *   rack   → multimedia systems (a media server with glowing ports)
 * Canvases lazy-mount AND pause (frameloop) when off-screen to stay light.
 */
export type IconShape = "play" | "gimbal" | "rack";

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

function usePlayGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.42, -0.54);
    s.lineTo(-0.42, 0.54);
    s.lineTo(0.58, 0);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 3,
      curveSegments: 4,
    });
    g.center();
    return g;
  }, []);
}

function IconMesh({
  shape,
  pointer,
  drag,
}: {
  shape: IconShape;
  pointer: Pointer;
  drag: DragRef;
}) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const chrome = useChrome();
  const play = usePlayGeometry();
  const portMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#6b79ff"),
        toneMapped: false,
        transparent: true,
      }),
    [],
  );
  const e = useRef({ x: 0, y: 0 });
  const t0 = useRef<number | null>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (t0.current === null) t0.current = t;
    const p = Math.min(1, (t - t0.current) / 1.1);
    const ease = 1 - Math.pow(1 - p, 3);

    g.scale.setScalar(1.15 * ease);
    stepDrag(drag);
    e.current.x += (pointer.current.tx - e.current.x) * 0.06;
    e.current.y += (pointer.current.ty - e.current.y) * 0.06;
    g.rotation.y =
      (1 - ease) * -Math.PI * 0.5 +
      e.current.x * 0.6 +
      t * 0.16 +
      drag.current.ry;
    g.rotation.x =
      -e.current.y * 0.32 + Math.sin(t * 0.5) * 0.05 + drag.current.rx;
    g.position.y = Math.sin(t * 0.8) * 0.06;

    // per-shape inner motion
    if (ringA.current) ringA.current.rotation.z = t * 0.7;
    if (ringB.current) ringB.current.rotation.x = t * 0.5 + 1;
    if (ringC.current) ringC.current.rotation.y = t * 0.9;
    portMat.opacity = 0.7 + 0.3 * Math.sin(t * 3);
  });

  return (
    <group ref={group} scale={0.001}>
      {shape === "play" && <mesh geometry={play} material={chrome} />}

      {shape === "gimbal" && (
        <>
          <mesh ref={ringA} material={chrome}>
            <torusGeometry args={[0.92, 0.045, 16, 80]} />
          </mesh>
          <mesh ref={ringB} material={chrome} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.68, 0.045, 16, 80]} />
          </mesh>
          <mesh ref={ringC} material={chrome} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.44, 0.045, 16, 80]} />
          </mesh>
          <mesh material={chrome}>
            <icosahedronGeometry args={[0.17, 0]} />
          </mesh>
        </>
      )}

      {shape === "rack" && (
        <group>
          <mesh material={chrome}>
            <boxGeometry args={[1.02, 1.32, 0.52]} />
          </mesh>
          {[0.42, 0.14, -0.14, -0.42].map((y) => (
            <mesh key={y} material={portMat} position={[-0.12, y, 0.27]}>
              <boxGeometry args={[0.56, 0.07, 0.02]} />
            </mesh>
          ))}
          {[0.42, 0.14, -0.14, -0.42].map((y) => (
            <mesh key={`d${y}`} material={portMat} position={[0.32, y, 0.27]}>
              <boxGeometry args={[0.1, 0.07, 0.02]} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function Scene({
  shape,
  pointer,
  drag,
}: {
  shape: IconShape;
  pointer: Pointer;
  drag: DragRef;
}) {
  return (
    <>
      <StudioEnv />
      <DragControls drag={drag} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-5, -1, 2]} intensity={0.7} color="#b06bff" />
      <pointLight position={[0, 1, 5]} intensity={1.2} color="#9aa6ff" />
      <Suspense fallback={null}>
        <IconMesh shape={shape} pointer={pointer} drag={drag} />
      </Suspense>
    </>
  );
}

export function ServiceIcon3D({ shape }: { shape: IconShape }) {
  const pointer = usePointer();
  const drag = useDrag();
  const holder = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[0].isIntersecting;
        setActive(vis);
        if (vis) setShown(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holder} className="relative aspect-[4/3] w-full" aria-hidden>
      {shown && (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.6]}
          frameloop={active ? "always" : "never"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 4], fov: 35 }}
        >
          <Scene shape={shape} pointer={pointer} drag={drag} />
        </Canvas>
      )}
    </div>
  );
}

export default ServiceIcon3D;
