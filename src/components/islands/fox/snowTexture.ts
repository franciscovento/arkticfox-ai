import { CanvasTexture, Color, RepeatWrapping, SRGBColorSpace } from 'three';

function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Soft grain so the ground is not a flat fill. Colors come from the palette. */
export function makeSnowTexture(
  snow: Color,
  shade: Color,
  ice: Color,
): CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new CanvasTexture(canvas);

  const image = ctx.createImageData(size, size);
  const mixed = snow.clone();
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = hash(x, y);
      const broad = hash(Math.floor(x / 8), Math.floor(y / 8));
      mixed.copy(snow).lerp(shade, n * 0.28 + broad * 0.12);
      if (n > 0.94) mixed.lerp(ice, 0.35);
      const i = (y * size + x) * 4;
      image.data[i] = Math.round(mixed.r * 255);
      image.data[i + 1] = Math.round(mixed.g * 255);
      image.data[i + 2] = Math.round(mixed.b * 255);
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
