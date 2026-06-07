"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DragControls, stepDrag, useDrag, type DragRef } from "./drag3d";

/**
 * Real-time 3D pillar icons — transparent canvas, chrome PBR with
 * RoomEnvironment reflections, global mouse-orbit AND grab-to-spin (drag, which
 * always settles back to the home pose). Shapes match each pillar:
 *   play  → Content & animation (a "play" wedge)
 *   touch → interactive apps (a touchscreen with a live touch ripple)
 *   rack  → multimedia systems (a media-server rack case: server/router/UPS/drawer)
 * Canvases lazy-mount AND pause (frameloop) when off-screen.
 */
export type IconShape = "play" | "touch" | "rack";

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
  const ripple = useRef<THREE.Mesh>(null);
  const chrome = useChrome();
  const play = usePlayGeometry();
  const glow = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#6b79ff"),
        toneMapped: false,
        transparent: true,
      }),
    [],
  );
  const screen = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#9aa6ff"),
        toneMapped: false,
      }),
    [],
  );
  const rippleMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#8b9bff"),
        toneMapped: false,
        transparent: true,
      }),
    [],
  );
  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0b0b14"),
        metalness: 0.5,
        roughness: 0.3,
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
    const ease = 1 - Math.pow(1 - Math.min(1, (t - t0.current) / 1.1), 3);

    g.scale.setScalar(1.15 * ease);
    stepDrag(drag);
    e.current.x += (pointer.current.tx - e.current.x) * 0.06;
    e.current.y += (pointer.current.ty - e.current.y) * 0.06;
    // sway around home (no endless spin) so a fling always returns home
    g.rotation.y =
      (1 - ease) * -Math.PI * 0.5 +
      e.current.x * 0.5 +
      Math.sin(t * 0.32) * 0.14 +
      drag.current.ry;
    g.rotation.x =
      -e.current.y * 0.3 + Math.sin(t * 0.5) * 0.05 + drag.current.rx;
    g.position.y = Math.sin(t * 0.8) * 0.06;

    // touch ripple loop
    if (ripple.current) {
      const ph = (t % 1.7) / 1.7;
      const sc = 0.12 + ph * 0.62;
      ripple.current.scale.set(sc, sc, 1);
      rippleMat.opacity = (1 - ph) * 0.85;
    }
    glow.opacity = 0.6 + 0.4 * Math.sin(t * 3);
  });

  return (
    <group ref={group} scale={0.001}>
      {shape === "play" && <mesh geometry={play} material={chrome} />}

      {shape === "touch" && (
        <group>
          <mesh material={chrome}>
            <boxGeometry args={[1.28, 1.5, 0.12]} />
          </mesh>
          <mesh material={glass} position={[0, 0, 0.065]}>
            <planeGeometry args={[1.08, 1.3]} />
          </mesh>
          <mesh ref={ripple} material={rippleMat} position={[0, 0, 0.08]}>
            <torusGeometry args={[0.5, 0.05, 12, 48]} />
          </mesh>
          <mesh material={glow} position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
        </group>
      )}

      {shape === "rack" && (
        <group>
          {/* case body + dark front recess */}
          <mesh material={chrome}>
            <boxGeometry args={[1.06, 1.56, 0.55]} />
          </mesh>
          <mesh material={glass} position={[0, 0, 0.276]}>
            <boxGeometry args={[0.94, 1.44, 0.03]} />
          </mesh>

          {/* media server */}
          <group position={[0, 0.53, 0.3]}>
            <mesh material={chrome}>
              <boxGeometry args={[0.88, 0.3, 0.05]} />
            </mesh>
            <mesh material={screen} position={[-0.22, 0, 0.03]}>
              <boxGeometry args={[0.28, 0.16, 0.01]} />
            </mesh>
            <mesh material={glow} position={[0.16, 0.05, 0.03]}>
              <boxGeometry args={[0.05, 0.05, 0.01]} />
            </mesh>
            <mesh material={glow} position={[0.28, 0.05, 0.03]}>
              <boxGeometry args={[0.05, 0.05, 0.01]} />
            </mesh>
          </group>

          {/* router (port LEDs) */}
          <group position={[0, 0.18, 0.3]}>
            <mesh material={chrome}>
              <boxGeometry args={[0.88, 0.3, 0.05]} />
            </mesh>
            {[-0.3, -0.18, -0.06, 0.06, 0.18, 0.3].map((x) => (
              <mesh key={x} material={glow} position={[x, 0, 0.03]}>
                <boxGeometry args={[0.05, 0.11, 0.01]} />
              </mesh>
            ))}
          </group>

          {/* UPS (indicator bar + status light) */}
          <group position={[0, -0.18, 0.3]}>
            <mesh material={chrome}>
              <boxGeometry args={[0.88, 0.3, 0.05]} />
            </mesh>
            <mesh material={glow} position={[-0.12, 0, 0.03]}>
              <boxGeometry args={[0.42, 0.07, 0.01]} />
            </mesh>
            <mesh material={screen} position={[0.27, 0, 0.03]}>
              <circleGeometry args={[0.07, 18]} />
            </mesh>
          </group>

          {/* drawer (handle) */}
          <group position={[0, -0.54, 0.3]}>
            <mesh material={chrome}>
              <boxGeometry args={[0.88, 0.3, 0.05]} />
            </mesh>
            <mesh material={chrome} position={[0, 0, 0.05]}>
              <boxGeometry args={[0.44, 0.06, 0.06]} />
            </mesh>
          </group>
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
