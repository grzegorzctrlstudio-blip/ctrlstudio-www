"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { useMouseRef, type MouseRef } from "@/components/demo/demoCommon";

const GLASS_BG = new THREE.Color("#dfe3f1");

/** Reusable refined glass material (refraction + reflections + chromatic edge). */
function Glass() {
  return (
    <MeshTransmissionMaterial
      background={GLASS_BG}
      samples={10}
      resolution={384}
      transmission={1}
      roughness={0}
      thickness={0.9}
      ior={1.42}
      chromaticAberration={0.02}
      anisotropy={0}
      distortion={0}
      distortionScale={0}
      temporalDistortion={0}
      clearcoat={1}
      clearcoatRoughness={0.05}
      attenuationDistance={4}
      attenuationColor="#ffffff"
      color="#ffffff"
    />
  );
}

function GlassModel({
  position,
  factor,
  spin,
  mouse,
  children,
}: {
  position: [number, number, number];
  factor: number;
  spin: number;
  mouse: MouseRef;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = ref.current;
    if (!g) return;
    g.rotation.x = t * 0.1 * spin + position[0];
    g.rotation.y = t * 0.14 * spin;
    g.position.x = position[0] + mouse.current.x * factor;
    g.position.y =
      position[1] - mouse.current.y * factor + Math.sin(t * 0.5 + position[0]) * 0.12;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

/** CTRL logo as a field of dark points, refracted through the glass behind. */
function ParticleLogo({ mouse }: { mouse: MouseRef }) {
  const ref = useRef<THREE.Points>(null);
  const base = useRef<Float32Array | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/logo-white.png";
    img.onload = () => {
      const W = 170;
      const H = Math.round((W * img.height) / img.width);
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;
      const aspect = img.width / img.height;
      const scaleX = 3.0;
      const scaleY = scaleX / aspect;
      const pts: number[] = [];
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (data[(y * W + x) * 4 + 3] > 120 && Math.random() < 0.5) {
            pts.push(
              (x / W - 0.5) * scaleX,
              -(y / H - 0.5) * scaleY,
              -0.4 + (Math.random() - 0.5) * 0.1,
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
    const p = ref.current;
    const b = base.current;
    if (!p || !b) return;
    const attr = p.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    const mx = mouse.current.x * 2.0;
    const my = mouse.current.y * 1.3;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = b[i];
      const by = b[i + 1];
      const dx = bx - mx;
      const dy = by - my;
      const dist = Math.hypot(dx, dy) + 0.0001;
      const force = Math.max(0, 1 - dist / 0.8) * 0.4;
      arr[i] = bx + (dx / dist) * force;
      arr[i + 1] = by + (dy / dist) * force + Math.sin(t * 0.5 + bx * 3) * 0.015;
      arr[i + 2] = b[i + 2];
    }
    attr.needsUpdate = true;
  });

  if (!geometry) return null;
  return (
    <points ref={ref} geometry={geometry} position={[0, 0, -0.4]}>
      <pointsMaterial
        size={0.022}
        color="#2b2b45"
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function DemoSceneD() {
  const mouse = useMouseRef();
  return (
    <Canvas
      className="!fixed inset-0 !pointer-events-none"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      {/* HDR-free environment (built from emissive planes) → reflections without
          any network fetch, so the glass renders reliably everywhere. */}
      <Environment resolution={96}>
        <Lightformer position={[0, 3, 3]} scale={7} intensity={2.2} color="#ffffff" />
        <Lightformer position={[-3, 1, 2]} scale={5} intensity={1.4} color="#e6ecff" />
        <Lightformer position={[3, -1, 2]} scale={5} intensity={1.2} color="#fff0f6" />
        <Lightformer position={[0, -3, 1]} scale={6} intensity={0.9} color="#ffffff" />
      </Environment>

      <ParticleLogo mouse={mouse} />

      <GlassModel position={[0, 0.1, 0.2]} factor={0.25} spin={0.6} mouse={mouse}>
        <RoundedBox args={[0.85, 1.7, 0.85]} radius={0.07} smoothness={5}>
          <Glass />
        </RoundedBox>
      </GlassModel>

      <GlassModel position={[1.9, 0.7, 0.6]} factor={0.5} spin={1.1} mouse={mouse}>
        <mesh>
          <torusKnotGeometry args={[0.42, 0.15, 160, 28]} />
          <Glass />
        </mesh>
      </GlassModel>

      <GlassModel position={[-1.9, -0.8, 0.5]} factor={0.45} spin={0.9} mouse={mouse}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.08} smoothness={5}>
          <Glass />
        </RoundedBox>
      </GlassModel>

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.28}
        scale={16}
        blur={3}
        far={5}
        color="#454560"
      />
    </Canvas>
  );
}
