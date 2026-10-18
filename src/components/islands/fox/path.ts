import { Vector3 } from 'three';

export const FOX_URL = '/media/fox.glb';

/** Authored height is about 0.6m. Scale keeps the mascot readable beside the type. */
export const FOX_SCALE = 1.45;

/**
 * Walk has no root translation. Meters of ground per cycle at unit scale,
 * matched to the leg swing by eye.
 */
export const STRIDE = 0.36 * FOX_SCALE;

/** Scroll must rest this long before the fox turns back and sits. */
export const IDLE_AFTER_MS = 400;

/**
 * Cruise speed. Scroll is a switch: while it is recent, or a fast scroll has
 * queued distance, the world advances at this many meters per second.
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

export function pointOnPath(progress: number, target: Vector3): Vector3 {
  const t = Math.min(1, Math.max(0, progress));
  return target.copy(PATH_ORIGIN).addScaledVector(PATH_FORWARD, t * PATH_LENGTH);
}

/**
 * Straight travelling. The camera stays left of and behind the fox so the
 * fox holds the right side of the frame. Offset does not swing.
 */
export function frameFor(
  progress: number,
  narrow: boolean,
  camera: Vector3,
  look: Vector3,
): void {
  pointOnPath(progress, camera);
  const side = narrow ? -1.2 : -2.2;
  const back = narrow ? 2.2 : 2.65;
  const height = narrow ? 0.92 : 1.12;
  camera.addScaledVector(PATH_FORWARD, -back);
  camera.x += side;
  camera.y += height;

  pointOnPath(progress, look);
  look.x += narrow ? -0.15 : -0.65;
  look.y += 0.4;
  look.addScaledVector(PATH_FORWARD, 0.2);
}
