// Deterministic per-turn hold time, independent of whether speech synthesis
// actually runs (so P0-7 timing and P0-5 voice-degradation both hold with
// the exact same numbers). Tuned so a full Tab 1 run lands ~80-95s.

const MS_PER_WORD_SARA = 320; // approx a natural 0.95-rate TTS pace
const MS_PER_WORD_PATIENT = 150; // reading pace only, no TTS
const BASE_SARA = 900;
const BASE_PATIENT = 1400;
const MIN_HOLD = 1800;

export function estimateHoldMs(node) {
  const words = node.text ? node.text.trim().split(/\s+/).length : 0;
  let ms;
  if (node.speaker === "sara") {
    ms = BASE_SARA + words * MS_PER_WORD_SARA;
  } else if (node.speaker === "system") {
    ms = BASE_PATIENT + words * MS_PER_WORD_PATIENT;
  } else {
    ms = BASE_PATIENT + words * MS_PER_WORD_PATIENT;
  }

  // Give sequenced ops events room to finish before advancing, plus a
  // moment to actually see the result (avoids the "money moment" flashing by).
  const events = node.opsEvents || [];
  if (events.length > 0) {
    const lastEventAt = Math.max(...events.map((e) => e.delay || 0));
    ms = Math.max(ms, lastEventAt + 1200);
  }

  return Math.max(MIN_HOLD, Math.round(ms));
}
