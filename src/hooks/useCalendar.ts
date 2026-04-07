import { useContext } from "react";
import { CalendarContext } from "../components/providers/CalendarProvider";

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
