"use client";

import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { CalendarDay as CalendarDayType } from "@/types/calendar";

interface CalendarDayProps {
  day: CalendarDayType;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isInRange: boolean;
  isHoliday: string | null;
  hasNote: boolean;
  onClick: (d: Date) => void;
  onHover: (d: Date) => void;
  index: number;
}

export function CalendarDay({
  day,
  isSelectedStart,
  isSelectedEnd,
  isInRange,
  isHoliday,
  hasNote,
  onClick,
  onHover,
  index,
}: CalendarDayProps) {
  const { date, isCurrentMonth, isToday } = day;
  const dateNum = date.getDate();
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const isSelected = isSelectedStart || isSelectedEnd;

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center h-12 md:h-16 w-full touch-manipulation sm:cursor-pointer transition-colors duration-0",
        {
          "opacity-20 grayscale": !isCurrentMonth,
          "hover:bg-ink hover:text-paper": isCurrentMonth && !isSelected,
        },
      )}
      data-date={date.getTime()}
      onClick={() => onClick(date)}
      onMouseEnter={() => onHover(date)}
    >
      {/* liquid fill */}
      <div
        className={clsx(
          "liquid-fill absolute inset-0 bg-accent origin-left z-0 overflow-hidden mix-blend-multiply",
          {
            "border-l-4 border-y-4 border-ink": isSelectedStart && isInRange && !isSelectedEnd,
            "border-r-4 border-y-4 border-ink": isSelectedEnd && isInRange && !isSelectedStart,
            "border-y-4 border-ink": isInRange && !isSelectedStart && !isSelectedEnd,
            "border-4 border-ink": isSelectedStart && isSelectedEnd,
          }
        )}
        style={{ transform: "scaleX(0)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-ink/20" />
      </div>
      <motion.div
        layoutId={isSelected ? `selected-ring` : undefined}
        className={clsx(
          "relative z-10 w-full h-full flex items-center justify-center text-lg font-black",
          {
            "bg-accent text-ink border-4 border-ink shadow-brutal": isSelected,
            "text-accent": isWeekend && isCurrentMonth && !isSelected,
            "text-ink": !isWeekend && isCurrentMonth && !isSelected,
          },
        )}
      >
        {dateNum}

        {isToday && !isSelected && (
          <div className="absolute inset-1 border-4 border-ink pointer-events-none" />
        )}

        {hasNote && (
          <div
            className={clsx(
              "absolute top-1 right-1 w-3 h-3 border-2 border-ink",
              isSelected ? "bg-paper" : "bg-accent",
            )}
          />
        )}

        {isHoliday && (
          <div
            className={clsx(
              "absolute bottom-1 right-1 w-3 h-3 border-2 border-ink",
              isSelected ? "bg-paper" : "bg-yellow-400",
            )}
            title={isHoliday}
          />
        )}
      </motion.div>
    </div>
  );
}
