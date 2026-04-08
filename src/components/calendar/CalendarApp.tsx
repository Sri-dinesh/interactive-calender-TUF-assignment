"use client";

import { CalendarProvider } from "@/components/providers/CalendarProvider";
import { SpiralBinding } from "@/components/ui/SpiralBinding";
import { RangeTooltip } from "@/components/ui/RangeTooltip";

import { useCalendar } from "@/hooks/useCalendar";
import { AnimatePresence } from "framer-motion";
import { CalendarPageWrapper } from "./CalendarPageWrapper";

function AppLayout() {
  const { state } = useCalendar();

  return (
    <div className="min-h-screen bg-paper-alt flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full relative">
        <SpiralBinding />
        <div
          className="relative w-full"
          style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <CalendarPageWrapper key={`${state.viewYear}-${state.viewMonth}`} />
          </AnimatePresence>
        </div>
      </div>
      <RangeTooltip />
    </div>
  );
}

export function CalendarApp() {
  return (
    <CalendarProvider>
      <AppLayout />
    </CalendarProvider>
  );
}
