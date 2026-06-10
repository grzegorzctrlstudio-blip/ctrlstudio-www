"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(
  () =>
    import("@/components/effects/WebGLBackgroundScene").then(
      (m) => m.WebGLBackgroundScene,
    ),
  { ssr: false },
);

/**
 * Scroll-driven page background — organic glass dissolving into a neon
 * wireframe terrain. Client-only (WebGL); fixed + opaque behind the page.
 */
export function WebGLBackground() {
  return <Scene />;
}

export default WebGLBackground;
