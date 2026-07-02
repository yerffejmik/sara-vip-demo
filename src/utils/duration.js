// Formats an elapsed millisecond count as a call-log duration, e.g.
// 84000 -> "1m 24s", 45000 -> "45s". Used for the Ops-view call log so the
// displayed duration reflects the actual length of the run.
export function formatDuration(ms) {
  const total = Math.max(0, Math.round((ms || 0) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes > 0 ? `${minutes}m ${String(seconds).padStart(2, "0")}s` : `${seconds}s`;
}
