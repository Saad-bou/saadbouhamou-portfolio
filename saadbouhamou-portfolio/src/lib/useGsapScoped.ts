'use client';

import { useEffect, type RefObject } from 'react';

type GsapInstance = typeof import('gsap')['gsap'];
type ScrollTriggerPlugin = typeof import('gsap/ScrollTrigger')['ScrollTrigger'];

/**
 * Lazy GSAP: the ~112KB gsap + ScrollTrigger bundle is fetched on demand
 * instead of being parsed on the critical path of first load. The callback
 * runs inside gsap.context() scoped to `scopeRef`, exactly like useGSAP's
 * `{ scope }` option, and is reverted on unmount — so animation behavior,
 * selector scoping, and cleanup are identical.
 */
export function useGsapScoped(
  scopeRef: RefObject<HTMLElement | null>,
  setup: (gsap: GsapInstance, ScrollTrigger: ScrollTriggerPlugin) => void
) {
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapMod, stMod]) => {
        if (cancelled) return;
        const gsap = gsapMod.gsap ?? gsapMod.default;
        const ScrollTrigger = stMod.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => setup(gsap, ScrollTrigger), scopeRef.current ?? undefined);
      }
    );

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // setup closes over refs/state setters only; run once like useGSAP(..., [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
