'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { CodeXml, Send, X, Minimize2 } from 'lucide-react';
import { useVisualViewport } from '@/hooks/useVisualViewport';

// ─── Helper: نستخرجو النص من UIMessage parts ─────────────────────────────────

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { type: 'text'; text: string }).text)
    .join('');
}

// ─── Typing Effect للـ AI Messages ────────────────────────────────────────────

interface TypingMessageProps {
  content: string;
  isStreaming: boolean;
  onTick?: () => void;
}

function TypingMessage({ content, isStreaming, onTick }: TypingMessageProps) {
  const [displayed, setDisplayed] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex >= content.length) return;
    const id = setTimeout(() => {
      setDisplayed(content.slice(0, charIndex + 1));
      setCharIndex((i) => i + 1);
      onTick?.();
    }, 10);
    return () => clearTimeout(id);
  }, [charIndex, content, onTick]);

  const isDone = charIndex >= content.length;

  return (
    <span>
      {displayed}
      {(!isDone || isStreaming) && (
        <span className="inline-block w-[2px] h-[1em] bg-[#00FF41] ml-[1px] align-middle animate-pulse" />
      )}
    </span>
  );
}

// ─── Online Pulse Dot ─────────────────────────────────────────────────────────

function OnlineDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41]" />
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerControls = useAnimation();

  // 🔥 الحل ديال الكيبورد — كنحسبو شحال كتاخد من الشاشة
  const keyboardOffset = useVisualViewport();

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      const scrollArea = messagesScrollRef.current;
      if (scrollArea) {
        scrollArea.scrollTo({
          top: scrollArea.scrollHeight,
          behavior,
        });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior });
      }
    });
  }, []);

  const scrollToBottomInstant = useCallback(() => {
    scrollToBottom('auto');
  }, [scrollToBottom]);

  // ── Wiggle animation loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) return;

    let cancelled = false;

    const runLoop = async () => {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 3000));
        if (cancelled) break;
        await triggerControls.start({
          rotate: [0, -8, 8, -6, 6, -3, 3, 0],
          transition: { duration: 0.5, ease: 'easeInOut' },
        });
      }
    };

    runLoop();
    return () => {
      cancelled = true;
      triggerControls.stop();
    };
  }, [isOpen, triggerControls]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    scrollToBottom('smooth');
  }, [messages, isLoading, isOpen, isMinimized, scrollToBottom]);

  // ── Focus input on open — ماشي على touch devices ──────────────────────────
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    // على الموبايل ما نديروش auto-focus باش ما تطلعش الكيبورد بوحدها
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    setTimeout(() => scrollToBottom('auto'), 300);
  }, [isOpen, isMinimized, scrollToBottom]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const maxHeight = 112;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, maxHeight)}px`;
    input.style.overflowY = input.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [inputValue, isOpen, isMinimized]);

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInputValue('');
  }, [inputValue, isLoading, sendMessage]);

  // ── Keyboard: Enter to send, Shift+Enter for newline ──────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // ── Quick starter prompts ──────────────────────────────────────────────────
  const starters = [
    'What are your skills?',
    'Tell me about your projects',
    'Where did you study?',
    'Hder m3aya 3la projects',
  ];

  const sendStarter = useCallback(
    (text: string) => {
      sendMessage({ text });
    },
    [sendMessage]
  );

  // ── Filter to user/assistant messages only ────────────────────────────────
  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <motion.button
        id="ai-chat-trigger"
        aria-label="Open AI Chat"
        animate={triggerControls}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`
          fixed z-50
          bottom-4 right-4 sm:bottom-6 sm:right-6
          w-14 h-14 rounded-full
          bg-[#0a0a0a] border border-[#00FF41]
          text-[#00FF41]
          flex items-center justify-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF41]
          ${isOpen ? 'hidden' : 'flex'}
        `}
        style={{
          animation: 'matrixPulse 2.5s ease-in-out infinite',
        }}
      >
        <CodeXml className="w-6 h-6" strokeWidth={2.4} />
      </motion.button>

      {/* ── Chat Window ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            id="ai-chat-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              // 🔥 هنا الماجيك: الـ bottom كيتبدل ملي الكيبورد تطلع
              bottom: `calc(env(safe-area-inset-bottom, 0px) + ${keyboardOffset > 0 ? keyboardOffset : 16}px)`,
            }}
            className={`
              fixed z-50
              right-3 left-3 sm:left-auto sm:right-6
              w-auto sm:w-[400px]
              rounded-2xl overflow-hidden
              border border-[#00FF41]/40
              bg-[#050505]/85 backdrop-blur-xl
              shadow-[0_0_60px_rgba(0,255,65,0.12),0_8px_32px_rgba(0,0,0,0.8)]
              flex flex-col
              ${isMinimized ? '' : 'h-[min(600px,calc(100dvh-2rem))]'}
            `}
          >
            {/* ─── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#00FF41]/20 bg-[#00FF41]/[0.04] shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full border border-[#00FF41]/50 bg-[#0a0a0a] flex items-center justify-center text-[#00FF41]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <OnlineDot />
                  </span>
                </div>

                <div>
                  <p className="text-[#00FF41] text-sm font-semibold font-mono leading-tight tracking-wide">
                    Saad&apos;s AI Twin
                  </p>
                  <p className="text-[#00FF41]/50 text-[10px] font-mono">
                    online - Saad data assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized((v) => !v)}
                  className="p-1.5 rounded-lg text-[#00FF41]/50 hover:text-[#00FF41] hover:bg-[#00FF41]/10 transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[#00FF41]/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            {/* ─── Body (hidden when minimized) ───────────────────────── */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  key="chat-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* ─── Messages Area ────────────────────────────── */}
                  <div
                    ref={messagesScrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 ai-chat-scrollbar"
                  >

                    {/* Welcome message */}
                    {visibleMessages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="bg-[#00FF41]/[0.07] border border-[#00FF41]/20 rounded-xl rounded-tl-sm px-4 py-3">
                          <p className="text-[#00FF41]/80 text-xs font-mono mb-1">
                            saad_twin@portfolio:~$
                          </p>
                          <p className="text-zinc-200 text-sm leading-relaxed">
                            Hey! I&apos;m Saad&apos;s AI Twin. Ask me anything
                            about his skills, projects, education, or background.
                            I speak English, French, Arabic &amp; Darija.
                          </p>
                        </div>

                        {/* Starter prompts */}
                        <div className="grid grid-cols-2 gap-2">
                          {starters.map((s) => (
                            <motion.button
                              key={s}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => sendStarter(s)}
                              className="text-left text-[11px] font-mono text-[#00FF41]/70 border border-[#00FF41]/20 bg-[#00FF41]/[0.04] hover:bg-[#00FF41]/10 hover:border-[#00FF41]/40 hover:text-[#00FF41] rounded-lg px-3 py-2 transition-all duration-200"
                            >
                              {s}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Chat messages */}
                    {visibleMessages.map((msg, i) => {
                      const isUser = msg.role === 'user';
                      const isLastMsg = i === visibleMessages.length - 1;
                      const isStreamingThis =
                        isLoading && !isUser && isLastMsg;
                      const text = getMessageText(msg);

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`
                              max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed
                              ${
                                isUser
                                  ? 'border border-[#00FF41]/50 bg-transparent text-zinc-100 rounded-br-sm'
                                  : 'bg-[#00FF41]/[0.07] border border-[#00FF41]/15 text-zinc-200 rounded-bl-sm'
                              }
                            `}
                          >
                            {isUser ? (
                              <span>{text}</span>
                            ) : (
                              <TypingMessage
                                content={text}
                                isStreaming={isStreamingThis}
                                onTick={scrollToBottomInstant}
                              />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Loading indicator (before first chunk) */}
                    {isLoading &&
                      (visibleMessages.length === 0 ||
                        visibleMessages[visibleMessages.length - 1].role ===
                          'user') && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-[#00FF41]/[0.07] border border-[#00FF41]/15 rounded-xl rounded-bl-sm px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {[0, 1, 2].map((dot) => (
                                <motion.span
                                  key={dot}
                                  className="w-1.5 h-1.5 rounded-full bg-[#00FF41]"
                                  animate={{
                                    opacity: [0.3, 1, 0.3],
                                    y: [0, -3, 0],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 0.9,
                                    delay: dot * 0.2,
                                    ease: 'easeInOut',
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* ─── Error Message ────────────────────────────── */}
                  {error && (
                    <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
                      <p className="text-red-400 text-xs font-mono">
                        Error: Failed to get response. Please check your API key or restart the server.
                      </p>
                    </div>
                  )}

                  {/* ─── Input Area ───────────────────────────────── */}
                  <div className="shrink-0 px-3 sm:px-4 py-3 border-t border-[#00FF41]/15 bg-[#00FF41]/[0.02]">
                    <div className="flex items-end gap-2 rounded-xl border border-[#00FF41]/25 bg-[#0a0a0a]/60 focus-within:border-[#00FF41]/60 focus-within:shadow-[0_0_12px_rgba(0,255,65,0.15)] transition-all duration-300 px-3 py-2">
                      <textarea
                        ref={inputRef}
                        id="ai-chat-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        rows={1}
                        className="
                          flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600
                          resize-none focus:outline-none font-mono
                          min-h-6 max-h-28 overflow-hidden
                          ai-chat-scrollbar
                        "
                        style={{ lineHeight: '1.5' }}
                      />
                      <motion.button
                        type="button"
                        id="ai-chat-send"
                        disabled={!inputValue.trim() || isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handleSend}
                        className="
                          shrink-0 w-8 h-8 rounded-lg
                          bg-[#00FF41] text-black
                          flex items-center justify-center
                          disabled:opacity-30 disabled:cursor-not-allowed
                          hover:bg-[#00FF41]/90
                          transition-all duration-200
                          shadow-[0_0_10px_rgba(0,255,65,0.4)]
                          disabled:shadow-none
                        "
                        aria-label="Send message"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-zinc-700 font-mono text-center mt-2">
                      Enter to send - Shift+Enter for newline
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
