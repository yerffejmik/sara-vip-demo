import { useEffect, useRef } from "react";
import "./PhonePanel.css";

function WaveIndicator({ active }) {
  return (
    <div className={`wave ${active ? "wave-active" : ""}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

export default function PhonePanel({
  callerLabel,
  transcript,
  activeSpeaker,
  status,
  endBanner,
  voiceEnabled,
  onToggleVoice,
  voiceSupported,
  flagBanner,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript]);

  return (
    <section className="phone-panel" aria-label="Live call">
      <div className="phone-header">
        <div>
          <div className="phone-caller mono">Incoming — {callerLabel}</div>
          <div className="phone-status">
            {status === "running" || status === "awaiting-choice" ? "Call in progress" : status === "complete" ? "Call ended" : "Ready"}
          </div>
        </div>
        <button
          type="button"
          className="voice-toggle"
          onClick={onToggleVoice}
          aria-pressed={voiceEnabled}
          title={voiceSupported ? "Toggle Sara's voice" : "Speech synthesis unavailable — text only"}
        >
          {voiceEnabled && voiceSupported ? "🔊" : "🔇"}
        </button>
      </div>

      {flagBanner && <div className="flag-banner">{flagBanner}</div>}

      <div className="transcript" ref={scrollRef}>
        {transcript.length === 0 && status === "idle" && <div className="transcript-empty">Press “Run the call” to begin.</div>}
        {transcript.map((turn) => (
          <div key={turn.id} className={`turn turn-${turn.speaker}`}>
            <div className="turn-label mono">{turn.speaker === "sara" ? "Sara" : turn.speaker === "patient" ? "Robert" : ""}</div>
            <div className="turn-bubble">{turn.text}</div>
          </div>
        ))}
        {activeSpeaker === "sara" && (status === "running" || status === "awaiting-choice") && (
          <div className="turn turn-sara turn-speaking">
            <WaveIndicator active />
          </div>
        )}
      </div>

      {endBanner && <div className="end-banner">{endBanner}</div>}
    </section>
  );
}

export { WaveIndicator };
