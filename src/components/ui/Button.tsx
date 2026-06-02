"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { usePointerFine } from "@/hooks/useMediaQuery";

type Variant = "solid" | "line" | "ghost";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const base =
  "group relative inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 will-change-transform";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-bg hover:bg-accent-ink",
  line: "border border-line-strong text-ink hover:border-accent hover:text-accent-ink",
  ghost: "text-ink-dim hover:text-ink",
};

/** Premium magnetic button. Works as an internal link, external link, or button. */
export function Button({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  arrow = true,
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const magnetic = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 18);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 18);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  const classes = cn(base, variants[variant], className);
  const isExternal = href?.startsWith("http");

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {href ? (
        isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            data-cursor
            aria-label={ariaLabel}
          >
            {inner}
          </a>
        ) : (
          <Link href={href} className={classes} data-cursor aria-label={ariaLabel}>
            {inner}
          </Link>
        )
      ) : (
        <button
          type={type}
          onClick={onClick}
          className={classes}
          data-cursor
          aria-label={ariaLabel}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}
