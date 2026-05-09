import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Image from "next/image";

export default function Hero() {
  return (
    <Section className="min-h-[95vh] flex items-center justify-center overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terminal/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* جهة النص: Centered فالموبايل و Left فالديسكطوب */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-1">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-6 uppercase">
              Building <br />
              <span className="text-terminal drop-shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                Empires
              </span> 
              <span className="opacity-20 ml-2 sm:ml-4 inline-block">2026.</span>
            </h1>

            <p className="max-w-md text-zinc-400 text-base sm:text-lg font-light leading-relaxed mb-8">
              Saad Bouhamou — Full-stack Developer & AI Strategist. 
              Crafting premium digital experiences with precision and purpose.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 relative z-10">
              <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 h-11 transition-all">
                View Projects
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 border-white/10 text-white hover:bg-white/5 h-11">
                Resume
              </Button>
            </div>
          </div>

          {/* جهة الصورة + Terminal (الدمج المثالي) */}
          <div className="relative order-2 w-full flex flex-col items-center justify-center group">
            {/* الضوء اللي مورا الصورة */}
            <div className="absolute w-72 h-72 bg-terminal/10 blur-[80px] rounded-full z-0" />
            
            {/* Container جامع الصورة والـ Terminal باش يبقاو ديما متناسقين */}
            <div className="relative flex flex-col items-center w-full max-w-[300px] sm:max-w-[450px]">
              
              {/* 1. الصورة مع الـ Zoom Effect */}
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <Image 
                  src="/saadbouhamou.png" 
                  alt="Saad Bouhamou"
                  fill
                  className="object-contain z-20 transition-transform duration-700 ease-out "
                  priority
                />
              </div>

              {/* 2. الـ Terminal Bar (ثابت ديما وتحت الصورة مباشرة) */}
              <div className="w-full bg-[#0d0d0d] border border-white/5 rounded-b-xl p-3 font-mono text-[10px] sm:text-xs backdrop-blur-md shadow-2xl z-30 transition-all duration-500 ">
                {/* Header ديال التيرمينال */}
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                    <div className="w-2 h-2 rounded-full bg-terminal/30" />
                  </div>
                  <span className="text-zinc-600 text-[9px] uppercase tracking-widest">system_status</span>
                </div>

                {/* محتوى التيرمينال */}
                <div className="space-y-1">
                  <p className="flex gap-2">
                    <span className="text-terminal">➜</span>
                    <span className="text-zinc-300">saadbouhamou.dev</span>
                    <span className="text-zinc-500">git:(</span><span className="text-blue-400">main</span><span className="text-zinc-500">)</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-terminal">●</span>
                    <span className="text-zinc-400">Ready on port 3000</span>
                  </p>
                  <div className="flex justify-between items-center pt-1 opacity-40">
                     <span className="text-[8px]">TYPE: PORTFOLIO</span>
                     <span className="text-[8px] text-terminal">AI_READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}