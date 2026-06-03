"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Full-page reactive background.
 *
 * Primary path = WebGL: a clip-space fullscreen quad (camera-independent, like
 * ShaderBackground) that cross-fades the active style's section images on
 * scroll, with mouse-driven parallax-occlusion depth, chromatic aberration, a
 * cheap bloom, indigo tint, vignette and grain — plus a real 3D dust particle
 * field that parallaxes with the camera. Falls back to a layered DOM version if
 * WebGL is unavailable or the context is lost, so it never shows black.
 */

const STYLES = [
  [
    "/assets/bg/nebula-hero.png",
    "/assets/bg/nebula-showreel.png",
    "/assets/bg/nebula-services.png",
    "/assets/bg/nebula-process.png",
  ],
  [
    "/assets/bg/chrome-hero.png",
    "/assets/bg/chrome-showreel.png",
    "/assets/bg/chrome-services.png",
    "/assets/bg/chrome-process.png",
  ],
];

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

/* ------------------------------- shared input ------------------------------ */

function useReactiveInput() {
  const ref = useRef({ p: 0, mx: 0, my: 0, tmx: 0, tmy: 0 });
  useEffect(() => {
    const s = ref.current;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      s.p = h > 0 ? clamp(window.scrollY / h, 0, 1) : 0;
    };
    const onMove = (e: PointerEvent) => {
      s.tmx = (e.clientX / window.innerWidth) * 2 - 1;
      s.tmy = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return ref;
}

/* ----------------------------------- WebGL --------------------------------- */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec2 uRes;

  const vec2 IMG = vec2(2048.0, 1152.0);

  float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  vec2 coverUV(vec2 uv){
    float rs = uRes.x / uRes.y;
    float ri = IMG.x / IMG.y;
    vec2 st = uv;
    if (rs > ri) st.y = (uv.y - 0.5) * (ri / rs) + 0.5;
    else         st.x = (uv.x - 0.5) * (rs / ri) + 0.5;
    return st;
  }

  vec3 sampleCA(sampler2D tex, vec2 uv, vec2 ca){
    return vec3(
      texture2D(tex, uv + ca).r,
      texture2D(tex, uv).g,
      texture2D(tex, uv - ca).b
    );
  }

  void main(){
    // base framing + gentle idle drift / breathing zoom
    vec2 base = coverUV(vUv);
    vec2 c = (base - 0.5) * (0.94 + 0.01 * sin(uTime * 0.2));
    c += vec2(cos(uTime * 0.05), sin(uTime * 0.04)) * 0.006;
    base = c + 0.5;

    // parallax-occlusion: shift along the mouse vector by local depth (luma)
    vec2 par = uMouse * 0.05;
    float hA = luma(texture2D(uTexA, base).rgb);
    float hB = luma(texture2D(uTexB, base).rgb);
    vec2 uvA = base + par * (hA - 0.5);
    vec2 uvB = base + par * 1.35 * (hB - 0.5);

    // chromatic aberration grows toward the edges
    vec2 ca = (vUv - 0.5) * 0.0045 + par * 0.0015;

    vec3 colA = sampleCA(uTexA, uvA, ca);
    vec3 colB = sampleCA(uTexB, uvB, ca);
    vec3 col = mix(colA, colB, clamp(uMix, 0.0, 1.0));

    // cheap bloom: ring of bright-pass taps
    vec3 bloom = vec3(0.0);
    float r = 0.018;
    for (int i = 0; i < 8; i++){
      float a = float(i) / 8.0 * 6.2831853;
      vec2 o = vec2(cos(a), sin(a)) * r;
      vec3 s = texture2D(uTexA, base + o).rgb;
      bloom += max(s - 0.55, 0.0);
    }
    col += bloom * 0.22;

    // restrained indigo tint, mostly in the shadows
    vec3 tint = vec3(0.82, 0.85, 1.14);
    float l = luma(col);
    col = mix(col * tint, col, smoothstep(0.25, 0.85, l));

    // vignette + floor fade
    float d = distance(vUv, vec2(0.5));
    col *= 1.0 - smoothstep(0.34, 1.08, d) * 0.82;

    // grain
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.02;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function BgQuad({ urls, input }: { urls: string[]; input: ReturnType<typeof useReactiveInput> }) {
  const textures = useLoader(THREE.TextureLoader, urls);
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });
  }, [textures]);

  const uniforms = useMemo(
    () => ({
      uTexA: { value: null as THREE.Texture | null },
      uTexB: { value: null as THREE.Texture | null },
      uMix: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const s = input.current;
    const n = textures.length;
    const f = s.p * (n - 1);
    const a = Math.min(Math.floor(f), n - 1);
    const b = Math.min(a + 1, n - 1);
    m.uniforms.uTexA.value = textures[a];
    m.uniforms.uTexB.value = textures[b];
    m.uniforms.uMix.value = f - a;

    mouse.current.x += (s.mx - mouse.current.x) * 0.05;
    mouse.current.y += (s.my - mouse.current.y) * 0.05;
    m.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function Dust({ input }: { input: ReturnType<typeof useReactiveInput> }) {
  const ref = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const cam = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const N = 700;
    const arr = new Float32Array(N * 3);
    let seed = 1;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (rand() - 0.5) * 11;
      arr[i * 3 + 1] = (rand() - 0.5) * 8;
      arr[i * 3 + 2] = (rand() - 0.5) * 5 - 1;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const s = input.current;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
      ref.current.rotation.z += delta * 0.004;
    }
    cam.current.x += (s.mx * 0.45 - cam.current.x) * 0.04;
    cam.current.y += (s.my * 0.45 - cam.current.y) * 0.04;
    camera.position.x = cam.current.x;
    camera.position.y = cam.current.y;
    camera.position.z = 5 - s.p * 0.6;
    camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={ref} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#9aa2ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GLBackground({
  styleIndex,
  onFail,
}: {
  styleIndex: number;
  onFail: () => void;
}) {
  const input = useReactiveInput();
  const urls = STYLES[styleIndex] ?? STYLES[0];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-bg" aria-hidden>
      <Canvas
        className="!fixed inset-0"
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
        }}
      >
        <Suspense fallback={null}>
          <BgQuad key={styleIndex} urls={urls} input={input} />
          <Dust input={input} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ------------------------------- DOM fallback ------------------------------ */

