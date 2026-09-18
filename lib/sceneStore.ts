"use client";

import { useSyncExternalStore } from "react";
import type { SectionId } from "@/types";

interface SceneState {
  activeIndex: number;
  activeId: SectionId;
}

type Listener = () => void;

let state: SceneState = { activeIndex: 0, activeId: "hero" };
const listeners = new Set<Listener>();

/**
 * Continuous 0..1 scroll progress across the page. Deliberately a
 * plain mutable object, not React state — it changes on every scroll
 * tick, and its only reader is the R3F render loop (useFrame), which
 * already polls every frame on its own. Routing this through setState
 * would re-render the whole tree on every scroll pixel; see the
 * README's "Animation ownership" section.
 */
export const scrollProgress = { value: 0 };

export function getSceneState(): SceneState {
  return state;
}

export function setSceneState(next: Partial<SceneState>): void {
  if (next.activeIndex === state.activeIndex && next.activeId === state.activeId) return;
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Re-renders only when the active section actually changes — a
 *  handful of times per session, never per animation frame. */
export function useSceneState(): SceneState {
  return useSyncExternalStore(subscribe, getSceneState, getSceneState);
}
