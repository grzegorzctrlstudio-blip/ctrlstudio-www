"use client";

import dynamic from "next/dynamic";

const SceneBackground = dynamic(
  () =>
    import("@/components/effects/SceneBackground").then((m) => m.SceneBackground),
  { ssr: false },
);

/**
 * Site background for the homepage: the chrome depth-parallax scene that
 * cross-fades per section on scroll. No logo here (the hero has the real 3D
 * logo). Fixed behind the content; the hero's own canvas covers it up top.
 */
export function HomeBackground() {
  return <SceneBackground styleIndex={1} showLogo={false} />;
}
