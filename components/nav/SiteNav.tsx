"use client";

import { useEffect, useRef } from "react";
import { scrollProgress, useSceneState } from "@/lib/sceneStore";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/types";

interface NavItem {
  id: SectionId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "top" },
  { id: "about", label: "about" },
  { id: "education", label: "education" },
  { id: "experience", label: "experience" },
  { id: "certifications", label: "certifications" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
];

function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const el = barRef.current;

      if (el) {
        el.style.transform = `scaleX(${scrollProgress.value})`;
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-px bg-line"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-signal"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export function SiteNav() {
  const { activeId } = useSceneState();

  return (
    <>
      <ProgressBar />

      {/* Mobile / Tablet Navigation */}
      <nav
        aria-label="Mobile section navigation"
        className="
          fixed
          bottom-3
          left-1/2
          z-40
          flex
          w-[calc(100%-1rem)]
          max-w-xl
          -translate-x-1/2
          items-center
          justify-center
          overflow-x-auto
          rounded-full
          border
          border-line
          bg-void/90
          px-2
          py-2
          backdrop-blur-md
          lg:hidden
        "
      >
        <div className="flex min-w-max items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[9px] transition-colors sm:px-3 sm:text-2xs",
                  isActive
                    ? "bg-signal text-void"
                    : "text-ink-faint hover:text-signal"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav
        aria-label="Section navigation"
        className="
          fixed
          right-5
          top-1/2
          z-40
          hidden
          -translate-y-1/2
          flex-col
          items-end
          gap-3
          lg:flex
        "
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group flex items-center gap-2.5"
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={cn(
                  "font-mono text-2xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                  isActive && "text-signal opacity-100"
                )}
              >
                {item.label}
              </span>

              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full border transition-colors",
                  isActive
                    ? "border-signal bg-signal"
                    : "border-line-strong bg-transparent group-hover:border-signal"
                )}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}