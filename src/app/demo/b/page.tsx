import type { Metadata } from "next";
import { DemoB } from "@/components/demo/DemoB";

export const metadata: Metadata = {
  title: "Demo B — Particle Field",
  robots: { index: false, follow: false },
};

export default function DemoBPage() {
  return <DemoB />;
}
