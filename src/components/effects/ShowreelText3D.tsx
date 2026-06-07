"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { DragControls, stepDrag, useDrag, type DragRef } from "./drag3d";

/**
 * CONTENT · TECHNOLOGY · SPACE as real 3D extruded chrome text (WebGL) — with
 * RoomEnvironment reflections, an intro grow/spin, gentle auto-rotation, global
 * mouse-orbit and grab-to-spin (drag). Pauses when off-screen.
 *
 * Uses a bundled bold typeface; swap to the brand "Refrigerator" face once it's
 * available as TTF/OTF (it ships only as woff2 today).
 */
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";
const TEXT = "CONTENT    TECHNOLOGY    SPACE";

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

function Words({ pointer, drag }: { pointer: Pointer; drag: DragRef }) {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const e = useRef({ x: 0, y: 0 });
  const t0 = useRef<number | null>(null);

  const font = useLoader(FontLoader, FONT_URL);

  const { geo, width, height } = useMemo(() => {
    const g = new TextGeometry(TEXT, {
      font,
      size: 1,
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.03,
      bevelSegments: 5,
      curveSegments: 10,
    });
    g.computeBoundingBox();
    g.center();
    const bb = g.boundingBox!;
    return {
      geo: g,
      width: bb.max.x - bb.min.x,
      height: bb.max.y - bb.min.y,
    };
  }, [font]);

  // hyperrealistic chrome: sharp reflections + a clearcoat gloss
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eef1f7"),
        metalness: 1,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.6,
      }),
    [],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (t0.current === null) t0.current = t;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - t0.current) / 1.3), 3);

    // fit the full width of the screen without clipping, then 30% smaller
    const s =
      Math.min((viewport.width * 0.96) / width, (viewport.height * 0.72) / height) *
      0.7 *
      ease;
    g.scale.setScalar(s);

    stepDrag(drag);
    e.current.x += (pointer.current.tx - e.current.x) * 0.05;
    e.current.y += (pointer.current.ty - e.current.y) * 0.05;
    g.rotation.y =
      (1 - ease) * -0.5 + e.current.x * 0.22 + Math.sin(t * 0.3) * 0.1 + drag.current.ry;
    g.rotation.x = -e.current.y * 0.12 + drag.current.rx;
    g.position.y = Math.sin(t * 0.7) * 0.03;
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} material={mat} />
    </group>
  );
}

function Scene({ pointer, drag }: { pointer: Pointer; drag: DragRef }) {
  return (
    <>
      <StudioEnv />
      <DragControls drag={drag} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-5, -1, 2]} intensity={0.7} color="#b06bff" />
      <pointLight position={[0, 1, 5]} intensity={1.2} color="#9aa6ff" />
      <Suspense fallback={null}>
        <Words pointer={pointer} drag={drag} />
      </Suspense>
    </>
  );
}

export function ShowreelText3D() {
  const pointer = usePointer();
  const drag = useDrag();
  const holder = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setActive(entries[0].isIntersecting),
      { rootMargin: "150px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={holder}
      className="relative h-[16svh] w-full sm:h-[20svh]"
      aria-label="Content · Technology · Space"
    >
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 35 }}
      >
        <Scene pointer={pointer} drag={drag} />
      </Canvas>
    </div>
  );
}

export default ShowreelText3D;
