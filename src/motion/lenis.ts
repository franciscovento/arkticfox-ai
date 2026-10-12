import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { registerGsap } from './gsap';
import { prefersReducedMotion } from './reduced';

let started = false;

/** Smooth wheel scrolling for scrubbed scenes. Off when reduced motion is requested. */
export function startSmoothScroll(): void {
  if (started || typeof window === 'undefined' || prefersReducedMotion()) return;
  started = true;
  registerGsap();

  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}
