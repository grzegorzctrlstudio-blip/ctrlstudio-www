"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

/**
 * Showreel — reference-style scroll scaling:
 * a 16:9 window grows from small to fullscreen as you scroll through a pinned
 * (sticky) stage, then CONTENT / TECHNOLOGY / SPACE fly toward the camera and
 * burst into particles. Media = local cosmic clip for now (swap for the Vimeo
 * showreel once embedding is enabled).
 */

// deterministic particle ring (no Math.random in render)
const PARTS = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2 + (i % 4) * 0.6;
  const d = 26 + (i % 6) * 9;
  const s = 2 + (i % 4);
  return { x: Math.cos(a) * d, y: Math.sin(a) * d, s };
});

export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // window scales from small to fullscreen 16:9
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.4, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [26, 12]);

  // words fly toward the camera + spread, then fade
  const wordsScale = useTransform(scrollYProgress, [0.48, 0.95], [1, 4.2]);
  const wordsOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.6, 0.86, 0.96],
    [0, 1, 1, 0],
  );
  const xContent = useTransform(scrollYProgress, [0.48, 0.95], ["0vw", "-16vw"]);
  const xSpace = useTransform(scrollYProgress, [0.48, 0.95], ["0vw", "16vw"]);

  // particle burst
  const partScale = useTransform(scrollYProgress, [0.5, 0.96], [0.2, 3.4]);
  const partOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.64, 0.96],
    [0, 1, 0],
  );

  const word =
    "font-display text-3xl font-bold uppercase tracking-tight text-gradient sm:text-5xl md:text-6xl";

  return (
    <section ref={ref} id="showreel" className="relative h-[210vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4">
        <h2 className="mb-8 max-w-[92vw] text-center font-display text-base font-bold uppercase tracking-tight text-ink sm:text-xl md:whitespace-nowrap md:text-2xl">
          {data.text}
        </h2>

        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative aspect-video w-full max-w-[1500px] overflow-hidden border border-line-strong shadow-[0_60px_160px_-40px_rgba(107,121,255,0.5)]"
        >
          <video
            src="/assets/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-bg/25" />

          {/* particle burst */}
          <motion.div
            style={{ scale: partScale, opacity: partOpacity }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              {PARTS.map((p, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-accent"
                  style={{
                    width: p.s,
                    height: p.s,
                    left: p.x,
                    top: p.y,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* words flying toward the camera */}
          <motion.div
            style={{ scale: wordsScale, opacity: wordsOpacity }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <motion.span style={{ x: xContent }} className={word}>
              Content
            </motion.span>
            <motion.span className={`${word} mx-5 sm:mx-9`}>
              Technology
            </motion.span>
            <motion.span style={{ x: xSpace }} className={word}>
              Space
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
