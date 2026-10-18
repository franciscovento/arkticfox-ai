import { BufferAttribute, BufferGeometry, Vector3 } from 'three';

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

const UP = new Vector3(0, 1, 0);

/** x, z, radius, height. Beside the straight path, never on it. */
export const DRIFTS: readonly [number, number, number, number][] = [
  [-3.2, 5.2, 2.2, 1],
  [3.4, 2.4, 2.5, 0.95],
  [-3.6, -1.2, 2.8, 1.05],
  [3.5, -5.4, 2.3, 0.9],
  [-3.1, -9.2, 2.6, 1],
  [3.8, -13.2, 2.4, 0.85],
];

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

export function buildTrail(width: number): BufferGeometry {
  const steps = 2;
  const positions = new Float32Array((steps + 1) * 6);
  const indices: number[] = [];
  const side = new Vector3().crossVectors(PATH_FORWARD, UP).normalize();
  const point = new Vector3();

  for (let i = 0; i <= steps; i++) {
    pointOnPath(i / steps, point);
    const left = i * 2;
    const right = left + 1;
    positions[left * 3] = point.x + side.x * width;
    positions[left * 3 + 1] = 0.025;
    positions[left * 3 + 2] = point.z + side.z * width;
    positions[right * 3] = point.x - side.x * width;
    positions[right * 3 + 1] = 0.025;
    positions[right * 3 + 2] = point.z - side.z * width;
    if (i < steps) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
