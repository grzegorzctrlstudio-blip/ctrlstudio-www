"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Backdrop, FBM, useMouseRef, type MouseRef } from "@/components/demo/demoCommon";

/** CTRL logo as a flowing "liquid glass" panel: domain-warp displacement,
 *  chromatic aberration, mouse ripple, and a 3D tilt toward the cursor. */
function LiquidLogo({ mouse }: { mouse: MouseRef }) {
  const tex = useTexture("/assets/logo-white.png");
  const group = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uLogo: { value: tex },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [tex],
  );

  useFrame((state, d) => {
    const dt = Math.min(d, 0.05);
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.x += (mouse.current.x - uniforms.uMouse.value.x) * 0.06;
    uniforms.uMouse.value.y += (mouse.current.y - uniforms.uMouse.value.y) * 0.06;
    if (group.current) {
      group.current.rotation.y += (mouse.current.x * 0.2 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-mouse.current.y * 0.14 - group.current.rotation.x) * 0.05;
      group.current.position.y = 0.45 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
  });

  const w = 1.75;
  const h = w / 1.105; // logo aspect

  return (
    <group ref={group}>
      <mesh scale={[w, h, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          transparent
          depthTest={false}
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`precision highp float; varying vec2 vUv;
            uniform sampler2D uLogo; uniform float uTime; uniform vec2 uMouse;
            ${FBM}
            void main(){
              vec2 uv = vUv;
              float t = uTime*0.18;
              vec2 flow = vec2(fbm(uv*3.0 + t), fbm(uv*3.0 + 10.0 - t)) - 0.5;
              vec2 m = uMouse*0.5 + 0.5;
              float md = distance(uv, m);
              float ripple = sin(md*22.0 - uTime*2.4) * 0.008 * smoothstep(0.45, 0.0, md);
              vec2 duv = uv + flow*0.016 + ripple;
              float ca = 0.0014 + 0.004 * smoothstep(0.5, 0.0, md);
              float r = texture2D(uLogo, duv + vec2(ca, 0.0)).a;
              float g = texture2D(uLogo, duv).a;
              float b = texture2D(uLogo, duv - vec2(ca, 0.0)).a;
              float a = max(r, max(g, b));
              vec3 col = vec3(0.55*r + 0.30, 0.72*g + 0.34, b + 0.42);
              gl_FragColor = vec4(col, a);
            }`}
        />
      </mesh>
    </group>
  );
}

export function DemoSceneA() {
  const mouse = useMouseRef();
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
    >
      <Backdrop mouse={mouse} />
      <Suspense fallback={null}>
        <LiquidLogo mouse={mouse} />
      </Suspense>
    </Canvas>
  );
}
