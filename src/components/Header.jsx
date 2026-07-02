import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-titles">
        <h1>Sara × Vision Innovation Partners</h1>
        <p className="app-header-sub">A working simulation — Confido Health Stage 2, built by Jeff Kim</p>
      </div>
      <div className="app-header-chips">
        <span className="chip">No real PHI</span>
        <span className="chip">Simulation — no live integrations</span>
        <span className="chip">Built in 2 hours with AI tools</span>
      </div>
    </header>
  );
}
