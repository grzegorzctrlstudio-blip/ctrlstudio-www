"use client";

import dynamic from "next/dynamic";
import { DemoChrome } from "@/components/demo/DemoChrome";

const Scene = dynamic(
  () => import("@/components/demo/DemoSceneA").then((m) => m.DemoSceneA),
  { ssr: false },
);

export function DemoA() {
  return (
    <>
      <Scene />
      <DemoChrome current="a" />
    </>
  );
}
