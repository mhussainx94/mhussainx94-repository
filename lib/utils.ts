type ClassValue = string | number | null | undefined | false;

/** Tiny className joiner — avoids pulling in clsx for a one-line job. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Formats "2024-09" style dates as "Sep 2024"; passes through anything
 *  else (like a bare year, or "Present") unchanged. */
export function formatMonthYear(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
