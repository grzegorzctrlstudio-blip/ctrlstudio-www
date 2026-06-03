"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

/**
 * Showreel (pinned stage), vertical layout that fills the screen:
 *   [ CONTENT · TECHNOLOGY · SPACE ]   ← top band, scales up to fill
 *   [        16:9 window        ]      ← appears fast, sits high
 *   [   Zobacz… (2 lines)        ]      ← bottom band, scales up to fill
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // window appears fast
  const scale = useTransform(scrollYProgress, [0, 0.18], [0.55, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.18], [22, 12]);

  // top words: reveal + grow to fill the band
  const topOpacity = useTransform(scrollYProgress, [0.18, 0.4], [0, 1]);
  const topScale = useTransform(scrollYProgress, [0.18, 0.62], [0.65, 1]);
  const topY = useTransform(scrollYProgress, [0.18, 0.4], [40, 0]);

  // bottom heading: reveal + grow to fill the band
  const botOpacity = useTransform(scrollYProgress, [0.26, 0.5], [0, 1]);
  const botScale = useTransform(scrollYProgress, [0.26, 0.66], [0.65, 1]);
  const botY = useTransform(scrollYProgress, [0.26, 0.5], [40, 0]);

  // two-line bottom text
  const t = data.text;
  const cut = (() => {
    const i = t.indexOf(" ", Math.floor(t.length / 2) - 6);
    return i < 0 ? t.length : i;
  })();
  const line1 = t.slice(0, cut);
  const line2 = t.slice(cut + 1);

  const topWord =
    "font-display text-3xl font-bold uppercase tracking-tight text-gradient sm:text-5xl md:text-6xl lg:text-7xl";

  return (
    <section ref={ref} id="showreel" className="relative h-[200vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center overflow-hidden px-4">
        {/* TOP band */}
        <motion.div
          style={{ opacity: topOpacity, scale: topScale, y: topY }}
          className="flex flex-[0.85] items-center justify-center gap-4 text-center sm:gap-10"
        >
          <span className={topWord}>Content</span>
          <span className={topWord}>Technology</span>
          <span className={topWord}>Space</span>
        </motion.div>

        {/* 16:9 window */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative aspect-video max-h-[40svh] w-full max-w-[1180px] shrink-0 overflow-hidden border border-line-strong shadow-[0_60px_160px_-40px_rgba(107,121,255,0.5)]"
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

        {/* BOTTOM band */}
        <motion.div
          style={{ opacity: botOpacity, scale: botScale, y: botY }}
          className="flex flex-[1.15] items-center justify-center"
        >
          <h2 className="display text-center text-gradient text-base leading-[1.06] sm:text-2xl md:text-4xl lg:text-5xl">
            <span className="block whitespace-nowrap">{line1}</span>
            {line2 && <span className="block whitespace-nowrap">{line2}</span>}
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
