"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import * as THREE from "three";
import { useRouter } from "next/navigation";

export type WorkItem = { slug: string; thumbnail: string; title: string };

/**
 * Infinite, draggable WebGL tile grid (à la yutaabe.com/playground): grab and
 * drag in any direction to pan an endless grid of project covers. The grid
 * wraps (modulo cell math) so it never ends, has flick momentum, and a click
 * (without a drag) opens that project.
 */

const N = 8; // tile columns rendered (covers viewport + margin)
const M = 7; // tile rows rendered

function Grid({ items }: { items: WorkItem[] }) {
  const { viewport, size, gl } = useThree();
  const router = useRouter();

  const urls = useMemo(() => items.map((i) => i.thumbnail), [items]);
  const textures = useLoader(THREE.TextureLoader, urls);
  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = 4;
    });
  }, [textures]);

  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const curIdx = useRef<number[]>([]);

  const offset = useRef({ x: 0, y: 0 }); // accumulated drag, in CSS px
  const vel = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const moved = useRef(0);

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      vel.current = { x: 0, y: 0 };
      moved.current = 0;
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      offset.current.x += dx;
      offset.current.y += dy;
      vel.current = { x: dx, y: dy };
      last.current = { x: e.clientX, y: e.clientY };
      moved.current += Math.abs(dx) + Math.abs(dy);
    };
    const up = () => {
      dragging.current = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  useFrame(() => {
    // flick momentum
    if (!dragging.current) {
      offset.current.x += vel.current.x;
      offset.current.y += vel.current.y;
      vel.current.x *= 0.92;
      vel.current.y *= 0.92;
    }

    const vw = viewport.width;
    const vh = viewport.height;
    const cw = vw / 3.6; // column pitch (~3.6 tiles across)
    const gap = cw * 0.07;
    const tileW = cw - gap;
    const tileH = tileW * 0.75; // 4:3 covers
    const ch = tileH + gap; // row pitch

    // px → world
    const wx = (offset.current.x / size.width) * vw;
    const wy = -(offset.current.y / size.height) * vh;
    const baseAx = Math.round(-wx / cw);
    const baseAy = Math.round(-wy / ch);
    const len = textures.length;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const k = i * M + j;
        const mesh = meshes.current[k];
        if (!mesh) continue;
        const ax = baseAx + i - (N >> 1);
        const ay = baseAy + j - (M >> 1);
        mesh.position.x = ax * cw + wx;
        mesh.position.y = ay * ch + wy;
        mesh.scale.set(tileW, tileH, 1);
        // deterministic, scattered cover per absolute cell
        const idx = (((ax * 73856093) ^ (ay * 19349663)) >>> 0) % len;
        if (curIdx.current[k] !== idx) {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.map = textures[idx];
          mat.needsUpdate = true;
          mesh.userData.slug = items[idx].slug;
          curIdx.current[k] = idx;
        }
      }
    }
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const slug = e.object?.userData?.slug as string | undefined;
    if (moved.current < 8 && slug) {
      e.stopPropagation();
      router.push(`/work/${slug}`);
    }
  };

  return (
    <>
      {Array.from({ length: N * M }).map((_, k) => (
        <mesh
          key={k}
          ref={(el) => {
            meshes.current[k] = el;
          }}
          geometry={geo}
          onClick={onClick}
        >
          <meshBasicMaterial toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

export function WorkGridScene({ items }: { items: WorkItem[] }) {
  return (
    <Canvas
      className="!absolute inset-0"
      orthographic
      camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#06050a"]} />
      <Suspense fallback={null}>
        <Grid items={items} />
      </Suspense>
    </Canvas>
  );
}

export default WorkGridScene;
