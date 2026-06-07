"use client";

import {
  Fragment,
  forwardRef,
  type JSX,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion, type MotionProps } from "motion/react";

/**
 * TextScramble — reveals text with a "decoding" scramble.
 * Adapted to the project's `motion/react` (Motion v11+) instead of the legacy
 * `framer-motion` package, so we don't ship a duplicate animation library.
 * Extended with `\n` → <br/> support (multi-line headings) and an `id` prop.
 */
type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  id?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const TextScramble = forwardRef<HTMLElement, TextScrambleProps>(
  function TextScramble(
    {
      children,
      duration = 0.8,
      speed = 0.04,
      characterSet = defaultChars,
      className,
      id,
      as: Component = "p",
      trigger = true,
      onScrambleComplete,
      ...props
    },
    ref,
  ) {
  const MotionComponent = useMemo(
    () => motion.create(Component as keyof JSX.IntrinsicElements),
    [Component],
  ) as typeof motion.p;
  const [displayText, setDisplayText] = useState(children);
  const isAnimatingRef = useRef(false);
  const reduced = useReducedMotion();
  const text = children;

  const scramble = async () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const steps = duration / speed;
    let step = 0;

    const interval = setInterval(
      () => {
        let scrambled = "";
        const progress = step / steps;

        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " " || ch === "\n") {
            scrambled += ch; // keep spaces + hard line breaks intact
            continue;
          }
          if (progress * text.length > i) {
            scrambled += ch;
          } else {
            scrambled +=
              characterSet[Math.floor(Math.random() * characterSet.length)];
          }
        }

        setDisplayText(scrambled);
        step++;

        if (step > steps) {
          clearInterval(interval);
          setDisplayText(text);
          isAnimatingRef.current = false;
          onScrambleComplete?.();
        }
      },
      speed * 1000,
    );
  };

  useEffect(() => {
    if (!trigger) return;
    // Motion-sensitive users get the final text without the flicker.
    if (reduced) {
      setDisplayText(text);
      onScrambleComplete?.();
      return;
    }
    scramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, reduced]);

  const lines = displayText.split("\n");

  return (
    <MotionComponent
      ref={ref as React.Ref<HTMLParagraphElement>}
      id={id}
      aria-label={text.replace(/\n/g, " ")}
      className={className}
      {...props}
    >
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </MotionComponent>
  );
  },
);
