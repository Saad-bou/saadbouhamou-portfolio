"use client";

import React, { useSyncExternalStore } from "react";

// دالات مساعدة للتأكد من حالة المتصفح (SSR Friendly)
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CodeBackground() {
  // هاد الـ Hook كيعوض useEffect وsetMounted وكيهنينا من الـ Warnings
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
      
      {/* 1. Line Numbers - كبرنا الخط وزدنا الوضوح */}
      <div className="absolute left-0 top-0 h-full w-14 border-r border-white/[0.03] bg-transparent pt-32">
        <div className="flex flex-col items-center gap-2 font-mono text-[11px] sm:text-xs text-terminal/20">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="h-5">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Floating Code Snippets - موزعة باحترافية */}
      <div className="absolute inset-0 font-mono text-sm sm:text-base text-terminal/[0.06]">
        
        {/* Snippet 1 - Top Right */}
        <div className="absolute top-[15%] right-[5%] rotate-3">
          <p className="text-terminal/10">{"async function buildEmpire() {"}</p>
          <p className="ml-6">{"const status = 'deploying...';"}</p>
          <p className="ml-6">{"await engine.start();"}</p>
          <p>{"}"}</p>
        </div>

        {/* Snippet 2 - Mid Left (مورا الـ Hero text) */}
        <div className="absolute top-[50%] left-[10%] -rotate-12 opacity-60">
          <p>{"export const Metadata = {"}</p>
          <p className="ml-6">{"title: 'Saad Bouhamou',"}</p>
          <p className="ml-6">{"role: 'Full-stack Dev'"}</p>
          <p>{"};"}</p>
        </div>

        {/* Snippet 3 - Bottom Right (Snowflake/Data vibe) */}
        <div className="absolute bottom-[15%] right-[15%] rotate-6">
          <p className="text-terminal/10">{"SELECT * FROM morocco_rabat"}</p>
          <p className="ml-6">{"WHERE status = 'LIVE'"}</p>
          <p className="ml-6">{"AND region = 'Rabat';"}</p>
        </div>

        {/* Snippet 4 - React Hook (وسط الشاشة خفيف) */}
        <div className="absolute top-[40%] right-[30%] opacity-20 hidden lg:block">
          <p>{"const [isScalable, setIsScalable] = useState(true);"}</p>
        </div>

      </div>

      {/* 3. Radial Glow - العمق ديال الخلفية */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.04)_0%,transparent_70%)]" />
      
      {/* لمسة إضافية: Grid خفيف بزاف كيشبه لـ الـ Blueprint */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}