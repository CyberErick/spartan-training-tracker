import React, { useState, useEffect } from "react";
import { Save, Download, Check, History, Zap } from "lucide-react";
import { ExerciseCard } from "../shared/components.jsx";
import {
  emptySet, isUnilateralSet, loadOverrides, saveOverrides, applyExerciseOverride,
  loadLog, saveLogToStorage, findLastEntry, exportCSV, groupExercises,
} from "../shared/helpers.js";
import { OPT_PHASES, EXERCISE_LIBRARY } from "./data.js";

const OVERRIDES_KEY = "opt-program-overrides";
const LOG_KEY = "opt-training-log";

function PhaseStrip({ selectedPhase, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
      {OPT_PHASES.map((p) => {
        const active = p.phase === selectedPhase;
        return (
          <button
            key={p.phase}
            onClick={() => onSelect(p.phase)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 4px", gap: 2,
              borderRadius: 8, cursor: "pointer",
              background: active ? "var(--accent)" : "var(--surface)",
              border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
            }}
          >
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, color: active ? "var(--bg)" : "var(--text)" }}>Phase {p.phase}</span>
            <span style={{ fontSize: 9, color: active ? "var(--bg)" : "var(--dim)", textAlign: "center", lineHeight: 1.3 }}>{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function PhaseBanner({ info }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderLeft: "3px solid var(--accent)", borderRadius: 8, padding: "10px 14px", background: "var(--surface)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Zap size={16} color="var(--accent)" />
        <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Phase {info.phase} · {info.name}
        </span>
      </div>
      <p style={{ margin: "8px 0 8px", fontSize: 13, color: "var(--dim)", lineHeight: 1.5 }}>{info.goal}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 10, fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>
        <div><div style={{ color: "var(--dim)" }}>REPS</div><b style={{ color: "var(--text)" }}>{info.reps}</b></div>
        <div><div style={{ color: "var(--dim)" }}>SETS</div><b style={{ color: "var(--text)" }}>{info.sets}</b></div>
        <div><div style={{ color: "var(--dim)" }}>TEMPO</div><b style={{ color: "var(--text)" }}>{info.tempo}</b></div>
        <div><div style={{ color: "var(--dim)" }}>REST</div><b style={{ color: "var(--text)" }}>{info.rest}</b></div>
        <div><div style={{ color: "var(--dim)" }}>INTENSITY</div><b style={{ color: "var(--text)" }}>{info.intensity}</b></div>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--dim)", fontStyle: "italic", lineHeight: 1.5 }}>{info.focus}</p>
    </div>
  );
}

function OptHistoryView({ sessions, onExport }) {
  const sorted = sessions.slice().sort((a, b) => b.phase - a.phase);
  return (
    <div>
      <button onClick={onExport} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "var(--bg)", border: "none", borderRadius: 8, padding: "9px 14px", fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: 0.4, cursor: "pointer", marginBottom: 14 }}>
        <Download size={14} /> Export CSV
      </button>
      {sorted.length === 0 && <p style={{ color: "var(--dim)", fontSize: 13 }}>No sessions saved yet — log a workout and it'll show up here.</p>}
      {sorted.map((s) => {
        const phaseInfo = OPT_PHASES[s.phase - 1];
        const setCount = Object.values(s.entries || {}).reduce((acc, e) => acc + (e.sets || []).filter((x) =>
          isUnilateralSet(x) ? (x.left?.load || x.left?.reps || x.right?.load || x.right?.reps) : (x.load || x.reps)
        ).length, 0);
        return (
          <div key={s.id} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13 }}>Phase {s.phase} — {phaseInfo ? phaseInfo.name : ""}</div>
            <div style={{ fontSize: 11, color: "var(--dim)" }}>{s.date} · {setCount} sets logged</div>
          </div>
        );
      })}
    </div>
  );
}

