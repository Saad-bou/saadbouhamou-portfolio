"use client";

import { useEffect, useRef, useState } from "react";

export interface TerminalLine {
  typingText: string;
}

export function useTerminalTyping(
  lines: TerminalLine[],
  typingSpeed = 40,
  lineDelay = 300
) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const startedRef = useRef(false);
  const isTypingDone = visibleLines > lines.length;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTimeout = setTimeout(() => {
      setVisibleLines(1);
    }, 800);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (visibleLines === 0) return;
    if (visibleLines > lines.length) return;

    const currentLine = lines[visibleLines - 1];
    const totalChars = currentLine.typingText.length;

    if (currentCharIndex < totalChars) {
      const timer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
      setCurrentCharIndex(0);
    }, lineDelay);
    return () => clearTimeout(timer);
  }, [visibleLines, currentCharIndex, lines, typingSpeed, lineDelay]);

  return { visibleLines, currentCharIndex, isTypingDone };
}
