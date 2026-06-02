"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Backdrop, useMouseRef, type MouseRef } from "@/components/demo/demoCommon";

/** CTRL logo rebuilt as a field of glowing points (sampled from the logo's
 *  alpha), gently breathing and repelling away from the cursor. */
function LogoPoints({ mouse }: { mouse: MouseRef }) {
  const ref = useRef<THREE.Points>(null);
  const base = useRef<Float32Array | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  // soft round glow sprite
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(170,210,255,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/logo-white.png";
    img.onload = () => {
      const W = 250;
      const H = Math.round((W * img.height) / img.width);
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;
      const aspect = img.width / img.height;
      const scaleX = 2.35;
      const scaleY = scaleX / aspect;
      const pts: number[] = [];
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (data[(y * W + x) * 4 + 3] > 120 && Math.random() < 0.55) {
            pts.push(
              (x / W - 0.5) * scaleX,
              -(y / H - 0.5) * scaleY,
              (Math.random() - 0.5) * 0.1,
            );
          }
        }
      }
      const arr = new Float32Array(pts);
      base.current = arr;
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(arr.slice(), 3));
      setGeometry(g);
    };
  }, []);

  useFrame((state) => {
    const points = ref.current;
    const b = base.current;
    if (!points || !b) return;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    const mx = mouse.current.x * 1.9;
    const my = mouse.current.y * 1.2;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = b[i];
      const by = b[i + 1];
      const dx = bx - mx;
      const dy = by - my;
      const dist = Math.hypot(dx, dy) + 0.0001;
      const force = Math.max(0, 1 - dist / 0.85) * 0.5;
      const drift = Math.sin(t * 0.6 + bx * 3.0) * 0.02;
      arr[i] = bx + (dx / dist) * force;
      arr[i + 1] = by + (dy / dist) * force + drift;
      arr[i + 2] = b[i + 2];
    }
    attr.needsUpdate = true;
    points.rotation.y = Math.sin(t * 0.15) * 0.08;
  });

  if (!geometry) return null;

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.032}
        map={sprite}
        color="#bcd4ff"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export function DemoSceneB() {
  const mouse = useMouseRef();
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
    >
      <Backdrop mouse={mouse} />
      <LogoPoints mouse={mouse} />
    </Canvas>
  );
}