export default function OptProgram() {
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionState, setSessionState] = useState({});
  const [view, setView] = useState("log");
  const [saveStatus, setSaveStatus] = useState(null);
  const [overrides, setOverrides] = useState(() => loadOverrides(OVERRIDES_KEY));

  useEffect(() => {
    (async () => {
      const log = await loadLog(LOG_KEY);
      setAllSessions(log.sessions || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    const categories = EXERCISE_LIBRARY[selectedPhase];
    const allExercises = Object.values(categories).flat();
    const existing = allSessions.find((s) => s.phase === selectedPhase);
    const initial = {};
    allExercises.forEach((exc) => {
      const merged = applyExerciseOverride(exc, overrides);
      const found = existing && existing.entries && existing.entries[exc.id];
      initial[exc.id] = found && found.sets && found.sets.length ? found.sets : Array.from({ length: Math.max(parseInt(merged.sets, 10) || 3, 1) }, () => emptySet(merged.unilateral));
    });
    setSessionState(initial);
  }, [selectedPhase, loading]); // eslint-disable-line

  function updateSet(exerciseId, idx, val) {
    setSessionState((prev) => {
      const sets = [...(prev[exerciseId] || [])];
      sets[idx] = val;
      return { ...prev, [exerciseId]: sets };
    });
  }
  function addSet(exerciseId, unilateral) {
    setSessionState((prev) => ({ ...prev, [exerciseId]: [...(prev[exerciseId] || []), emptySet(unilateral)] }));
  }
  function removeSet(exerciseId, idx) {
    setSessionState((prev) => {
      const sets = [...(prev[exerciseId] || [])];
      sets.splice(idx, 1);
      return { ...prev, [exerciseId]: sets };
    });
  }

  function saveExerciseOverride(id, fields) {
    setOverrides((prev) => {
      const next = { ...prev, exercises: { ...prev.exercises, [id]: fields } };
      saveOverrides(OVERRIDES_KEY, next);
      return next;
    });
  }
  function resetExerciseOverride(id) {
    setOverrides((prev) => {
      const nextExercises = { ...prev.exercises };
      delete nextExercises[id];
      const next = { ...prev, exercises: nextExercises };
      saveOverrides(OVERRIDES_KEY, next);
      return next;
    });
  }

  async function handleSave() {
    setSaveStatus("saving");
    const categories = EXERCISE_LIBRARY[selectedPhase];
    const allExercises = Object.values(categories).flat();
    const entries = {};
    allExercises.forEach((exc) => {
      const merged = applyExerciseOverride(exc, overrides);
      entries[exc.id] = { name: merged.name, unilateral: merged.unilateral, sets: sessionState[exc.id] || [] };
    });
    const newSession = {
      id: `phase${selectedPhase}`,
      phase: selectedPhase,
      date: new Date().toISOString().slice(0, 10),
      entries,
    };
    const newSessions = [...allSessions.filter((s) => s.phase !== selectedPhase), newSession];
    const ok = await saveLogToStorage(LOG_KEY, { sessions: newSessions });
    if (ok) {
      setAllSessions(newSessions);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
    } else {
      setSaveStatus("error");
    }
  }

  if (loading) {
    return <div style={{ padding: 20, color: "var(--dim)", fontSize: 13 }}>Loading your log…</div>;
  }

  const phaseInfo = OPT_PHASES[selectedPhase - 1];
  const categories = EXERCISE_LIBRARY[selectedPhase];

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>NASM OPT Model</div>
        <div style={{ fontSize: 12, color: "var(--dim)" }}>5-phase Optimum Performance Training periodization</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setView("log")} style={{ flex: 1, padding: "8px", borderRadius: 8, fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: 0.4, cursor: "pointer", background: view === "log" ? "var(--accent)" : "var(--surface)", color: view === "log" ? "var(--bg)" : "var(--text)", border: `1px solid ${view === "log" ? "var(--accent)" : "var(--line)"}` }}>
          Log Workout
        </button>
        <button onClick={() => setView("history")} style={{ flex: 1, padding: "8px", borderRadius: 8, fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: 0.4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: view === "history" ? "var(--accent)" : "var(--surface)", color: view === "history" ? "var(--bg)" : "var(--text)", border: `1px solid ${view === "history" ? "var(--accent)" : "var(--line)"}` }}>
          <History size={13} /> History
        </button>
      </div>

      {view === "log" ? (
        <>
          <PhaseStrip selectedPhase={selectedPhase} onSelect={setSelectedPhase} />
          <div style={{ height: 10 }} />
          <PhaseBanner info={phaseInfo} />
          <div style={{ height: 14 }} />

          {Object.entries(categories).map(([category, exercises]) => {
            const visible = exercises.map((e) => applyExerciseOverride(e, overrides));
            const groups = groupExercises(visible);
            return (
              <div key={category} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--accent)", marginBottom: 8 }}>{category}</div>
                {groups.map((g, gi) =>
                  g.type === "superset" ? (
                    <div key={gi} style={{ border: "1px solid var(--accent)", borderRadius: 12, padding: 8, marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "Oswald, sans-serif", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6, paddingLeft: 4 }}>Superset</div>
                      {g.items.map((exc) => (
                        <ExerciseCard
                          key={exc.id}
                          exercise={exc}
                          sets={sessionState[exc.id] || []}
                          onSetChange={(idx, val) => updateSet(exc.id, idx, val)}
                          onAddSet={() => addSet(exc.id, exc.unilateral)}
                          onRemoveSet={(idx) => removeSet(exc.id, idx)}
                          lastEntry={findLastEntry(allSessions, exc.id, selectedPhase, "phase")}
                          onSaveEdit={(fields) => saveExerciseOverride(exc.id, fields)}
                          onResetEdit={() => resetExerciseOverride(exc.id)}
                          isOverridden={!!overrides.exercises?.[exc.id]}
                          supersetLabel
                        />
                      ))}
                    </div>
                  ) : (
                    <ExerciseCard
                      key={g.items[0].id}
                      exercise={g.items[0]}
                      sets={sessionState[g.items[0].id] || []}
                      onSetChange={(idx, val) => updateSet(g.items[0].id, idx, val)}
                      onAddSet={() => addSet(g.items[0].id, g.items[0].unilateral)}
                      onRemoveSet={(idx) => removeSet(g.items[0].id, idx)}
                      lastEntry={findLastEntry(allSessions, g.items[0].id, selectedPhase, "phase")}
                      onSaveEdit={(fields) => saveExerciseOverride(g.items[0].id, fields)}
                      onResetEdit={() => resetExerciseOverride(g.items[0].id)}
                      isOverridden={!!overrides.exercises?.[g.items[0].id]}
                    />
                  )
                )}
              </div>
            );
          })}

          <button
            onClick={handleSave}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: saveStatus === "saved" ? "var(--good)" : "var(--accent)", color: "var(--bg)", border: "none", borderRadius: 10, padding: "12px", fontFamily: "Oswald, sans-serif", fontSize: 14, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer" }}
          >
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? <><Check size={16} /> Saved</> : saveStatus === "error" ? "Couldn't save — try again" : <><Save size={16} /> Save Workout</>}
          </button>
        </>
      ) : (
        <OptHistoryView
          sessions={allSessions}
          onExport={() => exportCSV(allSessions, "opt-training-log-export.csv", {
            headerPrefix: ["date", "phase"],
            rowPrefix: (s) => [s.date, s.phase],
            sortFn: (a, b) => a.phase - b.phase,
          })}
        />
      )}
    </div>
  );
}
