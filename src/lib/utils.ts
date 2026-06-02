/** Tiny classNames joiner — filters falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Two-digit, 1-based index label, e.g. 1 -> "01". */
export function indexLabel(n: number): string {
  return String(n).padStart(2, "0");
}

/** Builds a soft diagonal gradient from a base hex — used for placeholders. */
export function placeholderGradient(hex: string): string {
  return `linear-gradient(135deg, ${hex}22 0%, #0c0b10 42%, #060507 100%)`;
}

/** Clamp helper for animation math. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
