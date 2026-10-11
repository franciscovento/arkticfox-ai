import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './reduced';

export { prefersReducedMotion };

let registered = false;

/** Single registration point for GSAP and ScrollTrigger. */
export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Run a scroll scene only when motion is allowed.
 * Every scroll scene must early-return when prefers-reduced-motion is set.
 */
export function runScrollScene(setup: () => void): void {
  if (prefersReducedMotion()) return;
  registerGsap();
  setup();
}
