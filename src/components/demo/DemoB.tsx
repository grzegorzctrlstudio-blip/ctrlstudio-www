"use client";

import dynamic from "next/dynamic";
import { DemoChrome } from "@/components/demo/DemoChrome";

const Scene = dynamic(
  () => import("@/components/demo/DemoSceneB").then((m) => m.DemoSceneB),
  { ssr: false },
);

export function DemoB() {
  return (
    <>
      <Scene />
      <DemoChrome current="b" />
    </>
  );
}
