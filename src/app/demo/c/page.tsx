import type { Metadata } from "next";
import { DemoC } from "@/components/demo/DemoC";

export const metadata: Metadata = {
  title: "Demo C — Noomo (light)",
  robots: { index: false, follow: false },
};

export default function DemoCPage() {
  return <DemoC />;
}
