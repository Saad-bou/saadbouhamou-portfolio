"use client";

import { useState, useEffect } from 'react';

/**
 * هاد الـ hook كيحسب شحال الكيبورد كتاخد من الشاشة على الموبايل.
 * كيستعمل visualViewport API — الحل الوحيد اللي كيخدم على iOS + Android.
 * كيرجع عدد الـ pixels اللي خاصك تزيد فـ bottom باش الـ input يبقى فوق الكيبورد.
 */
export function useVisualViewport() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const vv = window.visualViewport;

    const update = () => {
      // الفرق بين innerHeight و الـ viewport الحقيقي = المساحة اللي الكيبورد كتاخدها
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(offset);
    };

    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    update();

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return keyboardOffset;
}
