"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface CardStringProps {
  anchorRef: RefObject<HTMLElement>;
  cardRef: RefObject<HTMLElement>;
}

const STRETCH_RANGE = 160;

/**
 * Renders the string between the anchor letter and the hanging card.
 * This component only *reads* layout every frame via
 * getBoundingClientRect — it never writes either element's transform,
 * so it can never conflict with the physics hook or a GSAP scroll
 * transition, whichever currently owns the card's position.
 *
 * The curve also carries a small "tension" cue: near the card's
 * resting distance it sags like a slack cable (vertical tangent at
 * both ends); as the card is dragged farther away, the control points
 * blend toward the direct anchor-to-card line, so it visually
 * straightens the way a string under real tension would.
 */
export function CardString({ anchorRef, cardRef }: CardStringProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const visible = useRef(true);
  const rafId = useRef<number | null>(null);
  // The straight-line anchor-to-card distance the first time it's
  // measured after mount (or after a resize) — the "slack" baseline
  // everything else is measured against. Reset on resize rather than
  // captured once forever, since a layout change can genuinely move
  // the resting distance.
  const restDist = useRef<number | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      restDist.current = null;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const tick = () => {
      rafId.current = requestAnimationFrame(tick);
      if (document.hidden || !visible.current) return;

      const svg = svgRef.current;
      const path = pathRef.current;
      const anchor = anchorRef.current;
      const card = cardRef.current;
      if (!svg || !path || !anchor || !card) return;

      const svgRect = svg.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const startX = anchorRect.left + anchorRect.width / 2 - svgRect.left;
      const startY = anchorRect.bottom - svgRect.top;
      const endX = cardRect.left + cardRect.width / 2 - svgRect.left;
      const endY = cardRect.top - svgRect.top;
      const dx = endX - startX;
      const dy = endY - startY;
      const midY = startY + dy * 0.5;

      const dist = Math.hypot(dx, dy);
      if (restDist.current === null) restDist.current = dist;
      const tension = Math.min(1, Math.max(0, (dist - restDist.current) / STRETCH_RANGE));

      // Slack (tension 0): vertical tangent at both ends — a natural
      // hanging-cable sag. Taut (tension 1): control points collapse
      // onto the direct line, so the curve straightens.
      const ctrl1X = startX + (startX + dx * 0.33 - startX) * tension;
      const ctrl1Y = midY + (startY + dy * 0.33 - midY) * tension;
      const ctrl2X = endX + (startX + dx * 0.67 - endX) * tension;
      const ctrl2Y = midY + (startY + dy * 0.67 - midY) * tension;

      path.setAttribute("d", `M ${startX} ${startY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${endX} ${endY}`);
      path.setAttribute("stroke-width", (1.3 - tension * 0.4).toFixed(2));
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [anchorRef, cardRef]);

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg ref={svgRef} className="h-full w-full overflow-visible">
        <path ref={pathRef} fill="none" stroke="rgba(138,147,140,0.5)" strokeWidth={1.3} />
      </svg>
    </div>
  );
}
