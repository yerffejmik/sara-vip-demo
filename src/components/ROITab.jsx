import { useMemo, useState } from "react";
import "./ROITab.css";

const MINUTES_PER_CALL = 4;
const LOCATIONS = 69;

function fmtNumber(n) {
  return Math.round(n).toLocaleString("en-US");
}

function fmtMoney(n) {
  return `$${(n / 1_000_000).toFixed(1)}M`;
}

export default function ROITab() {
  const [visits, setVisits] = useState(500_000);
  const [callsPerVisit, setCallsPerVisit] = useState(3);
  const [automationRate, setAutomationRate] = useState(65);

  const stats = useMemo(() => {
    const totalCalls = visits * callsPerVisit;
    const staffHours = (totalCalls * MINUTES_PER_CALL) / 60;
    const laborValue = staffHours * 20;
    const freedCapacity = laborValue * (automationRate / 100);
    return { totalCalls, staffHours, laborValue, freedCapacity };
  }, [visits, callsPerVisit, automationRate]);

  return (
    <div className="roi-tab">
      <div className="roi-header">
        <h2>The math at 69 locations</h2>
        <p className="roi-sub">Drag the assumptions — the outputs recompute live.</p>
      </div>

      <div className="roi-body">
        <div className="roi-sliders">
          <label className="roi-slider-row">
            <div className="roi-slider-label">
              <span>Annual visits ({LOCATIONS} locations)</span>
              <span className="mono roi-value">{fmtNumber(visits)}</span>
            </div>
            <input type="range" min={100000} max={1500000} step={10000} value={visits} onChange={(e) => setVisits(Number(e.target.value))} />
          </label>

          <label className="roi-slider-row">
            <div className="roi-slider-label">
              <span>Calls per visit</span>
              <span className="mono roi-value">{callsPerVisit.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={0.5}
              value={callsPerVisit}
              onChange={(e) => setCallsPerVisit(Number(e.target.value))}
            />
          </label>

          <label className="roi-slider-row">
            <div className="roi-slider-label">
              <span>
                Automation rate <span className="roi-benchmark">Confido's published steady-state: 75%</span>
              </span>
              <span className="mono roi-value">{automationRate}%</span>
            </div>
            <div className="roi-slider-track">
              <input type="range" min={0} max={100} step={1} value={automationRate} onChange={(e) => setAutomationRate(Number(e.target.value))} />
              <div className="roi-benchmark-tick" style={{ left: "75%" }} title="Confido's published steady-state: 75%" />
            </div>
          </label>
        </div>

        <div className="roi-outputs">
          <div className="roi-stat">
            <div className="roi-stat-label">Total calls / yr</div>
            <div className="roi-stat-value">{fmtNumber(stats.totalCalls)}</div>
          </div>
          <div className="roi-stat">
            <div className="roi-stat-label">Staff hours / yr</div>
            <div className="roi-stat-value">{fmtNumber(stats.staffHours)}</div>
          </div>
          <div className="roi-stat">
            <div className="roi-stat-label">Labor value <span className="roi-stat-note">@ $20/hr</span></div>
            <div className="roi-stat-value">{fmtMoney(stats.laborValue)}</div>
          </div>
          <div className="roi-stat roi-stat-highlight">
            <div className="roi-stat-label">Freed capacity</div>
            <div className="roi-stat-value">{fmtMoney(stats.freedCapacity)}</div>
          </div>
        </div>

        <div className="roi-fixed-block">
          <div className="roi-fixed-card">
            <div className="roi-fixed-value">+1 recovered visit / location / day</div>
            <div className="roi-fixed-approx">≈ $2.6M</div>
          </div>
          <div className="roi-fixed-card">
            <div className="roi-fixed-value">+2 cataract surgeries / ASC / month</div>
            <div className="roi-fixed-approx">≈ $0.7M</div>
          </div>
        </div>
      </div>

      <div className="roi-footnote">All assumptions labeled and replaceable via Confido's free call analysis.</div>
    </div>
  );
}
