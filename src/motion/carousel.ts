import { prefersReducedMotion } from './reduced';
import { easeFox } from './easing';
import { dur } from './tokens';

interface CarouselOptions {
  /** Scale of a slide one full step (or more) away from the centre. */
  sideScale?: number;
  /** Opacity of a slide one full step (or more) away from the centre. */
  sideOpacity?: number;
  /** Called with the index of the slide closest to the centre whenever it changes. */
  onActive?: (index: number, slides: HTMLElement[]) => void;
  /**
   * Infinite loop: the track holds three identical copies of `loop` slides in a row. When the
   * centre drifts into an outer copy, the scroll jumps by one copy to the twin slide, which
   * looks identical, so there are always slides on both sides.
   */
  loop?: number;
  /** Slide to start on. Defaults to the middle of the track. */
  start?: number;
  /** Neighbours shown on each side of the centre; slides further out fade away. */
  neighbours?: number;
}

export interface CenterCarousel {
  /**
   * Entrance, 0 → 1. The visible slides arrive one by one from the right, left to right,
   * like the service cards. 1 (the default) is fully in.
   */
  setReveal: (value: number) => void;
  /** Index of the slide closest to the centre. */
  current: () => number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  destroy: () => void;
}

/**
 * Centre-focus carousel on a scroll-snap track. The slide in the middle is full size; the
 * others shrink and dim with their distance and are pulled inward so the gaps stay even.
 * Buttons, keys, clicks and the end of a mouse drag glide to a slide with `ease-fox` instead of
 * the browser's quick smooth scroll. Touch keeps native scrolling. Reduced motion jumps.
 * With `loop`, the track is three copies and quietly re-centres, so it never runs out.
 */
