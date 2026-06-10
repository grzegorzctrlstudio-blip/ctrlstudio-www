"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Scroll-driven page background — a 4-beat narrative (content → technology →
 * space → close) driven by GSAP ScrollTrigger (Lenis-wired in SmoothScroll).
 *
 * Beats are anchored to the REAL section offsets in the DOM (measured at mount
 * + on resize/refresh), not hard-coded scroll fractions, so each beat lands on
 * its sections regardless of section height. `phase` is a continuous 0..4:
 *   beat 1 [0,1] Hero+Showreel · beat 2 [1,2] Services+Tech ·
 *   beat 3 [2,3] SelectedWork  · beat 4 [3,4] Studio+Contact
 * If the sections can't be measured it falls back to fixed fractions, so the
 * scene can never be worse than the simple linear mapping.
 *
 * Layers (back → front), one canvas:
 *   nebula backdrop (AI) · glass sphere · wire terrain · dust ·
 *   FX glints (AI, beat 1) · FX energy (AI, beats 2-3) · focal glow (beat 4) ·
 *   vignette. AI plates are flat RGB; depth/parallax/reveal happen here.
 */

type PhaseRef = MutableRefObject<number>;
type MouseRef = MutableRefObject<{
  x: number;
  y: number;
  tx: number;
  ty: number;
  down: number;
}>;

const NEBULA = "/assets/bg/glass-bg-2.webp";
const SHOW_BLOB = false; // hero glass blob disabled per request
const GLINTS = "/assets/bg/fx-glints.png";
const ENERGY = "/assets/bg/fx-energy.png";

/** scroll fractions per beat boundary if section measurement is unavailable */
const FALLBACK_BOUNDS = [0, 0.28, 0.55, 0.78, 1];
/** section indices (of the 7 homepage sections) where each beat begins */
const BEAT_START_SECTION = [0, 2, 4, 5];

const smooth01 = (x: number, a: number, b: number) =>
  THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(x, 0, 1), a, b);

/** reveal ramp in phase units: fade in [a,b], hold, fade out [c,d] */
const ramp = (p: number, a: number, b: number, c: number, d: number) =>
  smooth01(p, a, b) * (1 - smooth01(p, c, d));

/** Map a 0..1 scroll progress through measured boundaries → continuous phase 0..N. */
function toPhase(p: number, bounds: number[]): number {
  for (let k = 0; k < bounds.length - 1; k++) {
    if (p < bounds[k + 1] || k === bounds.length - 2) {
      const seg = Math.max(1e-4, bounds[k + 1] - bounds[k]);
      return k + THREE.MathUtils.clamp((p - bounds[k]) / seg, 0, 1);
    }
  }
  return 0;
}

/** Measure beat boundaries (0..1 scroll fractions) from real section offsets. */
function measureBounds(): number[] {
  if (typeof document === "undefined") return FALLBACK_BOUNDS;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return FALLBACK_BOUNDS;
  const secs = Array.from(document.querySelectorAll("main section"));
  if (secs.length < 6) return FALLBACK_BOUNDS;
  const y = window.scrollY;
  const fr = BEAT_START_SECTION.map((i) =>
    THREE.MathUtils.clamp(
      (secs[i].getBoundingClientRect().top + y) / max,
      0,
      1,
    ),
  );
  const b = [0, fr[1], fr[2], fr[3], 1];
  for (let i = 1; i < b.length; i++) {
    if (b[i] <= b[i - 1]) b[i] = Math.min(1, b[i - 1] + 0.02);
  }
  return b;
}

/* --------------------------------- shaders --------------------------------- */

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const COVER = /* glsl */ `
  uniform vec2 uRes;
  const vec2 IMG = vec2(1376.0, 768.0);
  vec2 coverUV(vec2 uv){
    float rs = uRes.x / uRes.y, ri = IMG.x / IMG.y;
    vec2 st = uv;
    if (rs > ri) st.y = (uv.y - 0.5) * (ri / rs) + 0.5;
    else         st.x = (uv.x - 0.5) * (rs / ri) + 0.5;
    return st;
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`;

