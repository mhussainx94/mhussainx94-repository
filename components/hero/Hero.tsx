"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { CardString } from "./CardString";
import { HangingCard } from "./HangingCard";
import { ensureGsapRegistered, gsap } from "@/lib/gsap";

const WORDMARK = "PORTFOLIO";
const ANCHOR_LETTER_INDEX = 5;

interface HeroProps {
  reducedMotion: boolean;
  nextSectionId: string;
}

export function Hero({ reducedMotion, nextSectionId }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const anchorLetterRef = useRef<HTMLSpanElement>(null);
  const cardScrollWrapperRef = useRef<HTMLDivElement>(null);

  const cardElRef = useRef<HTMLButtonElement | null>(null);

  const handleCardElement = useCallback((el: HTMLButtonElement | null) => {
    cardElRef.current = el;
  }, []);

  const handleActivate = useCallback(() => {
    const target = document.getElementById(nextSectionId);

    target?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [nextSectionId, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const wrapper = cardScrollWrapperRef.current;
      const hero = heroRef.current;

      if (!wrapper || !hero) return;

      gsap.to(wrapper, {
        opacity: 0.2,
        scale: 0.88,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="
        relative
        flex
        min-h-[100svh]
        w-full
        flex-col
        items-center
        justify-center
        overflow-hidden
        px-4
        pb-20
        pt-24
        sm:px-6
        sm:pt-28
        md:px-8
        lg:px-12
        lg:pb-24
      "
    >
      <h1
        aria-label={WORDMARK}
        className="
          select-none
          whitespace-nowrap
          text-center
          font-mono
          font-medium
          leading-none
          tracking-tight
          text-ink
        "
        style={{
          fontSize: "clamp(2.2rem, 11vw, 7rem)",
        }}
      >
        <span aria-hidden="true">
          {WORDMARK.split("").map((letter, i) => (
            <span
              key={i}
              ref={i === ANCHOR_LETTER_INDEX ? anchorLetterRef : undefined}
            >
              {letter}
            </span>
          ))}
        </span>
      </h1>

      <div
        className="
          relative
          mt-10
          sm:mt-14
          md:mt-16
          lg:mt-20
        "
      >
        <div
          ref={cardScrollWrapperRef}
          className="
            relative
            z-10
            max-w-[calc(100vw-2rem)]
            sm:max-w-none
          "
        >
          <HangingCard
            reducedMotion={reducedMotion}
            onActivate={handleActivate}
            onCardElement={handleCardElement}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <CardString
          anchorRef={anchorLetterRef}
          cardRef={cardElRef}
        />
      </div>

      <div
        className="
          absolute
          bottom-5
          left-1/2
          z-10
          flex
          -translate-x-1/2
          flex-col
          items-center
          gap-1
          text-ink-faint
          sm:bottom-8
        "
      >
        <span className="font-mono text-2xs">
          scroll
        </span>

        <ChevronDown
          className="h-3.5 w-3.5 animate-glow-pulse"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}