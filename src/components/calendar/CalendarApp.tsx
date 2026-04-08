"use client";

import { CalendarProvider } from "@/components/providers/CalendarProvider";
import { SpiralBinding } from "@/components/ui/SpiralBinding";
import { HeroPanel } from "./HeroPanel";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { RangeTooltip } from "@/components/ui/RangeTooltip";

function AppLayout() {
  return (
    <div className="min-h-screen bg-paper-alt flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full relative">
        <SpiralBinding />
        <div className="bg-paper rounded-b-xl shadow-paper flex flex-col w-full overflow-hidden">
          <HeroPanel />
          <CalendarHeader />
          <div className="flex flex-col md:flex-row w-full">
            <NotesPanel />
            <CalendarGrid />
          </div>
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
