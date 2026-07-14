import React, { useState } from "react";
import { fontImport, tokens } from "./shared/theme.js";
import SpartanProgram from "./spartan/SpartanProgram.jsx";
import OptProgram from "./opt/OptProgram.jsx";

const PROGRAM_KEY = "selected-program";

function loadSelectedProgram() {
  try {
    return localStorage.getItem(PROGRAM_KEY) || "spartan";
  } catch (e) {
    return "spartan";
  }
}

export default function App() {
  const [program, setProgram] = useState(() => loadSelectedProgram());

  function selectProgram(next) {
    setProgram(next);
    try {
      localStorage.setItem(PROGRAM_KEY, next);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "Inter, sans-serif", padding: 16, borderRadius: 12, maxWidth: 720, margin: "0 auto" }}>
      <style>{fontImport + tokens}</style>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, border: "1px solid var(--line)", borderRadius: 10, padding: 4, background: "var(--surface)" }}>
        <button
          onClick={() => selectProgram("spartan")}
          style={{
            flex: 1, padding: "8px", borderRadius: 7, cursor: "pointer",
            fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase",
            background: program === "spartan" ? "var(--accent)" : "transparent",
            color: program === "spartan" ? "var(--bg)" : "var(--dim)",
            border: "none",
          }}
        >
          Spartan Program
        </button>
        <button
          onClick={() => selectProgram("opt")}
          style={{
            flex: 1, padding: "8px", borderRadius: 7, cursor: "pointer",
            fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase",
            background: program === "opt" ? "var(--accent)" : "transparent",
            color: program === "opt" ? "var(--bg)" : "var(--dim)",
            border: "none",
          }}
        >
          NASM OPT Model
        </button>
      </div>

      {program === "spartan" ? <SpartanProgram /> : <OptProgram />}
    </div>
  );
}
