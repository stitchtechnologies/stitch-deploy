import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// day is monday, tuesday, etc
// time is 12:00 AM, 1:00 PM, etc
export function isStartDateBeforeEndDate(startDate: { day: string, time: string }, endDate: { day: string, time: string }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const startDay = days.indexOf(startDate.day)
  const endDay = days.indexOf(endDate.day)
  if (startDay < endDay) {
    return true
  } else if (startDay === endDay) {
    const startHour = parseInt(startDate.time.split(':')[0])
    const endHour = parseInt(endDate.time.split(':')[0])
    if (startHour < endHour) {
      return true
    } else if (startHour === endHour) {
      const startMinute = parseInt(startDate.time.split(':')[1].split(' ')[0])
      const endMinute = parseInt(endDate.time.split(':')[1].split(' ')[0])
      if (startMinute < endMinute) {
        return true
      }
    }
  }
  return false
}