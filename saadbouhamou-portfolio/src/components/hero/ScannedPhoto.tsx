"use client";

import Image from "next/image";
import { useMatrixEffect } from "@/hooks/useMatrixEffect";
import TerminalBar from "@/components/hero/TerminalBar";

interface ScannedPhotoProps {
  scanComplete: boolean;
  scanStarted: boolean;
}

export default function ScannedPhoto({
  scanComplete,
  scanStarted,
}: ScannedPhotoProps) {
  const {
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
  } = useMatrixEffect(scanComplete);

  return (
    <div className="relative w-full flex flex-col items-center justify-center group">
      {/* Glow — مركّز مع الصورة بـ translate */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terminal/10 blur-[80px] [@media(min-width:1800px)]:h-[40vw] [@media(min-width:1800px)]:w-[40vw] [@media(min-width:1800px)]:blur-[10vw]" />

      {/* الصورة + Terminal Bar */}
      <div className="relative flex flex-col items-center w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[450px] mx-auto [@media(min-width:1800px)]:max-w-[32vw]">
        <div
          ref={photoContainerRef}
          className="relative w-full aspect-[4/5] overflow-hidden"
          onMouseMove={handlePhotoMouseMove}
          onMouseEnter={handlePhotoMouseEnter}
          onMouseLeave={handlePhotoMouseLeave}
          onTouchStart={handlePhotoTouchStart}
          onTouchMove={handlePhotoTouchMove}
          onTouchEnd={handlePhotoTouchEnd}
          style={{
            cursor: scanComplete ? "none" : "auto",
            // 🔥 touch-action: none — ضروري باش iOS Safari ما يبلوكش الـ touch events
            // overflow-hidden + touch = كيسبب مشكلة فاللي سافاري بدون هاد
            touchAction: "pan-y",
          }}
        >
          {/* الصورة الأصلية بـ clip-path scan effect */}
          <div
            className="absolute inset-0 z-20"
            style={{
              clipPath: scanStarted
                ? scanComplete
                  ? "inset(0 0 0 0)"
                  : undefined
                : "inset(0 0 100% 0)",
              animation:
                scanStarted && !scanComplete
                  ? "scanReveal 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
                  : undefined,
            }}
          >
            <Image
              src="/saadbouhamou.webp"
              alt="Saad Bouhamou — Full-Stack Developer"
              title="Saad Bouhamou - Expert Full-Stack Developer & AI Systems Architect"
              fill
              sizes="(max-width: 639px) 280px, (max-width: 1023px) 340px, (min-width: 1800px) 32vw, 450px"
              className="object-contain"
              priority
              fetchPriority="high"
            />
          </div>

          {/* Scan line متحركة */}
          {scanStarted && !scanComplete && (
            <div
              className="absolute left-0 right-0 z-30 pointer-events-none"
              style={{
                animation:
                  "scanLineMove 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              }}
            >
              <div className="w-full h-[2px] bg-terminal shadow-[0_0_15px_rgba(0,255,65,0.8),0_0_30px_rgba(0,255,65,0.4),0_0_60px_rgba(0,255,65,0.2)]" />
              <div className="w-full h-[30px] bg-gradient-to-b from-terminal/20 to-transparent" />
              <div className="w-full h-[10px] bg-gradient-to-t from-terminal/10 to-transparent absolute -top-[10px]" />
            </div>
          )}

          {/* Grid overlay */}
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

          {/* Matrix canvas effect بعد الـ scan */}
          {scanComplete && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-40 pointer-events-none"
            />
          )}

          {/* Custom cursor on hover (desktop only) */}
          {isHovering && scanComplete && (
            <div
              className="absolute z-50 pointer-events-none hidden lg:block"
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
        </div>

        <TerminalBar />
      </div>
    </div>
  );
}
