"use client";

import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { CalendarAction, CalendarState, ThemeType } from "@/types/calendar";

const initialState: CalendarState = {
  viewMonth: new Date().getMonth(),
  viewYear: new Date().getFullYear(),
  rangeStart: null,
  rangeEnd: null,
  hoverDate: null,
  selectionPhase: "idle",
  notes: {},
  theme: "light",
  heroImage: `/images/months/${new Date().getMonth() + 1}.jpg`,
  navDirection: null,
};

function calendarReducer(
  state: CalendarState,
  action: CalendarAction,
): CalendarState {
  switch (action.type) {
    case "NAVIGATE_MONTH": {
      let newMonth = state.viewMonth + (action.direction === "next" ? 1 : -1);
      let newYear = state.viewYear;

      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }

      return {
        ...state,
        viewMonth: newMonth,
        viewYear: newYear,
        heroImage: `/images/months/${newMonth + 1}.jpg`,
        navDirection: action.direction,
      };
    }
    case "SELECT_DAY": {
      const { date } = action;

      if (
        state.selectionPhase === "idle" ||
        state.selectionPhase === "complete"
      ) {
        return {
          ...state,
          rangeStart: date,
          rangeEnd: null,
          selectionPhase: "selecting",
        };
      }

      if (state.selectionPhase === "selecting") {
        if (!state.rangeStart) return state;

        let newStart = state.rangeStart;
        let newEnd = date;

        if (date < state.rangeStart) {
          newStart = date;
          newEnd = state.rangeStart;
        }

        return {
          ...state,
          rangeStart: newStart,
          rangeEnd: newEnd,
          selectionPhase: "complete",
          hoverDate: null,
        };
      }

      return state;
    }
    case "HOVER_DAY": {
      if (state.selectionPhase === "selecting") {
        return { ...state, hoverDate: action.date };
      }
      return state;
    }
    case "CLEAR_RANGE": {
      return {
        ...state,
        rangeStart: null,
        rangeEnd: null,
        selectionPhase: "idle",
        hoverDate: null,
      };
    }
    case "SAVE_NOTE": {
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.key]: action.text,
        },
      };
    }
    case "DELETE_NOTE": {
      const newNotes = { ...state.notes };
      delete newNotes[action.key];
      return {
        ...state,
        notes: newNotes,
      };
    }
    case "SET_THEME": {
      return { ...state, theme: action.theme };
    }
    case "RESET_TO_TODAY": {
      const now = new Date();
      return {
        ...state,
        viewMonth: now.getMonth(),
        viewYear: now.getFullYear(),
        heroImage: `/images/months/${now.getMonth() + 1}.jpg`,
        navDirection: null,
      };
    }
    default:
      return state;
  }
}

export const CalendarContext = createContext<{
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
} | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  // loads from localstorage when mounted for notes/theme
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(
        "calendar_theme",
      ) as ThemeType | null;
      if (storedTheme) {
        dispatch({ type: "SET_THEME", theme: storedTheme });
      }

      const storedNotes = localStorage.getItem("calendar_notes");
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        Object.entries(parsedNotes).forEach(([key, text]) => {
          if (typeof text === "string" && typeof key === "string") {
            dispatch({ type: "SAVE_NOTE", key, text });
          }
        });
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
  }, []);

  // theme sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
    localStorage.setItem("calendar_theme", state.theme);
  }, [state.theme]);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
}
