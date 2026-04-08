import { useEffect, useRef, useContext } from "react";
import { usePresence } from "framer-motion";
import gsap from "gsap";
import { CalendarContext } from "@/components/providers/CalendarProvider";

export function usePageFlip() {
  const ref = useRef<HTMLDivElement>(null);
  const [isPresent, safeToRemove] = usePresence();

  const context = useContext(CalendarContext);
  const direction = context?.state.navDirection || "next";

  useEffect(() => {
    if (!isPresent && ref.current) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // lock pivot point at top edge
      gsap.set(ref.current, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transformOrigin: "top center",
        zIndex: 50,
        pointerEvents: "none",
      });

      if (prefersReducedMotion) {
        gsap.to(ref.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: safeToRemove,
        });
        return;
      }

      const rotateTarget = direction === "next" ? 140 : -140;
      const yOffset = direction === "next" ? -25 : 25;
      const tl = gsap.timeline({ onComplete: safeToRemove });

      tl.to(ref.current, {
        y: yOffset,
        scale: 1.02,
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
        duration: 0.15,
        ease: "power2.out",
      }).to(
        ref.current,
        {
          rotateX: rotateTarget,
          opacity: 0,
          scale: 0.92,
          duration: 0.45,
          ease: "power2.inOut",
        },
        "<0.1",
      );
    }
  }, [isPresent, safeToRemove, direction]);

  return ref;
}
