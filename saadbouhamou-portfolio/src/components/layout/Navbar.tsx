"use client";

import { useState, useEffect, useCallback, type MouseEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import Container from "./Container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Lazy-load ContactPanel — JS bundle only fetched when user clicks "Let's Talk"
const ContactPanel = dynamic(() => import("@/components/ui/ContactPanel"), {
  ssr: false,
  loading: () => null,
});

const navLinks = [
  { name: "PROJECTS", href: "#projects" },
  { name: "ABOUT", href: "#about" },
  { name: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // hasPanelMounted: true once user has clicked the button at least once.
  // Keeps ContactPanel in the tree (and its dynamic bundle fetched) without
  // re-mounting on every open/close cycle.
  const [hasPanelMounted, setHasPanelMounted] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const isCaseStudy = pathname.startsWith("/le-petit-college");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick =
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      if (href === "#home") {
        lenis?.scrollTo(0, { duration: 1.1 });
        if (!lenis) window.scrollTo({ top: 0, behavior: "smooth" });
        // Clean URL without the #home hash
        window.history.pushState(null, "", window.location.pathname);
        return;
      }

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - 88;
      lenis?.scrollTo(target, { offset: -88, duration: 1.1 });
      if (!lenis) window.scrollTo({ top: targetTop, behavior: "smooth" });

      // Clean URL without the section hash
      window.history.pushState(null, "", window.location.pathname);
    };

  const openPanel = useCallback(() => {
    setHasPanelMounted(true);
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          isScrolled ? "top-2 sm:top-4 px-2 sm:px-4" : "top-0 px-0",
        )}
      >
        <nav
          className={cn(
            "mx-auto transition-all duration-500 ease-in-out border backdrop-blur-md",
            isScrolled
              ? "max-w-2xl rounded-full border-white/10 bg-black/60 backdrop-blur-xl py-2 px-3 sm:px-6"
              : "max-w-full border-transparent bg-transparent py-4 sm:py-6",
          )}
        >
          <Container>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                href="#home"
                onClick={handleAnchorClick("#home")}
                title="Saad Bouhamou - Navigate to Home Matrix"
                className="group flex items-center font-bold tracking-tighter transition-all duration-200 hover:opacity-80 active:scale-95"
              >
                <span className="text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-transform group-hover:-translate-x-1">
                  {"<"}
                </span>
                <span className="text-[15px] sm:text-[17px] mx-[1px]">sdbou</span>
                <span className="text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-transform group-hover:translate-x-1">
                  {" />"}
                </span>
              </Link>

              {/* Desktop Navigation - Hidden on Mobile */}
              <div className="hidden md:flex items-center gap-8 text-[12px] font-medium tracking-widest text-white/50">
                {isCaseStudy ? (
                  <Link
                    href="/"
                    title="Return to Home"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="text-terminal">{"<"}</span> BACK TO HOME
                  </Link>
                ) : (
                  navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={handleAnchorClick(link.href)}
                      title={`Explore Saad Bouhamou's ${link.name} - Full-Stack Architecture`}
                      className="hover:text-white transition-colors"
                    >
                      {link.name.toUpperCase()}
                    </Link>
                  ))
                )}
              </div>

              {/* Actions - Always Visible (Mobile & Desktop) */}
              <div className="flex items-center gap-4">
                {isCaseStudy && (
                  <Link
                    href="/"
                    title="Return to Home"
                    className="md:hidden text-[10px] sm:text-[11px] font-bold tracking-wider text-white hover:text-[#00FF41] transition-colors uppercase flex items-center gap-1"
                  >
                    <span className="text-terminal">{"<"}</span> BACK
                  </Link>
                )}
                <Button
                  id="lets-talk-btn"
                  variant={isScrolled ? "default" : "outline"}
                  size="sm"
                  onClick={openPanel}
                  className={cn(
                    "rounded-full px-3.5 sm:px-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] transition-transform",
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

      {/* Contact Panel — rendered only after first button click */}
      {hasPanelMounted && (
        <ContactPanel isOpen={isPanelOpen} onClose={closePanel} />
      )}
    </>
  );
}
