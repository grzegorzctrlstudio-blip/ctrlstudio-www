"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

const WORDS = ["Content", "Technology", "Space"];
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Showreel: a portrait window that scales in as it enters the viewport, with
 * CONTENT / TECHNOLOGY / SPACE stacked vertically and revealing one by one.
 * The media is the local cosmic clip for now — swap `mediaSrc` for the Vimeo
 * showreel once its embedding is enabled.
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 55%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section id="showreel" className="section flex flex-col items-center">
      <p className="eyebrow mb-3">Showreel</p>
      <h2 className="display-lg mb-12 max-w-[18ch] text-center text-balance">
        {data.text}
      </h2>

      <div ref={ref} className="flex w-full justify-center">
        <motion.div
          style={{ scale, opacity }}
          className="relative aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-[1.75rem] border border-line-strong shadow-[0_40px_120px_-30px_rgba(107,121,255,0.45)]"
        >
          <video
            src="/assets/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/10 to-bg/85" />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } }}
          >
            {WORDS.map((w) => (
              <motion.span
                key={w}
                variants={{ hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="font-display text-3xl font-bold uppercase tracking-tight text-gradient sm:text-4xl"
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
