import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Vector3,
} from 'three';

export const FOX_URL = '/media/fox.glb';

/**
 * Authored height is about 0.6m. Scale keeps the mascot readable in a wide shot
 * without turning the field into a close-up.
 */
export const FOX_SCALE = 1.45;

/**
 * Walk has no root translation (hips only bob). This is the ground covered by
 * one cycle at unit scale, matched to the leg swing by eye.
 */
export const STRIDE = 0.36 * FOX_SCALE;

/**
 * three r186 Object3D.lookAt aims local +Z at the target. The skinned head
 * leads along -Z, so the aim sits behind the travel direction and +Z trails.
 */
export const MODEL_LOOK_SIGN = -1;

/** Scroll must rest this long before the fox sits. Product requirement, not a UI duration. */
export const IDLE_AFTER_MS = 400;

const UP = new Vector3(0, 1, 0);

export const foxPath = new CatmullRomCurve3(
  [
    new Vector3(0, 0, 5),
    new Vector3(1.8, 0, 0.5),
    new Vector3(-1.4, 0, -5),
    new Vector3(1.7, 0, -10.5),
    new Vector3(-1.6, 0, -16.5),
    new Vector3(0.3, 0, -23),
  ],
  false,
  'catmullrom',
  0.32,
);

/** x, z, radius, height. Sits beside the path, never on it. */
export const DRIFTS: readonly [number, number, number, number][] = [
  [-3.6, 3.2, 2.3, 1],
  [4.1, -0.8, 2.6, 1.05],
  [-4.4, -6.4, 3, 0.9],
  [4.4, -11.2, 2.2, 1.15],
  [-4, -16.2, 2.7, 1],
  [3.6, -21.4, 2.5, 0.85],
  [5, 4.2, 1.9, 0.75],
  [-2.6, -24.2, 2.8, 1],
];

export function buildTrail(
  curve: CatmullRomCurve3,
  width: number,
): BufferGeometry {
  const steps = 80;
  const positions = new Float32Array((steps + 1) * 6);
  const indices: number[] = [];
  const tangent = new Vector3();
  const side = new Vector3();
  const point = new Vector3();

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent);
    side.crossVectors(tangent, UP).normalize();
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
