"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

let lenisInstance: Lenis | null = null;
/** Non-React access to the active Lenis instance (e.g. from canvas code). */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

interface SmoothScrollApi {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const firstRun = useRef(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Reduced motion → native scrolling, no smoothing. ScrollTrigger still
    // works against the native scroll position.
    if (reduced) return;

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisInstance = instance;
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisInstance = null;
      setLenis(null);
    };
  }, [reduced]);

  // Smooth-scroll in-page hash links (e.g. "Zobacz showreel" → #showreel).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top =
        (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 72;
      if (lenisInstance) lenisInstance.scrollTo(top);
      else window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduced]);

  // Reset scroll on route change (Next 16 no longer forces this).
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Re-measure pinned/scrubbed triggers after the new route paints.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  const scrollTo: SmoothScrollApi["scrollTo"] = (target, offset = 0) => {
    if (lenisInstance) lenisInstance.scrollTo(target, { offset });
    else if (typeof target === "number")
      window.scrollTo({ top: target + offset });
    else if (target instanceof HTMLElement)
      window.scrollTo({ top: target.offsetTop + offset });
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
