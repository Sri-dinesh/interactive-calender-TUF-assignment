"use client";

import { useState, useEffect, useContext } from "react";
import { CalendarContext } from "@/components/providers/CalendarProvider";
import { usePresence, motion } from "framer-motion";
import { usePageFlip } from "@/hooks/usePageFlip";
import { HeroPanel } from "./HeroPanel";
import { CalendarHeader } from "./CalendarHeader";
import { NotesPanel } from "./NotesPanel";
import { CalendarGrid } from "./CalendarGrid";

export function CalendarPageWrapper() {
  const liveContext = useContext(CalendarContext);
  if (!liveContext) throw new Error("Missing Context");

  const [frozenContext, setFrozenContext] = useState(liveContext);
  const [isPresent] = usePresence();

  useEffect(() => {
    if (isPresent) {
      setFrozenContext(liveContext);
    }
  }, [liveContext, isPresent]);

  const flipRef = usePageFlip();

  return (
    <CalendarContext.Provider value={frozenContext}>
      <motion.div
        ref={flipRef}
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
        className="bg-paper shadow-paper flex flex-col w-full overflow-hidden origin-top border-4 border-ink"
      >
        <HeroPanel />
        <CalendarHeader />
        <div className="flex flex-col md:flex-row w-full border-t-4 border-ink">
          <NotesPanel />
          <CalendarGrid />
        </div>
      </motion.div>
    </CalendarContext.Provider>
  );
}
