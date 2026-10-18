import {
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DataTexture,
  LinearFilter,
  LinearSRGBColorSpace,
  MeshToonMaterial,
  SphereGeometry,
  type InstancedMesh,
  Object3D,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** One repeat of the forest, in meters, along the straight path. */
export const LOOP_SPAN = 34;
const LOOP_BEHIND = 6;
const LOOP_AHEAD = LOOP_SPAN - LOOP_BEHIND;

export type ScenerySlot = {
  x: number;
  z: number;
  scale: number;
  spin: number;
};

const _dummy = new Object3D();

/** Keep a slot inside the camera window. Stable in world space until it wraps. */
export function wrapAlong(slotZ: number, cameraZ: number): number {
  const min = cameraZ - LOOP_AHEAD;
  const rel = slotZ - min;
  const wrapped = ((rel % LOOP_SPAN) + LOOP_SPAN) % LOOP_SPAN;
  return min + wrapped;
}

/** Left of the path. The fox's right side stays open. */
export function pineSlots(): ScenerySlot[] {
  const slots: ScenerySlot[] = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    slots.push({
      x: -(2.45 + (i % 3) * 1.35),
      z: (i / count) * LOOP_SPAN,
      scale: 1.15 + (i % 4) * 0.22,
      spin: (i % 5) * 0.55,
    });
  }
  return slots;
}

export function hillSlots(): ScenerySlot[] {
  const slots: ScenerySlot[] = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    slots.push({
      x: -(5.4 + (i % 2) * 2.5),
      z: ((i + 0.35) / count) * LOOP_SPAN,
      scale: 2.15 + (i % 3) * 0.55,
      spin: 0,
    });
  }
  return slots;
}

function paint(geometry: BufferGeometry, color: Color) {
  const count = geometry.getAttribute('position').count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  return geometry;
}

/** Three stacked blobs and a short trunk. Low segment counts, one merged mesh. */
export function createPineGeometry(foliage: Color, cap: Color, trunk: Color): BufferGeometry {
  const blobs = [
    { radius: 0.52, width: 6, height: 5, y: 0.72, color: foliage },
    { radius: 0.38, width: 6, height: 5, y: 1.12, color: foliage },
    { radius: 0.24, width: 5, height: 4, y: 1.42, color: cap },
  ];
  const parts = blobs.map((blob) => {
    const geometry = new SphereGeometry(blob.radius, blob.width, blob.height);
    geometry.translate(0, blob.y, 0);
    geometry.scale(1, 0.92, 1);
    return paint(geometry, blob.color);
  });
  const stem = new CylinderGeometry(0.07, 0.11, 0.42, 5);
  stem.translate(0, 0.2, 0);
  parts.push(paint(stem, trunk));
  const merged = mergeGeometries(parts, false);
  for (const part of parts) part.dispose();
  if (!merged) throw new Error('pine geometry');
  return merged;
}

export function createHillGeometry(): BufferGeometry {
  return new SphereGeometry(1, 8, 6);
}

/** Four soft steps from a cool shadow to white. Built from the scene colors. */
export function createToonRamp(shadow: Color, light: Color): DataTexture {
  const steps = 4;
  const data = new Uint8Array(steps * 4);
  for (let i = 0; i < steps; i++) {
    const mix = shadow.clone().lerp(light, (i / (steps - 1)) ** 1.4);
    data[i * 4] = Math.round(mix.r * 255);
    data[i * 4 + 1] = Math.round(mix.g * 255);
    data[i * 4 + 2] = Math.round(mix.b * 255);
    data[i * 4 + 3] = 255;
  }
  const texture = new DataTexture(data, steps, 1);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createToonMaterial(
  ramp: DataTexture,
  color?: Color,
  vertexColors = false,
): MeshToonMaterial {
  return new MeshToonMaterial({
    color,
    vertexColors,
    gradientMap: ramp,
  });
}

export function placeSlots(
  mesh: InstancedMesh,
  slots: readonly ScenerySlot[],
  cameraZ: number,
  yFor: (slot: ScenerySlot) => number,
) {
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    _dummy.position.set(slot.x, yFor(slot), wrapAlong(slot.z, cameraZ));
    _dummy.rotation.set(0, slot.spin, 0);
    _dummy.scale.set(slot.scale, slot.scale, slot.scale);
    _dummy.updateMatrix();
    mesh.setMatrixAt(i, _dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
