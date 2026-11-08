import { ease } from './tokens';

/** CSS-style cubic-bezier timing function, solved with a few Newton steps. */
export function cubicBezier([x1, y1, x2, y2]: readonly [number, number, number, number]) {
  const bx = (t: number) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
  const by = (t: number) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  const dx = (t: number) =>
    3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i += 1) {
      const slope = dx(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= (bx(t) - x) / slope;
    }
    return by(Math.min(1, Math.max(0, t)));
  };
}

/** `ease-fox` as a JS function, for tweens the browser cannot run in CSS. */
export const easeFox = cubicBezier(ease.fox);
