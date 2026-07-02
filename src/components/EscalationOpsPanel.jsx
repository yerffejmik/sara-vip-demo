import "./OpsPanel.css";

export default function EscalationOpsPanel({ opsState }) {
  return (
    <section className="ops-panel" aria-label="VIP Operations View — escalation">
      <div className="ops-panel-header">VIP Operations View</div>
      <div className="ops-panel-cards">
        <div className="ops-card">
          <div className="ops-card-title">Transcript flag</div>
          <div className="ops-card-body">
            {!opsState.flagged && <div className="ops-empty">No clinical flags</div>}
            {opsState.flagged && (
              <div className="task-card glow" style={{ borderColor: "var(--amber)" }}>
                <div className="task-title">CLINICAL — ESCALATED</div>
                <div className="task-meta mono">Patient-reported post-op pain, same day</div>
              </div>
            )}
          </div>
        </div>

        <div className="ops-card">
          <div className="ops-card-title">On-call protocol</div>
          <div className="ops-card-body">
            {!opsState.transferCard && <div className="ops-empty">Standing by</div>}
            {opsState.transferCard && (
              <div className="schedule-row pulse">
                <div className="schedule-row-detail">Warm transfer → on-call clinician</div>
                <span className="tag tag-blue">live handoff</span>
              </div>
            )}
          </div>
        </div>

        <div className="ops-card">
          <div className="ops-card-title">Call log</div>
          <div className="ops-card-body">
            {!opsState.callLog && <div className="ops-empty">Call in progress…</div>}
            {opsState.callLog && (
              <div className="call-log pulse-green">
                <div className="call-log-row">
                  <span>Duration</span>
                  <span className="mono">{opsState.callLog.duration}</span>
                </div>
                <div className="call-log-row">
                  <span>Disposition</span>
                  <span>{opsState.callLog.disposition}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
