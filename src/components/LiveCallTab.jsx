import { useMemo, useState, useCallback } from "react";
import { buildTab1Script } from "../data/tab1Script";
import { getScheduleDates } from "../data/dates";
import { initialOpsStateTab1, opsReducerTab1 } from "../data/opsReducerTab1";
import { useConversationEngine } from "../hooks/useConversationEngine";
import PhonePanel from "./PhonePanel";
import OpsPanelTab1 from "./OpsPanelTab1";
import { voiceAvailable, cancelSpeech } from "../utils/speech";
import "./LiveCallTab.css";

export default function LiveCallTab() {
  const dates = useMemo(() => getScheduleDates(), []);
  const script = useMemo(() => buildTab1Script(dates), [dates]);
  const [mode, setMode] = useState("auto");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [opsState, setOpsState] = useState(() => initialOpsStateTab1(dates));
  const voiceSupported = useMemo(() => voiceAvailable(), []);

  const handleEvent = useCallback(
    (evt, meta) => {
      setOpsState((prev) => opsReducerTab1(prev, evt, dates, meta));
    },
    [dates]
  );

  const engine = useConversationEngine(script, { mode, voiceEnabled, onEvent: handleEvent });
  const running = engine.status === "running" || engine.status === "awaiting-choice";

  const handleRestart = () => {
    engine.restart();
    setOpsState(initialOpsStateTab1(dates));
  };

  const handleRun = () => {
    setOpsState(initialOpsStateTab1(dates));
    engine.run();
  };

  const handleToggleVoice = () => {
    setVoiceEnabled((v) => {
      const next = !v;
      if (!next) cancelSpeech();
      return next;
    });
  };

  const endBanner =
    engine.status === "complete"
      ? "Task completed in the system of record. Staff touches: 0." + (engine.endNote ? ` ${engine.endNote}` : "")
      : null;

  return (
    <div className="live-call-tab">
      <div className="tab-controls">
        <div className="mode-toggle" role="group" aria-label="Playback mode">
          <button type="button" className={`mode-btn ${mode === "auto" ? "active" : ""}`} onClick={() => setMode("auto")} disabled={running}>
            Auto-play
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "interactive" ? "active" : ""}`}
            onClick={() => setMode("interactive")}
            disabled={running}
          >
            Interactive
          </button>
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
            callerLabel="Frederick Eye Institute line, 7:04 PM"
            transcript={engine.transcript}
            activeSpeaker={engine.activeSpeaker}
            status={engine.status}
            voiceEnabled={voiceEnabled}
            voiceSupported={voiceSupported}
            onToggleVoice={handleToggleVoice}
            endBanner={endBanner}
          />
          {engine.pendingChoices && (
            <div className="choice-tray">
              <div className="choice-tray-label mono">Reply as Robert</div>
              <div className="choice-buttons">
                {engine.pendingChoices.choices.map((c, idx) => (
                  <button key={idx} type="button" className="pill-btn secondary choice-btn" onClick={() => engine.selectChoice(c)}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="right-col">
          <OpsPanelTab1 opsState={opsState} />
        </div>
      </div>
    </div>
  );
}
