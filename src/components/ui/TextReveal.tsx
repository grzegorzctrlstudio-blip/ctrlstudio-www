"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

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

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const word: Variants = {
  hidden: { y: "115%" },
  visible: { y: 0, transition: { duration: 0.72, ease: EASE_OUT } },
};

/** Word-by-word "rise" reveal for headlines. Plain text under reduced motion. */
export function TextReveal({
  text,
  as = "h2",
  className,
  id,
  delay = 0,
  stagger = 0.045,
  once = true,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} id={id}>
        {text}
      </Tag>
    );
  }

  const tagMap = {
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    p: motion.p,
    span: motion.span,
    div: motion.div,
  } as const;
  const MotionTag = tagMap[as] as typeof motion.div;

  return (
    <MotionTag
      id={id}
      className={cn(className)}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span variants={word} className="inline-block">
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </MotionTag>
  );
}
