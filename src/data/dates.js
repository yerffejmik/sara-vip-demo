const DAY_MS = 24 * 60 * 60 * 1000;

// Returns the next occurrence of `weekday` (0=Sun..6=Mon..) strictly after `from`.
// "Next Tuesday" said on a Tuesday means the Tuesday of the following week.
function nextWeekday(from, weekday) {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  let diff = (weekday - d.getDay() + 7) % 7;
  if (diff === 0) diff = 7;
  d.setTime(d.getTime() + diff * DAY_MS);
  return d;
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatMonthDay(d) {
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${month} ${ordinal(d.getDate())}`;
}

export function getScheduleDates(today = new Date()) {
  const TUESDAY = 2;
  const THURSDAY = 4;
  const nextTue = nextWeekday(today, TUESDAY);
  const followingTue = new Date(nextTue.getTime() + 7 * DAY_MS);
  const nextThu = nextWeekday(today, THURSDAY);

  return {
    thursday: { date: nextThu, label: formatMonthDay(nextThu) },
    nextTuesday: { date: nextTue, label: formatMonthDay(nextTue) },
    followingTuesday: { date: followingTue, label: formatMonthDay(followingTue) },
  };
}
