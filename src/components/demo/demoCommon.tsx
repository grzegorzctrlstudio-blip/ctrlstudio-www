"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type MouseRef = RefObject<{ x: number; y: number }>;

/** Window-wide pointer in normalized device coords (-1..1, y up). */
export function useMouseRef(): MouseRef {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}

export const FBM = /* glsl */ `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
  float fbm(vec2 p){ float v=0.0,a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=0.5; } return v; }
`;

/** Deep-blue, mouse-reactive nebula plane filling the screen behind the logo. */
export function Backdrop({ mouse }: { mouse: MouseRef }) {
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
    }),
    [],
  );

  useFrame((_, d) => {
    const dt = Math.min(d, 0.05);
    uniforms.uTime.value += dt;
    uniforms.uAspect.value = size.width / Math.max(1, size.height);
    uniforms.uMouse.value.x += (mouse.current.x - uniforms.uMouse.value.x) * 0.04;
    uniforms.uMouse.value.y += (mouse.current.y - uniforms.uMouse.value.y) * 0.04;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        depthTest={false}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }`}
        fragmentShader={`precision highp float; varying vec2 vUv; uniform float uTime, uAspect; uniform vec2 uMouse;
          ${FBM}
          void main(){
            vec2 p = vec2((vUv.x-0.5)*uAspect, vUv.y-0.5) + uMouse*0.16;
            float t = uTime*0.04;
            vec2 q = vec2(fbm(p*1.5 + vec2(0.0,t)), fbm(p*1.5 + vec2(5.2,-t)));
            vec2 r = vec2(fbm(p*1.5+2.0*q+vec2(1.7,9.2)+0.15*t), fbm(p*1.5+2.0*q+vec2(8.3,2.8)-0.12*t));
            float f = fbm(p*1.5 + 2.4*r);
            vec3 base = vec3(0.012,0.022,0.045);
            vec3 blue = vec3(0.18,0.52,1.0);
            vec3 cyan = vec3(0.30,0.80,1.0);
            vec3 col = base;
            col = mix(col, blue, clamp(f*f*1.7,0.0,1.0)*0.55);
            col += cyan * 0.12 * smoothstep(0.62,1.0,f);
            float vig = smoothstep(1.12,0.2,length(vUv-0.5));
            col *= mix(0.42,1.05,vig);
            gl_FragColor = vec4(col, 1.0);
          }`}
      />
    </mesh>
  );
}
