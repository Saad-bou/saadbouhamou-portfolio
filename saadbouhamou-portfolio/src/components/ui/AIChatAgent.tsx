'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CodeXml } from 'lucide-react';
import { useVisualViewport } from '@/hooks/useVisualViewport';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';

// ─── Lazy-load the heavy chat body — fetched only on first button click ───────
const ChatBody = React.lazy(() => import('./AIChatAgent.body'));

// ─── Shell Component ──────────────────────────────────────────────────────────

export default function AIChatAgent() {
  // hasOpened stays true forever once chat is opened — gates the lazy import
  const [hasOpened, setHasOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const triggerControls = useAnimation();

  // 🔥 Keyboard offset magic — recalculated when virtual keyboard appears on iOS
  const keyboardOffset = useVisualViewport();

  // ── Wiggle animation loop (visibility-aware, no battery drain on hidden tabs) ─
  useEffect(() => {
    if (isOpen) return;

    let cancelled = false;

    const runLoop = async () => {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 3000));
        if (cancelled) break;
        // Bail out silently when tab is hidden — no wasted rAF/battery
        if (document.visibilityState !== 'visible') continue;
        await triggerControls.start({
          rotate: [0, -8, 8, -6, 6, -3, 3, 0],
          transition: { duration: 0.5, ease: 'easeInOut' },
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        triggerControls.stop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    runLoop();

    return () => {
      cancelled = true;
      triggerControls.stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, triggerControls]);

  // ── Scroll lock — only acquired when chat is open AND not minimized ──────────
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isOpen, isMinimized]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleOpen = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized((v) => !v);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <motion.button
        id="ai-chat-trigger"
        aria-label="Open AI Chat"
        animate={triggerControls}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleOpen}
        className={`
          fixed z-50
          bottom-4 right-4 sm:bottom-6 sm:right-6
          w-14 h-14 rounded-full
          bg-[#0a0a0a] border border-[#00FF41]
          text-[#00FF41]
          flex items-center justify-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF41]
          active:scale-90 transition-transform duration-200
          ${isOpen ? 'hidden' : 'flex'}
        `}
        style={{
          animation: 'matrixPulse 2.5s ease-in-out infinite',
        }}
      >
        <CodeXml className="w-6 h-6" strokeWidth={2.4} />
      </motion.button>

      {/* ── Lazy Chat Body — JS only fetched after first button click ───── */}
      {hasOpened && (
        <Suspense fallback={null}>
          <ChatBody
            isOpen={isOpen}
            isMinimized={isMinimized}
            onClose={handleClose}
            onMinimize={handleMinimize}
            keyboardOffset={keyboardOffset}
          />
        </Suspense>
      )}
    </>
  );
}
