"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { Logo } from "@/components/layout/Logo";
import { getLenis } from "@/components/providers/SmoothScroll";

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (pathname.startsWith("/demo")) return null;

  return (
    <footer className="relative border-t border-line bg-bg">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label="CTRLstudio" data-cursor className="w-fit">
            <Logo />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-ink-dim">
            Łączymy content, technologię i przestrzeń w doświadczenia, które
            działają w realnym świecie.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-ink-faint">
            Content · Technology · Space
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-sm">
          <span className="eyebrow mb-2">Nawigacja</span>
          {site.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor
              className="w-fit text-ink-dim transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <span className="eyebrow mb-2">Kontakt</span>
          <a
            href={`mailto:${site.email}`}
            data-cursor
            className="w-fit text-ink-dim transition-colors hover:text-ink"
          >
            {site.email}
          </a>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            data-cursor
            className="w-fit text-ink-dim transition-colors hover:text-ink"
          >
            {site.phone}
          </a>
          <div className="mt-3 flex flex-wrap gap-4">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="text-ink-dim transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-ink-faint sm:flex-row">
        <p>
          © {year} {site.name}. Wszystkie prawa zastrzeżone.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/polityka-prywatnosci" className="hover:text-ink-dim">
            Polityka prywatności
          </Link>
          <button
            type="button"
            onClick={toTop}
            data-cursor
            className="flex items-center gap-2 hover:text-ink-dim"
          >
            Do góry <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
