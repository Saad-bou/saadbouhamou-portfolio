"use client";

import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useSyncExternalStore } from 'react';

gsap.registerPlugin(ScrollTrigger);

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
    if (!shouldSmoothScroll) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".reveal-section");

      sections.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [shouldSmoothScroll]);

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
