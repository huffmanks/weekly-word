export function getWeekGenerateLabel(dateOverride?: string | Date) {
  const now = dateOverride ? new Date(dateOverride) : new Date();

  const tmp = new Date(now);
  const weekday = tmp.getDay() === 0 ? 7 : tmp.getDay();
  tmp.setDate(tmp.getDate() - (weekday - 1)); // startOfWeek (Monday)
  const startOfWeek = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());

  function isoWeekNumber(d: Date) {
    const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = dt.getUTCDay() || 7;
    dt.setUTCDate(dt.getUTCDate() + 4 - day);
    const isoYearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((dt.getTime() - isoYearStart.getTime()) / 86400000 + 1) / 7);
    return { weekNo, isoYear: dt.getUTCFullYear() };
  }

  const { weekNo, isoYear } = isoWeekNumber(startOfWeek);
  let weekNumber = weekNo;

  if (isoYear > startOfWeek.getFullYear() && startOfWeek.getMonth() === 11) weekNumber = 52;
  if (isoYear < startOfWeek.getFullYear() && startOfWeek.getMonth() === 0) weekNumber = 1;
  if (!weekNumber || isNaN(weekNumber)) weekNumber = startOfWeek.getMonth() === 11 ? 52 : 1;
  if (weekNumber > 52) weekNumber = 52;

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startMonth = startOfWeek.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });
  const startDay = startOfWeek.getDate();
  const endDay = endOfWeek.getDate();

  const range =
    startMonth === endMonth
      ? `${startMonth} ${startDay}-${endDay}`
      : `${startMonth} ${startDay}-${endMonth} ${endDay}`;

  const label = `Week #${weekNumber} | ${range}`;
  return { weekNumber, label };
}
