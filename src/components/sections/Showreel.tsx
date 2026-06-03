"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

/**
 * Showreel — reference-style scroll scaling: a 16:9 window grows from small to
 * (near) fullscreen as you scroll through a pinned stage. Inside it, CONTENT /
 * TECHNOLOGY / SPACE reveal with a Hubtown-style mask slide-up (clipped to the
 * window). The "Zobacz…" line sits BELOW the window. Media = local cosmic clip
 * for now (swap for the Vimeo showreel once embedding is enabled).
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.45], [0.45, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [26, 14]);

  // Hubtown-style masked reveal, staggered, contained in the window
  const y0 = useTransform(scrollYProgress, [0.4, 0.54], ["120%", "0%"]);
  const y1 = useTransform(scrollYProgress, [0.46, 0.6], ["120%", "0%"]);
  const y2 = useTransform(scrollYProgress, [0.52, 0.66], ["120%", "0%"]);
  const o0 = useTransform(scrollYProgress, [0.4, 0.54], [0, 1]);
  const o1 = useTransform(scrollYProgress, [0.46, 0.6], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.52, 0.66], [0, 1]);

  const headingOpacity = useTransform(scrollYProgress, [0.5, 0.72], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.5, 0.72], [28, 0]);

  const word =
    "block font-display text-2xl font-bold uppercase tracking-tight text-gradient sm:text-4xl md:text-5xl";

  return (
    <section ref={ref} id="showreel" className="relative h-[210vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden px-4">
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative aspect-video max-h-[64svh] w-full max-w-[1320px] overflow-hidden border border-line-strong shadow-[0_60px_160px_-40px_rgba(107,121,255,0.5)]"
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

          {/* contained Hubtown-style reveal */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 px-4 sm:gap-7">
            <span className="inline-block overflow-hidden py-1">
              <motion.span style={{ y: y0, opacity: o0 }} className={word}>
                Content
              </motion.span>
            </span>
            <span className="inline-block overflow-hidden py-1">
              <motion.span style={{ y: y1, opacity: o1 }} className={word}>
                Technology
              </motion.span>
            </span>
            <span className="inline-block overflow-hidden py-1">
              <motion.span style={{ y: y2, opacity: o2 }} className={word}>
                Space
              </motion.span>
            </span>
          </div>
        </motion.div>

        {/* heading BELOW the showreel */}
        <motion.h2
          style={{ opacity: headingOpacity, y: headingY }}
          className="max-w-[92vw] text-center font-display text-base font-bold uppercase tracking-tight text-ink sm:text-xl md:whitespace-nowrap md:text-2xl"
        >
          {data.text}
        </motion.h2>
      </div>
    </section>
  );
}
