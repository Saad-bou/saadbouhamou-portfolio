'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, ArrowRight, ShieldCheck, Code2, Coins, Clock } from 'lucide-react';
import { buildWhatsAppUrl, type ProjectInquiry } from '@/lib/contact';

// ─── Options ──────────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  'Web Development',
  'Full-Stack Application',
  'E-Commerce',
  'AI / Automation',
  'AI Marketing',
  'Digital Experience',
  'Custom Project',
];

const BUDGETS = [
  'Not defined yet',
  'Under €1K',
  '€1K — €5K',
  '€5K — €10K',
  '€10K+',
  'Enterprise',
];

const TIMELINES = [
  'Flexible',
  'ASAP',
  '1 — 2 weeks',
  '1 month',
  '2 — 3 months',
  'Long term',
];

// ─── Field primitives ─────────────────────────────────────────────────────────

const labelClass =
  'flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[#00ff41]/50';

const inputClass =
  'w-full bg-black/50 border border-[#00ff41]/15 rounded-lg px-3.5 py-2.5 text-sm font-mono text-zinc-200 ' +
  'placeholder-zinc-600 outline-none transition-all duration-300 ' +
  'focus:border-[#00ff41]/60 focus:shadow-[0_0_14px_rgba(0,255,65,0.1)] focus:bg-black/70';

interface SelectFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

function SelectField({ id, label, icon, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label htmlFor={id} className={labelClass}>
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} appearance-none pr-9 cursor-pointer ${value ? 'text-zinc-200' : 'text-zinc-600'}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-black text-zinc-200">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00ff41]/40 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function ProjectInitializer() {
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [preparing, setPreparing] = useState(false);

  const handleStart = useCallback(() => {
    if (preparing) return;
    setPreparing(true);

    const inquiry: ProjectInquiry = { name, projectType, budget, timeline };
    const url = buildWhatsAppUrl(inquiry);

    // Short terminal state, then open WhatsApp (works desktop / mobile / Web)
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setPreparing(false);
    }, 900);
  }, [preparing, name, projectType, budget, timeline]);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto rounded-2xl border border-[#00ff41]/25
                 bg-[#020402]/90 overflow-hidden
                 shadow-[0_0_60px_rgba(0,255,65,0.08),0_8px_40px_rgba(0,0,0,0.6)]"
    >
      {/* Technical corner details */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00ff41]/50 pointer-events-none" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00ff41]/50 pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00ff41]/50 pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00ff41]/50 pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#00ff41]/15 bg-[#00ff41]/[0.03]">
        <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-[#00ff41]/90">
          INITIALIZE_PROJECT.exe
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#00ff41]/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff41]" />
          </span>
          SYSTEM_READY
        </span>
      </div>

      {/* ── Form body ──────────────────────────────────────────────── */}
      <div className="relative px-5 sm:px-7 py-6 sm:py-7">
        {/* Decorative code — very low contrast, hidden on mobile */}
        <pre
          aria-hidden="true"
          className="hidden lg:block absolute right-6 top-8 font-mono text-[10px] leading-relaxed text-[#00ff41]/[0.08] pointer-events-none select-none"
        >
{`// available_services
const project = {
  web: true,
  mobile: true,
  ecommerce: true,
  ai: true
};`}
        </pre>

        <div className="relative space-y-5">
          {/* Name / Company */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pi-name" className={labelClass}>
              <User className="w-3 h-3" aria-hidden="true" />
              Your Name / Company
            </label>
            <input
              id="pi-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe / ACME Inc."
              autoComplete="organization"
              className={inputClass}
            />
          </div>

          {/* Project Type */}
          <SelectField
            id="pi-type"
            label="Project Type"
            icon={<Code2 className="w-3 h-3" aria-hidden="true" />}
            value={projectType}
            onChange={setProjectType}
            options={PROJECT_TYPES}
            placeholder="Select a project type"
          />

          {/* Budget + Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField
              id="pi-budget"
              label="Budget Range"
              icon={<Coins className="w-3 h-3" aria-hidden="true" />}
              value={budget}
              onChange={setBudget}
              options={BUDGETS}
              placeholder="Select a range"
            />
            <SelectField
              id="pi-timeline"
              label="Timeline"
              icon={<Clock className="w-3 h-3" aria-hidden="true" />}
              value={timeline}
              onChange={setTimeline}
              options={TIMELINES}
              placeholder="Select a timeline"
            />
          </div>

          {/* CTA */}
          <motion.button
            type="button"
            onClick={handleStart}
            disabled={preparing}
            whileHover={{ scale: preparing ? 1 : 1.01 }}
            whileTap={{ scale: preparing ? 1 : 0.98 }}
            aria-label="Start a project — opens WhatsApp with your project details"
            className="
              w-full flex items-center justify-center gap-2.5
              bg-[#00ff41] text-black font-bold font-mono text-sm
              tracking-[0.2em] uppercase rounded-lg py-3.5
              disabled:opacity-80 disabled:cursor-wait
              shadow-[0_0_24px_rgba(0,255,65,0.25)]
              hover:shadow-[0_0_40px_rgba(0,255,65,0.45)]
              transition-shadow duration-300
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              {preparing ? (
                <motion.span
                  key="preparing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  [SYSTEM] Preparing connection...
                </motion.span>
              ) : (
                <motion.span
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5"
                >
                  START A PROJECT
                  <motion.span
                    className="inline-flex"
                    initial={false}
                    whileHover={{ x: 4 }}
                    aria-hidden="true"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Footer status ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 sm:px-7 py-3 border-t border-[#00ff41]/15 bg-black/40">
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#00ff41]/45">
          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
          Connection secure
        </span>
        <span className="font-mono text-[10px] tracking-widest text-white/30">
          24h response
        </span>
      </div>
    </div>
  );
}

