"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const MATRIX_CHARS = "01アイウエオ</>{}[];=+@#$";

export default function MatrixButtonCV() {
  const [isHovered, setIsHovered] = useState(false);
  const [matrixText, setMatrixText] = useState("");
  
  // Highly optimized hover effect: only runs when hovered, zero cost otherwise.
  useEffect(() => {
    if (!isHovered) {
      setMatrixText("");
      return;
    }
    
    const generateMatrix = () => {
      let result = "";
      for (let i = 0; i < 150; i++) {
        result += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      }
      return result;
    };
    
    setMatrixText(generateMatrix());
    
    const interval = setInterval(() => {
      setMatrixText(generateMatrix());
    }, 80);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <a 
      href="/CV_Saad_Bouhamou.dev.pdf" 
      target="_blank" 
      rel="noopener noreferrer"
      title="Download Saad Bouhamou Resume - Full-Stack Developer & AI Strategist"
      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 bg-[#050505] border border-white/10 rounded-md overflow-hidden transition-all duration-300 hover:border-[#00FF41]/60 hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] active:scale-95 [@media(min-width:1800px)]:px-[2vw] [@media(min-width:1800px)]:py-[1vw]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ textDecoration: 'none' }}
    >
      {/* Matrix Background - strictly visible on hover, zero opacity otherwise */}
      <div 
        className={`absolute inset-0 z-0 flex flex-wrap content-start break-all font-mono text-[9px] md:text-[10px] leading-[1] text-[#00FF41]/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} [@media(min-width:1800px)]:text-[0.6vw]`}
        style={{ pointerEvents: 'none', wordBreak: 'break-all' }}
      >
        {matrixText}
      </div>
      
      {/* Scanline effect removed as requested */}
      
      {/* CRT flicker effect on hover */}
      <div className={`absolute inset-0 bg-[#00FF41]/5 mix-blend-screen z-10 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} animate-pulse`} />
      
      {/* Button Content */}
      <div className="relative z-20 flex items-center gap-2.5 text-zinc-300 group-hover:text-[#00FF41] transition-colors duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        <FileText className="w-4 h-4 md:w-5 md:h-5 [@media(min-width:1800px)]:w-[1.2vw] [@media(min-width:1800px)]:h-[1.2vw]" />
        <span className="font-mono text-sm md:text-base uppercase tracking-widest font-bold [@media(min-width:1800px)]:text-[1vw]">
          View CV
        </span>
      </div>
    </a>
  );
}
