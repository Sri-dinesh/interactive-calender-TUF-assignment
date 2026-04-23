"use client";

import { useMemo, useRef } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useNotes } from "@/hooks/useNotes";
import { useHolidays } from "@/hooks/useHolidays";
import { buildMonthGrid, formatDateKey } from "@/lib/calendar";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { CalendarDay } from "./CalendarDay";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useLiquidFill } from "@/hooks/useLiquidFill";

export function CalendarGrid() {
  const { state } = useCalendar();
  const { viewMonth, viewYear } = state;
  const {
    handleDaySelect,
    handleDayHover,
    isSelectedStart,
    isSelectedEnd,
    isDayInRange,
  } = useDateRange();
  const { hasNote } = useNotes();
  const { getHoliday } = useHolidays();

  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLiquidFill(
    state.rangeStart,
    state.hoverDate,
    state.rangeEnd,
    state.selectionPhase,
    gridRef,
    canvasRef,
  );

  const gridDays = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  return (
    <div className="flex-1 px-4 py-6 md:px-8 bg-paper border-l-4 border-ink">
      <div className="grid grid-cols-7 mb-4 border-b-4 border-ink pb-2">
        {DAYS_OF_WEEK.map((day, i) => (
          <div
            key={day}
            className={clsx(
              "text-center text-sm md:text-base font-black tracking-widest uppercase",
              i === 5 || i === 6 ? "text-accent" : "text-ink",
            )}
          >
            {day}
          </div>
        ))}
      </div>
      {/* calender grid */}
      <div className="relative isolate" ref={gridRef}>
        <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none w-full h-full mix-blend-difference" />
        <div className="grid grid-cols-7 gap-1 overflow-hidden bg-ink p-1 border-2 border-ink shadow-brutal">
        {gridDays.map((dayObj, i) => {
          const dateKey = formatDateKey(dayObj.date);
          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: i * 0.01, ease: "backOut" }}
              className="bg-paper"
            >
              <CalendarDay
                day={dayObj}
                index={i}
                isSelectedStart={isSelectedStart(dayObj.date)}
                isSelectedEnd={isSelectedEnd(dayObj.date)}
                isInRange={isDayInRange(dayObj.date)}
                isHoliday={getHoliday(dayObj.date)}
                hasNote={hasNote(dateKey)}
                onClick={handleDaySelect}
                onHover={(d) => handleDayHover(d)}
              />
            </motion.div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