export function initCenterCarousel(
  track: HTMLElement,
  options: CarouselOptions = {},
): CenterCarousel {
  const {
    sideScale = 0.8,
    sideOpacity = 0.55,
    onActive,
    loop = 0,
    start,
    neighbours = Number.POSITIVE_INFINITY,
  } = options;
  const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
  const reduce = prefersReducedMotion();
  let active = -1;
  let frame = 0;
  let glide = 0;
  // Where a running glide is heading, so repeated next/prev clicks keep stepping forward.
  let heading = -1;
  let reveal = 1;

  const layout = () => {
    frame = 0;
    const box = track.getBoundingClientRect();
    const centre = box.left + box.width / 2;
    let closest = 0;
    let best = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      // offsetLeft is untouched by transforms, so measuring never feeds back into itself.
      const width = slide.offsetWidth;
      const slideCentre = box.left + slide.offsetLeft - track.scrollLeft + width / 2;
      const signed = (slideCentre - centre) / width;
      const d = Math.abs(signed);
      const t = Math.min(d, 1);
      const shrink = 1 - sideScale;
      const scale = 1 - shrink * t;
      // Pull toward the centre by what the shrinking slides gave up: d²/2 until one step, then linear.
      const pull = shrink * width * (d < 1 ? (d * d) / 2 : d - 0.5);
      // Entrance order by place: left neighbour 0, centre 1, right neighbour 2. Each takes half
      // of the reveal, starting a quarter apart, and slides 96px in from the right.
      const place = Math.min(2, Math.max(0, signed + 1));
      const arrive = Math.min(1, Math.max(0, (reveal - place * 0.25) / 0.5));
      const enterX = (1 - arrive) * 96;
      slide.style.transform = `translateX(${-Math.sign(signed) * pull + enterX}px) scale(${scale})`;
      // Past the last neighbour a slide fades out over half a step, so only a few show at once.
      const beyond = Math.min(1, Math.max(0, (d - neighbours) / 0.5));
      const opacity = (1 - (1 - sideOpacity) * t) * (1 - beyond) * arrive;
      slide.style.opacity = String(opacity);
      slide.style.visibility = opacity < 0.02 ? 'hidden' : '';
      slide.style.zIndex = String(100 - Math.round(d * 10));
      if (d < best) {
        best = d;
        closest = index;
      }
    });

    if (closest !== active) {
      active = closest;
      slides.forEach((slide, index) => slide.toggleAttribute('data-active', index === active));
      onActive?.(active, slides);
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(layout);
  };

  const clamp = (index: number) => Math.max(0, Math.min(slides.length - 1, index));

  const leftFor = (index: number) => {
    const slide = slides[index];
    return slide ? slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2 : 0;
  };

  const stopGlide = () => {
    if (!glide) return;
    cancelAnimationFrame(glide);
    glide = 0;
    heading = -1;
    track.classList.remove('is-gliding');
  };

  const goTo = (index: number) => {
    stopGlide();
    heading = clamp(index);
    const target = leftFor(heading);
    const from = track.scrollLeft;
    if (reduce || Math.abs(target - from) < 1) {
      track.scrollLeft = target;
      heading = -1;
      return;
    }
    // Snap would fight every frame of the glide, so it is off until the glide lands.
    track.classList.add('is-gliding');
    const duration = dur.reveal * 1000;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      track.scrollLeft = from + (target - from) * easeFox(p);
      if (p < 1) {
        glide = requestAnimationFrame(step);
      } else {
        glide = 0;
        heading = -1;
        track.classList.remove('is-gliding');
        recentre();
      }
    };
    glide = requestAnimationFrame(step);
  };

  /** Loop: once settled near either end, jump one copy back toward the middle. */
  const recentre = () => {
    if (!loop || glide || dragging || slides.length < loop * 3) return;
    const edge = Math.floor(loop / 2);
    let shift = 0;
    if (active < edge) shift = loop;
    else if (active >= slides.length - edge) shift = -loop;
    if (!shift) return;
    // Snap off for the jump, or the browser re-snaps to a different slide mid-jump.
    track.classList.add('is-gliding');
    track.scrollLeft = leftFor(active + shift);
    layout();
    requestAnimationFrame(() => {
      if (!glide) track.classList.remove('is-gliding');
    });
  };

  let settle = 0;
  const onScroll = () => {
    schedule();
    window.clearTimeout(settle);
    settle = window.setTimeout(recentre, 160);
  };

  const current = () => (glide && heading >= 0 ? heading : active);
  const next = () => goTo(current() + 1);
  const prev = () => goTo(current() - 1);

  // Mouse drag with a little throw. Touch and trackpads scroll the track natively.
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    if ((event.target as HTMLElement | null)?.closest('[data-carousel-nav]')) return;
    stopGlide();
    dragging = true;
    moved = false;
    startX = lastX = event.clientX;
    lastT = event.timeStamp;
    startLeft = track.scrollLeft;
    velocity = 0;
    track.classList.add('is-dragging');
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    const dt = event.timeStamp - lastT;
    if (dt > 0) velocity = 0.8 * ((event.clientX - lastX) / dt) + 0.2 * velocity;
    lastX = event.clientX;
    lastT = event.timeStamp;
    track.scrollLeft = startLeft - dx;
  };

  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    // Throw: project where the drag was heading, then settle on the nearest slide (one step max).
    const width = slides[0]?.offsetWidth ?? 1;
    const projected = track.scrollLeft - velocity * 180;
    const from = active;
    let target = from;
    let best = Number.POSITIVE_INFINITY;
    slides.forEach((_, index) => {
      const gap = Math.abs(leftFor(index) - projected);
      if (gap < best) {
        best = gap;
        target = index;
      }
    });
    if (Math.abs(track.scrollLeft - startLeft) < width * 0.08 && Math.abs(velocity) < 0.3) target = from;
    goTo(Math.max(from - 1, Math.min(from + 1, target)));
  };

  // A click on a side slide centres it instead of pressing its controls; a drag never clicks.
  const onClick = (event: MouseEvent) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      moved = false;
      return;
    }
    const slide = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-carousel-slide]');
    if (!slide || slide.hasAttribute('data-active')) return;
    event.preventDefault();
    event.stopPropagation();
    goTo(slides.indexOf(slide));
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') next();
    else if (event.key === 'ArrowLeft') prev();
    else return;
    event.preventDefault();
  };

  // Any native input takes over from a running glide.
  const onTakeOver = () => stopGlide();

  track.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', schedule);
  track.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  track.addEventListener('click', onClick, true);
  track.addEventListener('keydown', onKey);
  track.addEventListener('wheel', onTakeOver, { passive: true });
  track.addEventListener('touchstart', onTakeOver, { passive: true });

  // Start in the middle so there is work on both sides.
  track.scrollLeft = leftFor(clamp(start ?? Math.floor((slides.length - 1) / 2)));
  layout();

  return {
    setReveal: (value: number) => {
      const next = Math.min(1, Math.max(0, value));
      if (next === reveal) return;
      reveal = next;
      schedule();
    },
    current: () => active,
    goTo,
    next,
    prev,
    destroy: () => {
      stopGlide();
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      track.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('click', onClick, true);
      track.removeEventListener('keydown', onKey);
      track.removeEventListener('wheel', onTakeOver);
      track.removeEventListener('touchstart', onTakeOver);
    },
  };
}
