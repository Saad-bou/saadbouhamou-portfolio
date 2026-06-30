'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, ShieldCheck, Terminal } from 'lucide-react';
import { sendEmail } from '@/app/actions/sendEmail';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';


// ─── Zod Schema ──────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(20, 'Project brief must be at least 20 characters.'),
});
type FormData = z.infer<typeof schema>;


// ─── Input Field ─────────────────────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-mono font-semibold tracking-[0.2em] text-[#00FF41]/60 uppercase">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-mono text-red-400/80"
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  'w-full bg-black/60 border border-[#00FF41]/15 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 placeholder-zinc-600 transition-all duration-300 outline-none focus:border-[#00FF41]/60 focus:shadow-[0_0_16px_rgba(0,255,65,0.12)] focus:bg-black/80';

// ─── Props ────────────────────────────────────────────────────────────────────
interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContactPanel({ isOpen, onClose }: ContactPanelProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Lock page scroll when panel is open
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSuccess(false);
        setServerError(null);
        reset();
      }, 400);
    }
  }, [isOpen, reset]);

  // Escape key closes panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const onSubmit = useCallback(async (data: FormData) => {
    setServerError(null);
    const result = await sendEmail(data);
    if (result.success) {
      setIsSuccess(true);
    } else {
      setServerError(result.error ?? 'Unknown error.');
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ──────────────────────────────────────────────── */}
          <motion.div
            ref={backdropRef}
            key="contact-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Slide Panel ───────────────────────────────────────────── */}
          <motion.aside
            key="contact-panel"
            id="contact-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Contact Panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="
              fixed top-0 right-0 z-[100]
              w-full sm:max-w-md h-full
              bg-zinc-950/95 backdrop-blur-md
              border-l border-[#00FF41]/20
              flex flex-col overflow-hidden
              shadow-[-24px_0_80px_rgba(0,255,65,0.06)]
            "
          >

            {/* Content — above canvas */}
            <div className="relative z-10 flex flex-col h-full">

              {/* ── Header ──────────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#00FF41]/10 shrink-0">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-[#00FF41]" strokeWidth={2} />
                  <span className="font-mono text-[11px] tracking-[0.25em] text-[#00FF41]/70 uppercase">
                    contact.exe
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onClose}
                  aria-label="Close contact panel"
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#00FF41]/40 hover:text-[#00FF41] transition-colors border border-[#00FF41]/15 hover:border-[#00FF41]/40 rounded-md px-2.5 py-1.5"
                >
                  <X className="w-3 h-3" />
                  CLOSE
                </motion.button>
              </div>

              {/* ── Body ────────────────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" data-lenis-prevent="true">

                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    /* ── Form ──────────────────────────────────────── */
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Title */}
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-white">
                          Let&apos;s build something{' '}
                          <span className="text-[#00FF41] drop-shadow-[0_0_12px_rgba(0,255,65,0.5)]">
                            remarkable.
                          </span>
                        </h2>
                        <p className="mt-1 text-xs text-zinc-500 font-mono">
                          Drop your project brief — I&apos;ll analyze it and respond within 24h.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <Field id="contact-name" label="Your Name" error={errors.name?.message}>
                          <input
                            id="contact-name"
                            type="text"
                            placeholder="John Doe"
                            autoComplete="name"
                            className={inputClass}
                            {...register('name')}
                          />
                        </Field>

                        <Field id="contact-email" label="Email Address" error={errors.email?.message}>
                          <input
                            id="contact-email"
                            type="email"
                            placeholder="john@company.com"
                            autoComplete="email"
                            className={inputClass}
                            {...register('email')}
                          />
                        </Field>

                        <Field id="contact-message" label="Project Brief" error={errors.message?.message}>
                          <textarea
                            id="contact-message"
                            rows={5}
                            placeholder="Describe your project, goals, timeline, and budget..."
                            className={`${inputClass} resize-none`}
                            {...register('message')}
                          />
                        </Field>

                        {/* Server error */}
                        <AnimatePresence>
                          {serverError && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                            >
                              ⚠ {serverError}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                          className="
                            w-full flex items-center justify-center gap-2
                            bg-[#00FF41] text-black font-bold font-mono text-sm
                            tracking-widest uppercase rounded-xl py-3.5
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-[#00FF41]/90
                            shadow-[0_0_24px_rgba(0,255,65,0.3)]
                            hover:shadow-[0_0_36px_rgba(0,255,65,0.45)]
                            transition-all duration-300
                          "
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                              Transmitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Transmission
                            </>
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  ) : (
                    /* ── Success State ─────────────────────────────── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="flex flex-col items-center justify-center text-center py-16 gap-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                        className="w-20 h-20 rounded-full border-2 border-[#00FF41]/40 bg-[#00FF41]/10 flex items-center justify-center shadow-[0_0_40px_rgba(0,255,65,0.2)]"
                      >
                        <ShieldCheck className="w-10 h-10 text-[#00FF41]" strokeWidth={1.5} />
                      </motion.div>

                      <div className="space-y-3">
                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="text-lg font-bold tracking-[0.15em] text-[#00FF41] font-mono uppercase drop-shadow-[0_0_16px_rgba(0,255,65,0.5)]"
                        >
                          Transmission Secured
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="text-sm text-zinc-400 font-mono leading-relaxed max-w-[280px] mx-auto"
                        >
                          Your empire layout is being analyzed. Expect a tactical response within 24 hours.
                        </motion.p>
                      </div>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={onClose}
                        className="mt-2 font-mono text-[11px] tracking-widest text-[#00FF41]/50 hover:text-[#00FF41] transition-colors border border-[#00FF41]/15 hover:border-[#00FF41]/40 rounded-md px-4 py-2"
                      >
                        [ CLOSE TERMINAL ]
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Footer Links ────────────────────────────────────────── */}
              {!isSuccess && (
                <div className="shrink-0 px-6 py-4 border-t border-[#00FF41]/10 flex items-center justify-center gap-6">
                  <a
                    href="https://www.linkedin.com/in/saad-bouhamou-59278a3bb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 hover:text-[#00FF41] transition-colors group"
                  >
                    <svg className="w-3.5 h-3.5 group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.6)] transition-all" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    LinkedIn
                  </a>
                  <span className="text-zinc-700 text-xs">|</span>
                  <a
                    href="mailto:bouhamousaad@gmail.com"
                    className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 hover:text-[#00FF41] transition-colors group"
                  >
                    <Mail className="w-3.5 h-3.5 group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.6)] transition-all" />
                    Direct Mail
                  </a>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
