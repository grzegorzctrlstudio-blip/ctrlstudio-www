"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { Homepage } from "@/lib/types";
import { TextScramble } from "@/components/ui/text-scramble";

/**
 * Showreel — CONTENT · TECHNOLOGY · SPACE decode in, then a large 16:9 Vimeo
 * window (with controls) scales up to fill the screen. Not scroll-pinned: an
 * interactive iframe + scroll-jacking would trap the wheel over the video.
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const topWord =
    "font-display text-xl font-bold uppercase tracking-tight text-gradient sm:text-3xl md:text-5xl lg:text-6xl";

  const vimeoSrc = data.vimeoId
    ? `https://player.vimeo.com/video/${data.vimeoId}?autoplay=1&loop=1&muted=1&controls=1&dnt=1&title=0&byline=0&portrait=0`
    : undefined;

  return (
    <section
      id="showreel"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center gap-6 overflow-hidden px-4 py-16 sm:gap-8"
    >
      {/* labels — decode in early */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center sm:gap-x-10">
        <TextScramble as="span" className={topWord} trigger={inView} duration={0.9} speed={0.035}>
          Content
        </TextScramble>
        <TextScramble as="span" className={topWord} trigger={inView} duration={1.1} speed={0.03}>
          Technology
        </TextScramble>
        <TextScramble as="span" className={topWord} trigger={inView} duration={0.8} speed={0.04}>
          Space
        </TextScramble>
      </div>

      {/* big 16:9 window with controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-video max-h-[76svh] w-full max-w-[1600px] overflow-hidden rounded-xl border border-line-strong bg-black shadow-[0_60px_160px_-40px_rgba(107,121,255,0.55)]"
      >
        {vimeoSrc ? (
          <iframe
            src={vimeoSrc}
            title={data.title}
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        ) : (
          <video
            src={data.src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </motion.div>
    </section>
  );
}
