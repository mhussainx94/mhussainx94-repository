import type { PerformanceConfig, PerformanceTier } from "@/types";

// Safari/Firefox don't expose deviceMemory — treat it as "unknown" rather
// than "low", so we don't punish browsers that simply don't report it.
interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
}

/**
 * A cheap, synchronous heuristic — no benchmarking, just the signals
 * the browser already exposes. `usePerformanceTier` can additionally
 * step this down (never up) after sampling real frame times.
 */
export function detectInitialTier(): PerformanceTier {
  if (typeof window === "undefined") return "medium";

  const nav = window.navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory;
  const width = window.innerWidth;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (reducedMotion) return "low";

  let score = 0;
  score += cores >= 8 ? 2 : cores >= 4 ? 1 : 0;
  score += memory === undefined ? 1 : memory >= 8 ? 2 : memory >= 4 ? 1 : 0;
  score += width >= 1024 ? 1 : 0;
  score -= coarsePointer ? 1 : 0;

  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

export const performanceConfigs: Record<PerformanceTier, PerformanceConfig> = {
  high: {
    particleCount: 1400,
    nodeCount: 7,
    showGrid: true,
    dpr: [1, 1.75],
    cameraDrift: true,
  },
  medium: {
    particleCount: 650,
    nodeCount: 5,
    showGrid: true,
    dpr: [1, 1.25],
    cameraDrift: true,
  },
  low: {
    particleCount: 220,
    nodeCount: 3,
    showGrid: false,
    dpr: [1, 1],
    cameraDrift: false,
  },
};

export function nextTierDown(tier: PerformanceTier): PerformanceTier {
  if (tier === "high") return "medium";
  if (tier === "medium") return "low";
  return "low";
}

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}
