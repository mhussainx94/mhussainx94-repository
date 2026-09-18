/**
 * Lightweight spring/damper math for the hanging card. No physics
 * engine — just refs, requestAnimationFrame, and this module. See
 * hooks/useCardPhysics.ts for how it's driven.
 */

export interface CardPhysicsConfig {
  /** Soft limit on horizontal drag, in px, before rubber-band resistance kicks in. */
  maxHorizontalDrag: number;
  /** Soft limit on downward drag, in px. */
  maxDownwardDrag: number;
  /** Soft limit on upward drag, in px — deliberately small; the card hangs. */
  maxUpwardDrag: number;
  /** How strongly the spring pulls the card back to rest. */
  springStrength: number;
  /** Fraction of velocity retained per nominal (16.67ms) frame. */
  damping: number;
  /** How much horizontal displacement contributes to rotation. */
  rotationStrength: number;
  /** How much horizontal velocity contributes to rotation on top of displacement. */
  velocityRotationInfluence: number;
  /** 0..1 — how strongly the rubber-band resists motion past the soft limit. */
  dragResistance: number;
  /** Movement, in px, before a pointer-down is treated as a drag rather than a click. */
  dragThreshold: number;
}

export const defaultCardPhysics: CardPhysicsConfig = {
  maxHorizontalDrag: 130,
  maxDownwardDrag: 190,
  maxUpwardDrag: 36,
  springStrength: 0.07,
  damping: 0.78,
  rotationStrength: 0.05,
  velocityRotationInfluence: 0.55,
  dragResistance: 0.55,
  dragThreshold: 6,
};

/** A calmer variant used under prefers-reduced-motion: fast, no
 *  overshoot (numerically verified monotonic — see lib/physics
 *  simulation notes in the README), no idle sway. */
export const reducedMotionCardPhysics: CardPhysicsConfig = {
  ...defaultCardPhysics,
  springStrength: 0.3,
  damping: 0.4,
  rotationStrength: 0.02,
  velocityRotationInfluence: 0.1,
};

export const MAX_ROTATION_DEG = 16;

export function clampNum(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Rubber-band soft limit: linear within `limit`, then asymptotically
 * saturating beyond it so the card never hits a hard wall. Modeled on
 * the classic iOS overscroll curve.
 */
export function applySoftLimit(raw: number, limit: number, resistance: number): number {
  if (limit <= 0) return 0;
  const sign = raw < 0 ? -1 : 1;
  const abs = Math.abs(raw);
  if (abs <= limit) return raw;
  const over = abs - limit;
  const factor = Math.max(0.05, resistance);
  const extra = (1 - 1 / ((over / limit) * factor + 1)) * limit;
  return sign * (limit + extra);
}

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * Advances one semi-implicit-Euler step of a critically-ish damped
 * spring pulling `pos` back toward the origin, scaled by `dt` (in units
 * of a nominal 16.67ms frame) so behaviour stays consistent across
 * refresh rates. Mutates `pos` and `vel` in place — called every frame
 * from a ref, never from React state.
 */
export function stepSpring(pos: Vec2, vel: Vec2, config: CardPhysicsConfig, dt: number): void {
  const springX = -pos.x * config.springStrength;
  const springY = -pos.y * config.springStrength;
  const dampingFactor = Math.pow(config.damping, dt);

  vel.x = (vel.x + springX * dt) * dampingFactor;
  vel.y = (vel.y + springY * dt) * dampingFactor;

  pos.x += vel.x * dt;
  pos.y += vel.y * dt;
}

export function isAtRest(pos: Vec2, vel: Vec2, posEpsilon = 0.05, velEpsilon = 0.02): boolean {
  return (
    Math.abs(pos.x) < posEpsilon &&
    Math.abs(pos.y) < posEpsilon &&
    Math.abs(vel.x) < velEpsilon &&
    Math.abs(vel.y) < velEpsilon
  );
}

export function rotationFromState(pos: Vec2, vel: Vec2, config: CardPhysicsConfig): number {
  const raw = pos.x * config.rotationStrength + vel.x * config.velocityRotationInfluence;
  return clampNum(raw, -MAX_ROTATION_DEG, MAX_ROTATION_DEG);
}

/** Peak degrees for the subtle rotateY "3D" tilt applied during drag/
 *  settle, driven by horizontal velocity — separate from the Z-axis
 *  spin above, and small enough to never look like a flip. */
const DRAG_TILT_VELOCITY_GAIN = 0.16;
const MAX_DRAG_TILT_DEG = 7;

export function tiltYFromVelocity(vel: Vec2): number {
  return clampNum(vel.x * DRAG_TILT_VELOCITY_GAIN, -MAX_DRAG_TILT_DEG, MAX_DRAG_TILT_DEG);
}

/**
 * "Gentle breeze" idle sway. Three non-harmonic sine waves (periods of
 * roughly 6.5s, 4.1s, and 9.7s — no small common multiple) are summed
 * into a single angular "wind" driver, so the composite never visibly
 * repeats within a normal viewing session even though it's technically
 * periodic. That one angle then drives everything, the way a real
 * hanging object actually moves — not three independent animations:
 *
 *  - horizontal sway  = armLength * sin(angle)      (dominant term)
 *  - vertical lift    = -verticalGain * drive²       (always upward,
 *    second-order-small relative to the horizontal term, exactly like
 *    a real pendulum bob rising slightly as it swings away from centre)
 *  - rotation (Z)     = angle * rotationGain          (tilts with the swing)
 *  - tilt (Y, "3D")   = angle * tiltGain              (very small — see
 *    tiltYFromVelocity above for the equivalent during drag/settle)
 */
export interface IdleSwayConfig {
  /** Effective pendulum arm (px) converting the idle angle into horizontal sway. */
  armLength: number;
  /** Peak angular amplitude of the idle "wind", in radians. */
  maxAngle: number;
  /** Peak vertical lift (px) at the swing extremes. */
  verticalGain: number;
  /** Degrees of extra card rotation (Z-axis) per radian of idle angle. */
  rotationGain: number;
  /** Degrees of 3D tilt (Y-axis) per radian of idle angle — deliberately
   *  much smaller than rotationGain; this is a hint of depth, not a spin. */
  tiltGain: number;
}

export const defaultIdleSway: IdleSwayConfig = {
  armLength: 150,
  maxAngle: 0.05,
  verticalGain: 2.2,
  rotationGain: 40,
  tiltGain: 14,
};

export interface IdleSwayResult {
  x: number;
  y: number;
  rotation: number;
  tiltY: number;
}

const ZERO_SWAY: IdleSwayResult = { x: 0, y: 0, rotation: 0, tiltY: 0 };

export function computeIdleSway(
  time: number,
  seed: number,
  config: IdleSwayConfig = defaultIdleSway
): IdleSwayResult {
  const drive =
    Math.sin(time * 0.0161 + seed) * 0.5 +
    Math.sin(time * 0.0255 + seed * 1.7) * 0.32 +
    Math.sin(time * 0.0108 + seed * 2.3) * 0.18;
  const angle = drive * config.maxAngle;

  return {
    x: config.armLength * Math.sin(angle),
    y: -config.verticalGain * drive * drive,
    rotation: angle * config.rotationGain,
    tiltY: angle * config.tiltGain,
  };
}

export { ZERO_SWAY };
