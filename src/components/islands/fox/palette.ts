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

/** Scene colors mixed from the token palette. No raw colors live in this file. */
export function readFoxPalette(): FoxPalette {
  const ice = cssColor('--color-ice-blue');
  const ink = cssColor('--color-ink');
  const white = cssColor('--color-white');
  const snow = cssColor('--color-snow-white');
  const snowShade = cssColor('--color-snow-gray');
  const coral = cssColor('--color-fox-coral');
  const pink = cssColor('--color-fox-pink');
  const night = cssColor('--color-polar-night');
  const skyHigh = ink.clone().lerp(ice, 0.22);
  const skyMid = ink.clone().lerp(ice, 0.38);
  const skyLow = ink.clone().lerp(ice, 0.54);

  return {
    snow,
    snowShade,
    ice,
    ink,
    coral,
    pink,
    white,
    night,
    skyHigh,
    skyMid,
    skyLow,
    horizon: coral.clone().lerp(pink, 0.45),
    trail: snow.clone().lerp(ice, 0.22).lerp(snowShade, 0.2),
  };
}
