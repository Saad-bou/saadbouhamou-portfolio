'use client';

import { useEffect, useRef } from 'react';

/**
 * Blocks vertical page drift during horizontal swipes over a horizontally
 * scrollable strip (e.g. the Projects carousel).
 *
 * Why native CSS (`touch-action: pan-x`) is not enough here: the site runs
 * Lenis with `syncTouch: true` (src/components/layout/SmoothScroll.tsx), which
 * listens on `window` for touch events and, once its virtual scroll handler
 * decides the gesture is scrollable, applies the finger's deltaY to the page
 * through its own programmatic scrollTo — a scroll CSS can't stop. Its source
 * never checks `event.defaultPrevented`, and it engages *before* the browser
 * decides which axis to keep. So this guard does two jobs:
 *
 *   1. Locks the gesture axis at its first movement: while the intent is
 *      horizontal, every touchmove is preventDefault()ed, which tells the
 *      browser to cancel any native vertical panning (this is the classic
 *      fix and covers the non-Lenis path, e.g. prefers-reduced-motion).
 *   2. Marks the strip `data-lenis-prevent-touch` so Lenis's own composed-path
 *      check skips touch gestures originating inside the strip entirely
 *      (Lenis honors this attribute; it does NOT honor defaultPrevented).
 *
 * Taps are untouched: we only ever preventDefault on touchmove after real
 * movement, and never touch click/touchend, so the card's onClick keeps
 * working. A movement under the ~8px threshold is treated as a tap.
 */
const TAP_SLOP_PX = 8;

export function useHorizontalSwipeGuard() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof window === 'undefined' || !('ontouchstart' in window)) return;

    // Per-gesture state (touchstart is not guaranteed to precede touchmove
    // in one listener, so we lazily initialise from the first move too).
    let startX = 0;
    let startY = 0;
    let gestureLocked: 'none' | 'horizontal' | 'vertical' = 'none';
    let tracking = false;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      gestureLocked = 'none';
      tracking = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || !e.cancelable) return;
      const t = e.touches[0];
      if (!t) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (gestureLocked === 'none') {
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);

        // Wait until the finger crosses the tap slop before deciding —
        // below it, the gesture may still be a tap (click) and must stay
        // untouched so the card's onClick fires.
        if (adx < TAP_SLOP_PX && ady < TAP_SLOP_PX) return;

        // Dominant horizontal intent → lock the gesture to the horizontal
        // axis. Preventing the default action on this and all subsequent
        // moves tells the browser to cancel native vertical page panning
        // and hand the gesture to the strip's native horizontal scroll.
        // A vertical intent is left alone so normal page scrolling over
        // the cards keeps working.
        gestureLocked = adx >= ady ? 'horizontal' : 'vertical';
      }

      if (gestureLocked === 'horizontal') {
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      tracking = false;
      gestureLocked = 'none';
    };

    // Non-passive is REQUIRED for touchmove: a passive listener can never
    // call preventDefault. touchstart/touchend stay passive — they never
    // prevent anything.
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return containerRef;
}
