"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

const panel = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col bg-bg/95 backdrop-blur-xl lg:hidden"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute inset-0 glow opacity-50" aria-hidden />
          <nav className="container-x relative flex flex-1 flex-col justify-center gap-2 pt-24">
            {site.nav.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <motion.div key={link.href} variants={item}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "display text-5xl transition-colors",
                      active ? "text-accent-ink" : "text-ink hover:text-ink-dim",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
          <motion.div
            variants={item}
            className="container-x relative flex flex-wrap items-center justify-between gap-4 border-t border-line py-8 text-sm text-ink-dim"
          >
            <a href={`mailto:${site.email}`} className="hover:text-ink">
              {site.email}
            </a>
            <div className="flex gap-4">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
