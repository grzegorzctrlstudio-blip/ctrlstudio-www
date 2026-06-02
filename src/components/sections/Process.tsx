"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Process({ data }: { data: Homepage["process"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0, 1]);

  return (
    <section className="section">
      <div className="container-x flex flex-col gap-14">
        <SectionHeading eyebrow="Proces" title={data.title} intro={data.text} />

        <div ref={ref}>
          {/* horizontal timeline — desktop */}
          <div className="relative hidden md:block">
            <div className="absolute inset-x-0 top-[7px] h-px bg-line" />
            <motion.div
              className="absolute left-0 top-[7px] h-px w-full origin-left bg-accent"
              style={{ scaleX: fill }}
            />
            <ol className="grid grid-cols-5 gap-6">
              {data.steps.map((s, i) => (
                <li key={s.index} className="relative pt-9">
                  <span className="absolute left-0 top-0 h-[15px] w-[15px] rounded-full border border-line-strong bg-bg" />
                  <Reveal delay={i * 0.08}>
                    <span className="font-mono text-xs text-ink-faint">{s.index}</span>
                    <h3 className="mt-3 font-display text-2xl uppercase text-ink">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-dim">{s.description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/* vertical timeline — mobile */}
          <div className="relative md:hidden">
            <div className="absolute bottom-0 left-2 top-0 w-px bg-line" />
            <motion.div
              className="absolute left-2 top-0 h-full w-px origin-top bg-accent"
              style={{ scaleY: fill }}
            />
            <ol className="flex flex-col gap-9">
              {data.steps.map((s, i) => (
                <li key={s.index} className="relative pl-10">
                  <span className="absolute left-[1px] top-1 h-[15px] w-[15px] rounded-full border border-line-strong bg-bg" />
                  <Reveal delay={i * 0.05}>
                    <span className="font-mono text-xs text-ink-faint">{s.index}</span>
                    <h3 className="mt-1 font-display text-2xl uppercase text-ink">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-dim">{s.description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
