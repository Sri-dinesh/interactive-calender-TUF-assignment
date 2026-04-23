"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { MONTHS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";

const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
];

export function HeroPanel() {
  const { state } = useCalendar();
  const { viewMonth, viewYear } = state;

  return (
    <div className="relative w-full h-[35vh] md:h-[40vh] overflow-hidden bg-ink border-b-4 border-ink">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={`${viewYear}-${viewMonth}`}
          src={MONTH_IMAGES[viewMonth]}
          alt={`${MONTHS[viewMonth]} Hero`}
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 contrast-150 grayscale"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
        />
      </AnimatePresence>

      {/* geometric brutalist overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-accent mix-blend-multiply opacity-50"
      />
      <div 
        className="absolute top-0 right-0 w-1/2 h-full bg-ink"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      />

      <div className="absolute bottom-6 right-8 text-right text-paper drop-shadow-[4px_4px_0_rgba(0,0,0,1)] z-10 flex flex-col items-end">
        <div className="text-3xl font-sans font-bold tracking-[0.5em] bg-ink text-paper px-2 py-1 mb-2 border-2 border-paper">
          {viewYear}
        </div>
        <div className="text-6xl md:text-8xl font-serif font-black uppercase tracking-tighter leading-none">
          {MONTHS[viewMonth]}
        </div>
      </div>
    </div>
  );
}
