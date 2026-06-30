"use client";

import { useCallback, useMemo } from "react";
import { useTerminalTyping, type TerminalLine } from "@/hooks/useTerminalTyping";

function TerminalCursor({ small = false }: { small?: boolean }) {
  return (
    <span
      className={
        small
          ? "inline-block w-[5px] h-[10px] bg-terminal ml-[1px] animate-[terminalBlink_0.8s_steps(1)_infinite] align-middle"
          : "inline-block w-[6px] h-[14px] bg-terminal ml-[1px] animate-[terminalBlink_0.8s_steps(1)_infinite] align-middle"
      }
    />
  );
}

export default function TerminalBar() {
  const terminalLines: TerminalLine[] = useMemo(
    () => [
      { typingText: "saadbouhamou.dev git:(main)" },
      { typingText: "Ready on port 3000" },
      { typingText: "TYPE: PORTFOLIO  AI_READY" },
    ],
    []
  );

  const { visibleLines, currentCharIndex, isTypingDone } = useTerminalTyping(
    terminalLines,
    35,
    250
  );

  const renderTerminalLine1 = useCallback(
    (charCount: number, isCurrentlyTyping: boolean) => {
      const fullText = "saadbouhamou.dev git:(main)";
      const part1End = Math.min(charCount, 16);
      const part2Start = 16;
      const part2End = Math.min(charCount, 22);
      const part3Start = 22;
      const part3End = Math.min(charCount, 26);
      const part4Start = 26;
      const part4End = Math.min(charCount, 27);

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
              <span className="text-zinc-400">
                {fullText.slice(part2Start, part2End)}
              </span>
            )}
            {charCount > part3Start && (
              <span className="text-blue-400">
                {fullText.slice(part3Start, part3End)}
              </span>
            )}
            {charCount > part4Start && (
              <span className="text-zinc-400">
                {fullText.slice(part4Start, part4End)}
              </span>
            )}
            {isCurrentlyTyping && <TerminalCursor />}
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
            {isCurrentlyTyping && <TerminalCursor />}
          </span>
        </p>
      );
    },
    []
  );

  const renderTerminalLine3 = useCallback(
    (charCount: number, isCurrentlyTyping: boolean) => {
      const fullText = "TYPE: PORTFOLIO  AI_READY";
      const part1End = Math.min(charCount, 17);
      const part2Start = 17;

      return (
        <div className="flex justify-between items-center pt-1 opacity-40">
          <span className="text-[8px] [@media(min-width:1800px)]:text-[0.8vw]">{fullText.slice(0, part1End)}</span>
          {charCount > part2Start && (
            <span className="text-[8px] text-terminal [@media(min-width:1800px)]:text-[0.8vw]">
              {fullText.slice(part2Start, charCount)}
            </span>
          )}
          {isCurrentlyTyping && <TerminalCursor small />}
        </div>
      );
    },
    []
  );

  return (
    <div className="w-full max-w-full bg-[#0d0d0d] border border-white/5 rounded-b-xl p-2.5 sm:p-3 font-mono text-[9px] sm:text-xs backdrop-blur-md shadow-2xl z-30 transition-all duration-500 overflow-hidden [@media(min-width:1800px)]:p-[1.5vw] [@media(min-width:1800px)]:text-[1vw] [@media(min-width:1800px)]:rounded-b-[1.5vw]">
      <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2 [@media(min-width:1800px)]:gap-[1vw] [@media(min-width:1800px)]:mb-[1vw] [@media(min-width:1800px)]:pb-[1vw]">
        <div className="flex gap-1.5 [@media(min-width:1800px)]:gap-[0.5vw]">
          <div className="w-2 h-2 rounded-full bg-red-500/30 [@media(min-width:1800px)]:w-[0.8vw] [@media(min-width:1800px)]:h-[0.8vw]" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/30 [@media(min-width:1800px)]:w-[0.8vw] [@media(min-width:1800px)]:h-[0.8vw]" />
          <div className="w-2 h-2 rounded-full bg-terminal/30 [@media(min-width:1800px)]:w-[0.8vw] [@media(min-width:1800px)]:h-[0.8vw]" />
        </div>
        <span className="text-zinc-400 text-[9px] uppercase tracking-widest [@media(min-width:1800px)]:text-[0.8vw]">
          system_status
        </span>
      </div>

      <div className="space-y-1 overflow-hidden">
        {visibleLines >= 1 &&
          renderTerminalLine1(
            visibleLines === 1
              ? currentCharIndex
              : terminalLines[0].typingText.length,
            visibleLines === 1
          )}

        {visibleLines >= 2 &&
          renderTerminalLine2(
            visibleLines === 2
              ? currentCharIndex
              : terminalLines[1].typingText.length,
            visibleLines === 2
          )}

        {visibleLines >= 3 &&
          renderTerminalLine3(
            visibleLines === 3
              ? currentCharIndex
              : terminalLines[2].typingText.length,
            visibleLines === 3
          )}

        {isTypingDone && (
          <p className="flex gap-2 items-center mt-1">
            <span className="text-terminal">➜</span>
            <span className="inline-block w-[6px] h-[14px] bg-terminal animate-[terminalBlink_0.8s_steps(1)_infinite] [@media(min-width:1800px)]:w-[0.5vw] [@media(min-width:1800px)]:h-[1.5vw]" />
          </p>
        )}
      </div>
    </div>
  );
}
