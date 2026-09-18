"use client";

import { useCallback, useEffect, useRef } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import {
  applySoftLimit,
  computeIdleSway,
  defaultCardPhysics,
  isAtRest,
  reducedMotionCardPhysics,
  rotationFromState,
  stepSpring,
  ZERO_SWAY,
  type CardPhysicsConfig,
  type Vec2,
} from "@/lib/physics";
import { lerp } from "@/lib/utils";

type CardPhase = "idle" | "dragging" | "settling";

interface UseCardPhysicsOptions {
  reducedMotion: boolean;

  /**
   * Fires on a genuine click/tap when movement stayed
   * under the drag threshold, or on keyboard activation.
   */
  onActivate?: () => void;

  configOverrides?: Partial<CardPhysicsConfig>;
}

export interface CardPhysicsHandle {
  cardRef: RefObject<HTMLButtonElement>;
  onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLButtonElement>) => void;
  setPaused: (paused: boolean) => void;
}

const NOMINAL_FRAME_MS = 1000 / 60;

export function useCardPhysics({
  reducedMotion,
  onActivate,
  configOverrides,
}: UseCardPhysicsOptions): CardPhysicsHandle {
  const cardRef = useRef<HTMLButtonElement>(null);

  const pos = useRef<Vec2>({ x: 0, y: 0 });
  const vel = useRef<Vec2>({ x: 0, y: 0 });

  const phase = useRef<CardPhase>("idle");

  const pointerId = useRef<number | null>(null);

  const startPointer = useRef<Vec2>({
    x: 0,
    y: 0,
  });

  const lastPointer = useRef<{
    x: number;
    y: number;
    t: number;
  }>({
    x: 0,
    y: 0,
    t: 0,
  });

  const dragOrigin = useRef<Vec2>({
    x: 0,
    y: 0,
  });

  const movedPastThreshold = useRef(false);

  const isVisible = useRef(true);
  const isPaused = useRef(false);

  const lastFrameTime = useRef<number | null>(null);

  const idleTime = useRef(0);
  const idleSeed = useRef(Math.random() * 1000);

  const rafId = useRef<number | null>(null);

  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const configRef = useRef<CardPhysicsConfig>({
    ...(reducedMotion
      ? reducedMotionCardPhysics
      : defaultCardPhysics),
    ...configOverrides,
  });

  useEffect(() => {
    configRef.current = {
      ...(reducedMotion
        ? reducedMotionCardPhysics
        : defaultCardPhysics),
      ...configOverrides,
    };
  }, [reducedMotion, configOverrides]);

  /*
   * Pause ambient animation while the card is off-screen.
   */
  useEffect(() => {
    const el = cardRef.current;

    if (!el || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  /*
   * Single transform owner.
   *
   * The card button owns the transform.
   * Children such as the image must NOT have their own transform.
   */
  useEffect(() => {
    const tick = (time: number) => {
      rafId.current = requestAnimationFrame(tick);

      const el = cardRef.current;

      if (!el) {
        return;
      }

      if (
        document.hidden ||
        (!isVisible.current && phase.current !== "dragging")
      ) {
        lastFrameTime.current = null;
        return;
      }

      const config = configRef.current;

      const previous =
        lastFrameTime.current ?? time;

      const dt = Math.min(
        3,
        Math.max(
          0.001,
          (time - previous) / NOMINAL_FRAME_MS
        )
      );

      lastFrameTime.current = time;

      if (phase.current !== "dragging") {
        stepSpring(
          pos.current,
          vel.current,
          config,
          dt
        );

        if (
          phase.current === "settling" &&
          isAtRest(pos.current, vel.current)
        ) {
          pos.current.x = 0;
          pos.current.y = 0;

          vel.current.x = 0;
          vel.current.y = 0;

          phase.current = "idle";
        }
      }

      idleTime.current += dt;

      const idleSway =
        phase.current === "idle" &&
        !reducedMotionRef.current &&
        isVisible.current &&
        !isPaused.current
          ? computeIdleSway(
              idleTime.current,
              idleSeed.current
            )
          : ZERO_SWAY;

      const rotation =
        rotationFromState(
          pos.current,
          vel.current,
          config
        ) + idleSway.rotation;

      const renderX =
        pos.current.x + idleSway.x;

      const renderY =
        pos.current.y + idleSway.y;

      /*
       * ONLY the card gets transformed.
       *
       * The image inside the card moves naturally
       * because it is a child of this element.
       */
      el.style.transform = `
        translate3d(
          ${renderX.toFixed(2)}px,
          ${renderY.toFixed(2)}px,
          0
        )
        rotate(${rotation.toFixed(2)}deg)
      `.replace(/\s+/g, " ");
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  /*
   * START DRAG
   */
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      /*
       * Only allow primary mouse button.
       */
      if (
        e.pointerType === "mouse" &&
        e.button !== 0
      ) {
        return;
      }

      /*
       * Prevent native browser dragging behavior.
       *
       * This is particularly important when the pointer
       * starts directly on an image inside the card.
       */
      e.preventDefault();

      const el = cardRef.current;

      if (!el) {
        return;
      }

      /*
       * Make the CARD own the pointer interaction.
       */
      el.setPointerCapture(e.pointerId);

      /*
       * If the card was idly swaying, preserve its current
       * visual position before starting the drag.
       */
      if (phase.current === "idle") {
        const sway = computeIdleSway(
          idleTime.current,
          idleSeed.current
        );

        pos.current.x += sway.x;
        pos.current.y += sway.y;
      }

      pointerId.current = e.pointerId;

      startPointer.current = {
        x: e.clientX,
        y: e.clientY,
      };

      lastPointer.current = {
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      };

      dragOrigin.current = {
        ...pos.current,
      };

      movedPastThreshold.current = false;

      phase.current = "dragging";

      /*
       * Prevent browser text/image selection while dragging.
       */
      el.classList.add("is-grabbing");

      document.body.style.userSelect = "none";
    },
    []
  );

  /*
   * DRAG
   */
  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (pointerId.current !== e.pointerId) {
        return;
      }

      const config = configRef.current;

      const dx =
        e.clientX -
        startPointer.current.x;

      const dy =
        e.clientY -
        startPointer.current.y;

      /*
       * Do not classify tiny pointer movement as dragging.
       * This preserves normal click/tap behavior.
       */
      if (!movedPastThreshold.current) {
        if (
          Math.hypot(dx, dy) <
          config.dragThreshold
        ) {
          return;
        }

        movedPastThreshold.current = true;
      }

      e.preventDefault();

      const now = performance.now();

      const dt = Math.max(
        1,
        now - lastPointer.current.t
      );

      /*
       * Calculate pointer velocity.
       */
      const instVelX =
        ((e.clientX -
          lastPointer.current.x) /
          dt) *
        NOMINAL_FRAME_MS;

      const instVelY =
        ((e.clientY -
          lastPointer.current.y) /
          dt) *
        NOMINAL_FRAME_MS;

      vel.current.x = lerp(
        vel.current.x,
        instVelX,
        0.5
      );

      vel.current.y = lerp(
        vel.current.y,
        instVelY,
        0.5
      );

      lastPointer.current = {
        x: e.clientX,
        y: e.clientY,
        t: now,
      };

      /*
       * Calculate the new CARD position.
       *
       * The image is not moved independently.
       */
      const targetX =
        dragOrigin.current.x + dx;

      const targetY =
        dragOrigin.current.y + dy;

      pos.current.x = applySoftLimit(
        targetX,
        config.maxHorizontalDrag,
        config.dragResistance
      );

      pos.current.y =
        targetY >= 0
          ? applySoftLimit(
              targetY,
              config.maxDownwardDrag,
              config.dragResistance
            )
          : -applySoftLimit(
              -targetY,
              config.maxUpwardDrag,
              config.dragResistance
            );
    },
    []
  );

  /*
   * END DRAG
   */
  const endDrag = useCallback(
    (
      e: ReactPointerEvent<HTMLButtonElement>,
      allowClick: boolean
    ) => {
      if (
        pointerId.current !== e.pointerId
      ) {
        return;
      }

      const el = cardRef.current;

      if (el) {
        try {
          el.releasePointerCapture(
            e.pointerId
          );
        } catch {
          /*
           * Safe for browsers such as Safari where
           * pointer capture may already be released.
           */
        }

        el.classList.remove(
          "is-grabbing"
        );
      }

      /*
       * Restore normal text selection.
       */
      document.body.style.userSelect = "";

      const wasDrag =
        movedPastThreshold.current;

      pointerId.current = null;

      movedPastThreshold.current = false;

      /*
       * Let the spring take over.
       *
       * Existing velocity creates the release momentum.
       */
      phase.current = "settling";

      /*
       * Normal click/tap still activates the card.
       */
      if (
        allowClick &&
        !wasDrag
      ) {
        onActivate?.();
      }
    },
    [onActivate]
  );

  const onPointerUp = useCallback(
    (
      e: ReactPointerEvent<HTMLButtonElement>
    ) => {
      endDrag(e, true);
    },
    [endDrag]
  );

  const onPointerCancel = useCallback(
    (
      e: ReactPointerEvent<HTMLButtonElement>
    ) => {
      endDrag(e, false);
    },
    [endDrag]
  );

  /*
   * KEYBOARD ACCESSIBILITY
   */
  const onKeyDown = useCallback(
    (
      e: ReactKeyboardEvent<HTMLButtonElement>
    ) => {
      if (
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        onActivate?.();
      }
    },
    [onActivate]
  );

  /*
   * External pause control.
   */
  const setPaused = useCallback(
    (paused: boolean) => {
      isPaused.current = paused;
    },
    []
  );

  return {
    cardRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
    setPaused,
  };
}