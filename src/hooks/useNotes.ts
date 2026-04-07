import { useCallback, useEffect } from "react";
import { useCalendar } from "./useCalendar";

export function useNotes() {
  const { state, dispatch } = useCalendar();
  const { notes } = state;

  const saveNote = useCallback(
    (key: string, text: string) => {
      dispatch({ type: "SAVE_NOTE", key, text });
    },
    [dispatch],
  );

  const deleteNote = useCallback(
    (key: string) => {
      dispatch({ type: "DELETE_NOTE", key });
    },
    [dispatch],
  );

  const getNote = useCallback(
    (key: string) => {
      return notes[key] || "";
    },
    [notes],
  );

  const hasNote = useCallback(
    (key: string) => {
      return !!notes[key];
    },
    [notes],
  );

  // sync to localstore when notes changes
  useEffect(() => {
    localStorage.setItem("calendar_notes", JSON.stringify(notes));
  }, [notes]);

  return {
    notes,
    saveNote,
    deleteNote,
    getNote,
    hasNote,
  };
}
