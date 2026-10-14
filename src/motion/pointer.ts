import { prefersReducedMotion } from './reduced';

export interface PointerState {
  /** Viewport position, 0 to 1. Starts centered so the first frame is never off-screen. */
  x: number;
  y: number;
  /** Eased follow of x/y. Use this for anything visible, so the motion reads as drift, not as a jump. */
  ex: number;
  ey: number;
  /** True once the device has actually produced a fine-pointer move. */
  active: boolean;
}

const state: PointerState = { x: 0.5, y: 0.5, ex: 0.5, ey: 0.5, active: false };
const listeners = new Set<(s: PointerState) => void>();
let bound = false;
let frame = 0;

/**
 * Single pointer source for the motion layer. Snow wind, the frost glow and the glass
 * sheen all read from here, so there is one listener and one rAF rather than three.
 * Returns a read-only view that is mutated in place.
 */
export function pointer(): PointerState {
  bind();
  return state;
}

/** Subscribe to the eased pointer. The callback runs at most once per frame. */
export function onPointer(fn: (s: PointerState) => void): () => void {
  bind();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function bind(): void {
  if (bound || typeof window === 'undefined') return;
  bound = true;

  // Touch has no hover, and reduced motion means the background should sit still.
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  window.addEventListener(
    'pointermove',
    (event) => {
      state.x = event.clientX / window.innerWidth;
      state.y = event.clientY / window.innerHeight;
      state.active = true;
      if (!frame) frame = window.requestAnimationFrame(tick);
    },
    { passive: true },
  );

  window.addEventListener(
    'pointerleave',
    () => {
      state.x = 0.5;
      state.y = 0.5;
      if (!frame) frame = window.requestAnimationFrame(tick);
    },
    { passive: true },
  );
}

function tick(): void {
  state.ex += (state.x - state.ex) * 0.06;
  state.ey += (state.y - state.ey) * 0.06;

  for (const fn of listeners) fn(state);

  const settled = Math.abs(state.x - state.ex) < 0.0005 && Math.abs(state.y - state.ey) < 0.0005;
  if (settled) {
    state.ex = state.x;
    state.ey = state.y;
    frame = 0;
    return;
  }
  frame = window.requestAnimationFrame(tick);
}
