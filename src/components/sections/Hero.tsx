"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { TextScramble } from "@/components/ui/text-scramble";

const Logo3D = dynamic(
  () => import("@/components/effects/Logo3D").then((m) => m.Logo3D),
  { ssr: false },
);

interface HeroProps {
  headline: string;
  subtext: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero({ headline, subtext }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
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

  // kick off the text "decode" once the load-in entrance has started
  const [decoded, setDecoded] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setDecoded(true), 550);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden"
    >
      {/* transparent → the animated depth background plays under the logo */}
      <Logo3D transparent className="absolute inset-0" scaleFactor={0.32} lift={0.35} />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 px-6 pb-[6vh]"
      >
        {/* staggered load-in entrance (after the loader clears) */}
        <motion.div
          initial={reduced ? "show" : "hidden"}
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } },
          }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="display text-gradient text-balance text-3xl leading-[0.96] [text-shadow:0_2px_40px_rgba(0,0,0,0.65)] sm:text-4xl md:text-5xl"
          >
            <TextScramble as="span" className="block" trigger={decoded} duration={0.9} speed={0.03}>
              {line1}
            </TextScramble>
            {line2 && (
              <TextScramble as="span" className="block" trigger={decoded} duration={1.05} speed={0.03}>
                {line2}
              </TextScramble>
            )}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="lead max-w-xl [text-shadow:0_2px_24px_rgba(0,0,0,0.75)]"
          >
            <TextScramble as="span" trigger={decoded} duration={1.1} speed={0.025}>
              {subtext}
            </TextScramble>
          </motion.p>
          <motion.div variants={fadeUp}>
            <p className="eyebrow mt-2 animate-float">↓ Przewiń</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
