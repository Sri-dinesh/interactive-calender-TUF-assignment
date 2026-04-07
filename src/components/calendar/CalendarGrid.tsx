"use client";

import { useMemo } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useNotes } from "@/hooks/useNotes";
import { useHolidays } from "@/hooks/useHolidays";
import { buildMonthGrid, formatDateKey } from "@/lib/calendar";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { CalendarDay } from "./CalendarDay";
import { motion } from "framer-motion";
import clsx from "clsx";

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

  const gridDays = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  return (
    <div className="flex-1 px-4 py-6 md:px-8 bg-paper">
      <div className="grid grid-cols-7 mb-4">
        {DAYS_OF_WEEK.map((day, i) => (
          <div
            key={day}
            className={clsx(
              "text-center text-xs md:text-sm font-semibold tracking-widest",
              i === 5 || i === 6 ? "text-weekend" : "text-ink-muted",
            )}
          >
            {day}
          </div>
        ))}
      </div>
      {/* calender grid */}
      <div className="grid grid-cols-7 gap-y-2">
        {gridDays.map((dayObj, i) => {
          const dateKey = formatDateKey(dayObj.date);
          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.015 }}
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
  );
}
