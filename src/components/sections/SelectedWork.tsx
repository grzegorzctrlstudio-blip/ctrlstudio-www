"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { Homepage, Project } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";

interface SelectedWorkProps {
  data: Homepage["selectedWork"];
  projects: Project[];
}

/**
 * Stable, varied scatter origins. Each tile starts off-position (different
 * direction), scaled down and rotated, then settles into its grid slot as it
 * scrolls toward the viewport centre — a random "fly-in + assemble".
 */
const SCATTER = [
  { x: -130, y: 70, rotate: -8, scale: 0.6 },
  { x: 140, y: 46, rotate: 7, scale: 0.55 },
  { x: -110, y: 96, rotate: 6, scale: 0.62 },
  { x: 132, y: 80, rotate: -7, scale: 0.58 },
  { x: -34, y: 122, rotate: 4, scale: 0.64 },
  { x: 112, y: 104, rotate: -5, scale: 0.56 },
];

export function SelectedWork({ data, projects }: SelectedWorkProps) {
  return (
    <section className="section overflow-x-clip">
      <div className="container-x flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Wybrane realizacje" title={data.title} intro={data.text} />
          <Reveal className="hidden shrink-0 md:block">
            <Button href="/work" variant="line">
              Wszystkie realizacje
            </Button>
          </Reveal>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {projects.map((project, i) => (
            <AssembleTile key={project.slug} project={project} index={i} />
          ))}
        </div>

        <Reveal className="md:hidden">
          <Button href="/work" variant="line">
            Wszystkie realizacje
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/** One project tile that scrubs from scattered → assembled with scroll. */
function AssembleTile({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const s = SCATTER[index % SCATTER.length];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  // soften the scrub so fast scrolling glides instead of snapping
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const x = useTransform(p, [0, 0.75], [s.x, 0]);
  const y = useTransform(p, [0, 0.75], [s.y, 0]);
  const rotate = useTransform(p, [0, 0.75], [s.rotate, 0]);
  const scale = useTransform(p, [0, 0.75], [s.scale, 1]);
  const opacity = useTransform(p, [0, 0.3], [0, 1]);

  const widthCls = "w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]";

  if (reduced) {
    return (
      <div className={widthCls}>
        <ProjectCard project={project} index={index} />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={widthCls}
      style={{ x, y, rotate, scale, opacity, willChange: "transform" }}
    >
      <ProjectCard project={project} index={index} />
    </motion.div>
  );
}
