import { useCallback } from "react";
import { useCalendar } from "./useCalendar";
import { isSameDay, isInRange } from "../lib/calendar";

export function useDateRange() {
  const { state, dispatch } = useCalendar();
  const { rangeStart, rangeEnd, hoverDate, selectionPhase } = state;

  const handleDaySelect = useCallback(
    (date: Date) => {
      dispatch({ type: "SELECT_DAY", date });
    },
    [dispatch],
  );

  const handleDayHover = useCallback(
    (date: Date | null) => {
      dispatch({ type: "HOVER_DAY", date });
    },
    [dispatch],
  );

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_RANGE" });
  }, [dispatch]);

  const isSelectedStart = useCallback(
    (date: Date) => isSameDay(date, rangeStart),
    [rangeStart],
  );

  const isSelectedEnd = useCallback(
    (date: Date) =>
      isSameDay(date, rangeEnd) ||
      (selectionPhase === "selecting" && isSameDay(date, hoverDate)),
    [rangeEnd, selectionPhase, hoverDate],
  );

  const isDayInRange = useCallback(
    (date: Date) => {
      if (rangeStart && rangeEnd) {
        return isInRange(date, rangeStart, rangeEnd);
      }
      if (selectionPhase === "selecting" && rangeStart && hoverDate) {
        return isInRange(date, rangeStart, hoverDate);
      }
      return false;
    },
    [rangeStart, rangeEnd, selectionPhase, hoverDate],
  );

  return {
    rangeStart,
    rangeEnd,
    selectionPhase,
    handleDaySelect,
    handleDayHover,
    clearSelection,
    isSelectedStart,
    isSelectedEnd,
    isDayInRange,
  };
}
