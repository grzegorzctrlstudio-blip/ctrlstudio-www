import type { Metadata } from "next";
import { SceneMockup } from "@/components/sections/SceneMockup";

export const metadata: Metadata = {
  title: "Tło — podgląd stylów",
  robots: { index: false, follow: false },
};

export default function TloPage() {
  return <SceneMockup />;
}
