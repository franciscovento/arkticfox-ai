/** Approved travelling plate. Muted 720p loop, about eight seconds. */
export const FOX_VIDEO_URL = '/media/snow-path-foggy-1.mp4';
export const FOX_VIDEO_POSTER = '/media/snow-path-foggy-1.jpg';

export type FoxPlate = 'scene' | 'video';

/** `?bg=3d` and `?bg=video` win over the route default. Anything else keeps it. */
export function plateFromSearch(search: string, fallback: FoxPlate): FoxPlate {
  const bg = new URLSearchParams(search).get('bg');
  if (bg === 'video') return 'video';
  if (bg === '3d') return 'scene';
  return fallback;
}

/** The comparison toggle is on in dev, and on a production build only with `?debug`. */
export function plateToggleVisible(dev: boolean, search: string): boolean {
  return dev || new URLSearchParams(search).has('debug');
}

export function readFoxPlate(fallback: FoxPlate): FoxPlate {
  if (typeof window === 'undefined') return fallback;
  const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
  const routeDefault = stage?.dataset.foxPlateDefault === 'video' ? 'video' : fallback;
  return plateFromSearch(window.location.search, routeDefault);
}

/** Shows the film or the drawn woods without reloading the fox. */
export function applyFoxPlateDom(plate: FoxPlate) {
  const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
  if (!stage) return;
  stage.dataset.foxPlate = plate;
  const video = stage.querySelector<HTMLVideoElement>('[data-fox-video]');
  if (video) {
    const show = plate === 'video';
    video.hidden = !show;
    video.classList.toggle('hidden', !show);
    if (show && video.preload === 'none') {
      video.preload = 'auto';
      video.load();
    }
  }
  const toggle = stage.querySelector<HTMLElement>('[data-fox-plate-toggle]');
  if (!toggle) return;
  const dev = stage.dataset.foxDev === '1';
  toggle.hidden = !plateToggleVisible(dev, window.location.search);
  toggle.querySelectorAll<HTMLButtonElement>('[data-fox-bg]').forEach((button) => {
    const selected =
      (button.dataset.foxBg === 'video' && plate === 'video') ||
      (button.dataset.foxBg === '3d' && plate === 'scene');
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}
