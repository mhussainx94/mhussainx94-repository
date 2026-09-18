"use client";

import { useEffect, useRef, useState } from "react";
import type { PerformanceConfig, PerformanceTier } from "@/types";
import { detectInitialTier, nextTierDown, performanceConfigs } from "@/lib/performance";

const SAMPLE_WINDOW_MS = 1500;
const LOW_FPS_THRESHOLD = 40;

/**
 * Picks a tier synchronously from device heuristics, then — once — samples
 * real frame times for ~1.5s shortly after mount and steps the tier down
 * if the device can't keep up. It never steps back up mid-session; a
 * one-way downgrade avoids visible flicker between quality levels.
 */
export function usePerformanceTier(): { tier: PerformanceTier; config: PerformanceConfig } {
  const [tier, setTier] = useState<PerformanceTier>(() => detectInitialTier());
  const hasSampled = useRef(false);

  useEffect(() => {
    if (hasSampled.current || typeof window === "undefined") return;
    hasSampled.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number;
    let frames = 0;
    let start = performance.now();

    const sample = (time: number) => {
      frames += 1;
      if (time - start >= SAMPLE_WINDOW_MS) {
        const fps = (frames * 1000) / (time - start);
        if (fps < LOW_FPS_THRESHOLD) {
          setTier((current) => nextTierDown(current));
        }
        return;
      }
      rafId = requestAnimationFrame(sample);
    };

    rafId = requestAnimationFrame((time) => {
      start = time;
      rafId = requestAnimationFrame(sample);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  return { tier, config: performanceConfigs[tier] };
}
