"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticleBackgroundProps {
  className?: string;
  /** Relative particle count multiplier. */
  density?: number;
  /** Tint a few particles with the accent colour. */
  accent?: boolean;
}

interface P {
  x: number;
  y: number;
  z: number; // depth 0.15–1
  r: number;
  ph: number; // drift phase
  acc: boolean;
}

/**
 * Lightweight canvas dot-field — an abstract "spatial grid" of points that
 * drift slowly and parallax with the cursor. DPR-capped, pauses when hidden,
 * renders a single static frame under reduced motion. Used as the hero's
 * non-3D backdrop and general atmosphere.
 */
export function ParticleBackground({
  className,
  density = 1,
  accent = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: P[] = [];
    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    let raf = 0;
    let running = true;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isSmall = w < 720;
      const count = Math.min(
        isSmall ? 42 : 104,
        Math.max(22, Math.round(((w * h) / 16500) * density)),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.15 + Math.random() * 0.85,
        r: 0.6 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
        acc: accent && Math.random() < 0.12,
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      const mx = (mouse.x - 0.5) * 2;
      const my = (mouse.y - 0.5) * 2;

      for (const p of particles) {
        const shift = p.z * 26;
        const drift = Math.sin(time * 0.0006 + p.ph) * 4 * p.z;
        const px = p.x - mx * shift;
        const py = p.y - my * shift + drift;
        const alpha = 0.12 + p.z * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.acc
          ? `rgba(123,140,255,${alpha})`
          : `rgba(244,244,246,${alpha})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = (e.clientY - rect.top) / rect.height;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
