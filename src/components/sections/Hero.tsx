"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";

const Logo3D = dynamic(
  () => import("@/components/effects/Logo3D").then((m) => m.Logo3D),
  { ssr: false },
);

interface HeroProps {
  headline: string;
  subtext: string;
}

export function Hero({ headline, subtext }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // first texts gracefully leave as you start scrolling
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  const idx = headline.toLowerCase().indexOf("powered");
  const line1 = idx > 0 ? headline.slice(0, idx).trim() : headline;
  const line2 = idx > 0 ? headline.slice(idx).trim() : "";

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden"
    >
      {/* transparent → the animated depth background plays under the logo */}
      <Logo3D transparent className="absolute inset-0" scaleFactor={0.32} lift={0.35} />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 flex flex-col items-center gap-5 px-6 pb-[6vh] text-center"
      >
        <h1 className="display text-gradient text-balance text-3xl leading-[0.96] [text-shadow:0_2px_40px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl">
          <span className="block">{line1}</span>
          {line2 && <span className="block">{line2}</span>}
        </h1>
        <p className="lead max-w-xl [text-shadow:0_2px_24px_rgba(0,0,0,0.75)]">
          {subtext}
        </p>
        <p className="eyebrow mt-2 animate-float">↓ Przewiń</p>
      </motion.div>
    </section>
  );
}
