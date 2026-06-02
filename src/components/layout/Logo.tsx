import { cn } from "@/lib/utils";

/**
 * CTRLstudio wordmark, set in the real REFRIGERATOR (Refrigerator Deluxe):
 * "CTRL" in Heavy + "STUDIO" in Light, letter-spaced — matching the brand logo.
 * Crisp at any size and theme-aware (white on the dark UI).
 * The full graphic logo lives at /public/assets/logo-white.png (used in the loader).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.18em] leading-none text-ink",
        className,
      )}
    >
      <span className="font-display text-xl font-extrabold uppercase tracking-[-0.01em]">
        CTRL
      </span>
      <span className="font-display text-[0.72rem] font-light uppercase tracking-[0.42em]">
        studio
      </span>
    </span>
  );
}
