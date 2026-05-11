"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Image from "next/image";

// Matrix effect constants
const MATRIX_CHARS = "01アイウエオ</>{}[];=+@#$";
const MATRIX_FONT_SIZE = 14;
const MATRIX_RADIUS = 100;
const TOUCH_DISMISS_MS = 2000;

// ==============================
// Terminal Typing Animation Hook
// ==============================
interface TerminalLine {
  content: React.ReactNode;
  typingText: string; // النص اللي غادي يتكتب حرف بحرف
}

function useTerminalTyping(lines: TerminalLine[], typingSpeed = 40, lineDelay = 300) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // نبداو بعد delay صغير باش الصفحة تلود
    const startTimeout = setTimeout(() => {
      setVisibleLines(1);
    }, 800);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (visibleLines === 0) return;
    if (visibleLines > lines.length) {
      setIsTypingDone(true);
      return;
    }

    const currentLine = lines[visibleLines - 1];
    const totalChars = currentLine.typingText.length;

    if (currentCharIndex < totalChars) {
      const timer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else {
      // الخط الحالي سالى، نزيدو واحد جديد
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, currentCharIndex, lines, typingSpeed, lineDelay]);

  return { visibleLines, currentCharIndex, isTypingDone };
}

// ==============================
// Hero Component
// ==============================
export default function Hero() {
  const [scanComplete, setScanComplete] = useState(false);
  const [scanStarted, setScanStarted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const photoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  // Touch point
  const activePointRef = useRef<{ x: number; y: number } | null>(null);
  const touchDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Roaming point for idle state
  const roamingPointRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    // Check if it's a touch device (mobile)
    setIsMobileDevice(window.matchMedia("(pointer: coarse)").matches);

    // نبداو الـ scan بعد 200ms
    const startTimer = setTimeout(() => {
      setScanStarted(true);
    }, 200);

    // الـ scan كيخد 2s (مطابق مع CSS animation-duration)
    const endTimer = setTimeout(() => {
      setScanComplete(true);
    }, 2400); // 200ms delay + 2200ms scan

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, []);

  // Terminal Lines Data
  const terminalLines: TerminalLine[] = [
    {
      typingText: "saadbouhamou.dev git:(main)",
      content: null, // غادي نبنيوه ديناميكيا
    },
    {
      typingText: "Ready on port 3000",
      content: null,
    },
    {
      typingText: "TYPE: PORTFOLIO  AI_READY",
      content: null,
    },
  ];

  const { visibleLines, currentCharIndex, isTypingDone } = useTerminalTyping(
    terminalLines,
    35,
    250
  );

  // بناء الخط الأول ديال التيرمينال مع الألوان
  const renderTerminalLine1 = useCallback(
    (charCount: number, isCurrentlyTyping: boolean) => {
      const fullText = "saadbouhamou.dev git:(main)";
      const visibleText = fullText.slice(0, charCount);

      // نقسمو النص لأجزاء ملونة
      const part1End = Math.min(charCount, 16); // "saadbouhamou.dev"
      const part2Start = 16;
      const part2End = Math.min(charCount, 22); // " git:("
      const part3Start = 22;
      const part3End = Math.min(charCount, 26); // "main"
      const part4Start = 26;
      const part4End = Math.min(charCount, 27); // ")"

      return (
        <p className="flex gap-2 items-center">
          <span className="text-terminal">➜</span>
          <span>
            {charCount > 0 && (
              <span className="text-zinc-300">
                {fullText.slice(0, part1End)}
              </span>
            )}
            {charCount > part2Start && (
              <span className="text-zinc-500">
                {fullText.slice(part2Start, part2End)}
              </span>
            )}
            {charCount > part3Start && (
              <span className="text-blue-400">
                {fullText.slice(part3Start, part3End)}
              </span>
            )}
            {charCount > part4Start && (
              <span className="text-zinc-500">
                {fullText.slice(part4Start, part4End)}
              </span>
            )}
            {isCurrentlyTyping && (
              <span className="inline-block w-[6px] h-[14px] bg-terminal ml-[1px] animate-[terminalBlink_0.8s_steps(1)_infinite] align-middle" />
            )}
          </span>
        </p>
      );
    },
    []
  );

  const renderTerminalLine2 = useCallback(
    (charCount: number, isCurrentlyTyping: boolean) => {
      const fullText = "Ready on port 3000";
      return (
        <p className="flex gap-2 items-center">
          <span className="text-terminal">●</span>
          <span className="text-zinc-400">
            {fullText.slice(0, charCount)}
            {isCurrentlyTyping && (
              <span className="inline-block w-[6px] h-[14px] bg-terminal ml-[1px] animate-[terminalBlink_0.8s_steps(1)_infinite] align-middle" />
            )}
          </span>
        </p>
      );
    },
    []
  );

  const renderTerminalLine3 = useCallback(
    (charCount: number, isCurrentlyTyping: boolean) => {
      const fullText = "TYPE: PORTFOLIO  AI_READY";
      const part1End = Math.min(charCount, 17); // "TYPE: PORTFOLIO  "
      const part2Start = 17;

      return (
        <div className="flex justify-between items-center pt-1 opacity-40">
          <span className="text-[8px]">
            {fullText.slice(0, part1End)}
          </span>
          {charCount > part2Start && (
            <span className="text-[8px] text-terminal">
              {fullText.slice(part2Start, charCount)}
            </span>
          )}
          {isCurrentlyTyping && (
            <span className="inline-block w-[5px] h-[10px] bg-terminal ml-[1px] animate-[terminalBlink_0.8s_steps(1)_infinite] align-middle" />
          )}
        </div>
      );
    },
    []
  );

  // ==============================
  // Matrix Hover Effect (Canvas)
  // ==============================
  useEffect(() => {
    if (!scanComplete) return;
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
        // Roaming state
        if (!isMobileDevice) {
          // On desktop, we don't draw anything when not hovering
          frameId = requestAnimationFrame(draw);
          return;
        }

        if (roamingPointRef.current.tx === 0 && roamingPointRef.current.ty === 0 && canvas.width > 0) {
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

        // سرعة التحرك العشوائي
        roamingPointRef.current.x += dx * 0.015;
        roamingPointRef.current.y += dy * 0.015;

        point = roamingPointRef.current;
      }

      const mx = point.x;
      const my = point.y;

      ctx.font = `bold ${MATRIX_FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";
      const startCol = Math.max(0, Math.floor((mx - MATRIX_RADIUS) / MATRIX_FONT_SIZE));
      const endCol = Math.min(charGrid[0]?.length || 0, Math.ceil((mx + MATRIX_RADIUS) / MATRIX_FONT_SIZE));
      const startRow = Math.max(0, Math.floor((my - MATRIX_RADIUS) / MATRIX_FONT_SIZE));
      const endRow = Math.min(charGrid.length, Math.ceil((my + MATRIX_RADIUS) / MATRIX_FONT_SIZE));
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
    };
  }, [scanComplete]);

  // ── Mouse handlers (desktop) ──────────────────────────
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

  // ── Touch handlers (mobile) ───────────────────────────
  const startTouchEffect = useCallback(
    (x: number, y: number) => {
      if (!scanComplete) return;
      // نوقفو أي timer سابق
      if (touchDismissTimer.current) clearTimeout(touchDismissTimer.current);

      activePointRef.current = { x, y };
      setIsTouchActive(true);

      // بعد 2 ثواني، نرجعو للوضع العشوائي (اللمس كيسالي)
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
      // نحرّكو النقطة مع الإصبع بلا ما نعيّدو الـ timer
      activePointRef.current = { x, y };
    },
    [scanComplete]
  );

  const handlePhotoTouchEnd = useCallback(() => {
    // ما نوقفوش الـ timer — خلّيه يكمل الـ 2s من اللحظة dial touch
    // غير إلا كانت النقطة مزال حية
    if (!activePointRef.current) setIsTouchActive(false);
  }, []);

  return (
    <Section className="min-h-[95vh] flex items-center justify-center overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terminal/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* جهة النص: Centered فالموبايل و Left فالديسكطوب */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-1">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-6 uppercase">
              Building <br />
              <span className="text-terminal drop-shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                Empires
              </span>
              <span className="opacity-20 ml-2 sm:ml-4 inline-block">
                2026.
              </span>
            </h1>

            <p className="max-w-md text-zinc-400 text-base sm:text-lg font-light leading-relaxed mb-8">
              Saad Bouhamou — Full-stack Developer & AI Strategist. Crafting
              premium digital experiences with precision and purpose.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 relative z-10">
              <Button
                size="lg"
                className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 h-11 transition-all"
              >
                View Projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-white/10 text-white hover:bg-white/5 h-11"
              >
                Resume
              </Button>
            </div>
          </div>

          {/* جهة الصورة + Terminal (الدمج المثالي) */}
          <div className="relative order-2 w-full flex flex-col items-center justify-center group">
            {/* الضوء اللي مورا الصورة */}
            <div className="absolute w-72 h-72 bg-terminal/10 blur-[80px] rounded-full z-0" />

            {/* Container جامع الصورة والـ Terminal باش يبقاو ديما متناسقين */}
            <div className="relative flex flex-col items-center w-full max-w-[300px] sm:max-w-[450px]">
              {/* 1. الصورة مع الـ Scan Effect */}
              <div
                ref={photoContainerRef}
                className="relative w-full aspect-[4/5] overflow-hidden"
                onMouseMove={handlePhotoMouseMove}
                onMouseEnter={handlePhotoMouseEnter}
                onMouseLeave={handlePhotoMouseLeave}
                onTouchStart={handlePhotoTouchStart}
                onTouchMove={handlePhotoTouchMove}
                onTouchEnd={handlePhotoTouchEnd}
                style={{ cursor: scanComplete ? "none" : "auto" }}
              >
                {/* الصورة الأصلية — مخبية في البداية وكتبان مع الـ scan */}
                <div
                  className="absolute inset-0 z-20"
                  style={{
                    clipPath: scanStarted
                      ? scanComplete
                        ? "inset(0 0 0 0)"
                        : undefined
                      : "inset(0 0 100% 0)",
                    animation: scanStarted && !scanComplete
                      ? "scanReveal 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
                      : undefined,
                  }}
                >
                  <Image
                    src="/saadbouhamou.png"
                    alt="Saad Bouhamou"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Scanline — الخط الأخضر اللي كيتحرك من فوق لتحت */}
                {scanStarted && !scanComplete && (
                  <div
                    className="absolute left-0 right-0 z-30 pointer-events-none"
                    style={{
                      animation:
                        "scanLineMove 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
                    }}
                  >
                    {/* الخط الرئيسي */}
                    <div className="w-full h-[2px] bg-terminal shadow-[0_0_15px_rgba(0,255,65,0.8),0_0_30px_rgba(0,255,65,0.4),0_0_60px_rgba(0,255,65,0.2)]" />
                    {/* Glow تحت الخط */}
                    <div className="w-full h-[30px] bg-gradient-to-b from-terminal/20 to-transparent" />
                    {/* Glow خفيف فوق الخط */}
                    <div className="w-full h-[10px] bg-gradient-to-t from-terminal/10 to-transparent absolute -top-[10px]" />
                  </div>
                )}

                {/* Grid overlay خفيف أثناء الـ scan */}
                {scanStarted && !scanComplete && (
                  <div
                    className="absolute inset-0 z-25 pointer-events-none opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(0deg, transparent 95%, rgba(0,255,65,0.1) 100%), linear-gradient(90deg, transparent 95%, rgba(0,255,65,0.05) 100%)",
                      backgroundSize: "8px 8px",
                      animation: "fadeOut 2.2s ease-out forwards",
                    }}
                  />
                )}

                {/* Matrix Canvas Overlay - يبان غير فالـ hover بعد الـ scan */}
                {scanComplete && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-40 pointer-events-none"
                  />
                )}

                {/* Custom Cursor: < /> — desktop فقط */}
                {isHovering && scanComplete && (
                  <div
                    className="absolute z-50 pointer-events-none hidden md:block"
                    style={{
                      left: cursorPos.x,
                      top: cursorPos.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span className="text-terminal text-lg font-bold drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] select-none">
                      {"< />"}
                    </span>
                  </div>
                )}

                {/* Touch ripple حيدناه، حيت الأرقام كتمشي بوحدها للبلاصة اللي لمسها */}
              </div>

              {/* 2. الـ Terminal Bar (ثابت ديما وتحت الصورة مباشرة) */}
              <div className="w-full bg-[#0d0d0d] border border-white/5 rounded-b-xl p-3 font-mono text-[10px] sm:text-xs backdrop-blur-md shadow-2xl z-30 transition-all duration-500">
                {/* Header ديال التيرمينال */}
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                    <div className="w-2 h-2 rounded-full bg-terminal/30" />
                  </div>
                  <span className="text-zinc-600 text-[9px] uppercase tracking-widest">
                    system_status
                  </span>
                </div>

                {/* محتوى التيرمينال بالـ Typing Animation */}
                <div className="space-y-1">
                  {/* Line 1 */}
                  {visibleLines >= 1 &&
                    renderTerminalLine1(
                      visibleLines === 1 ? currentCharIndex : terminalLines[0].typingText.length,
                      visibleLines === 1
                    )}

                  {/* Line 2 */}
                  {visibleLines >= 2 &&
                    renderTerminalLine2(
                      visibleLines === 2 ? currentCharIndex : terminalLines[1].typingText.length,
                      visibleLines === 2
                    )}

                  {/* Line 3 */}
                  {visibleLines >= 3 &&
                    renderTerminalLine3(
                      visibleLines === 3 ? currentCharIndex : terminalLines[2].typingText.length,
                      visibleLines === 3
                    )}

                  {/* Cursor اللي كيرمش من بعد ما يسالي الكل */}
                  {isTypingDone && (
                    <p className="flex gap-2 items-center mt-1">
                      <span className="text-terminal">➜</span>
                      <span className="inline-block w-[6px] h-[14px] bg-terminal animate-[terminalBlink_0.8s_steps(1)_infinite]" />
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}