"use client";

import { useEffect, useRef } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { ensureGsapRegistered, gsap } from "@/lib/gsap";
import { profile } from "@/data/profile";

interface BootSequenceProps {
  reducedMotion: boolean;
  id: string;
}

/**
 * A single, orchestrated "whoami" reveal — the moment the immersive
 * hero hands off to the readable terminal/document sections. It fires
 * once, the first time it scrolls into view; scrolling back up and
 * down again doesn't replay it.
 */
export function BootSequence({ reducedMotion, id }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const lines = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(".boot-line") ?? []
      );
      if (lines.length === 0) return;
      gsap.set(lines, { width: 0 });
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: containerRef.current, start: "top 75%", once: true },
      });
      lines.forEach((line, i) => {
        timeline.to(line, { width: "auto", duration: 0.55, ease: "steps(20)" }, i * 0.32);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div id={id} ref={containerRef} className="mx-auto max-w-measure px-6 py-20 sm:py-28">
      <TerminalWindow command="whoami">
        <div className="space-y-2">
          <p className="boot-line overflow-hidden whitespace-nowrap font-mono text-sm text-signal sm:text-base">
            {profile.name.toLowerCase()}@{profile.handle}
          </p>
          <p className="boot-line overflow-hidden whitespace-nowrap font-mono text-sm text-ink-muted">
            role: {profile.title}
          </p>
          <p className="boot-line overflow-hidden whitespace-nowrap font-mono text-sm text-ink-muted">
            location: {profile.location}
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
}
