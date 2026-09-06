/**
 * Defer non-critical work until the main thread is idle — after the first
 * paint/hydration has settled. On mobile this is what keeps heavy dynamic
 * chunks (gsap, chat agent, canvas effects) from contending with the initial
 * render. Falls back to a short setTimeout when requestIdleCallback is
 * unavailable (Safari < 16). Returns a cancel function.
 */
export function runWhenIdle(callback: () => void, timeout = 500): () => void {
  if (typeof window === "undefined") return () => {};

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }

  const timer = window.setTimeout(callback, 200);
  return () => window.clearTimeout(timer);
}
