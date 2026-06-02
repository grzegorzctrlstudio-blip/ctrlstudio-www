"use client";

import { useEffect, useState } from "react";

/** SSR-safe media-query hook. Returns false until mounted on the client. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True on laptop/desktop widths (≥ 1024px). */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** True for precise pointers (mouse/trackpad) — gates cursor & heavy hover FX. */
export function usePointerFine(): boolean {
  return useMediaQuery("(pointer: fine)");
}
