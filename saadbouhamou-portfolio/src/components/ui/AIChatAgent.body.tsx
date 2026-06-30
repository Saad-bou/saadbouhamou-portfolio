'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { Send, Minimize2, X } from 'lucide-react';

// â”€â”€â”€ Helper: extract text from UIMessage parts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function stripThinkingBlocks(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/gi, '')
    .trimStart();
}

function getMessageText(msg: UIMessage): string {
  const text = msg.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { type: 'text'; text: string }).text)
    .join('');

  return stripThinkingBlocks(text);
}

// â”€â”€â”€ Typing Effect for AI Messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Online Pulse Dot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function OnlineDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41]" />
    </span>
  );
}

// â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ChatBodyProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  keyboardOffset: number;
}

// â”€â”€â”€ Chat Body (heavy: useChat, state machine, message tree) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ChatBody({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  keyboardOffset,
}: ChatBodyProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      const scrollArea = messagesScrollRef.current;
      if (scrollArea) {
        scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior });
      }
    });
  }, []);

  const scrollToBottomInstant = useCallback(() => {
    scrollToBottom('auto');
  }, [scrollToBottom]);

  // â”€â”€ Auto-scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    scrollToBottom('smooth');
  }, [messages, isLoading, isOpen, isMinimized, scrollToBottom]);

  // â”€â”€ Focus input on open â€” not on touch devices â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    setTimeout(() => scrollToBottom('auto'), 300);
  }, [isOpen, isMinimized, scrollToBottom]);

  // â”€â”€ Input height auto-resize â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const maxHeight = 112;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, maxHeight)}px`;
    input.style.overflowY = input.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [inputValue, isOpen, isMinimized]);

  // â”€â”€ Send message â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInputValue('');
  }, [inputValue, isLoading, sendMessage]);

  // â”€â”€ Keyboard: Enter to send, Shift+Enter for newline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // â”€â”€ Quick starter prompts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Filter to user/assistant messages only â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
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
            bottom: `calc(env(safe-area-inset-bottom, 0px) + ${keyboardOffset > 0 ? keyboardOffset : 16}px)`,
          }}
          className={`
            fixed z-50
            right-3 left-3 sm:left-auto sm:right-6 md:right-8 lg:right-10
            w-auto sm:w-[380px] md:w-[440px] lg:w-[480px]
            rounded-2xl overflow-hidden
            border border-[#00FF41]/40
            bg-[#050505]/85 backdrop-blur-xl
            shadow-[0_0_60px_rgba(0,255,65,0.12),0_8px_32px_rgba(0,0,0,0.8)]
            flex flex-col
            ${isMinimized ? '' : 'h-[min(600px,calc(100dvh-2rem))] md:h-[min(700px,calc(100dvh-3rem))]'}
          `}
        >
          {/* â”€â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                onClick={onMinimize}
                className="p-1.5 rounded-lg text-[#00FF41]/50 hover:text-[#00FF41] hover:bg-[#00FF41]/10 transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#00FF41]/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* â”€â”€â”€ Body (hidden when minimized) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                {/* â”€â”€â”€ Messages Area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div
                  ref={messagesScrollRef}
                  data-lenis-prevent="true"
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
                            className="text-left text-[11px] font-mono text-[#00FF41]/70 border border-[#00FF41]/20 bg-[#00FF41]/[0.04] hover:bg-[#00FF41]/10 hover:border-[#00FF41]/40 hover:text-[#00FF41] rounded-lg px-3 py-2 transition-all duration-200 active:scale-95"
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
                    const isStreamingThis = isLoading && !isUser && isLastMsg;
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

                {/* â”€â”€â”€ Error Message â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                {error && (
                  <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
                    <p className="text-red-400 text-xs font-mono">
                      Error: Failed to get response. Please check your API key or restart the server.
                    </p>
                  </div>
                )}

                {/* â”€â”€â”€ Input Area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="shrink-0 px-3 sm:px-4 py-3 border-t border-[#00FF41]/15 bg-[#00FF41]/[0.02]">
                  <div className="flex items-end gap-2 rounded-xl border border-[#00FF41]/25 bg-[#0a0a0a]/60 focus-within:border-[#00FF41]/60 focus-within:shadow-[0_0_12px_rgba(0,255,65,0.15)] transition-all duration-300 px-3 py-2">
                    <textarea
                      ref={inputRef}
                      id="ai-chat-input"
                      data-lenis-prevent="true"
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
  );
}
