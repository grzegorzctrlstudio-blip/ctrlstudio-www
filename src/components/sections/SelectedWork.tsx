"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { placeholderGradient } from "@/lib/utils";

interface SelectedWorkProps {
  data: Homepage["selectedWork"];
  projects: Project[];
}

/**
 * Directional assemble origin by column: left tiles fly in from the left,
 * right tiles from the right, centre tiles rise from the middle.
 */
const COLS = 3;
function originFor(index: number) {
  const col = index % COLS;
  const dirX = (col / (COLS - 1) - 0.5) * 2; // -1 (far left) .. +1 (far right)
  return {
    x: dirX * 240,
    y: 24 + (1 - Math.abs(dirX)) * 78,
    rotate: dirX * -4,
    scale: 0.78,
  };
}

/**
 * Responsive tile width: 2 / 3 / 4 / 7 per row.
 * On xl (≥1280px) it's 7 per row, so 13 tiles assemble into 7 + 6
 * (the short last row is centred by the flex container).
 */
const TILE_W =
  "w-[calc(50%_-_0.5rem)] lg:w-[calc(33.333%_-_0.667rem)]";

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

        <div className="flex flex-wrap justify-center gap-4">
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

/** One tile that scrubs from scattered → assembled with scroll. */
function AssembleTile({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const s = originFor(index);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  const x = useTransform(p, [0, 0.75], [s.x, 0]);
  const y = useTransform(p, [0, 0.75], [s.y, 0]);
  const rotate = useTransform(p, [0, 0.75], [s.rotate, 0]);
  const scale = useTransform(p, [0, 0.75], [s.scale, 1]);
  const opacity = useTransform(p, [0, 0.3], [0, 1]);

  if (reduced) {
    return (
      <div className={TILE_W}>
        <CompactTile project={project} />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={TILE_W}
      style={{ x, y, rotate, scale, opacity, willChange: "transform" }}
    >
      <CompactTile project={project} />
    </motion.div>
  );
}

/** Image-forward compact tile — the cover fills it; a tiny caption is overlaid. */
function CompactTile({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor
      aria-label={`${project.title} — zobacz projekt`}
      className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-line bg-bg-raised"
    >
      {project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, (max-width:1280px) 25vw, 14vw"
          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: placeholderGradient(project.accent) }}
        />
      )}

      {/* accent line grows on hover */}
      <span
        className="absolute left-0 top-0 z-10 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: project.accent }}
      />

      {/* bottom gradient + tiny caption (image stays the hero) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-4">
        <p className="truncate text-[11px] uppercase tracking-[0.18em] text-white/60">
          {project.category}
        </p>
        <h3 className="truncate text-[15px] font-medium leading-tight text-white">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
