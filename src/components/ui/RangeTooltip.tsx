"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDateRange } from "@/hooks/useDateRange";
import { format, differenceInDays } from "date-fns";
import { X, Copy } from "lucide-react";

export function RangeTooltip() {
  const { rangeStart, rangeEnd, clearSelection, selectionPhase } =
    useDateRange();

  const isVisible = rangeStart && rangeEnd && selectionPhase === "complete";
  let title = "";
  let duration = "";

  if (isVisible) {
    const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const end = rangeStart > rangeEnd ? rangeStart : rangeEnd;

    title = `${format(start, "MMM d")} → ${format(end, "MMM d")}`;
    const diff = differenceInDays(end, start);
    duration = diff === 0 ? "Same day" : `${diff} night${diff > 1 ? "s" : ""}`;
  }

  const handleCopy = () => {
    if (title) {
      navigator.clipboard.writeText(`${title} • ${duration}`);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-ink text-paper px-6 py-3 rounded-full shadow-2xl backdrop-blur-sm"
        >
          <span className="font-sans font-medium whitespace-nowrap">
            {title} <span className="text-ink-muted px-2">•</span> {duration}
          </span>

          <div className="flex items-center gap-1 border-l border-ink-muted/30 pl-4 ml-2">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-paper-alt/20 rounded-full transition-colors"
              aria-label="Copy Range"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={clearSelection}
              className="p-1.5 hover:bg-paper-alt/20 rounded-full transition-colors"
              aria-label="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
