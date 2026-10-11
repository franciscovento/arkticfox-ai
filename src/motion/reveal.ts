import { prefersReducedMotion } from './reduced';

let observer: IntersectionObserver | null = null;

/** Bind fade-and-rise reveals. Safe to call once per page. */
export function initReveal(): void {
  const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
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
