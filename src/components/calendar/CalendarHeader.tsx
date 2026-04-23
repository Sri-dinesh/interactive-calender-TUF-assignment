"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { ChevronLeft, ChevronRight, Moon, Sun, Monitor } from "lucide-react";
import { ThemeType } from "@/types/calendar";

export function CalendarHeader() {
  const { state, dispatch } = useCalendar();

  const handlePrev = () =>
    dispatch({ type: "NAVIGATE_MONTH", direction: "prev" });
  const handleNext = () =>
    dispatch({ type: "NAVIGATE_MONTH", direction: "next" });
  const handleToday = () => dispatch({ type: "RESET_TO_TODAY" });

  const toggleTheme = () => {
    const nextTheme: Record<ThemeType, ThemeType> = {
      light: "dark",
      dark: "sepia",
      sepia: "light",
    };
    dispatch({ type: "SET_THEME", theme: nextTheme[state.theme] });
  };

  return (
    <div className="flex items-center justify-between py-4 px-2 md:px-8 bg-paper-alt border-b-4 border-ink shrink-0">
      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          className="p-2 border-2 border-ink hover:bg-ink hover:text-paper transition-colors shadow-brutal active:translate-y-1 active:translate-x-1 active:shadow-none"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={3} />
        </button>
        <button
          onClick={handleNext}
          className="p-2 border-2 border-ink hover:bg-ink hover:text-paper transition-colors shadow-brutal active:translate-y-1 active:translate-x-1 active:shadow-none"
          aria-label="Next Month"
        >
          <ChevronRight className="w-6 h-6" strokeWidth={3} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleToday}
          className="text-lg font-black tracking-widest text-ink hover:bg-accent hover:text-ink transition-colors px-4 py-2 border-2 border-ink shadow-brutal active:translate-y-1 active:translate-x-1 active:shadow-none"
        >
          TODAY
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 border-2 border-ink hover:bg-accent text-ink transition-all shadow-brutal active:translate-y-1 active:translate-x-1 active:shadow-none"
          aria-label="Toggle Theme"
        >
          {state.theme === "light" && <Sun className="w-6 h-6" strokeWidth={2.5} />}
          {state.theme === "dark" && <Moon className="w-6 h-6" strokeWidth={2.5} />}
          {state.theme === "sepia" && <Monitor className="w-6 h-6" strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
}
