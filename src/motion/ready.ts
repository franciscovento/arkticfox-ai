/** Run after the document is parsed. Full page loads do not fire `astro:page-load`. */
export function onPageReady(boot: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
    return;
  }
  boot();
}
