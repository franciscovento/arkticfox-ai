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
 * Overcast field for the 3D fox only. Mixes stay inside the token set.
 * Ice is pulled toward snow gray and ink so the sky reads as gray-lavender
 * and muted blue, not a bright pastel. The fox fur stays the light shape.
 */
export function readFoxPalette(): FoxPalette {
  const ice = cssColor('--color-ice-blue');
  const ink = cssColor('--color-ink');
  const white = cssColor('--color-white');
  const snowWhite = cssColor('--color-snow-white');
  const gray = cssColor('--color-snow-gray');
  const coral = cssColor('--color-fox-coral');
  const pink = cssColor('--color-fox-pink');
  const night = cssColor('--color-polar-night');

  const cloud = ice.clone().lerp(gray, 0.58).lerp(ink, 0.28);
  const skyHigh = gray.clone().lerp(ink, 0.3).lerp(ice, 0.2);
  const skyMid = skyHigh.clone().lerp(gray, 0.12).lerp(pink, 0.06);
  const skyLow = skyMid.clone().lerp(gray, 0.16);
  const snow = snowWhite.clone().lerp(gray, 0.5).lerp(ink, 0.14).lerp(ice, 0.04);
  const snowShade = snow.clone().lerp(ink, 0.08).lerp(cloud, 0.1);
  const mist = ice.clone().lerp(gray, 0.55).lerp(ink, 0.22);

  return {
    snow,
    snowShade,
    ice: mist,
    ink,
    coral,
    pink,
    white,
    night,
    skyHigh,
    skyMid,
    skyLow,
    horizon: gray.clone().lerp(cloud, 0.4).lerp(ink, 0.22),
    trail: snow.clone().lerp(snowShade, 0.55),
  };
}
