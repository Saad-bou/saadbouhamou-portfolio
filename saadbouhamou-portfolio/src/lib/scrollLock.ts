/**
 * Scroll Lock Utility
 *
 * Reference-counted so multiple consumers (AIChatAgent, ContactPanel, etc.)
 * can independently lock/unlock without fighting each other.
 * Each caller that locks MUST call unlock exactly once when done.
 */

let lockCount = 0;

export function lockScroll(): void {
  if (typeof window === 'undefined') return;
  lockCount++;
  if (lockCount === 1) {
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    document.body.style.setProperty('overflow', 'hidden', 'important');
  }
}

export function unlockScroll(): void {
  if (typeof window === 'undefined') return;
  if (lockCount === 0) return; // already unlocked — no-op
  lockCount--;
  if (lockCount === 0) {
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
  }
}
