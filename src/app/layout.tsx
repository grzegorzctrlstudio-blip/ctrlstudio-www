import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Loader } from "@/components/providers/Loader";
import { Cursor } from "@/components/effects/Cursor";
import { AnimatedBackground } from "@/components/effects/AnimatedBackground";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <a
          href="#main"
          className="sr-only z-[110] rounded-full bg-ink px-4 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Przejdź do treści
        </a>

        <div className="site-aurora" aria-hidden />
        <AnimatedBackground />

        <SmoothScroll>
          <Loader />
          <Cursor />
          <ScrollProgress />
          <div className="grain" aria-hidden />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>

        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
