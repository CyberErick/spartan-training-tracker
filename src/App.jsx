import React, { useState } from "react";
import { Menu, X, Dumbbell, Zap, BookOpen } from "lucide-react";
import { fontImport, tokens } from "./shared/theme.js";
import SpartanProgram from "./spartan/SpartanProgram.jsx";
import OptProgram from "./opt/OptProgram.jsx";
import ExerciseLibrary from "./library/ExerciseLibrary.jsx";

const PROGRAM_KEY = "selected-program";

function loadSelectedProgram() {
  try {
    return localStorage.getItem(PROGRAM_KEY) || "spartan";
  } catch (e) {
    return "spartan";
  }
}

const NAV_ITEMS = [
  { id: "spartan", label: "Spartan Program", sub: "6-day race-prep split", icon: Dumbbell },
  { id: "opt", label: "NASM OPT Model", sub: "5-phase periodization", icon: Zap },
  { id: "library", label: "Exercise Library", sub: "14 categories, form & breathing cues", icon: BookOpen },
];

export default function App() {
  const [program, setProgram] = useState(() => loadSelectedProgram());
  const [drawerOpen, setDrawerOpen] = useState(false);

  function selectProgram(next) {
    setProgram(next);
    setDrawerOpen(false);
    try {
      localStorage.setItem(PROGRAM_KEY, next);
    } catch (e) {
      // ignore
    }
  }

  const activeItem = NAV_ITEMS.find((n) => n.id === program) || NAV_ITEMS[0];

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <style>{fontImport + tokens}</style>

      <header
        style={{
          position: "sticky", top: 0, zIndex: 10, background: "var(--bg)", borderBottom: "1px solid var(--line)",
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px",
          paddingTop: "max(10px, env(safe-area-inset-top))",
          paddingLeft: "max(16px, env(safe-area-inset-left))",
          paddingRight: "max(16px, env(safe-area-inset-right))",
        }}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", padding: 4, display: "flex" }}
        >
          <Menu size={22} />
        </button>
        <div>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, letterSpacing: 0.4, textTransform: "uppercase" }}>{activeItem.label}</div>
          <div style={{ fontSize: 11, color: "var(--dim)" }}>{activeItem.sub}</div>
        </div>
      </header>

      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(20,20,20,0.45)", zIndex: 20 }}
        />
      )}

      <nav
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: 270, maxWidth: "80vw",
          background: "var(--surface)", borderRight: "1px solid var(--line)", zIndex: 21,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          display: "flex", flexDirection: "column",
          paddingTop: "max(16px, env(safe-area-inset-top))",
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          paddingLeft: "max(16px, env(safe-area-inset-left))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 16px 0" }}>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--dim)" }}>Menu</span>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)", padding: 4, display: "flex" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingRight: 16 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.id === program;
            return (
              <button
                key={item.id}
                onClick={() => selectProgram(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                  background: active ? "var(--accent)" : "transparent",
                  color: active ? "var(--bg)" : "var(--text)",
                  border: "none",
                }}
              >
                <Icon size={17} />
                <span>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: 0.3 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: active ? "var(--bg)" : "var(--dim)" }}>{item.sub}</div>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "auto", paddingRight: 16, fontSize: 11, color: "var(--dim)", lineHeight: 1.5 }}>
          Custom Program Builder coming soon.
        </div>
      </nav>

      <main
        style={{
          maxWidth: 720, margin: "0 auto", boxSizing: "border-box",
          padding: 16,
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          paddingLeft: "max(16px, env(safe-area-inset-left))",
          paddingRight: "max(16px, env(safe-area-inset-right))",
        }}
      >
        {program === "spartan" ? <SpartanProgram /> : program === "opt" ? <OptProgram /> : <ExerciseLibrary />}
      </main>
    </div>
  );
}
