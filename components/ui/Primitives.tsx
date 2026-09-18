import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-5xl px-6", className)}>{children}</div>;
}

export function CommandLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-2xs text-signal", className)}>
      <span className="text-ink-faint">$ </span>
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 sm:mb-12">
      <h2 className="font-mono text-2xl font-medium text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-muted">{description}</p>}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-line px-2.5 py-1 font-mono text-2xs text-ink-muted">
      {children}
    </span>
  );
}
