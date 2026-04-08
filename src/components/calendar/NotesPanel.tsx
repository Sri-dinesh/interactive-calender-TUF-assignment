"use client";

import React, { useState, useEffect } from "react";
import { useDateRange } from "@/hooks/useDateRange";
import { useNotes } from "@/hooks/useNotes";
import { formatDateKey } from "@/lib/calendar";

export function NotesPanel() {
  const { rangeStart, rangeEnd } = useDateRange();
  const { notes, saveNote } = useNotes();
  const [localText, setLocalText] = useState("");

  const currentKey = React.useMemo(() => {
    if (rangeStart && rangeEnd) {
      if (rangeStart.getTime() === rangeEnd.getTime()) {
        return formatDateKey(rangeStart);
      }
      return `${formatDateKey(rangeStart)}_${formatDateKey(rangeEnd)}`;
    }
    if (rangeStart) {
      return formatDateKey(rangeStart);
    }
    return "general_monthly_note";
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    setLocalText(notes[currentKey] || "");
  }, [currentKey, notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setLocalText(text);
    saveNote(currentKey, text);
  };

  return (
    <div className="w-full md:w-64 lg:w-80 shrink-0 px-6 py-6 md:border-r border-calendar-border bg-paper h-full">
      <h3 className="text-sm font-bold tracking-widest text-ink mb-6 uppercase">
        Notes
      </h3>

      <div className="relative w-full h-[200px] md:h-[300px]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(transparent, transparent 27px, var(--color-calendar-border) 27px, var(--color-calendar-border) 28px)",
            backgroundSize: "100% 28px",
          }}
        />

        <textarea
          value={localText}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full bg-transparent resize-none border-none outline-none text-ink leading-[28px] py-[2px]"
          placeholder="add notes here..."
          style={{ lineHeight: "28px" }}
        />
      </div>
    </div>
  );
}
