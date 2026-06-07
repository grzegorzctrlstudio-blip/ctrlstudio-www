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

/* ---- grab-to-spin (drag orbit with inertia) ---- */
type DragState = {
  dragging: boolean;
  rx: number;
  ry: number;
  vrx: number;
  vry: number;
  lx: number;
  ly: number;
};
type DragRef = MutableRefObject<DragState>;

function useDrag(): DragRef {
  return useRef<DragState>({
    dragging: false,
    rx: 0,
    ry: 0,
    vrx: 0,
    vry: 0,
    lx: 0,
    ly: 0,
  });
}

/** Attaches pointer handlers to the canvas so you can grab + spin the logo. */
function DragControls({ drag }: { drag: DragRef }) {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y"; // vertical swipe still scrolls the page
    el.style.cursor = "grab";
    const down = (e: PointerEvent) => {
      drag.current.dragging = true;
      drag.current.lx = e.clientX;
      drag.current.ly = e.clientY;
      drag.current.vrx = 0;
      drag.current.vry = 0;
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.dragging) return;
      const dx = e.clientX - drag.current.lx;
      const dy = e.clientY - drag.current.ly;
      drag.current.lx = e.clientX;
      drag.current.ly = e.clientY;
      drag.current.ry += dx * 0.008;
      drag.current.rx += dy * 0.008;
      drag.current.vry = dx * 0.008;
      drag.current.vrx = dy * 0.008;
    };
    const up = () => {
      drag.current.dragging = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl, drag]);
  return null;
}

/** Advance drag inertia + relax the tilt back to level. Call once per frame. */
function stepDrag(drag: DragRef) {
  const d = drag.current;
  if (!d.dragging) {
    d.rx += d.vrx;
    d.ry += d.vry;
    d.vrx *= 0.93;
    d.vry *= 0.93;
    d.rx *= 0.96; // ease the up/down tilt back so it never sticks upside-down
  }
  d.rx = Math.max(-1.1, Math.min(1.1, d.rx));
}

interface LogoProps {
  pointer: Pointer;
  fadeRef: FadeRef;
  scaleFactor: number;
  lift: number;
  drag: DragRef;
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

function chromeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e6eaf3"),
    metalness: 1,
    roughness: 0.15,
    envMapIntensity: 1.3,
    side: THREE.DoubleSide,
  });
}

function SvgLogo({ pointer, fadeRef, scaleFactor, lift, drag }: LogoProps) {
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

  const mat = useMemo(chromeMaterial, []);

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
    inner.current.rotation.y =
      (1 - ease) * -Math.PI * 0.6 +
      mouse.current.x * 0.5 +
      Math.sin(t * 0.35) * 0.18 +
      drag.current.ry;
    inner.current.rotation.x =
      -mouse.current.y * 0.26 + Math.sin(t * 0.5) * 0.04 + drag.current.rx;
    inner.current.position.y = Math.sin(t * 0.8) * 0.05;

    const fade = fadeRef.current;
    mat.opacity = fade;
    mat.transparent = fade < 0.999;
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

  useFrame((state) => {
    if (!inner.current) return;
    const t = state.clock.elapsedTime;
    inner.current.scale.setScalar(
      Math.min((viewport.width * scaleFactor) / model.w, 2),
    );
    stepDrag(drag);
    mouse.current.x += (pointer.current.tx - mouse.current.x) * 0.06;
    mouse.current.y += (pointer.current.ty - mouse.current.y) * 0.06;
    inner.current.rotation.y =
      mouse.current.x * 0.5 + Math.sin(t * 0.25) * 0.08 + drag.current.ry;
    inner.current.rotation.x = -mouse.current.y * 0.28 + drag.current.rx;
    inner.current.position.y = Math.sin(t * 0.7) * 0.05;

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
}: {
  glb: boolean;
  pointer: Pointer;
  fadeRef: FadeRef;
  scaleFactor: number;
  lift: number;
  transparent: boolean;
  drag: DragRef;
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
          <GlbLogo pointer={pointer} fadeRef={fadeRef} scaleFactor={scaleFactor} lift={lift} drag={drag} />
        ) : (
          <SvgLogo pointer={pointer} fadeRef={fadeRef} scaleFactor={scaleFactor} lift={lift} drag={drag} />
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

  useEffect(() => {
    fetch(GLB_URL, { method: "HEAD" })
      .then((r) => setGlb(r.ok))
      .catch(() => setGlb(false));
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
        />
      </Canvas>
    </div>
  );
}

export default Logo3D;
