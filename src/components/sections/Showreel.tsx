"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

/**
 * Showreel scroll choreography (pinned stage):
 * 1. the 16:9 window scales in fast (small → full),
 * 2. CONTENT / TECHNOLOGY / SPACE reveal ABOVE the window (masked slide-up),
 *    and the big "Zobacz…" line reveals BELOW it,
 * 3. on further scroll CONTENT/SPACE spread apart and the middle word
 *    (TECHNOLOGY) fades out.
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // window scales in quickly
  const scale = useTransform(scrollYProgress, [0, 0.26], [0.55, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.26], [24, 12]);

  // masked reveal of the words above
  const yC = useTransform(scrollYProgress, [0.3, 0.44], ["120%", "0%"]);
  const yT = useTransform(scrollYProgress, [0.35, 0.49], ["120%", "0%"]);
  const yS = useTransform(scrollYProgress, [0.4, 0.54], ["120%", "0%"]);
  const oC = useTransform(scrollYProgress, [0.3, 0.44], [0, 1]);
  const oS = useTransform(scrollYProgress, [0.4, 0.54], [0, 1]);
  // middle word reveals then disappears
  const oT = useTransform(scrollYProgress, [0.35, 0.49, 0.64, 0.82], [0, 1, 1, 0]);

  // outer words spread apart on further scroll
  const xC = useTransform(scrollYProgress, [0.56, 0.88], ["0vw", "-17vw"]);
  const xS = useTransform(scrollYProgress, [0.56, 0.88], ["0vw", "17vw"]);

  // big "Zobacz…" below
  const zOpacity = useTransform(scrollYProgress, [0.34, 0.54], [0, 1]);
  const zY = useTransform(scrollYProgress, [0.34, 0.54], [28, 0]);

  const word =
    "block font-display text-2xl font-bold uppercase tracking-tight text-gradient sm:text-4xl md:text-5xl";

  return (
    <section ref={ref} id="showreel" className="relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-6 overflow-hidden px-4 md:gap-8">
        {/* words ABOVE the window */}
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <motion.span style={{ x: xC }} className="inline-block overflow-hidden py-1">
            <motion.span style={{ y: yC, opacity: oC }} className={word}>
              Content
            </motion.span>
          </motion.span>
          <span className="inline-block overflow-hidden py-1">
            <motion.span style={{ y: yT, opacity: oT }} className={word}>
              Technology
            </motion.span>
          </span>
          <motion.span style={{ x: xS }} className="inline-block overflow-hidden py-1">
            <motion.span style={{ y: yS, opacity: oS }} className={word}>
              Space
            </motion.span>
          </motion.span>
        </div>

        {/* the 16:9 window */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative aspect-video max-h-[46svh] w-full max-w-[1200px] overflow-hidden border border-line-strong shadow-[0_60px_160px_-40px_rgba(107,121,255,0.5)]"
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
        </motion.div>

        {/* big "Zobacz…" BELOW the window */}
        <motion.h2
          style={{ opacity: zOpacity, y: zY }}
          className="display-lg max-w-[22ch] text-center text-balance"
        >
          {data.text}
        </motion.h2>
      </div>
    </section>
  );
}
