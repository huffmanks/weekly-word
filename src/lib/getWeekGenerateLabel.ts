export function getWeekGenerateLabel(dateOverride?: string | Date) {
  const date = new Date(dateOverride ?? new Date());

  const months = [
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

  const toMonday = (d: Date) => {
    const out = new Date(d);
    out.setDate(out.getDate() - ((out.getDay() || 7) - 1));
    out.setHours(0, 0, 0, 0);
    return out;
  };

  const firstMondayOnOrAfter = (year: number) => {
    const d = new Date(year, 0, 1);
    d.setHours(0, 0, 0, 0);
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    return d;
  };

  const startOfWeek = toMonday(date);
  let year = startOfWeek.getFullYear();
  let firstMonday = firstMondayOnOrAfter(year);

  if (startOfWeek < firstMonday) {
    year--;
    firstMonday = firstMondayOnOrAfter(year);
  }

  const diffWeeks = Math.floor((startOfWeek.getTime() - firstMonday.getTime()) / (7 * 86400000));
  const weekNumber = diffWeeks + 1;

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const startMonth = months[startOfWeek.getMonth()];
  const endMonth = months[endOfWeek.getMonth()];
  const startDay = startOfWeek.getDate();
  const endDay = endOfWeek.getDate();

  const labelRange =
    startMonth === endMonth
      ? `${startMonth} ${startDay}-${endDay}`
      : `${startMonth} ${startDay}-${endMonth} ${endDay}`;

  return {
    weekNumber,
    label: `Week #${weekNumber} | ${labelRange}`,
  };
}
