const bernCalendar = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Zurich",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function bernDate(now = new Date()) {
  return bernCalendar.format(now);
}
