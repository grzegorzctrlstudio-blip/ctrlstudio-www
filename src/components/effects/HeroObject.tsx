"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ParticleBackground } from "@/components/effects/ParticleBackground";

// Three.js is client-only and must be dynamically imported with ssr:false
// from inside a Client Component (Next 16 disallows ssr:false in Server Components).
const HeroScene = dynamic(
  () => import("@/components/effects/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

export function HeroObject() {
  const reduced = usePrefersReducedMotion();
  const wideEnough = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Pause the render loop while the hero is scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const use3D = mounted && !reduced && wideEnough;

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      {use3D ? (
        // global animated nebula shows through; this adds the 3D object on top
        <HeroScene active={visible} />
      ) : (
        // mobile / reduced motion: rich static aurora + light particle field
        <>
          <div className="absolute inset-0 bg-aurora-hero" />
          <ParticleBackground density={0.85} />
          <FallbackObject reduced={reduced} />
        </>
      )}
    </div>
  );
}

/** CSS/SVG fallback object — concentric "control" rings around a core. */
function FallbackObject({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-[min(64vw,22rem)] w-[min(64vw,22rem)]">
        <div className="absolute inset-0 glow opacity-70" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={
              "absolute rounded-full border border-line-strong" +
              (reduced ? "" : " animate-float")
            }
            style={{
              inset: `${i * 14}%`,
              animationDelay: `${i * 0.4}s`,
              borderColor:
                i === 1 ? "color-mix(in oklab, var(--accent) 50%, transparent)" : undefined,
            }}
          />
        ))}
        <div className="absolute inset-[36%] rotate-45 border border-accent/60 bg-bg-raised/40 backdrop-blur-sm" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="display text-2xl text-ink/80">CTRL</span>
        </div>
      </div>
    </div>
  );
}
