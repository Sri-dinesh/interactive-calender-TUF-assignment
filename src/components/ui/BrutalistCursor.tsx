"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function BrutalistCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const checkHover = () => {
      const hoveredElement = document.elementFromPoint(
        cursorX.get(),
        cursorY.get()
      );
      if (
        hoveredElement &&
        (window.getComputedStyle(hoveredElement).cursor === "pointer" ||
          hoveredElement.tagName.toLowerCase() === "button" ||
          hoveredElement.tagName.toLowerCase() === "a" ||
          hoveredElement.closest("[data-date]"))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", (e) => {
      moveCursor(e);
      checkHover();
    });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          rotate: isHovering ? 45 : 0,
          borderRadius: isHovering ? "0%" : "50%",
        }}
        transition={{ duration: 0.2, ease: "backOut" }}
      >
        <div className="w-full h-full bg-white opacity-100" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white pointer-events-none z-[10000] mix-blend-difference rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}