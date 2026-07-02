import { useMemo, useState, useCallback } from "react";
import { buildTab2Script } from "../data/tab2Script";
import { initialOpsStateTab2, opsReducerTab2 } from "../data/opsReducerTab2";
import { useConversationEngine } from "../hooks/useConversationEngine";
import PhonePanel from "./PhonePanel";
import EscalationOpsPanel from "./EscalationOpsPanel";
import { voiceAvailable } from "../utils/speech";
import "./LiveCallTab.css";

export default function EscalationTab() {
  const script = useMemo(() => buildTab2Script(), []);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [opsState, setOpsState] = useState(initialOpsStateTab2);
  const voiceSupported = useMemo(() => voiceAvailable(), []);

  const handleEvent = useCallback((evt, meta) => {
    setOpsState((prev) => opsReducerTab2(prev, evt, meta));
  }, []);

  const engine = useConversationEngine(script, { mode: "auto", voiceEnabled, onEvent: handleEvent });

  const handleRestart = () => {
    engine.restart();
    setOpsState(initialOpsStateTab2);
  };

  const handleRun = () => {
    setOpsState(initialOpsStateTab2);
    engine.run();
  };

  const endBanner =
    engine.status === "complete" ? "Trust is built by failing well. Clinical anything goes to a human, every time." : null;

  return (
    <div className="live-call-tab">
      <div className="tab-controls">
        <div className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
          Scripted auto-play only — this call always escalates.
        </div>
        <div className="run-controls">
          {engine.status === "idle" ? (
            <button type="button" className="pill-btn primary" onClick={handleRun}>
              ▶ Run the call
            </button>
          ) : (
            <button type="button" className="pill-btn secondary" onClick={handleRestart}>
              ↺ Restart
            </button>
          )}
        </div>
      </div>

      <div className="split-screen">
        <div className="left-col">
          <PhonePanel
            callerLabel="Frederick Eye Institute line, post-op line"
            transcript={engine.transcript}
            activeSpeaker={engine.activeSpeaker}
            status={engine.status}
            voiceEnabled={voiceEnabled}
            voiceSupported={voiceSupported}
            onToggleVoice={() => setVoiceEnabled((v) => !v)}
            endBanner={endBanner}
            flagBanner={opsState.flagged ? "CLINICAL — ESCALATED" : null}
          />
        </div>
        <div className="right-col">
          <EscalationOpsPanel opsState={opsState} />
        </div>
      </div>
    </div>
  );
}
