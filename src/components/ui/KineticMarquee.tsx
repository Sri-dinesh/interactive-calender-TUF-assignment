"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useCalendar } from "@/hooks/useCalendar";
import { MONTHS } from "@/lib/constants";

export function KineticMarquee() {
  const { state } = useCalendar();
  const { viewMonth, viewYear } = state;
  const marqueeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !marqueeRef.current) return;

    // Reset translation to 0 before starting animation
    gsap.set(textRef.current, { xPercent: 0 });

    const width = textRef.current.clientWidth;
    // Animate to translate by half of the duplicated text width to create a seamless loop
    const tl = gsap.to(textRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 15, // Speed of marquee
      repeat: -1,
    });

    return () => {
      tl.kill();
    };
  }, [viewMonth, viewYear]); // Re-run if text changes

  const text = `${MONTHS[viewMonth]} ${viewYear} // `;
  // Duplicate the text multiple times to ensure it fills the screen and wraps seamlessly
  const content = text.repeat(8);

  return (
    <div
      ref={marqueeRef}
      className="fixed top-[15%] left-0 w-full overflow-hidden whitespace-nowrap z-0 pointer-events-none opacity-10 mix-blend-difference select-none flex items-center"
      style={{
        transform: "rotate(-2deg) scale(1.1)",
      }}
    >
      <div
        ref={textRef}
        className="inline-block text-[15vw] font-black uppercase tracking-tighter leading-none"
        style={{
          fontFamily: "var(--font-syne), var(--font-serif)",
          WebkitTextStroke: "2px currentColor",
          color: "transparent",
        }}
      >
        {content}
        {content}
      </div>
    </div>
  );
}