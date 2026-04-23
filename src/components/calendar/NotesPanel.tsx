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
    <div className="w-full md:w-64 lg:w-80 shrink-0 px-6 py-6 border-b-4 md:border-b-0 md:border-r-4 border-ink bg-paper h-full shadow-[inset_-4px_0_0_var(--color-ink)]">
      <h3 className="text-2xl font-serif font-black tracking-tighter text-ink mb-6 uppercase border-b-4 border-ink pb-2 inline-block">
        NOTES
      </h3>

      <div className="relative w-full h-[200px] md:h-[300px]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(transparent, transparent 27px, var(--color-ink) 27px, var(--color-ink) 31px)",
            backgroundSize: "100% 31px",
          }}
        />

        <textarea
          value={localText}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full bg-transparent resize-none border-none outline-none text-ink font-bold text-lg leading-[31px] py-[2px]"
          placeholder="WRITE HERE..."
          style={{ lineHeight: "31px" }}
        />
      </div>
    </div>
  );
}
