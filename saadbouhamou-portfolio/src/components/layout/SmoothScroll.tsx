"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useSyncExternalStore } from 'react';

// ─── Lenis ↔ GSAP ScrollTrigger Bridge ──────────────────────────────────────
// بدون هاد الـ Bridge، GSAP كيقرا window.scrollY بينما Lenis كيهضم
// الـ scroll في عالمه الخاص → ScrollTrigger ما كيشوفش progress الـ scroll
// على الموبايل (touch devices) — هاد الـ component ضروري جداً!
function LenisGSAPBridge() {
  // useLenis(callback) كيستدعي الـ callback فكل frame ديال Lenis
  // ScrollTrigger.update كيقول لـ GSAP يعيد يحسب الـ scroll position
  useLenis(ScrollTrigger.update);
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
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
