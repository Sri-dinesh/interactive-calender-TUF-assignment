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
        "relative flex items-center justify-center h-12 w-full touch-manipulation sm:cursor-pointer transition-colors duration-200",
        {
          "opacity-30": !isCurrentMonth,
        },
      )}
      data-date={date.getTime()}
      onClick={() => onClick(date)}
      onMouseEnter={() => onHover(date)}
    >
      {/* liquid fill */}
      <div
        className={clsx(
          "liquid-fill absolute inset-0 bg-accent/20 origin-left z-0 overflow-hidden",
          {
            "rounded-l-full": isSelectedStart && isInRange && !isSelectedEnd,
            "rounded-r-full": isSelectedEnd && isInRange && !isSelectedStart,
          }
        )}
        style={{ transform: "scaleX(0)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-black/5" />
      </div>
      <motion.div
        layoutId={isSelected ? `selected-ring` : undefined}
        className={clsx(
          "relative z-10 w-10 h-10 flex items-center justify-center rounded-full text-base font-medium",
          {
            "bg-accent text-white shadow-md": isSelected,
            "text-weekend font-bold":
              isWeekend && isCurrentMonth && !isSelected,
            "text-ink": !isWeekend && isCurrentMonth && !isSelected,
            "hover:bg-border": !isSelected && isCurrentMonth,
          },
        )}
      >
        {dateNum}

        {isToday && !isSelected && (
          <div className="absolute inset-0 border-2 border-accent rounded-full animate-pulse-ring" />
        )}
        {isToday && !isSelected && (
          <div className="absolute inset-0 border-2 border-accent rounded-full" />
        )}

        {hasNote && (
          <div
            className={clsx(
              "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white",
              isSelected ? "bg-white" : "bg-accent",
            )}
          />
        )}

        {isHoliday && (
          <div
            className={clsx(
              "absolute -bottom-1 -right-1 w-2h-2 h-2 w-2 rounded-full",
              isSelected ? "bg-white/80" : "bg-red-400",
            )}
            title={isHoliday}
          />
        )}
      </motion.div>
    </div>
  );
}
