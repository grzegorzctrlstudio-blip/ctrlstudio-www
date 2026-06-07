"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { TextScramble } from "@/components/ui/text-scramble";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  id?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  id,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-line-strong" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <TextScramble
        as="h2"
        id={id}
        trigger={inView}
        speed={0.03}
        duration={0.9}
        className={cn(
          "display-xl text-gradient max-w-[20ch]",
          align === "center" && "max-w-[24ch]",
          titleClassName,
        )}
      >
        {title}
      </TextScramble>
      {intro && (
        <Reveal delay={0.1}>
          <p className={cn("lead max-w-2xl", align === "center" && "mx-auto")}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
