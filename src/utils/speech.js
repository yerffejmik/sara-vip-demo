// Thin wrapper around SpeechSynthesis. Never throws, never blocks — every
// call is best-effort. Turn timing in the conversation engine never awaits
// these, so the demo runs identically whether or not voice is available.

function isSupported() {
  try {
    return typeof window !== "undefined" && "speechSynthesis" in window && !!window.speechSynthesis;
  } catch {
    return false;
  }
}

let cachedVoice = null;

function pickVoice() {
  if (!isSupported()) return null;
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length === 0) return null;
    const preferred =
      voices.find((v) => /en-US/i.test(v.lang) && /female|samantha|zira|jenny|aria/i.test(v.name)) ||
      voices.find((v) => /en-US/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang)) ||
      voices[0];
    return preferred || null;
  } catch {
    return null;
  }
}

if (isSupported()) {
  try {
    cachedVoice = pickVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = pickVoice();
    };
  } catch {
    // ignore — voice stays null, demo runs as text-only
  }
}

export function voiceAvailable() {
  return isSupported();
}

export function speak(text, { enabled = true, rate = 0.95 } = {}) {
  if (!enabled || !isSupported() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    const voice = cachedVoice || pickVoice();
    if (voice) utterance.voice = voice;
    utterance.onerror = () => {}; // swallow — never surface as a console error
    window.speechSynthesis.speak(utterance);
  } catch {
    // graceful no-op — text still renders on its own timer
  }
}

export function cancelSpeech() {
  if (!isSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
