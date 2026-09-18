"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Safe to call from every component that needs GSAP — registers the
 *  plugin exactly once even across fast-refresh remounts. */
export function ensureGsapRegistered(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