const BACKDROP_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec3 uTint;
  uniform float uBright;
  ${COVER}
  void main(){
    vec2 uv = coverUV(vUv);
    uv += uMouse * 0.012;
    uv += vec2(sin(uTime * 0.03) * 0.004, cos(uTime * 0.025) * 0.003);
    vec3 col = texture2D(uTex, uv).rgb * uTint * uBright;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const FX_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uReveal;
  uniform float uDepth;
  uniform float uScale;
  ${COVER}
  void main(){
    vec2 uv = coverUV(vUv);
    uv = (uv - 0.5) / uScale + 0.5;
    uv += uMouse * uDepth;
    uv += vec2(sin(uTime * 0.05 + vUv.y * 3.0), cos(uTime * 0.04 + vUv.x * 3.0)) * 0.006;
    vec3 col = texture2D(uTex, uv).rgb;
    gl_FragColor = vec4(col, uReveal); // additive blend → adds col * uReveal
  }
`;

const GLOW_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uReveal;
  uniform float uTime;
  uniform vec2 uRes;
  void main(){
    vec2 p = vUv - vec2(0.5, 0.44);
    p.x *= uRes.x / uRes.y;
    float d = length(p);
    float g = smoothstep(0.55, 0.0, d);
    g *= 0.88 + 0.12 * sin(uTime * 1.4);
    vec3 col = vec3(0.40, 0.50, 1.0) * g;
    gl_FragColor = vec4(col, uReveal);
  }
`;

/* ------------------------------- clip quads -------------------------------- */

function Backdrop({ phase, mouse }: { phase: PhaseRef; mouse: MouseRef }) {
  const tex = useLoader(THREE.TextureLoader, NEBULA);
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
  }, [tex]);

  const tints = useMemo(
    () => [
      new THREE.Color("#cfd8ff"), // near-white — let the glass show, subtle beat shift
      new THREE.Color("#c6d6ff"),
      new THREE.Color("#dfe6ff"),
      new THREE.Color("#e2dcff"),
    ],
    [],
  );
  const tint = useMemo(() => new THREE.Color("#8f9bff"), []);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uTint: { value: tint },
      uBright: { value: 1 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [tex, tint],
  );

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const ph = phase.current;
    const pn = ph / 4;
    const f = THREE.MathUtils.clamp(pn, 0, 1) * 3;
    const i = Math.min(Math.floor(f), 2);
    tint.copy(tints[i]).lerp(tints[i + 1], f - i);
    const beat3 = smooth01(ph, 1.9, 2.3) * (1 - smooth01(ph, 3.0, 3.6));
    m.uniforms.uBright.value = 0.9 + beat3 * 0.35;
    m.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={QUAD_VERT}
        fragmentShader={BACKDROP_FRAG}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function FxLayer({
  url,
  phase,
  mouse,
  rampArgs,
  depth,
  scale,
  order,
}: {
  url: string;
  phase: PhaseRef;
  mouse: MouseRef;
  rampArgs: [number, number, number, number];
  depth: number;
  scale: number;
  order: number;
}) {
  const tex = useLoader(THREE.TextureLoader, url);
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
  }, [tex]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uDepth: { value: depth },
      uScale: { value: scale },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [tex, depth, scale],
  );

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uReveal.value = ramp(phase.current, ...rampArgs);
    m.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh renderOrder={order}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={QUAD_VERT}
        fragmentShader={FX_FRAG}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function FocalGlow({ phase }: { phase: PhaseRef }) {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );
  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uReveal.value = smooth01(phase.current, 3.1, 3.75);
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uRes.value.set(size.width, size.height);
  });
  return (
    <mesh renderOrder={15}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={QUAD_VERT}
        fragmentShader={GLOW_FRAG}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ----------------------------------- 3D ------------------------------------ */

function StudioEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    scene.background = new THREE.Color("#05050c");
    return () => {
      env.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Scene A — organic glass blob (beat 1).
 *  Idle wobble · click-hold jelly squash (springs back) · scroll-velocity pump ·
 *  iridescent indigo-tinted glass with strong env reflections. */
function GlassSphere({ phase, mouse }: { phase: PhaseRef; mouse: MouseRef }) {
  const ref = useRef<THREE.Mesh>(null);
  const uTime = useRef({ value: 0 });
  const uGrab = useRef({ value: 0 });
  const uVel = useRef({ value: 0 });
  const grabVel = useRef(0);
  const sm = useRef(0);
  const prevPhase = useRef(0);
  const velSm = useRef(0);

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dbe9ff"),
      metalness: 0,
      roughness: 0.02,
      transmission: 1,
      ior: 1.46,
      thickness: 1.3, // thin → clear, see-through glass
      dispersion: 4.0, // chromatic dispersion → rainbow refraction on the edges
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      iridescence: 0.1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [120, 420],
      attenuationColor: new THREE.Color("#7fa8ff"), // faint blue — stays transparent
      attenuationDistance: 3.0,
      specularColor: new THREE.Color("#ffffff"),
      envMapIntensity: 2.0, // bright, glossy studio reflections
      transparent: true,
      opacity: 1,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime.current;
      shader.uniforms.uVel = uVel.current;
      shader.vertexShader =
        "uniform float uTime;\nuniform float uVel;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float tt = uTime;
           // organic "melted glass" lobes — low-frequency, smooth, flowing.
           // The grab/stretch is done at mesh level so normals stay correct.
           float n = sin(position.x * 1.1 + tt * 0.5) * sin(position.y * 1.3 + tt * 0.4) * 0.20
                   + sin(position.y * 1.7 + tt * 0.7) * 0.10
                   + sin(position.z * 1.5 + tt * 0.9) * 0.09;
           transformed += normal * n * (1.0 + uVel * 0.45);`,
        );
    };
    return m;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033);
    const t = state.clock.elapsedTime;
    uTime.current.value = t;

    // grab: underdamped spring → rubbery bounce back on release
    const target = mouse.current.down;
    grabVel.current +=
      ((target - uGrab.current.value) * 220 - grabVel.current * 14) * dt;
    uGrab.current.value = THREE.MathUtils.clamp(
      uGrab.current.value + grabVel.current * dt,
      -0.2,
      1.2,
    );

    // scroll velocity from phase delta (auto-decays when still)
    const raw = Math.abs(phase.current - prevPhase.current) / Math.max(dt, 1e-3);
    prevPhase.current = phase.current;
    velSm.current += (Math.min(raw * 0.7, 1.0) - velSm.current) * 0.1;
    uVel.current.value = velSm.current;

    sm.current += (phase.current - sm.current) * 0.08;
    const pn = sm.current / 4;
    const g = THREE.MathUtils.clamp(uGrab.current.value, 0, 1);
    const mx = mouse.current.x;
    const my = mouse.current.y;

    const m = ref.current;
    if (!m) return;
    // grab + drag → strong rubbery stretch toward the cursor. Done with an
    // anisotropic MESH scale so the normals (and glass refraction) stay correct.
    const STR = 0.95;
    m.scale.set(
      1 + Math.abs(mx) * g * STR + g * 0.05,
      1 + Math.abs(my) * g * STR + g * 0.05,
      Math.max(0.4, 1 - (Math.abs(mx) + Math.abs(my)) * g * 0.2),
    );
    // the grabbed point follows the cursor
    m.position.x = mx * 0.85 * g;
    m.position.y = pn * 3.2 + my * 0.75 * g;
    m.position.z = -1 - pn * 2.5;
    // idle rotation eases off while held so the pull reads clearly
    m.rotation.y =
      (t * 0.12 + pn * 2.2 + velSm.current * 0.5) * (1 - 0.85 * g) +
      mx * 0.25 * (1 - 0.5 * g);
    m.rotation.x = pn * 1.4 * (1 - 0.85 * g) - my * 0.18 * (1 - 0.5 * g);
    const vis = 1 - smooth01(sm.current, 0.9, 1.3);
    material.opacity = vis;
    m.visible = vis > 0.02;
  });

  return (
    <mesh ref={ref} position={[0, 0, -1]} material={material} castShadow>
      <icosahedronGeometry args={[2.3, 24]} />
    </mesh>
  );
}

/** Scene B — neon wireframe terrain that rises + lights up (beats 2-3). */
function WireTerrain({ phase }: { phase: PhaseRef }) {
  const ref = useRef<THREE.Mesh>(null);
  const sm = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(46, 46, 90, 90);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const ridge = Math.sin(x * 0.35) * Math.cos(y * 0.32) * 1.1;
      const edge = (x * x + y * y) * 0.004;
      const rnd = Math.sin(x * 1.9 + y * 2.3) * 0.35;
      pos.setZ(i, ridge + edge + rnd);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#6b8aff"),
        wireframe: true,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useFrame((state) => {
    sm.current += (phase.current - sm.current) * 0.08;
    const ph = sm.current;
    const vis = smooth01(ph, 1.2, 2.1) * (1 - smooth01(ph, 3.7, 4.0) * 0.5);
    material.opacity = vis * 0.9;
    const m = ref.current;
    if (!m) return;
    m.visible = vis > 0.02;
    m.position.y = -3.4 + (1 - vis) * -5;
    m.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 1.2;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -3.4, -5]}
    />
  );
}

/** Volumetric dust — gentle parallax atmosphere throughout. */
function Dust({ mouse }: { mouse: MouseRef }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const N = 700;
    const arr = new Float32Array(N * 3);
    let seed = 7;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (rand() - 0.5) * 14;
      arr[i * 3 + 1] = (rand() - 0.5) * 9;
      arr[i * 3 + 2] = (rand() - 0.5) * 6 - 1;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.012;
      ref.current.rotation.z += delta * 0.005;
      ref.current.position.x = mouse.current.x * 0.4;
      ref.current.position.y = mouse.current.y * 0.3;
    }
  });

  return (
    <points ref={ref} renderOrder={5}>
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

/** Camera rig — subtle mouse parallax + scroll dolly (only the 3D reacts). */
function Rig({ phase, mouse }: { phase: PhaseRef; mouse: MouseRef }) {
  const { camera } = useThree();
  useFrame(() => {
    const mo = mouse.current;
    mo.x += (mo.tx - mo.x) * 0.05;
    mo.y += (mo.ty - mo.y) * 0.05;
    camera.position.x = mo.x * 0.5;
    camera.position.y = mo.y * 0.4;
    camera.position.z = 6 - (phase.current / 4) * 1.2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* --------------------------------- scene ----------------------------------- */

function Scene({ phase, mouse }: { phase: PhaseRef; mouse: MouseRef }) {
  return (
    <>
      <StudioEnv />
      {/* moody, blue-dominant lighting + a shadow-casting key */}
      <ambientLight intensity={0.14} />
      <directionalLight
        castShadow
        position={[5, 7, 4]}
        intensity={2.2}
        color="#cfe0ff"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.5, 30]} />
      </directionalLight>
      <pointLight position={[-6, 2, 4]} intensity={2.0} color="#2d6bff" />
      <pointLight position={[6, -2, 5]} intensity={1.1} color="#5b9aff" />
      {/* blue rim/back light — edge glow on the glass (blooms nicely) */}
      <pointLight position={[0, 1.6, -3]} intensity={2.6} color="#7fa0ff" />

      <Backdrop phase={phase} mouse={mouse} />
      {/* hero glass blob disabled (flip SHOW_BLOB to re-enable) */}
      {SHOW_BLOB && <GlassSphere phase={phase} mouse={mouse} />}
      {SHOW_BLOB && (
        <mesh receiveShadow position={[0, -2.6, -1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 24]} />
          <shadowMaterial transparent opacity={0.45} />
        </mesh>
      )}
      <WireTerrain phase={phase} />
      <Dust mouse={mouse} />
      {/* glints peak in beat 1, energy across beats 2-3 (phase units 0..4) */}
      <FxLayer url={GLINTS} phase={phase} mouse={mouse} rampArgs={[0.0, 0.25, 0.9, 1.3]} depth={0.03} scale={1.05} order={10} />
      <FxLayer url={ENERGY} phase={phase} mouse={mouse} rampArgs={[1.1, 1.5, 3.0, 3.4]} depth={0.05} scale={1.0} order={11} />
      <FocalGlow phase={phase} />
      <Rig phase={phase} mouse={mouse} />

      {/* cohesive cinematic grade — bloom lifts the neon terrain + glass,
          vignette + grain replace the old hand-rolled quads in one pass */}
      <EffectComposer multisampling={4}>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.55}
          luminanceSmoothing={0.22}
          intensity={0.7}
        />
        <Vignette offset={0.32} darkness={0.62} />
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.06} />
      </EffectComposer>
    </>
  );
}

export function WebGLBackgroundScene() {
  const phase = useRef(0);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0, down: 0 });
  const bounds = useRef<number[]>(FALLBACK_BOUNDS);

  useEffect(() => {
    const remeasure = () => {
      bounds.current = measureBounds();
    };

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        phase.current = toPhase(self.progress, bounds.current);
      },
      onRefresh: remeasure,
    });

    const onMove = (e: PointerEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onDown = () => {
      mouse.current.down = 1;
    };
    const onUp = () => {
      mouse.current.down = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("pointercancel", onUp, true);
    window.addEventListener("resize", remeasure, { passive: true });

    // measure once layout has settled, then again after late content (fonts/img)
    const id1 = requestAnimationFrame(() => {
      remeasure();
      ScrollTrigger.refresh();
    });
    const id2 = window.setTimeout(remeasure, 1200);

    return () => {
      cancelAnimationFrame(id1);
      window.clearTimeout(id2);
      st.kill();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("pointercancel", onUp, true);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black" aria-hidden>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Scene phase={phase} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default WebGLBackgroundScene;
