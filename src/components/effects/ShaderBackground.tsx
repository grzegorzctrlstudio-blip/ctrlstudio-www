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
  uniform float uScroll; // 0 at top of page → 1 at bottom

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

    // time advances on its own AND is pushed by scrolling
    float t = uTime * 0.045 + uScroll * 1.25;

    vec2 q = vec2(fbm(p * 1.5 + vec2(0.0, t)), fbm(p * 1.5 + vec2(5.2, -t)));
    vec2 r = vec2(
      fbm(p * 1.5 + 2.0 * q + vec2(1.7, 9.2) + 0.15 * t),
      fbm(p * 1.5 + 2.0 * q + vec2(8.3, 2.8) - 0.12 * t)
    );
    float f = fbm(p * 1.5 + 2.5 * r);

    // stronger near the top (hero), calmer further down so text stays readable
    float eff = uIntensity * mix(1.0, 0.32, clamp(uScroll, 0.0, 1.0));

    vec3 base   = vec3(0.024, 0.020, 0.028);
    vec3 indigo = vec3(0.42, 0.475, 1.0);
    vec3 violet = vec3(0.69, 0.42, 1.0);
    vec3 teal   = vec3(0.30, 0.85, 0.80);

    vec3 col = base;
    col = mix(col, indigo, clamp(f * f * 1.5, 0.0, 1.0) * 0.72 * eff);
    col = mix(col, violet, clamp(r.x * 0.9, 0.0, 1.0) * 0.38 * eff);
    // hue journey toward teal as the page scrolls
    col = mix(col, teal, clamp(uScroll, 0.0, 1.0) * 0.12 * eff);
    col += indigo * 0.16 * eff * smoothstep(0.62, 1.0, f);

    float vig = smoothstep(1.15, 0.2, length(uv - 0.5));
    col *= mix(0.5, 1.06, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function NebulaPlane({ intensity }: { intensity: number }) {
  const { size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uIntensity: { value: intensity },
      uScroll: { value: 0 },
    }),
    [intensity],
  );

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    uniforms.uTime.value += d;
    uniforms.uAspect.value = size.width / Math.max(1, size.height);
    uniforms.uMouse.value.x += (pointer.current.x - uniforms.uMouse.value.x) * 0.04;
    uniforms.uMouse.value.y += (pointer.current.y - uniforms.uMouse.value.y) * 0.04;
    // ease scroll for buttery transitions
    uniforms.uScroll.value += (scroll.current - uniforms.uScroll.value) * Math.min(1, d * 4);
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
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
  intensity?: number;
  active?: boolean;
}

export function ShaderBackground({ intensity = 1, active = true }: ShaderBackgroundProps) {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <NebulaPlane intensity={intensity} />
    </Canvas>
  );
}
