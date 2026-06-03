"use client";

import { useRef } from "react";

/**
 * Hyperrealistic 3D pillar icon (Higgsfield render). Floats idly, tilts in 3D
 * toward the pointer, and its glow lifts on hover. The render is on black, so
 * `mix-blend-screen` drops the black into the dark card.
 */
export function ServiceIcon({ src, alt }: { src: string; alt: string }) {
  const tilt = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (tilt.current) {
      tilt.current.style.transform = `rotateY(${px * 18}deg) rotateX(${-py * 18}deg) scale(1.06)`;
    }
  };
  const onLeave = () => {
    if (tilt.current) tilt.current.style.transform = "";
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-bg-raised [perspective:1000px]"
    >
      <div className="glow absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-75" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-[82%] w-[82%] animate-float">
          <div
            ref={tilt}
            className="h-full w-full transition-transform duration-300 ease-out will-change-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-contain mix-blend-screen"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
