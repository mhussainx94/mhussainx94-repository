"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, TerminalSquare } from "lucide-react";
import { TerminalWindow } from "./TerminalWindow";
import { ensureGsapRegistered, gsap } from "@/lib/gsap";
import { profile } from "@/data/profile";

type CvPhase = "idle" | "installing" | "done" | "not-found";

const SEQUENCE_LINES = [
  "Reading package lists... Done",
  "Building dependency tree... Done",
  `Installing ${profile.handle}-cv...`,
];

const RESET_DELAY_MS = 3000;

/**
 * A small "apt install" easter egg between About and Education — not a
 * real section: no SectionShell, no nav entry, not part of the
 * ScrollTrigger active-section list. Reuses TerminalWindow for the
 * chrome so it stays visually identical to every other terminal
 * moment on the site, just at a fraction of the size.
 *
 * The command is a pure visual metaphor — nothing here ever executes
 * anything; it triggers a plain static-file download and nothing else.
 */
export function CvTerminal({ reducedMotion }: { reducedMotion: boolean }) {
  const [phase, setPhase] = useState<CvPhase>("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<CvPhase>("idle");
  phaseRef.current = phase;

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  // A light entrance, consistent with every other section's reveal,
  // but scoped to this one small block rather than a full SectionShell.
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const el = containerRef.current;
      if (!el) return;
      gsap.from(el, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const scheduleReset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setPhase("idle"), RESET_DELAY_MS);
  }, []);

  const checkAndDownload = useCallback(() => {
    const url = profile.cvUrl;
    if (!url) {
      setPhase("not-found");
      scheduleReset();
      return;
    }
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setPhase("done");
          downloadLinkRef.current?.click();
        } else {
          setPhase("not-found");
        }
      })
      .catch(() => setPhase("not-found"))
      .finally(scheduleReset);
  }, [scheduleReset]);

  const runSequence = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    setPhase("installing");
    setVisibleLines(0);
    setProgress(0);

    if (reducedMotion) {
      setVisibleLines(SEQUENCE_LINES.length);
      setProgress(100);
      checkAndDownload();
      return;
    }

    ensureGsapRegistered();
    const progressObj = { value: 0 };
    const tl = gsap.timeline({ onComplete: checkAndDownload });
    SEQUENCE_LINES.forEach((_, i) => {
      tl.call(() => setVisibleLines(i + 1), undefined, i * 0.18 + 0.05);
    });
    tl.to(
      progressObj,
      {
        value: 100,
        duration: 0.5,
        ease: "power1.inOut",
        onUpdate: () => setProgress(Math.round(progressObj.value)),
      },
      0.45
    );
    tl.to({}, { duration: 0.3 }); // brief hold before the result line
  }, [reducedMotion, checkAndDownload]);

  return (
    <div ref={containerRef} className="border-t border-line py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="max-w-lg">
          <TerminalWindow command={`sudo apt install ${profile.handle}-cv`}>
            {phase === "idle" && (
              <button
                type="button"
                onClick={runSequence}
                aria-label={`Run sudo apt install ${profile.handle}-cv — downloads the CV as a PDF`}
                className="group flex w-full items-center justify-between gap-3 rounded border border-line px-4 py-3 text-left outline-none transition-colors hover:border-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void"
              >
                <span className="font-mono text-sm text-ink">
                  <span className="text-ink-faint">$ </span>
                  sudo apt install {profile.handle}-cv
                </span>
                <Download
                  className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-signal"
                  aria-hidden="true"
                />
              </button>
            )}

            {phase === "installing" && (
              <div aria-live="polite" className="space-y-1.5 font-mono text-xs text-ink-muted sm:text-sm">
                {SEQUENCE_LINES.slice(0, visibleLines).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {visibleLines >= SEQUENCE_LINES.length && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
                      <div className="h-full bg-signal" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="w-9 shrink-0 text-right text-2xs tabular-nums text-ink-faint">
                      {progress}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {phase === "done" && (
              <div aria-live="polite" className="space-y-1.5 font-mono text-xs sm:text-sm">
                <p className="flex items-center gap-1.5 text-signal">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {profile.handle}-cv installed
                </p>
                <p className="text-ink-muted">→ Downloading CV...</p>
              </div>
            )}

            {phase === "not-found" && (
              <div aria-live="polite" className="space-y-1.5 font-mono text-xs text-ink-faint sm:text-sm">
                <p className="flex items-center gap-1.5">
                  <TerminalSquare className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {profile.handle}-cv: package not found
                </p>
                <p>Add the PDF at {profile.cvUrl ?? "/Muhammad-Hussain-CV.pdf"} to enable this.</p>
              </div>
            )}
          </TerminalWindow>
        </div>
      </div>

      {/* Real download trigger — a plain static-file link, nothing more.
          Hidden from view and from the tab order; the visible button
          above is the only way a person actually reaches this. */}
      <a
        ref={downloadLinkRef}
        href={profile.cvUrl}
        download
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        download cv
      </a>
    </div>
  );
}
