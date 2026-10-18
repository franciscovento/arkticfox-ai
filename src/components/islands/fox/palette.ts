import { Color } from 'three';

export type FoxPalette = {
  snow: Color;
  snowShade: Color;
  ice: Color;
  ink: Color;
  coral: Color;
  pink: Color;
  white: Color;
  night: Color;
  skyHigh: Color;
  skyMid: Color;
  skyLow: Color;
  horizon: Color;
  trail: Color;
  foliage: Color;
  cap: Color;
  trunk: Color;
  /** Distant pines. Horizon pulled toward the low sky so fog can swallow them. */
  mist: Color;
};

function cssColor(name: string): Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const color = new Color();
  if (raw) color.set(raw);
  return color;
}

/**
 * Pastel field for the 3D fox only. Mixes stay inside the token set.
 * There is no green token, so the pines are ice blue pulled toward pink.
 * Global sky tokens stay on the home frost field.
 */
export function readFoxPalette(): FoxPalette {
  const ice = cssColor('--color-ice-blue');
  const ink = cssColor('--color-ink');
  const white = cssColor('--color-white');
  const snowWhite = cssColor('--color-snow-white');
  const coral = cssColor('--color-fox-coral');
  const pink = cssColor('--color-fox-pink');
  const night = cssColor('--color-polar-night');

  const skyHigh = ice.clone().lerp(white, 0.62);
  const skyMid = white.clone().lerp(pink, 0.16).lerp(ice, 0.4);
  const skyLow = snowWhite.clone().lerp(pink, 0.2).lerp(ice, 0.18);
  const horizon = snowWhite.clone().lerp(pink, 0.28);
  const snow = snowWhite.clone().lerp(pink, 0.05).lerp(white, 0.35);
  const snowShade = ice.clone().lerp(white, 0.42).lerp(pink, 0.14);
  const foliage = ice.clone().lerp(white, 0.18).lerp(pink, 0.26);
  const cap = white.clone().lerp(ice, 0.16).lerp(pink, 0.05);
  const trunk = coral.clone().lerp(ink, 0.52).lerp(pink, 0.1);

  return {
    snow,
    snowShade,
    ice: ice.clone().lerp(white, 0.48),
    ink,
    coral,
    pink,
    white,
    night,
    skyHigh,
    skyMid,
    skyLow,
    horizon,
    trail: snow.clone().lerp(ice, 0.22).lerp(snowShade, 0.28),
    foliage,
    cap,
    trunk,
    mist: horizon.clone().lerp(skyLow, 0.55),
  };
}
