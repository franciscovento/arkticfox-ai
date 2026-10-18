import { DoubleSide, ShaderMaterial, type Color } from 'three';
import { TRAVEL_MPS } from './path';

/**
 * Looping travelling plate behind the fox.
 * Leave this null until the plate asset exists, then set it to a same-origin
 * URL such as `/media/fox-travel.mp4` (muted loop) or a still sequence poster.
 * The plate already scrolls with travelled meters and holds when the fox sits.
 * A video should pause with the fox and set `currentTime` from `backdropTime`.
 */
export const BACKDROP_URL: string | null = null;

/** Seconds of travel the future clip represents. */
export const BACKDROP_LOOP_S = 8;

export function backdropTime(distance: number): number {
  const span = TRAVEL_MPS * BACKDROP_LOOP_S;
  if (span <= 0) return 0;
  const wrapped = distance % span;
  return (wrapped / span) * BACKDROP_LOOP_S;
}

type BackdropColors = {
  skyHigh: Color;
  skyMid: Color;
  skyLow: Color;
  snow: Color;
  ice: Color;
};

/** Token-colored stand-in. Swap the material when BACKDROP_URL is set. */
export function createBackdropMaterial(colors: BackdropColors): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    fog: true,
    uniforms: {
      offset: { value: 0 },
      highColor: { value: colors.skyHigh },
      midColor: { value: colors.skyMid },
      lowColor: { value: colors.skyLow },
      snowColor: { value: colors.snow },
      iceColor: { value: colors.ice },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float offset;
      uniform vec3 highColor;
      uniform vec3 midColor;
      uniform vec3 lowColor;
      uniform vec3 snowColor;
      uniform vec3 iceColor;
      void main() {
        float h = clamp(vUv.y, 0.0, 1.0);
        vec3 color = mix(lowColor, midColor, smoothstep(0.05, 0.55, h));
        color = mix(color, highColor, smoothstep(0.4, 1.0, h));
        float bands = sin(vUv.x * 8.0 + offset * 0.35);
        float drift = smoothstep(0.15, 0.85, bands * 0.5 + 0.5);
        color = mix(color, mix(snowColor, iceColor, h), drift * 0.28 * (1.0 - smoothstep(0.45, 0.9, h)));
        float alpha = smoothstep(0.02, 0.28, h);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}
