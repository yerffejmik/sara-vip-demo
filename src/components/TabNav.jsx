import "./TabNav.css";

const TABS = [
  { id: "live", label: "1 — Live call" },
  { id: "escalation", label: "2 — When Sara shouldn't handle it" },
  { id: "roi", label: "3 — The math at 69 locations" },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="tab-nav" aria-label="Demo sections">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tab-nav-btn ${active === t.id ? "active" : ""}`}
          onClick={() => onChange(t.id)}
          aria-current={active === t.id ? "page" : undefined}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
