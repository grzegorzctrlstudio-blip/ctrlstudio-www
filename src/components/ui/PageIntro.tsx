import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { MouseLight } from "@/components/effects/MouseLight";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
}

/** Shared top-of-page header for inner routes — clears the fixed header. */
export function PageIntro({ eyebrow, title, intro, children, className }: PageIntroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pb-14 pt-[calc(var(--header-h)+clamp(3rem,8vh,7rem))]",
        className,
      )}
    >
      <MouseLight size="40rem" intensity={0.16} />
      <div className="absolute inset-0 grid-field opacity-30" aria-hidden />
      <div className="container-x relative flex flex-col gap-6">
        <Reveal>
          <span className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            {eyebrow}
          </span>
        </Reveal>
        <TextReveal as="h1" text={title} className="display-xl text-gradient max-w-[16ch]" />
        {intro && (
          <Reveal delay={0.1}>
            <p className="lead max-w-2xl">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
