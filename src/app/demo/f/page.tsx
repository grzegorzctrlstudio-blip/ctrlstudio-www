import type { Metadata } from "next";
import { DemoF } from "@/components/demo/DemoF";

export const metadata: Metadata = {
  title: "Demo F — Lamp",
  robots: { index: false, follow: false },
};

export default function DemoFPage() {
  return <DemoF />;
}
