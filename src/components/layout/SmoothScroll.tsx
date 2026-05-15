"use client";

import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useSyncExternalStore } from 'react';

// ⚠️ registerPlugin حيدناه من module scope — كان كيعطي SSR warning
// دابا كيتسجل داخل useEffect فقط

const getShouldSmoothScroll = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowMemoryDevice =
    "deviceMemory" in navigator && Number(navigator.deviceMemory) <= 4;
  return !reduceMotion && !lowMemoryDevice;
};

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
    // Register client-side فقط
    gsap.registerPlugin(ScrollTrigger);

    // 🔥 حيدنا الـ generic .reveal-section fade اللي هنا
    // كل section عندها الـ reveal ديالها (MatrixSectionReveal)
    // الـ double animation كانت كتسبب flickering فالـ Projects section

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

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
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
