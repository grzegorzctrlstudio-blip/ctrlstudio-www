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
 * 3D studio for the real CTRLstudio mark. Outlines are traced from the brand
 * PNG to /assets/ctrl-logo.svg and extruded to genuine 3D here, with
 * RoomEnvironment reflections, studio lighting, a calm shader backdrop and
 * mouse-orbit. A Spline/Blender /assets/ctrl-logo.glb is preferred if present.
 * `fade` (1→0) dissolves the logo (used by the homepage hero as the showreel
 * expands).
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

function useMouseRig(ref: React.RefObject<THREE.Object3D | null>, pointer: Pointer) {
  const e = useRef({ x: 0, y: 0 });
  useFrame((state) => {
    const o = ref.current;
    if (!o) return;
    e.current.x += (pointer.current.tx - e.current.x) * 0.06;
    e.current.y += (pointer.current.ty - e.current.y) * 0.06;
    const t = state.clock.elapsedTime;
    o.rotation.y = e.current.x * 0.5 + Math.sin(t * 0.25) * 0.08;
    o.rotation.x = -e.current.y * 0.28;
    o.position.y = Math.sin(t * 0.7) * 0.05;
  });
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

function SvgLogo({ pointer, fadeRef }: { pointer: Pointer; fadeRef: FadeRef }) {
  const data = useLoader(SVGLoader, SVG_URL);
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  useMouseRig(group, pointer);

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

  useFrame(() => {
    if (!group.current) return;
    const s = (viewport.width * 0.62) / width;
    group.current.scale.set(s, -s, s);
    const fade = fadeRef.current;
    mat.opacity = fade;
    mat.transparent = fade < 0.999;
    group.current.visible = fade > 0.02;
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} material={mat} />
    </group>
  );
}

function GlbLogo({ pointer, fadeRef }: { pointer: Pointer; fadeRef: FadeRef }) {
  const gltf = useLoader(GLTFLoader, GLB_URL);
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  useMouseRig(group, pointer);

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
    if (!group.current) return;
    group.current.scale.setScalar(Math.min((viewport.width * 0.6) / model.w, 2));
    const fade = fadeRef.current;
    for (const m of model.mats) {
      m.transparent = fade < 0.999;
      m.opacity = fade;
    }
    group.current.visible = fade > 0.02;
  });

  return (
    <group ref={group}>
      <primitive object={model.s} />
    </group>
  );
}

function Scene({
  glb,
  pointer,
  fadeRef,
}: {
  glb: boolean;
  pointer: Pointer;
  fadeRef: FadeRef;
}) {
  return (
    <>
      <StudioEnv />
      <CalmBackdrop pointer={pointer} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-5, -1, 2]} intensity={0.7} color="#b06bff" />
      <pointLight position={[0, 1, 5]} intensity={1.2} color="#9aa6ff" />
      <Suspense fallback={null}>
        {glb ? (
          <GlbLogo pointer={pointer} fadeRef={fadeRef} />
        ) : (
          <SvgLogo pointer={pointer} fadeRef={fadeRef} />
        )}
      </Suspense>
    </>
  );
}

export function Logo3D({
  fade = 1,
  className = "pointer-events-none fixed inset-0 z-0 bg-bg",
}: {
  fade?: number;
  className?: string;
}) {
  const pointer = usePointer();
  const fadeRef = useRef(1);
  fadeRef.current = fade;
  const [glb, setGlb] = useState(false);

  useEffect(() => {
    fetch(GLB_URL, { method: "HEAD" })
      .then((r) => setGlb(r.ok))
      .catch(() => setGlb(false));
  }, []);

  return (
    <div className={className} aria-hidden>
      <Canvas
        className="!fixed inset-0"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 35 }}
      >
        <Scene glb={glb} pointer={pointer} fadeRef={fadeRef} />
      </Canvas>
    </div>
  );
}

export default Logo3D;
