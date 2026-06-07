"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import type { Homepage } from "@/lib/types";
import { TextScramble } from "@/components/ui/text-scramble";

/**
 * Showreel (pinned stage), vertical layout that fills the screen:
 *   [ CONTENT · TECHNOLOGY · SPACE ]   ← top band, scales up + scrambles in
 *   [        16:9 window        ]      ← Vimeo showreel (ambient loop)
 *   [   Zobacz… (2 lines)        ]      ← bottom band, scales up + scrambles in
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // screen + texts grow TOGETHER (same scale), centered
  const scale = useTransform(scrollYProgress, [0, 0.22], [0.5, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.22], [22, 12]);
  const topOpacity = useTransform(scrollYProgress, [0.02, 0.2], [0, 1]);
  const botOpacity = useTransform(scrollYProgress, [0.06, 0.24], [0, 1]);

  // fire the text scramble once the reel scrolls into view
  const [started, setStarted] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.05) setStarted(true);
  });

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
          style={{ opacity: topOpacity, scale }}
          className="flex flex-[0.85] items-center justify-center gap-4 text-center sm:gap-10"
        >
          <TextScramble
            as="span"
            className={topWord}
            trigger={started}
            duration={0.9}
            speed={0.035}
          >
            Content
          </TextScramble>
          <TextScramble
            as="span"
            className={topWord}
            trigger={started}
            duration={1.1}
            speed={0.03}
          >
            Technology
          </TextScramble>
          <TextScramble
            as="span"
            className={topWord}
            trigger={started}
            duration={0.8}
            speed={0.04}
          >
            Space
          </TextScramble>
        </motion.div>

        {/* 16:9 window — Vimeo showreel */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative aspect-video max-h-[40svh] w-full max-w-[1180px] shrink-0 overflow-hidden border border-line-strong bg-black shadow-[0_60px_160px_-40px_rgba(107,121,255,0.5)]"
        >
          {data.vimeoId ? (
            <iframe
              src={`https://player.vimeo.com/video/${data.vimeoId}?background=1&autoplay=1&loop=1&muted=1&dnt=1`}
              title={data.title}
              allow="autoplay; fullscreen; picture-in-picture"
              className="pointer-events-none absolute inset-0 h-full w-full"
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

        {/* BOTTOM band */}
        <motion.div
          style={{ opacity: botOpacity, scale }}
          className="flex flex-[1.15] items-center justify-center"
        >
          <h2
            aria-label={data.text}
            className="display text-center text-gradient text-base leading-[1.06] sm:text-2xl md:text-4xl lg:text-5xl"
          >
            <TextScramble
              as="span"
              className="block whitespace-nowrap"
              trigger={started}
              duration={1.1}
              speed={0.03}
            >
              {line1}
            </TextScramble>
            {line2 && (
              <TextScramble
                as="span"
                className="block whitespace-nowrap"
                trigger={started}
                duration={1.2}
                speed={0.03}
              >
                {line2}
              </TextScramble>
            )}
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
