import { Vector3 } from 'three';

export const FOX_URL = '/media/fox.glb';

/** Authored height is about 0.6m. Small enough to sit among the pines. */
export const FOX_SCALE = 0.92;

/**
 * Walk has no root translation. Meters of ground per cycle at unit scale,
 * matched to the leg swing by eye.
 */
export const STRIDE = 0.36 * FOX_SCALE;

/** Scroll must rest this long before the fox turns back and sits. */
export const IDLE_AFTER_MS = 400;

/**
 * Cruise speed. Scroll is a switch: while it is recent, or a fast scroll has
 * queued distance, the world moves at this many meters per second.
 * Scroll down advances. Scroll up retreats at the same rate.
 */
export const TRAVEL_MPS = 1.7;

/** A fast scroll queues at most this much travel. The surplus is dropped. */
export const TRAVEL_BANK_MAX = TRAVEL_MPS * 1.8;

/**
 * Straight run. Scroll down moves along PATH_FORWARD. The rig's visual
 * forward is local +Z (three r186 lookAt aims +Z at the target).
 */
export const PATH_ORIGIN = new Vector3(0.55, 0, 6);
export const PATH_FORWARD = new Vector3(0, 0, -1);
export const PATH_LENGTH = 20;

/** Progress is signed meters / PATH_LENGTH. It is not clamped to the segment. */
export function pointOnPath(progress: number, target: Vector3): Vector3 {
  return target.copy(PATH_ORIGIN).addScaledVector(PATH_FORWARD, progress * PATH_LENGTH);
}

/**
 * Straight travelling, pulled back so the fox reads with the trees.
 * The camera stays left of and behind the fox. On a narrow screen the look
 * point sits low, so the fox stays above the headline.
 */
export function frameFor(
  progress: number,
  narrow: boolean,
  camera: Vector3,
  look: Vector3,
): void {
  pointOnPath(progress, camera);
  const side = narrow ? -2.15 : -3.7;
  const back = narrow ? 5.7 : 5.5;
  const height = narrow ? 1.58 : 1.7;
  camera.addScaledVector(PATH_FORWARD, -back);
  camera.x += side;
  camera.y += height;

  pointOnPath(progress, look);
  look.x += narrow ? -0.7 : -1.7;
  look.y += narrow ? -0.05 : 0.28;
  look.addScaledVector(PATH_FORWARD, narrow ? 1.1 : 2.1);
}
