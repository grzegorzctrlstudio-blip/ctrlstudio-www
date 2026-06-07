"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { TextScramble } from "@/components/ui/text-scramble";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface TextRevealProps {
  text: string;
  as?: Tag;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/**
 * Headline reveal — a "decode" scramble. Kept the TextReveal name + API so every
 * existing call site animates without changes. Fires when scrolled into view;
 * reduced motion is handled inside TextScramble. `delay`/`stagger` are accepted
 * for back-compat and intentionally ignored.
 */
export function TextReveal({
  text,
  as = "h2",
  className,
  id,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount: 0.4 });

  return (
    <TextScramble
      ref={ref}
      as={as}
      id={id}
      className={className}
      trigger={inView}
      speed={0.03}
      duration={0.9}
    >
      {text}
    </TextScramble>
  );
}
