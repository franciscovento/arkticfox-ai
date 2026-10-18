import { Object3D, Quaternion, Vector3 } from 'three';
import { dur } from '@/motion/tokens';

/**
 * Sit already swings Tail_* (about 16° at the base, hips stay put).
 * Idle and Idle Alert are standing clips, so blending them would stand the fox up.
 * Flip this off only if a future Sit export has no tail keys.
 */
export const SIT_CLIP_HAS_TAIL = true;

/**
 * Sit, Idle, and Idle Alert store the head on two identical keys.
 * Flip this on when a future Sit export carries the head look itself.
 */
export const SIT_CLIP_HAS_HEAD = false;

/** Hard caps. The offset is rebuilt from the clip pose every frame, never added to last frame. */
const HEAD_YAW = 0.09;
const HEAD_PITCH = 0.03;
const TAIL_YAW = 0.12;

const _base = new Quaternion();
const _parent = new Quaternion();
const _inv = new Quaternion();
const _offset = new Quaternion();
const _yaw = new Quaternion();
const _pitch = new Quaternion();
const _up = new Vector3(0, 1, 0);
const _right = new Vector3(1, 0, 0);

function wave(time: number, period: number, phase: number, cap: number): number {
  const angle = Math.sin((time / period) * Math.PI * 2 + phase) * cap;
  return Math.min(cap, Math.max(-cap, angle));
}

/**
 * World-up yaw and a small pitch, written on top of whatever the mixer just
 * sampled. The next mixer update replaces the bone, so the offset cannot stack.
 */
function poseOffset(bone: Object3D, yaw: number, pitch: number) {
  const parent = bone.parent;
  if (!parent) return;
  _base.copy(bone.quaternion);
  parent.updateWorldMatrix(true, false);
  parent.getWorldQuaternion(_parent);
  _inv.copy(_parent).invert();
  _yaw.setFromAxisAngle(_up, yaw);
  _pitch.setFromAxisAngle(_right, pitch);
  _offset.copy(_yaw).multiply(_pitch);
  bone.quaternion.copy(_inv).multiply(_offset).multiply(_parent).multiply(_base);
}

export function applyHeadLife(head: Object3D, time: number): number {
  const yaw = wave(time, dur.slow * 3.2, 0.4, HEAD_YAW);
  const pitch = wave(time, dur.slow * 2.6, 1.3, HEAD_PITCH);
  poseOffset(head, yaw, pitch);
  return yaw;
}

/** Used only when SIT_CLIP_HAS_TAIL is off. Same non-accumulating rule as the head. */
export function applyTailLife(tail: Object3D, time: number) {
  const yaw = wave(time, dur.slow * 1.6, 0.2, TAIL_YAW);
  poseOffset(tail, yaw, 0);
}

export function sitLifeLabel(): 'clip' | 'procedural' {
  return SIT_CLIP_HAS_TAIL ? 'clip' : 'procedural';
}
