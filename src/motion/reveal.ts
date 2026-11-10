import { prefersReducedMotion } from './reduced';

let observer: IntersectionObserver | null = null;

/** Bind fade-and-rise reveals. Safe to call once per page. */
export function initReveal(): void {
  bindReveal('[data-reveal]');
}

/** Same fade, only for the stacked phone page. No effect from `md` up. */
export function initPhoneReveal(): void {
  if (!window.matchMedia('(max-width: 767px)').matches) return;
  bindReveal('[data-phone-reveal]');
}

function bindReveal(selector: string): void {
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  if (nodes.length === 0) return;

  if (prefersReducedMotion()) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
  }

  nodes.forEach((node) => {
    if (node.dataset.revealBound === 'true') return;
    node.dataset.revealBound = 'true';
    observer?.observe(node);
  });
}
