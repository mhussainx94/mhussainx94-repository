import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  command: string;
  children: ReactNode;
  className?: string;
}

/**
 * The recurring terminal "chrome" used to frame the boot sequence and
 * each section's command label. Deliberately no fake macOS traffic
 * lights — a single status dot and a real prompt line carry the whole
 * motif without tipping into pastiche.
 */
export function TerminalWindow({ command, children, className }: TerminalWindowProps) {
  return (
    <div className={cn("rounded-md border border-line bg-panel", className)}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 sm:px-5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
        <span className="truncate font-mono text-2xs text-ink-muted">
          visitor@{profile.handle}:~$ {command}
        </span>
        <span className="h-3 w-1.5 shrink-0 bg-signal animate-cursor-blink" aria-hidden="true" />
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
