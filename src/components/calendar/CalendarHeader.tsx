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
    <div className="flex items-center justify-between py-4 px-2 md:px-8 bg-paper-alt border-b border-calendar-border shrink-0">
      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-range-fill text-ink transition-colors"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-range-fill text-ink transition-colors"
          aria-label="Next Month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleToday}
          className="text-sm font-semibold tracking-wide text-ink-muted hover:text-accent transition-colors px-3 py-1 rounded-md"
        >
          TODAY
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-range-fill text-ink-muted transition-all animate-spin-once"
          aria-label="Toggle Theme"
        >
          {state.theme === "light" && <Sun className="w-5 h-5" />}
          {state.theme === "dark" && <Moon className="w-5 h-5" />}
          {state.theme === "sepia" && <Monitor className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
