import type { Metadata } from "next";
import { Logo3DHero } from "@/components/sections/Logo3DHero";

export const metadata: Metadata = {
  title: "Logo 3D — podgląd",
  robots: { index: false, follow: false },
};

export default function Logo3DPage() {
  return <Logo3DHero />;
}
