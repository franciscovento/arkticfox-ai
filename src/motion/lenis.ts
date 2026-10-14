import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { registerGsap } from './gsap';
import { prefersReducedMotion } from './reduced';

let lenis: Lenis | undefined;
let ticker: ((time: number) => void) | undefined;

function isCoarsePointer(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Smooth wheel scrolling for scrubbed scenes. Off on touch and reduced motion. */
export function startSmoothScroll(): void {
  if (typeof window === 'undefined' || prefersReducedMotion() || isCoarsePointer()) return;
  if (lenis) {
    lenis.resize();
    ScrollTrigger.refresh();
    return;
  }
  registerGsap();

  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);

  ticker = (time) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);
}

/** Drop Lenis so the next page can scroll natively. */
export function stopSmoothScroll(): void {
  if (ticker) gsap.ticker.remove(ticker);
  ticker = undefined;
  lenis?.destroy();
  lenis = undefined;
  document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('overflow');
}
