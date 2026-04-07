import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay as dateFnsIsSameDay,
  format,
  isWithinInterval,
} from "date-fns";
import { CalendarDay } from "../types/calendar";

// builds a 6x7 grid (42 days) representing a monthly calendar view
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

  const currentDay = new Date();

  let daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });

  if (daysInGrid.length === 35) {
    const extraWeekEnd = endOfWeek(
      new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() + 1,
      ),
      { weekStartsOn: 1 },
    );
    daysInGrid = eachDayOfInterval({ start: startDate, end: extraWeekEnd });
  } else if (daysInGrid.length === 28) {
    const extraWeekEnd = endOfWeek(
      new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() + 14,
      ),
      { weekStartsOn: 1 },
    );
    daysInGrid = eachDayOfInterval({ start: startDate, end: extraWeekEnd });
  }

  return daysInGrid.slice(0, 42).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, firstDayOfMonth),
    isToday: dateFnsIsSameDay(date, currentDay),
  }));
}

export function isInRange(
  date: Date,
  start: Date | null,
  end: Date | null,
): boolean {
  if (!start || !end) return false;

  const intervalStart = start < end ? start : end;
  const intervalEnd = start < end ? end : start;

  return isWithinInterval(date, { start: intervalStart, end: intervalEnd });
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return dateFnsIsSameDay(a, b);
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
