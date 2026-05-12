"use client";

import { useEffect, useState } from "react";

export function useScanAnimation() {
  const [scanComplete, setScanComplete] = useState(false);
  const [scanStarted, setScanStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setScanStarted(true);
    }, 200);

    const endTimer = setTimeout(() => {
      setScanComplete(true);
    }, 2400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, []);

  return { scanComplete, scanStarted };
}
