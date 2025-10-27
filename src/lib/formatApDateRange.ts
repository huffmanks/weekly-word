export function formatApDateRange(firstDate: Date, lastDate: Date) {
  const apMonths = [
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
  ];

  const startMonth = apMonths[firstDate.getMonth()];
  const endMonth = apMonths[lastDate.getMonth()];
  const startDay = firstDate.getDate();
  const endDay = lastDate.getDate();
  const startYear = firstDate.getFullYear();
  const endYear = lastDate.getFullYear();

  if (startYear === endYear) {
    if (firstDate.getMonth() === lastDate.getMonth()) {
      return `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay}-${endMonth} ${endDay}, ${startYear}`;
  }

  return `${startMonth} ${startDay}, ${startYear}-${endMonth} ${endDay}, ${endYear}`;
}
