"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { ensureGsapRegistered, ScrollTrigger } from "@/lib/gsap";
import { scrollProgress, setSceneState } from "@/lib/sceneStore";
import type { SectionId } from "@/types";

export interface SectionDescriptor {
  id: SectionId;
  ref: RefObject<HTMLElement>;
}

/**
 * One ScrollTrigger per section — drives which section is "active" for
 * the nav dots and the 3D scene's per-section state — plus one global
 * ScrollTrigger across the whole document that writes continuous
 * scroll progress for the 3D camera. Everything is created and torn
 * down inside a single effect so React Strict Mode's double-invoke in
 * development never leaves duplicate triggers behind.
 */
export function useSectionProgress(sections: SectionDescriptor[]): void {
  useEffect(() => {
    ensureGsapRegistered();
    const triggers: ScrollTrigger[] = [];

    sections.forEach(({ id, ref }, index) => {
      const el = ref.current;
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setSceneState({ activeIndex: index, activeId: id }),
          onEnterBack: () => setSceneState({ activeIndex: index, activeId: id }),
        })
      );
    });

    triggers.push(
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollProgress.value = self.progress;
        },
      })
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
    // Section refs are stable for the page's lifetime; only the count matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.length]);
}
