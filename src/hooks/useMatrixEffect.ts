"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MATRIX_CHARS = "01アイウエオ</>{}[];=+@#$";
const MATRIX_FONT_SIZE = 14;
const MATRIX_RADIUS = 100;
const TOUCH_DISMISS_MS = 2000;

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

export function useMatrixEffect(scanComplete: boolean) {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [isInView, setIsInView] = useState(true);

  const photoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const isMobileDeviceRef = useRef(false);
  const activePointRef = useRef<{ x: number; y: number } | null>(null);
  const touchDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roamingPointRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const reduceEffectsRef = useRef(false);

  useEffect(() => {
    const navigatorWithMemory = navigator as NavigatorWithDeviceMemory;
    isMobileDeviceRef.current = window.matchMedia("(pointer: coarse)").matches;
    reduceEffectsRef.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigatorWithMemory.deviceMemory !== undefined &&
        navigatorWithMemory.deviceMemory <= 4);
    
    // Setup Intersection Observer to pause matrix when out of view
    const container = photoContainerRef.current;
    if (!container) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0 });
    
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !scanComplete ||
      !isInView ||
      reduceEffectsRef.current ||
      (!isHovering && !isTouchActive && !isMobileDeviceRef.current)
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const container = photoContainerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    let frameId: number;
    let lastCharUpdate = 0;
    let charGrid: string[][] = [];

    const refreshChars = () => {
      const cols = Math.ceil(canvas.width / MATRIX_FONT_SIZE) + 1;
      const rows = Math.ceil(canvas.height / MATRIX_FONT_SIZE) + 1;
      charGrid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        )
      );
    };
    refreshChars();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (time - lastCharUpdate > 120) {
        refreshChars();
        lastCharUpdate = time;
      }

      let point;
      if (isHoveringRef.current) {
        point = mousePosRef.current;
        roamingPointRef.current.x = point.x;
        roamingPointRef.current.y = point.y;
        roamingPointRef.current.tx = point.x;
        roamingPointRef.current.ty = point.y;
      } else if (activePointRef.current) {
        point = activePointRef.current;
        roamingPointRef.current.x = point.x;
        roamingPointRef.current.y = point.y;
        roamingPointRef.current.tx = point.x;
        roamingPointRef.current.ty = point.y;
      } else {
        if (!isMobileDeviceRef.current) return;

        if (
          roamingPointRef.current.tx === 0 &&
          roamingPointRef.current.ty === 0 &&
          canvas.width > 0
        ) {
          roamingPointRef.current.tx = Math.random() * canvas.width;
          roamingPointRef.current.ty = Math.random() * canvas.height;
          roamingPointRef.current.x = roamingPointRef.current.tx;
          roamingPointRef.current.y = roamingPointRef.current.ty;
        }

        const dx = roamingPointRef.current.tx - roamingPointRef.current.x;
        const dy = roamingPointRef.current.ty - roamingPointRef.current.y;
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          roamingPointRef.current.tx = Math.random() * canvas.width;
          roamingPointRef.current.ty = Math.random() * canvas.height;
        }

        roamingPointRef.current.x += dx * 0.015;
        roamingPointRef.current.y += dy * 0.015;

        point = roamingPointRef.current;
      }

      const mx = point.x;
      const my = point.y;

      ctx.font = `bold ${MATRIX_FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";
      const startCol = Math.max(
        0,
        Math.floor((mx - MATRIX_RADIUS) / MATRIX_FONT_SIZE)
      );
      const endCol = Math.min(
        charGrid[0]?.length || 0,
        Math.ceil((mx + MATRIX_RADIUS) / MATRIX_FONT_SIZE)
      );
      const startRow = Math.max(
        0,
        Math.floor((my - MATRIX_RADIUS) / MATRIX_FONT_SIZE)
      );
      const endRow = Math.min(
        charGrid.length,
        Math.ceil((my + MATRIX_RADIUS) / MATRIX_FONT_SIZE)
      );

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          const x = col * MATRIX_FONT_SIZE;
          const y = row * MATRIX_FONT_SIZE;
          const dist = Math.sqrt((x + 7 - mx) ** 2 + (y + 7 - my) ** 2);
          if (dist > MATRIX_RADIUS) continue;
          const opacity = (1 - dist / MATRIX_RADIUS) * 0.75;
          ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
          ctx.shadowColor = "rgba(0, 255, 65, 0.3)";
          ctx.shadowBlur = dist < MATRIX_RADIUS * 0.3 ? 4 : 0;
          ctx.fillText(charGrid[row]?.[col] || "0", x, y);
        }
      }
      ctx.shadowBlur = 0;
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [scanComplete, isInView, isHovering, isTouchActive]);

  const handlePhotoMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!photoContainerRef.current || !scanComplete) return;
      const rect = photoContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePosRef.current = { x, y };
      setCursorPos({ x, y });
    },
    [scanComplete]
  );

  const handlePhotoMouseEnter = useCallback(() => {
    if (!scanComplete) return;
    isHoveringRef.current = true;
    setIsHovering(true);
  }, [scanComplete]);

  const handlePhotoMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    setIsHovering(false);
  }, []);

  const startTouchEffect = useCallback(
    (x: number, y: number) => {
      if (!scanComplete) return;
      if (touchDismissTimer.current) clearTimeout(touchDismissTimer.current);

      activePointRef.current = { x, y };
      setIsTouchActive(true);

      touchDismissTimer.current = setTimeout(() => {
        activePointRef.current = null;
        setIsTouchActive(false);
      }, TOUCH_DISMISS_MS);
    },
    [scanComplete]
  );

  const handlePhotoTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!photoContainerRef.current || !scanComplete) return;
      const touch = e.touches[0];
      const rect = photoContainerRef.current.getBoundingClientRect();
      startTouchEffect(touch.clientX - rect.left, touch.clientY - rect.top);
    },
    [scanComplete, startTouchEffect]
  );

  const handlePhotoTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!photoContainerRef.current || !scanComplete) return;
      const touch = e.touches[0];
      const rect = photoContainerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      activePointRef.current = { x, y };
    },
    [scanComplete]
  );

  const handlePhotoTouchEnd = useCallback(() => {
    if (!activePointRef.current) setIsTouchActive(false);
  }, []);

  return {
    canvasRef,
    cursorPos,
    handlePhotoMouseEnter,
    handlePhotoMouseLeave,
    handlePhotoMouseMove,
    handlePhotoTouchEnd,
    handlePhotoTouchMove,
    handlePhotoTouchStart,
    isHovering,
    photoContainerRef,
  };
}
