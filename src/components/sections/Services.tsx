"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import type { Service, ServiceVisual } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/effects/Parallax";
import { ServiceIcon3D, type IconShape } from "@/components/effects/ServiceIcon3D";
import { TextScramble } from "@/components/ui/text-scramble";

// Each pillar → a distinct real-time 3D form (transparent, mouse-reactive),
// chosen to match the pillar's description.
const ICON: Record<ServiceVisual, IconShape> = {
  experience: "play", // Content & animacje — play wedge (video / motion)
  interactive: "gimbal", // Aplikacje interaktywne — nested realtime rings
  scenography: "rack", // Systemy multimedialne — media server with ports
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

function ServiceRow({ service, flip }: { service: Service; flip: boolean }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.6 });

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(flip && "lg:order-2")}>
        <div className="flex flex-col gap-5">
          <span className="font-display text-6xl text-ink/10 sm:text-7xl">
            {service.index}
          </span>
          <h3 ref={titleRef} className="display-lg text-ink">
            <TextScramble
              as="span"
              trigger={titleInView}
              duration={0.9}
              speed={0.03}
            >
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
      </Reveal>

      <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
        <Parallax distance={26}>
          <ServiceIcon3D shape={ICON[service.visual]} />
        </Parallax>
      </Reveal>
    </div>
  );
}
