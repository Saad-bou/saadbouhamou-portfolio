"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "./Container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled ? "top-2 sm:top-4 px-2 sm:px-4" : "top-0 px-0",
      )}
    >
      <nav
        className={cn(
          "mx-auto transition-all duration-500 ease-in-out border",
          isScrolled
            ? "max-w-2xl rounded-full border-white/10 bg-black/60 backdrop-blur-xl py-2 px-2 sm:px-6"
            : "max-w-full border-transparent bg-transparent py-4 sm:py-6",
        )}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center font-bold tracking-tighter transition-opacity hover:opacity-80"
            >
              <span className="text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-transform group-hover:-translate-x-1">
                {"<"}
              </span>
              <span className="text-[17px] mx-[1px]">sdbou</span>
              <span className="text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-transform group-hover:translate-x-1">
                {" />"}
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-8 text-[12px] font-medium tracking-widest text-white/50">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.name.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Let's Talk Button - Always Visible (Mobile & Desktop) */}
            <div className="flex items-center">
              <Button
                variant={isScrolled ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full px-5 text-[11px] font-bold uppercase tracking-wider transition-all duration-500",
                  !isScrolled && "border-white/10 text-white hover:bg-white/5",
                  isScrolled && "bg-white text-black",
                )}
              >
                {"Let's Talk"}
              </Button>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
