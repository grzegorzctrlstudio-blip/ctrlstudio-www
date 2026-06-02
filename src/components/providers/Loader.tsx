"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getLenis } from "@/components/providers/SmoothScroll";

const SESSION_KEY = "ctrl:intro-shown";
const DURATION = 1500; // ms — kept short on purpose

export function Loader() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  // Decide on the client only (avoids hydration mismatch + reload flash).
  useEffect(() => {
    setMounted(true);
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY);
    if (seen || reduced) return;
    setShow(true);
  }, [reduced]);

  // Counter + auto-finish. Skippable via click / any key.
  useEffect(() => {
    if (!show) return;

    getLenis()?.stop();
    document.body.style.overflow = "hidden";

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // easeOutCubic for a confident, non-laggy climb
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      cancelAnimationFrame(raf);
      setProgress(100);
      sessionStorage.setItem(SESSION_KEY, "1");
      // brief hold, then unmount
      window.setTimeout(() => setShow(false), 260);
    };

    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [show]);

  // Release scroll lock when the overlay is gone.
  useEffect(() => {
    if (mounted && !show) {
      document.body.style.overflow = "";
      getLenis()?.start();
    }
  }, [show, mounted]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.7, 0, 0.3, 1] } }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-0 glow opacity-60"
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/assets/logo-white.png"
              alt="CTRLstudio"
              width={106}
              height={96}
              priority
              className="h-20 w-auto sm:h-24"
            />
          </motion.div>

          {/* progress line */}
          <div className="relative mt-8 h-px w-44 overflow-hidden bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 bg-ink"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 font-mono text-xs tabular-nums text-ink-faint">
            {String(progress).padStart(3, "0")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
