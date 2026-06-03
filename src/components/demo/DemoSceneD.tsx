"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";
import { useMouseRef, type MouseRef } from "@/components/demo/demoCommon";

const GLASS_BG = new THREE.Color("#172a4d");

/** The CTRL logo, extruded from its outline into a 3D glass model with an
 *  iridescent / chromatic effect that refracts the glowing particles behind. */
function GlassLogo({ mouse }: { mouse: MouseRef }) {
  const svg = useLoader(SVGLoader, "/assets/ctrl-logo.svg");
  const geometry = useMemo(() => {
    const shapes: THREE.Shape[] = [];
    svg.paths.forEach((p) => {
      SVGLoader.createShapes(p).forEach((s) => shapes.push(s));
    });
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 45,
      bevelEnabled: true,
      bevelThickness: 7,
      bevelSize: 4,
      bevelSegments: 3,
      curveSegments: 10,
    });
    geo.center();
    return geo;
  }, [svg]);

  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.rotation.y += (mouse.current.x * 0.45 - g.rotation.y) * 0.05 + 0.0;
    g.rotation.x += (-mouse.current.y * 0.28 - g.rotation.x) * 0.05;
    g.position.y = 0.15 + Math.sin(t * 0.5) * 0.07;
  });

  const s = 0.0039;
  return (
    <group ref={group} position={[0, 0.25, 0]}>
      <mesh geometry={geometry} rotation={[Math.PI, 0, 0]} scale={[s, s, s]}>
        <MeshTransmissionMaterial
          background={GLASS_BG}
          samples={10}
          resolution={512}
          transmission={1}
          roughness={0}
          thickness={0.4}
          ior={1.48}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          iridescence={0.7}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[120, 500]}
          clearcoat={1}
          clearcoatRoughness={0.04}
          attenuationDistance={6}
          attenuationColor="#e3edff"
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}

/** Soft glowing particle cloud behind the logo (B colourway), refracted by it. */
function ParticleCloud({ mouse }: { mouse: MouseRef }) {
  const ref = useRef<THREE.Points>(null);
  const { geometry, sprite } = useMemo(() => {
    const N = 1400;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
      arr[i * 3 + 2] = -0.8 - Math.random() * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));

    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.35, "rgba(150,200,255,0.5)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 64, 64);
    return { geometry: g, sprite: new THREE.CanvasTexture(c) };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = mouse.current.x * 0.4;
    ref.current.position.y = -mouse.current.y * 0.3;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        map={sprite}
        color="#aecbff"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 6], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 5]} intensity={1.2} />
      {/* bright emissive studio (no network) → strong reflections on the glass */}
      <Environment resolution={128}>
        <Lightformer form="rect" position={[0, 4, 4]} scale={[10, 6, 1]} intensity={6} color="#eaf4ff" />
        <Lightformer form="rect" position={[-5, 1, 3]} scale={[5, 8, 1]} intensity={4} color="#88b8ff" />
        <Lightformer form="rect" position={[5, 0, 3]} scale={[5, 8, 1]} intensity={4} color="#bfe6ff" />
        <Lightformer form="ring" position={[0, -2, 4]} scale={4} intensity={3} color="#6a86ff" />
      </Environment>

      <ParticleCloud mouse={mouse} />
      <Suspense fallback={null}>
        <GlassLogo mouse={mouse} />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.95, 0]}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          resolution={512}
          blur={[400, 120]}
          mixBlur={1}
          mixStrength={30}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#060912"
          metalness={0.55}
          mirror={0}
        />
      </mesh>

      <ContactShadows
        position={[0, -1.93, 0]}
        opacity={0.4}
        scale={16}
        blur={3}
        far={5}
        color="#000010"
      />

      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.45}
          luminanceSmoothing={0.3}
          intensity={1.15}
        />
      </EffectComposer>
    </Canvas>
  );
}
