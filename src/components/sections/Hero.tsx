"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Cta } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/ui/TextReveal";
import { HeroObject } from "@/components/effects/HeroObject";
import { MouseLight } from "@/components/effects/MouseLight";

interface HeroProps {
  headline: string;
  subtext: string;
  ctas: Cta[];
}

export function Hero({ headline, subtext, ctas }: HeroProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = reduced ? 0 : yRaw;
  const opacity = reduced ? 1 : opacityRaw;

  return (
    <section ref={ref} className="relative min-h-svh w-full overflow-hidden">
      {/* interactive object / background */}
      <HeroObject />
      <MouseLight size="40rem" intensity={0.18} />

      {/* legibility scrim toward the bottom where the copy sits */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-transparent" />

      <motion.div
        style={{ y, opacity }}
        className="container-x relative z-10 flex min-h-svh flex-col justify-end pb-16 pt-[var(--header-h)]"
      >
        <motion.span
          className="eyebrow mb-6 flex items-center gap-3"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="inline-block h-px w-8 bg-accent" />
          Creative-technology studio
        </motion.span>

        <TextReveal
          as="h1"
          text={headline}
          delay={0.4}
          className="display-hero text-gradient max-w-[15ch]"
        />

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            className="lead max-w-xl text-balance"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {subtext}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {ctas.map((cta, i) => (
              <Button
                key={cta.href}
                href={cta.href}
                variant={i === 0 ? "solid" : "line"}
              >
                {cta.label}
              </Button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      {!reduced && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ink-faint">
            Scroll
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-line-strong">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-ink"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      )}
    </section>
  );
}
