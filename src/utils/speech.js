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

// Warmer, more natural female-leaning en-US voices shipped by common OSes.
const NATURAL_NAMES = /samantha|ava|allison|susan|zoe|nicky|joelle|serena|karen|kathy|nova|jenny|aria|emma|female/i;
// Name/URI hints that mark a genuinely high-quality (neural) voice.
const QUALITY_HINT = /premium|enhanced|neural|natural/i;
// Network-backed neural voices (excellent, but stream to a vendor server).
const CLOUD_NAME = /google|microsoft.*(online|natural)/i;

// Score every available voice; higher = more human. English only. We give a
// strong bonus to LOCAL voices so the demo stays offline by default (the
// header claims "no live integrations") — a cloud neural voice only wins when
// no decent local voice exists on the machine.
function scoreVoice(v) {
  const name = v.name || "";
  const uri = v.voiceURI || "";
  const lang = v.lang || "";
  if (!/^en/i.test(lang)) return -1; // never read English copy in a non-English voice
  let score = /en[-_]US/i.test(lang) ? 40 : 10;
  if (v.localService) score += 50; // offline + low-latency + spec-compliant
  if (QUALITY_HINT.test(name) || QUALITY_HINT.test(uri)) score += 45; // neural/enhanced
  if (NATURAL_NAMES.test(name)) score += 25;
  if (CLOUD_NAME.test(name)) score += 15; // still a natural-sounding fallback
  return score;
}

function pickVoice() {
  if (!isSupported()) return null;
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length === 0) return null;
    let best = null;
    let bestScore = -Infinity;
    for (const v of voices) {
      const s = scoreVoice(v);
      if (s > bestScore) {
        bestScore = s;
        best = v;
      }
    }
    return best || voices[0] || null;
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
