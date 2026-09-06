"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useSyncExternalStore } from 'react';
import { runWhenIdle } from '@/lib/defer';

type ScrollTriggerPlugin = typeof import('gsap/ScrollTrigger')['ScrollTrigger'];

// Set once the lazy gsap/ScrollTrigger bundle finishes loading, so the
// Lenis bridge can forward frames to ScrollTrigger without gsap being
// on the critical initial-load path.
let scrollTriggerRef: ScrollTriggerPlugin | null = null;

// ─── Lenis ↔ GSAP ScrollTrigger Bridge ──────────────────────────────────────
// بدون هاد الـ Bridge، GSAP كيقرا window.scrollY بينما Lenis كيهضم
// الـ scroll في عالمه الخاص → ScrollTrigger ما كيشوفش progress الـ scroll
// على الموبايل (touch devices) — هاد الـ component ضروري جداً!
function LenisGSAPBridge() {
  // useLenis(callback) كيستدعي الـ callback فكل frame ديال Lenis
  // ScrollTrigger.update كيقول لـ GSAP يعيد يحسب الـ scroll position
  useLenis(() => {
    scrollTriggerRef?.update();
  });
  return null;
}

// ─── Lenis eligibility: فقط prefers-reduced-motion كيوقفو ────────────────
// ⚠️ حيدنا الـ lowMemoryDevice check (deviceMemory <= 4) —
//    كانت كتقتل Lenis على معظم الأندرويد (كلهم ≤ 4GB) وتخلي التاتش ما يخدمش!
const getShouldSmoothScroll = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const subscribeToMotionPreference = (callback: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const shouldSmoothScroll = useSyncExternalStore(
    subscribeToMotionPreference,
    getShouldSmoothScroll,
    () => true
  );

  // GSAP (~112KB) is fetched on demand — sections that need it pull the
  // same singleton chunk; here we only register + refresh once it lands.
  // The fetch is deferred to an idle frame so it never contends with the
  // initial mobile paint/hydration.
  useEffect(() => {
    let cancelled = false;

    const cancelIdle = runWhenIdle(() => {
      Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
        ([gsapMod, stMod]) => {
          if (cancelled) return;
          const gsap = gsapMod.gsap ?? gsapMod.default;
          const ScrollTrigger = stMod.ScrollTrigger;
          gsap.registerPlugin(ScrollTrigger);
          scrollTriggerRef = ScrollTrigger;
          ScrollTrigger.refresh();
        }
      );
    }, 500);

    return () => {
      cancelled = true;
      cancelIdle();
      scrollTriggerRef?.getAll().forEach(t => t.kill());
      scrollTriggerRef = null;
    };
  }, []);

  // بدون Lenis: GSAP كيخدم مع native scroll — ScrollTrigger كيشوف window.scrollY مباشرة
  if (!shouldSmoothScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        // syncTouch: true — Lenis يهضم التاتش على موبايل
        // + LenisGSAPBridge فوق كيخبر GSAP بكل frame
        syncTouch: true,
        touchMultiplier: 1.5,
      }}
    >
      {/* 🔥 Bridge ضروري: كيربط Lenis بـ GSAP ScrollTrigger فكل frame */}
      <LenisGSAPBridge />
      {children}
    </ReactLenis>
  );
}
