"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page reactive background (DOM/CSS — renders everywhere, incl. reduced
 * motion and weak GPUs). The active style's section images are stacked as
 * fixed layers that cross-fade as the page scrolls, each parallaxing at a
 * different depth with the mouse, over a slow Ken-Burns drift. A vignette and
 * indigo tint sit on top. WebGL is a later upgrade once a style is chosen.
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

export function SceneBackground({ styleIndex = 0 }: { styleIndex?: number }) {
  const urls = STYLES[styleIndex] ?? STYLES[0];
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const st = useRef({ p: 0, mx: 0, my: 0, tmx: 0, tmy: 0, t: 0 });

  useEffect(() => {
    const s = st.current;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      s.p = h > 0 ? clamp(window.scrollY / h, 0, 1) : 0;
    };
    const onMove = (e: PointerEvent) => {
      s.tmx = (e.clientX / window.innerWidth) * 2 - 1;
      s.tmy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      s.mx += (s.tmx - s.mx) * 0.06;
      s.my += (s.tmy - s.my) * 0.06;
      s.t += 0.0015;
      const n = layers.current.length;
      const f = s.p * (n - 1);
      const driftX = Math.cos(s.t) * 6;
      const driftY = Math.sin(s.t * 0.8) * 6;
      layers.current.forEach((el, i) => {
        if (!el) return;
        const op = clamp(1 - Math.abs(f - i), 0, 1);
        el.style.opacity = String(op);
        const depth = 14 + i * 6; // deeper sections parallax a touch more
        const x = -s.mx * depth + driftX;
        const y = -s.my * depth + driftY;
        el.style.transform = `scale(1.14) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [urls.length]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg"
      aria-hidden
    >
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

      {/* indigo/violet tint */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(180deg, rgba(107,121,255,0.16), rgba(176,107,255,0.12))",
        }}
      />
      {/* vignette + floor fade for legibility */}
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

export default SceneBackground;
