"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { Service, ServiceVisual } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/effects/Parallax";
import { ServiceIcon3D, type IconShape } from "@/components/effects/ServiceIcon3D";
import { TextScramble } from "@/components/ui/text-scramble";

// Each pillar → a distinct real-time 3D form (transparent, mouse-reactive),
// chosen to match the pillar's description.
const ICON: Record<ServiceVisual, IconShape> = {
  experience: "play", // Content & animacje — play wedge (video / motion)
  interactive: "touch", // Aplikacje interaktywne — touchscreen with live ripple
  scenography: "rack", // Systemy multimedialne — media-server rack case
  product: "play",
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section className="section">
      <div className="container-x flex flex-col gap-16">
        <SectionHeading
          eyebrow="Co robimy"
          title={"Content, interakcja i technologia\ndla eventów, targów i przestrzeni."}
          titleClassName="max-w-[34ch]!"
          intro="Tworzymy animacje, aplikacje interaktywne i obsługujemy systemy multimedialne, które pozwalają markom działać efektownie na scenie, stoisku, wystawie albo w stałej instalacji."
        />

        <div className="flex flex-col gap-20 lg:gap-28">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** A pillar row that scrubs in from its side (alternating) as it scrolls in —
 *  the same assemble feel as the Selected-work tiles. */
function ServiceRow({ service, flip }: { service: Service; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.6 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const x = useTransform(p, [0, 0.72], [flip ? 240 : -240, 0]);
  const y = useTransform(p, [0, 0.72], [90, 0]);
  const rotateY = useTransform(p, [0, 0.72], [flip ? -30 : 30, 0]);
  const scale = useTransform(p, [0, 0.72], [0.8, 1]);
  const opacity = useTransform(p, [0, 0.4], [0, 1]);

  const cls = "grid items-center gap-8 lg:grid-cols-2 lg:gap-16";

  const inner = (
    <>
      <div className={cn(flip && "lg:order-2")}>
        <div className="flex flex-col gap-5">
          <span className="font-display text-6xl text-ink/10 sm:text-7xl">
            {service.index}
          </span>
          <h3 ref={titleRef} className="display-lg text-ink">
            <TextScramble as="span" trigger={titleInView} duration={0.9} speed={0.03}>
              {service.title}
            </TextScramble>
          </h3>
          {service.scope && (
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
              {service.scope}
            </p>
          )}
          <p className="max-w-xl text-base leading-relaxed text-ink-dim">
            {service.description}
          </p>
          {service.tags && service.tags.length > 0 && (
            <ul className="flex max-w-xl flex-wrap gap-2 pt-1">
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line bg-bg-raised/40 px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-line-strong hover:text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={cn(flip && "lg:order-1")}>
        <Parallax distance={26}>
          <ServiceIcon3D shape={ICON[service.visual]} />
        </Parallax>
      </div>
    </>
  );

  if (reduced) {
    return (
      <div ref={ref} className={cls}>
        {inner}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cls}
      style={{
        x,
        y,
        rotateY,
        scale,
        opacity,
        transformPerspective: 1000,
        willChange: "transform",
      }}
    >
      {inner}
    </motion.div>
  );
}
