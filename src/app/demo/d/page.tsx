import type { Metadata } from "next";
import { DemoD } from "@/components/demo/DemoD";

export const metadata: Metadata = {
  title: "Demo D — Glass (B + C)",
  robots: { index: false, follow: false },
};

export default function DemoDPage() {
  return <DemoD />;
}
