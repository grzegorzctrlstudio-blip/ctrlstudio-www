import type { Metadata } from "next";
import { DemoE } from "@/components/demo/DemoE";

export const metadata: Metadata = {
  title: "Demo E — Cosmic",
  robots: { index: false, follow: false },
};

export default function DemoEPage() {
  return <DemoE />;
}
