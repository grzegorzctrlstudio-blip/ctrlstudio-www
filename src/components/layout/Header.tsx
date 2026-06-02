"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { getLenis } from "@/components/providers/SmoothScroll";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll while the overlay is open.
  useEffect(() => {
    if (open) {
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
    } else {
      getLenis()?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled || open
            ? "border-b border-line bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div
          className="container-x flex items-center justify-between"
          style={{ height: "var(--header-h)" }}
        >
          <Link href="/" aria-label="CTRLstudio — strona główna" data-cursor>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {site.nav.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor
                  className={cn(
                    "group relative text-sm tracking-wide transition-colors",
                    active ? "text-ink" : "text-ink-dim hover:text-ink",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
            <a
              href={`mailto:${site.email}`}
              data-cursor
              className="rounded-full border border-line-strong px-4 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent-ink"
            >
              Napisz do nas
            </a>
          </nav>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            data-cursor
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={cn(
                "h-px w-6 bg-ink transition-transform duration-300",
                open && "translate-y-[3px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-ink transition-transform duration-300",
                open && "-translate-y-[3px] -rotate-45",
              )}
            />
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}
