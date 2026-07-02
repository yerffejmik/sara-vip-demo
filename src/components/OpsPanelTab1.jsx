import "./OpsPanel.css";

function ScheduleCard({ schedule }) {
  return (
    <div className="ops-card">
      <div className="ops-card-title">Schedule</div>
      <div className="ops-card-body">
        <div key={`thu-${schedule.thursday.rev}`} className={`schedule-row ${schedule.thursday.rev > 0 ? "pulse" : ""} ${schedule.matchRev > 0 && schedule.thursday.status === "booked" ? "matched" : ""}`}>
          <div className="schedule-row-time mono">{schedule.thursday.label}, {schedule.thursday.time}</div>
          <div className="schedule-row-detail">
            Dr. Patel — {schedule.thursday.status === "booked" ? schedule.thursday.patient : <span className="open-label">Open</span>}
          </div>
          {schedule.matchRev > 0 && schedule.thursday.status === "booked" && <span className="tag tag-blue">record matched</span>}
        </div>
        <div key={`tue-${schedule.tuesday.rev}`} className={`schedule-row ${schedule.tuesday.rev > 0 ? "pulse-green" : ""}`}>
          <div className="schedule-row-time mono">{schedule.tuesday.label}, {schedule.tuesday.time}</div>
          <div className="schedule-row-detail">
            Dr. Patel — {schedule.tuesday.status === "booked" ? schedule.tuesday.patient : <span className="open-label">Open</span>}
          </div>
        </div>
        {schedule.waitlistLine && <div className="waitlist-line">{schedule.waitlistLine}</div>}
      </div>
    </div>
  );
}

function TasksCard({ tasks }) {
  return (
    <div className="ops-card">
      <div className="ops-card-title">Tasks</div>
      <div className="ops-card-body">
        {tasks.length === 0 && <div className="ops-empty">No open tasks</div>}
        {tasks.map((t) => (
          <div key={t.id} className="task-card glow">
            <div className="task-title">{t.title} — {t.patient}</div>
            <div className="task-meta mono">owner: {t.owner} · SLA: {t.sla}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommsCard({ comms }) {
  return (
    <div className="ops-card">
      <div className="ops-card-title">Patient comms</div>
      <div className="ops-card-body">
        {comms.length === 0 && <div className="ops-empty">No messages sent</div>}
        {comms.map((c) => (
          <div key={c.id} className="sms-bubble pulse">
            {c.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function CallLogCard({ callLog }) {
  return (
    <div className="ops-card">
      <div className="ops-card-title">Call log</div>
      <div className="ops-card-body">
        {!callLog && <div className="ops-empty">Call in progress…</div>}
        {callLog && (
          <div className="call-log pulse">
            <div className="call-log-row">
              <span>Duration</span>
              <span className="mono">{callLog.duration}</span>
            </div>
            <div className="call-log-row">
              <span>Disposition</span>
              <span>{callLog.disposition}</span>
            </div>
            <div className="call-log-tags">
              {callLog.tags.map((tag) => (
                <span key={tag} className="tag tag-blue">
                  {tag}
                </span>
              ))}
              <span className="tag tag-link">transcript ↗</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpsPanelTab1({ opsState }) {
  return (
    <section className="ops-panel" aria-label="VIP Operations View">
      <div className="ops-panel-header">VIP Operations View</div>
      <div className="ops-panel-cards">
        <ScheduleCard schedule={opsState.schedule} />
        <TasksCard tasks={opsState.tasks} />
        <CommsCard comms={opsState.comms} />
        <CallLogCard callLog={opsState.callLog} />
      </div>
    </section>
  );
}
