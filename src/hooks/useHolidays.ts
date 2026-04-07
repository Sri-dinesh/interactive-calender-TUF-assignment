import { useCallback } from "react";

const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-14": "Makar Sankranti",
  "01-26": "Republic Day",
  "03-14": "Holi",
  "04-10": "Eid al-Fitr",
  "04-14": "Ambedkar Jayanti",
  "08-15": "Independence Day",
  "08-19": "Raksha Bandhan",
  "08-26": "Janmashtami",
  "09-05": "Ganesh Chaturthi",
  "10-02": "Gandhi Jayanti",
  "10-12": "Dussehra",
  "10-20": "Diwali",
  "12-25": "Christmas Day",
};

export function useHolidays() {
  const getHoliday = useCallback((date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const key = `${month}-${day}`;

    return HOLIDAYS[key] || null;
  }, []);

  return {
    HOLIDAYS,
    getHoliday,
  };
}
