"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uIntensity;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
    p += uMouse * 0.18;
    float t = uTime * 0.045;

    // domain warping for an organic, flowing nebula
    vec2 q = vec2(fbm(p * 1.5 + vec2(0.0, t)), fbm(p * 1.5 + vec2(5.2, -t)));
    vec2 r = vec2(
      fbm(p * 1.5 + 2.0 * q + vec2(1.7, 9.2) + 0.15 * t),
      fbm(p * 1.5 + 2.0 * q + vec2(8.3, 2.8) - 0.12 * t)
    );
    float f = fbm(p * 1.5 + 2.5 * r);

    vec3 base   = vec3(0.024, 0.020, 0.028);
    vec3 indigo = vec3(0.42, 0.475, 1.0);
    vec3 violet = vec3(0.69, 0.42, 1.0);

    vec3 col = base;
    col = mix(col, indigo, clamp(f * f * 1.5, 0.0, 1.0) * 0.72 * uIntensity);
    col = mix(col, violet, clamp(r.x * 0.9, 0.0, 1.0) * 0.38 * uIntensity);
    col += indigo * 0.16 * uIntensity * smoothstep(0.62, 1.0, f);

    float vig = smoothstep(1.15, 0.2, length(uv - 0.5));
    col *= mix(0.5, 1.06, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function NebulaPlane({ intensity }: { intensity: number }) {
  const { size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uIntensity: { value: intensity },
    }),
    [intensity],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uAspect.value = size.width / Math.max(1, size.height);
    // ease the (window-wide) pointer toward the target
    uniforms.uMouse.value.x += (pointer.current.x - uniforms.uMouse.value.x) * 0.04;
    uniforms.uMouse.value.y += (pointer.current.y - uniforms.uMouse.value.y) * 0.04;
  });

  // track the cursor across the whole window
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

interface ShaderBackgroundProps {
  /** 0–1.5 — strength of the colour flow. */
  intensity?: number;
  /** Pause the render loop when false (e.g. scrolled off-screen). */
  active?: boolean;
}

export function ShaderBackground({ intensity = 1, active = true }: ShaderBackgroundProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <NebulaPlane intensity={intensity} />
    </Canvas>
  );
}
