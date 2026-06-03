"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

/**
 * Showreel: a wide 16:9 window that scales in as it enters the viewport, with
 * CONTENT / TECHNOLOGY / SPACE that spread apart across it on scroll. Media is
 * the local cosmic clip for now — swap for the Vimeo showreel once embedding is
 * enabled.
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.6], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);
  const xLeft = useTransform(scrollYProgress, [0.15, 0.85], ["0vw", "-17vw"]);
  const xRight = useTransform(scrollYProgress, [0.15, 0.85], ["0vw", "17vw"]);

  // two-line heading
  const t = data.text;
  const cut = (() => {
    const i = t.indexOf(" ", Math.floor(t.length / 2) - 6);
    return i < 0 ? t.length : i;
  })();
  const line1 = t.slice(0, cut);
  const line2 = t.slice(cut + 1);

  const word =
    "font-display text-2xl font-bold uppercase tracking-tight text-gradient sm:text-4xl md:text-5xl";

  return (
    <section id="showreel" className="section flex flex-col items-center">
      <p className="eyebrow mb-3">Showreel</p>
      <h2 className="mb-12 max-w-[42ch] text-center font-display text-xl font-bold uppercase tracking-tight sm:text-2xl md:text-3xl">
        <span className="block">{line1}</span>
        {line2 && <span className="block">{line2}</span>}
      </h2>

      <div ref={ref} className="w-full">
        <motion.div
          style={{ scale, opacity }}
          className="relative mx-auto aspect-video w-full max-w-[1400px] overflow-hidden rounded-2xl border border-line-strong shadow-[0_50px_140px_-40px_rgba(107,121,255,0.45)]"
        >
          <video
            src="/assets/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-bg/30" />

          <motion.div
            style={{ opacity: textOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.span style={{ x: xLeft }} className={word}>
              Content
            </motion.span>
            <motion.span className={`${word} mx-5 sm:mx-9`}>
              Technology
            </motion.span>
            <motion.span style={{ x: xRight }} className={word}>
              Space
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
