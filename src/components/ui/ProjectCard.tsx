"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/lib/types";
import { cn, indexLabel, placeholderGradient } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
  className?: string;
  /** Wide cinematic hero treatment (full-width lead card). */
  featured?: boolean;
}

export function ProjectCard({
  project,
  index = 0,
  className,
  featured = false,
}: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    if (project.hoverVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };
  const onLeave = () => {
    if (project.hoverVideo && videoRef.current) {
      const v = videoRef.current;
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-line bg-bg-raised",
        className,
      )}
      aria-label={`${project.title} — zobacz projekt`}
    >
      {/* visual */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          featured ? "aspect-[16/10] sm:aspect-[21/9]" : "aspect-[4/3]",
        )}
      >
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            priority={featured}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            style={{ background: placeholderGradient(project.accent) }}
          >
            <div className="absolute inset-0 grid-field opacity-60" />
            <span className="absolute right-5 top-4 font-mono text-xs tracking-[0.3em] text-white/30">
              {indexLabel(index + 1)}
            </span>
            <span
              className="absolute -bottom-4 left-4 font-display text-[7rem] leading-none text-white/[0.04]"
              aria-hidden
            >
              {indexLabel(index + 1)}
            </span>
          </div>
        )}

        {project.hoverVideo && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={project.hoverVideo} type="video/mp4" />
          </video>
        )}

        {/* top accent line grows on hover */}
        <span
          className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ background: project.accent }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      </div>

      {/* meta */}
      <div className="flex items-end justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="eyebrow mb-2 truncate">{project.category}</p>
          <h3 className="display-lg text-ink">{project.title}</h3>
          <p
            className={cn(
              "mt-3 max-w-md text-sm leading-relaxed text-ink-dim transition-opacity duration-500",
              featured ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            {project.shortDescription}
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-2 text-sm text-ink-dim transition-colors group-hover:text-accent-ink sm:flex">
          <span className="font-mono text-xs">{project.year}</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