function DomBackground({ styleIndex }: { styleIndex: number }) {
  const urls = STYLES[styleIndex] ?? STYLES[0];
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const input = useReactiveInput();

  useEffect(() => {
    const s = input.current;
    let raf = 0;
    let mx = 0;
    let my = 0;
    let t = 0;
    const tick = () => {
      mx += (s.mx - mx) * 0.06;
      my += (s.my - my) * 0.06;
      t += 0.0015;
      const n = layers.current.length;
      const f = s.p * (n - 1);
      layers.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(clamp(1 - Math.abs(f - i), 0, 1));
        const depth = 14 + i * 6;
        const x = -mx * depth + Math.cos(t) * 6;
        const y = -my * depth + Math.sin(t * 0.8) * 6;
        el.style.transform = `scale(1.14) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [input, urls.length]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden>
      {urls.map((u, i) => (
        <div
          key={u}
          ref={(el) => {
            layers.current[i] = el;
          }}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${u})`, opacity: i === 0 ? 1 : 0 }}
        />
      ))}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(180deg, rgba(107,121,255,0.16), rgba(176,107,255,0.12))",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 50% 38%, transparent 42%, rgba(6,5,7,0.55) 78%, rgba(6,5,7,0.9) 100%)",
        }}
      />
    </div>
  );
}

/* --------------------------------- export ---------------------------------- */

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function SceneBackground({ styleIndex = 0 }: { styleIndex?: number }) {
  const [mode, setMode] = useState<"gl" | "dom">("gl");

  useEffect(() => {
    if (!webglOk()) setMode("dom");
  }, []);

  if (mode === "dom") return <DomBackground styleIndex={styleIndex} />;
  return <GLBackground styleIndex={styleIndex} onFail={() => setMode("dom")} />;
}

export default SceneBackground;
