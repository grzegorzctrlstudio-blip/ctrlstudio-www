import type { Metadata } from "next";
import { DemoA } from "@/components/demo/DemoA";

export const metadata: Metadata = {
  title: "Demo A — Liquid Glass",
  robots: { index: false, follow: false },
};

export default function DemoAPage() {
  return <DemoA />;
}
