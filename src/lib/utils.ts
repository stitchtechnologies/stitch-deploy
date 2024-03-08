import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function parseTimeString(timeString: string): [number, number, string] {
  const [time, period] = timeString.split(" ");
  const [hour, minute] = time.split(":").map(Number);
  return [hour, minute, period.toUpperCase()];
}

export function convertToTimeObjects(timeObject: {
  startDay: string;
  startTime: string;
  endDay: string;
  endTime: string;
}): { start: Date; end: Date } | null {
  const daysOfWeek: { [key: string]: number; } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const { startDay, startTime, endDay, endTime } = timeObject;

  // Parse start and end time strings
  const [startHour, startMinute, startPeriod] = parseTimeString(startTime);
  const [endHour, endMinute, endPeriod] = parseTimeString(endTime);

  // Create start and end Date objects
  const startDate = new Date();
  startDate.setHours(startHour + (startPeriod === "PM" && startHour !== 12 ? 12 : 0), startMinute, 0, 0);

  const endDate = new Date();
  endDate.setHours(endHour + (endPeriod === "PM" && endHour !== 12 ? 12 : 0), endMinute, 0, 0);

  // Set the day of the week for start and end Date objects
  startDate.setDate(startDate.getDate() + (daysOfWeek[startDay] + 7 - startDate.getDay()) % 7);
  endDate.setDate(endDate.getDate() + (daysOfWeek[endDay] + 7 - endDate.getDay()) % 7);

  return { start: startDate, end: endDate };
}