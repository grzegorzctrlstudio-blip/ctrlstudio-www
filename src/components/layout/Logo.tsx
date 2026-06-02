import { cn } from "@/lib/utils";

/**
 * Text wordmark for CTRLstudio. Crisp at any size and theme-aware.
 * To use the supplied SVG logo instead, swap the markup for:
 *   <Image src="/assets/logo.svg" alt="CTRLstudio" width={132} height={24} />
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-[0.14em] leading-none", className)}>
      <span className="display text-xl tracking-tight">CTRL</span>
      <span className="relative font-mono text-[0.6rem] uppercase tracking-[0.32em] text-ink-dim">
        studio
        <span
          aria-hidden
          className="absolute -right-2 -top-1 h-1 w-1 rounded-[1px] bg-accent"
        />
      </span>
    </span>
  );
}
