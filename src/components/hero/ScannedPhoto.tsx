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
    <div className="relative order-2 w-full flex flex-col items-center justify-center group">
      <div className="absolute w-72 h-72 bg-terminal/10 blur-[80px] rounded-full z-0" />

      <div className="relative flex flex-col items-center w-full max-w-[300px] sm:max-w-[450px]">
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
              src="/saadbouhamou.png"
              alt="Saad Bouhamou"
              fill
              className="object-contain"
              priority
            />
          </div>

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

          {scanComplete && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-40 pointer-events-none"
            />
          )}

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
        </div>

        <TerminalBar />
      </div>
    </div>
  );
}
