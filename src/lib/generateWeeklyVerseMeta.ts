const MONTHS = [
  "Jan.",
  "Feb.",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
] as const;

function getFirstMondayOfYear(year: number): Date {
  const jan1 = new Date(year, 0, 1, 12, 0, 0);
  const dayOfWeek = jan1.getDay();

  const daysToMonday = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;

  return new Date(year, 0, 1 + daysToMonday, 12, 0, 0);
}

function getCurrentWeekDate(weekId: number): Date {
  const currentYear = new Date().getFullYear();
  const firstMonday = getFirstMondayOfYear(currentYear);

  const daysToAdd = (weekId - 1) * 7;

  firstMonday.setDate(firstMonday.getDate() + daysToAdd);
  return firstMonday;
}

export function generateWeeklyVerseMeta(weekId?: number) {
  const date = weekId ? getCurrentWeekDate(weekId) : new Date();
  date.setHours(12, 0, 0, 0);

  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

  let year = startOfWeek.getFullYear();
  let firstMonday = getFirstMondayOfYear(year);

  if (startOfWeek < firstMonday) {
    year--;
    firstMonday = getFirstMondayOfYear(year);
  }

  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  const diffWeeks = Math.round((startOfWeek.getTime() - firstMonday.getTime()) / msInWeek);

  const weekNumber = diffWeeks + 1;

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const startMonth = MONTHS[startOfWeek.getMonth()];
  const endMonth = MONTHS[endOfWeek.getMonth()];
  const startDay = startOfWeek.getDate();
  const endDay = endOfWeek.getDate();

  const labelRange =
    startMonth === endMonth
      ? `${startMonth} ${startDay}-${endDay}`
      : `${startMonth} ${startDay}-${endMonth} ${endDay}`;

  return {
    weekNumber,
    title: "Weekly Verses",
    label: `Week #${weekNumber} | ${labelRange}`,
  };
}
