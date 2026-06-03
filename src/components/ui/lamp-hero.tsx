"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface HeroAction {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  gradient?: boolean;
  blur?: boolean;
  title: string;
  subtitle?: string;
  actions?: HeroAction[];
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
  /** Interactive/animated layer rendered behind the lamp glow (e.g. particles). */
  fx?: React.ReactNode;
}

const ACCENT_CONIC_LEFT =
  "conic-gradient(from 70deg at center top, color-mix(in oklab, var(--accent) 55%, transparent), transparent 55%, transparent)";
const ACCENT_CONIC_RIGHT =
  "conic-gradient(from 290deg at center top, transparent, transparent 45%, color-mix(in oklab, var(--accent) 55%, transparent))";

/**
 * "Lamp" hero — animated conic-gradient cones forming a glowing light line at
 * the top, with the title/subtitle/actions below. Adapted to this project's
 * tokens (accent / bg / ink) and Button.
 */
const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      gradient = true,
      blur = true,
      title,
      subtitle,
      actions,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      fx,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-bg",
          className,
        )}
        {...props}
      >
        {fx && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {fx}
          </div>
        )}
        {gradient && (
          <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
            {blur && (
              <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />
            )}

            {/* Main glow */}
            <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-accent/60 opacity-80 blur-3xl" />

            {/* Lamp effect */}
            <motion.div
              initial={{ width: "8rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "16rem" }}
              className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-accent/60 blur-2xl"
            />

            {/* Top line */}
            <motion.div
              initial={{ width: "15rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "30rem" }}
              className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-accent/70"
            />

            {/* Left gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              style={{ backgroundImage: ACCENT_CONIC_LEFT }}
              className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible"
            >
              <div className="absolute bottom-0 left-0 z-20 h-40 w-[100%] bg-bg [mask-image:linear-gradient(to_top,white,transparent)]" />
              <div className="absolute bottom-0 left-0 z-20 h-[100%] w-40 bg-bg [mask-image:linear-gradient(to_right,white,transparent)]" />
            </motion.div>

            {/* Right gradient cone */}
            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              style={{ backgroundImage: ACCENT_CONIC_RIGHT }}
              className="absolute inset-auto left-1/2 h-56 w-[30rem]"
            >
              <div className="absolute bottom-0 right-0 z-20 h-[100%] w-40 bg-bg [mask-image:linear-gradient(to_left,white,transparent)]" />
              <div className="absolute bottom-0 right-0 z-20 h-40 w-[100%] bg-bg [mask-image:linear-gradient(to_top,white,transparent)]" />
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ y: 100, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="container relative z-50 flex flex-1 -translate-y-20 flex-col justify-center gap-4 px-5 md:px-10"
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1
              className={cn(
                "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
                titleClassName,
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className={cn("text-xl text-ink-dim", subtitleClassName)}>
                {subtitle}
              </p>
            )}
            {actions && actions.length > 0 && (
              <div className={cn("flex gap-3", actionsClassName)}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    href={action.href}
                    variant={action.variant === "outline" ? "line" : "solid"}
                    arrow={false}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    );
  },
);
Hero.displayName = "Hero";

export { Hero };
