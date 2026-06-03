import type { Metadata } from "next";
import { ScrollHeroPreview } from "@/components/sections/ScrollHeroPreview";

export const metadata: Metadata = {
  title: "Scroll hero — podgląd",
  robots: { index: false, follow: false },
};

export default function ScrollPreviewPage() {
  return <ScrollHeroPreview />;
}
