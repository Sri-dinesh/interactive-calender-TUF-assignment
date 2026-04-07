export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  text: string;
  dateKey?: string;
  createdAt: number;
  updatedAt: number;
}

export type ThemeType = "light" | "dark" | "sepia";

export interface CalendarState {
  viewMonth: number;
  viewYear: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  selectionPhase: "idle" | "selecting" | "complete";
  notes: Record<string, string>;
  theme: ThemeType;
  heroImage: string;
}

export type CalendarAction =
  | { type: "NAVIGATE_MONTH"; direction: "prev" | "next" }
  | { type: "SELECT_DAY"; date: Date }
  | { type: "HOVER_DAY"; date: Date | null }
  | { type: "CLEAR_RANGE" }
  | { type: "SAVE_NOTE"; key: string; text: string }
  | { type: "DELETE_NOTE"; key: string }
  | { type: "SET_THEME"; theme: ThemeType }
  | { type: "RESET_TO_TODAY" };
