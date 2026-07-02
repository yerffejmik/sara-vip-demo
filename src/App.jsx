import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TabNav from "./components/TabNav";
import LiveCallTab from "./components/LiveCallTab";
import EscalationTab from "./components/EscalationTab";
import ROITab from "./components/ROITab";
import "./App.css";

function App() {
  const [tab, setTab] = useState("live");

  return (
    <>
      <Header />
      <TabNav active={tab} onChange={setTab} />
      <main className="app-main">
        {tab === "live" && <LiveCallTab />}
        {tab === "escalation" && <EscalationTab />}
        {tab === "roi" && <ROITab />}
      </main>
      <Footer />
    </>
  );
}

export default App;
