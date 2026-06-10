"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DragControls, stepDrag, useDrag, type DragRef } from "./drag3d";

/**
 * 3D studio for the real CTRLstudio mark (traced to /assets/ctrl-logo.svg and
 * extruded), with RoomEnvironment reflections, studio lighting, a calm shader
 * backdrop, mouse-orbit AND grab-to-spin (drag with inertia). A
 * /assets/ctrl-logo.glb is preferred if present.
 */

const GLB_URL = "/assets/ctrl-logo.glb";
const SVG_URL = "/assets/ctrl-logo.svg";

function usePointer() {
  const p = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      p.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return p;
}
type Pointer = ReturnType<typeof usePointer>;
type FadeRef = MutableRefObject<number>;

interface LogoProps {
  pointer: Pointer;
  fadeRef: FadeRef;
  scaleFactor: number;
  lift: number;
  drag: DragRef;
  scrollRef: MutableRefObject<number>;
}

function StudioEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    return () => {
      env.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const BG_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  void main(){
    vec2 p = vUv - 0.5;
    p += uMouse * 0.04;
    float d = length(p);
    vec3 base = vec3(0.035, 0.033, 0.045);
    vec3 glow = vec3(0.10, 0.11, 0.20);
    float g = smoothstep(0.62, 0.0, d) * (0.6 + 0.12 * sin(uTime * 0.3));
    vec3 col = mix(base, glow, g);
    col *= 1.0 - smoothstep(0.45, 0.95, d) * 0.6;
    gl_FragColor = vec4(col, 1.0);
  }
`;
function CalmBackdrop({ pointer }: { pointer: Pointer }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const m = useRef({ x: 0, y: 0 });
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } }),
    [],
  );
  useFrame((_, delta) => {
    if (!matRef.current) return;
    m.current.x += (pointer.current.tx - m.current.x) * 0.05;
    m.current.y += (pointer.current.ty - m.current.y) * 0.05;
    matRef.current.uniforms.uTime.value += Math.min(delta, 0.05);
    matRef.current.uniforms.uMouse.value.set(m.current.x, m.current.y);
  });
  return (
    <mesh renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={BG_VERT}
        fragmentShader={BG_FRAG}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function SvgLogo({ pointer, fadeRef, scaleFactor, lift, drag, scrollRef }: LogoProps) {
  const data = useLoader(SVGLoader, SVG_URL);
  const { viewport } = useThree();
  const inner = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const t0 = useRef<number | null>(null);

  const { geo, width } = useMemo(() => {
    const shapes: THREE.Shape[] = [];
    for (const path of data.paths) {
      for (const s of SVGLoader.createShapes(path)) shapes.push(s);
    }
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: 220,
      bevelEnabled: true,
      bevelThickness: 28,
      bevelSize: 16,
      bevelSegments: 3,
      curveSegments: 6,
    });
    g.computeBoundingBox();
    g.center();
    const bb = g.boundingBox!;
    return { geo: g, width: bb.max.x - bb.min.x };
  }, [data]);

  // one physical material that morphs metal → glass → iridescent fluid.
  // transmission + iridescence start at 1 so their shader paths compile once;
  // the values are then driven live (uniforms only, no recompiles).
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#e6eaf3"),
        metalness: 1,
        roughness: 0.18,
        transmission: 1,
        ior: 1.5,
        thickness: 1.6,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        iridescence: 1,
        iridescenceIOR: 1.3,
        envMapIntensity: 1.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
      }),
    [],
  );
  const cols = useMemo(
    () => ({
      metal: new THREE.Color("#e6eaf3"),
      glass: new THREE.Color("#cfe0ff"),
      fluid: new THREE.Color("#e7d6ff"),
    }),
    [],
  );
  const sp = useRef(0);

  useFrame((state) => {
    if (!inner.current) return;
    const t = state.clock.elapsedTime;
    if (t0.current === null) t0.current = t;
    const intro = Math.min(1, (t - t0.current) / 1.3);
    const ease = 1 - Math.pow(1 - intro, 3); // easeOutCubic — logo grows + spins in

    const s = ((viewport.width * scaleFactor) / width) * ease;
    inner.current.scale.set(s, -s, s);

    stepDrag(drag);
    mouse.current.x += (pointer.current.tx - mouse.current.x) * 0.06;
    mouse.current.y += (pointer.current.ty - mouse.current.y) * 0.06;
    // paused: idle auto-rotation / intro spin / float / drag-spin — cursor-track only
    inner.current.rotation.y = mouse.current.x * 0.5;
    inner.current.rotation.x = -mouse.current.y * 0.26;

    // scroll-driven material morph: metal → glass → iridescent fluid
    sp.current += (scrollRef.current - sp.current) * 0.07;
    const p = sp.current;
    const L = THREE.MathUtils.lerp;
    if (p < 0.5) {
      const k = p / 0.5;
      mat.metalness = L(1, 0, k);
      mat.roughness = L(0.18, 0.05, k);
      mat.transmission = L(0, 1, k);
      mat.thickness = L(1.6, 2, k);
      mat.iridescence = 0;
      mat.color.copy(cols.metal).lerp(cols.glass, k);
    } else {
      const k = (p - 0.5) / 0.5;
      mat.metalness = L(0, 0.12, k);
      mat.roughness = L(0.05, 0.16, k);
      mat.transmission = L(1, 0.5, k);
      mat.thickness = L(2, 1.3, k);
      mat.iridescence = L(0, 1, k);
      mat.color.copy(cols.glass).lerp(cols.fluid, k);
    }
    // flowing shimmer once it's in the fluid phase
    mat.iridescenceIOR =
      1.3 + Math.sin(t * 0.7) * 0.12 * THREE.MathUtils.smoothstep(p, 0.5, 1);

    const fade = fadeRef.current;
    mat.opacity = fade;
    inner.current.visible = fade > 0.02;
  });

  return (
    <group position={[0, lift, 0]}>
      <group ref={inner}>
        <mesh geometry={geo} material={mat} />
      </group>
    </group>
  );
}

function GlbLogo({ pointer, fadeRef, scaleFactor, lift, drag }: LogoProps) {
  const gltf = useLoader(GLTFLoader, GLB_URL);
  const { viewport } = useThree();
  const inner = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const model = useMemo(() => {
    const s = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    s.position.sub(center);
    const mats: THREE.Material[] = [];
    s.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[];
      if (Array.isArray(m)) mats.push(...m);
      else if (m) mats.push(m);
    });
    return { s, w: size.x || 1, mats };
  }, [gltf]);

  useFrame(() => {
    if (!inner.current) return;
    inner.current.scale.setScalar(
      Math.min((viewport.width * scaleFactor) / model.w, 2),
    );
    stepDrag(drag);
    mouse.current.x += (pointer.current.tx - mouse.current.x) * 0.06;
    mouse.current.y += (pointer.current.ty - mouse.current.y) * 0.06;
    // paused: idle auto-rotation / float / drag-spin — cursor-track only
    inner.current.rotation.y = mouse.current.x * 0.5;
    inner.current.rotation.x = -mouse.current.y * 0.28;

    const fade = fadeRef.current;
    for (const m of model.mats) {
      m.transparent = fade < 0.999;
      m.opacity = fade;
    }
    inner.current.visible = fade > 0.02;
  });

  return (
    <group position={[0, lift, 0]}>
      <group ref={inner}>
        <primitive object={model.s} />
      </group>
    </group>
  );
}

function Scene({
  glb,
  pointer,
  fadeRef,
  scaleFactor,
  lift,
  transparent,
  drag,
  scrollRef,
}: {
  glb: boolean;
  pointer: Pointer;
  fadeRef: FadeRef;
  scaleFactor: number;
  lift: number;
  transparent: boolean;
  drag: DragRef;
  scrollRef: MutableRefObject<number>;
}) {
  return (
    <>
      <StudioEnv />
      <DragControls drag={drag} />
      {!transparent && <CalmBackdrop pointer={pointer} />}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-5, -1, 2]} intensity={0.7} color="#b06bff" />
      <pointLight position={[0, 1, 5]} intensity={1.2} color="#9aa6ff" />
      <Suspense fallback={null}>
        {glb ? (
          <GlbLogo pointer={pointer} fadeRef={fadeRef} scaleFactor={scaleFactor} lift={lift} drag={drag} scrollRef={scrollRef} />
        ) : (
          <SvgLogo pointer={pointer} fadeRef={fadeRef} scaleFactor={scaleFactor} lift={lift} drag={drag} scrollRef={scrollRef} />
        )}
      </Suspense>
    </>
  );
}

export function Logo3D({
  fade = 1,
  className = "pointer-events-none fixed inset-0 z-0 bg-bg",
  scaleFactor = 0.62,
  lift = 0,
  transparent = false,
}: {
  fade?: number;
  className?: string;
  scaleFactor?: number;
  lift?: number;
  transparent?: boolean;
}) {
  const pointer = usePointer();
  const drag = useDrag();
  const fadeRef = useRef(1);
  fadeRef.current = fade;
  const [glb, setGlb] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true); // pause rendering when off-screen
  const scrollRef = useRef(0); // 0 at top → 1 after ~0.75 viewport (drives morph)

  useEffect(() => {
    fetch(GLB_URL, { method: "HEAD" })
      .then((r) => setGlb(r.ok))
      .catch(() => setGlb(false));
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // GSAP ScrollTrigger is Lenis-wired (SmoothScroll) → reliable scroll progress
    // over the hero. Drives the metal → glass → fluid material morph.
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "center top",
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(id);
      st.kill();
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setActive(entries[0].isIntersecting),
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: transparent,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 6], fov: 35 }}
      >
        <Scene
          glb={glb}
          pointer={pointer}
          fadeRef={fadeRef}
          scaleFactor={scaleFactor}
          lift={lift}
          transparent={transparent}
          drag={drag}
          scrollRef={scrollRef}
        />
      </Canvas>
    </div>
  );
}

export default Logo3D;
