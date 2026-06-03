"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { FontLoader, type Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * The "studio" for the 3D logo: a clean cyclorama-style scene with real
 * environment reflections (RoomEnvironment), studio lighting, a calm shader
 * backdrop and mouse-orbit. It renders a Spline/Blender `ctrl-logo.glb` if one
 * is present in /public/assets, otherwise a real extruded-3D chrome stand-in so
 * the lighting/reflections/interaction are visible immediately.
 */

const GLB_URL = "/assets/ctrl-logo.glb";
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

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

function StudioEnv() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04);
    scene.environment = env.texture;
    return () => {
      env.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* calm dark backdrop — clip-space, camera-independent */
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
    // soft studio sweep: brighter center, deep edges
    vec3 base = vec3(0.035, 0.033, 0.045);
    vec3 glow = vec3(0.10, 0.11, 0.20);
    float g = smoothstep(0.62, 0.0, d) * (0.6 + 0.12 * sin(uTime * 0.3));
    vec3 col = mix(base, glow, g);
    col *= 1.0 - smoothstep(0.45, 0.95, d) * 0.6; // vignette
    gl_FragColor = vec4(col, 1.0);
  }
`;
function CalmBackdrop({ pointer }: { pointer: ReturnType<typeof usePointer> }) {
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
    color: new THREE.Color("#e4e8f2"),
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.25,
  });
}

function useMouseRig(
  ref: React.RefObject<THREE.Object3D | null>,
  pointer: ReturnType<typeof usePointer>,
) {
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

function ExtrudedLogo({ pointer }: { pointer: ReturnType<typeof usePointer> }) {
  const font = useLoader(FontLoader, FONT_URL) as unknown as Font;
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  useMouseRig(group, pointer);

  const { ctrl, studio, width } = useMemo(() => {
    const mk = (text: string, size: number, depth: number) => {
      const g = new TextGeometry(text, {
        font,
        size,
        depth,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: depth * 0.18,
        bevelSize: size * 0.025,
        bevelSegments: 4,
      } as ConstructorParameters<typeof TextGeometry>[1]);
      g.computeBoundingBox();
      g.center();
      const w = g.boundingBox ? g.boundingBox.max.x - g.boundingBox.min.x : 1;
      return { geo: g, w };
    };
    const ctrl = mk("CTRL", 1.3, 0.42);
    const studio = mk("STUDIO", 0.34, 0.12);
    return { ctrl, studio, width: ctrl.w + 1.1 };
  }, [font]);

  useFrame(() => {
    if (!group.current) return;
    const target = viewport.width * 0.74;
    const s = Math.min(target / width, 1.15);
    group.current.scale.setScalar(s);
  });

  const mat = useMemo(chromeMaterial, []);
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#6b79ff"),
        metalness: 0.7,
        roughness: 0.25,
        emissive: new THREE.Color("#2b34a8"),
        emissiveIntensity: 0.4,
        envMapIntensity: 1,
      }),
    [],
  );

  return (
    <group ref={group}>
      <mesh geometry={ctrl.geo} material={mat} position={[0.45, 0.25, 0]} />
      <mesh
        geometry={studio.geo}
        material={mat}
        position={[0.45, -0.85, 0]}
      />
      <mesh
        material={accentMat}
        position={[-ctrl.w / 2 - 0.05, 0.25, 0]}
      >
        <boxGeometry args={[0.5, 0.5, 0.4]} />
      </mesh>
    </group>
  );
}

function GlbLogo({ pointer }: { pointer: ReturnType<typeof usePointer> }) {
  const gltf = useLoader(GLTFLoader, GLB_URL);
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  useMouseRig(group, pointer);

  const scene = useMemo(() => {
    const s = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    s.position.sub(center);
    return { s, w: size.x || 1 };
  }, [gltf]);

  useFrame(() => {
    if (!group.current) return;
    const target = viewport.width * 0.6;
    group.current.scale.setScalar(Math.min(target / scene.w, 2));
  });

  return (
    <group ref={group}>
      <primitive object={scene.s} />
    </group>
  );
}

function Scene({ glb, pointer }: { glb: boolean; pointer: ReturnType<typeof usePointer> }) {
  return (
    <>
      <StudioEnv />
      <CalmBackdrop pointer={pointer} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <directionalLight position={[-5, -1, 2]} intensity={0.7} color="#b06bff" />
      <pointLight position={[0, 1, 5]} intensity={1.2} color="#9aa6ff" />
      <Suspense fallback={null}>
        {glb ? <GlbLogo pointer={pointer} /> : <ExtrudedLogo pointer={pointer} />}
      </Suspense>
    </>
  );
}

export function Logo3D() {
  const pointer = usePointer();
  const [glb, setGlb] = useState(false);

  useEffect(() => {
    fetch(GLB_URL, { method: "HEAD" })
      .then((r) => setGlb(r.ok))
      .catch(() => setGlb(false));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-bg" aria-hidden>
      <Canvas
        className="!fixed inset-0"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 35 }}
      >
        <Scene glb={glb} pointer={pointer} />
      </Canvas>
    </div>
  );
}

export default Logo3D;
