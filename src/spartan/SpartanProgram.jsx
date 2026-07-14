import React, { useState, useEffect } from "react";
import {
  Save, Download, ChevronDown, ChevronUp,
  Shield, Leaf, Flame, Check, Info, History, ListChecks
} from "lucide-react";
import { ExerciseCard } from "../shared/components.jsx";
import {
  emptySet, isUnilateralSet, loadOverrides, saveOverrides, applyExerciseOverride,
  loadLog, saveLogToStorage, findLastEntry, exportCSV, groupExercises,
} from "../shared/helpers.js";
import {
  WEEK_PLAN, DAY_META, CORE_ROUTINE, CORE_ROUTINE_NOTE, weekParityOf, PROGRAM,
  FLEXIBILITY_PROTOCOL, FLEXIBILITY_OPTIONAL, STABILITY_PROTOCOL, WEEK5_SCHEDULE, CONTENT_LABEL,
} from "./data.js";

const OVERRIDES_KEY = "program-overrides";
const LOG_KEY = "training-log";

const PHASE_COLOR = { build: "var(--accent)", recovery: "var(--good)", intensify: "var(--hot)", taper: "var(--dim)" };
const PHASE_ICON = { build: Flame, recovery: Leaf, intensify: Flame, taper: ChevronDown };

function WeekStrip({ selectedWeek, onSelect }) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 6 }}>
      <div style={{ display: "flex", gap: 6, minWidth: "max-content", padding: "2px 2px" }}>
        {WEEK_PLAN.map((w) => {
          const active = w.week === selectedWeek;
          return (
            <button
              key={w.week}
              onClick={() => onSelect(w.week)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                background: active ? "var(--surface2)" : "transparent",
                border: active ? "1px solid var(--accent)" : "1px solid var(--line)",
                borderRadius: 8, padding: "6px 10px", cursor: "pointer", minWidth: 46,
              }}
            >
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: 0.5, color: active ? "var(--text)" : "var(--dim)" }}>
                W{w.week}
              </span>
              <span style={{ width: 18, height: 3, borderRadius: 2, background: PHASE_COLOR[w.phase] }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekBanner({ info }) {
  const Icon = PHASE_ICON[info.phase] || Info;
  return (
    <div style={{ border: "1px solid var(--line)", borderLeft: `3px solid ${PHASE_COLOR[info.phase]}`, borderRadius: 8, padding: "10px 14px", background: "var(--surface)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={16} color={PHASE_COLOR[info.phase]} />
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Week {info.week} · {info.block}
          </span>
          <span style={{ color: "var(--dim)", fontSize: 13 }}>{info.dates}</span>
        </div>
        {!info.recoveryWeek && (
          <div style={{ display: "flex", gap: 14, fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
            <span>Main RIR <b style={{ color: "var(--text)" }}>{info.mainRIR}</b></span>
            <span>Acc RIR <b style={{ color: "var(--text)" }}>{info.accRIR}</b></span>
            <span>Vol <b style={{ color: "var(--text)" }}>{info.volume}</b></span>
          </div>
        )}
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--dim)", lineHeight: 1.5 }}>{info.note}</p>
    </div>
  );
}

function DayTabs({ selectedDay, onSelect, count }) {
  const days = count === 7 ? Array.from({ length: 7 }, (_, i) => ({ id: i + 1, name: `Day ${i + 1}`, style: "" })) : DAY_META;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 6 }}>
      {days.map((d) => {
        const active = d.id === selectedDay;
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 4px",
              borderRadius: 8, cursor: "pointer",
              background: active ? "var(--accent)" : "var(--surface)",
              border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
            }}
          >
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, color: active ? "var(--bg)" : "var(--text)" }}>{d.name}</span>
            {d.style && <span style={{ fontSize: 10, color: active ? "var(--bg)" : "var(--dim)", textAlign: "center" }}>{d.style}</span>}
          </button>
        );
      })}
    </div>
  );
}

function CoreRoutineSection({ items, sessionState, onSetChange, onAddSet, onRemoveSet, allSessions, selectedWeek, onSaveEdit, onResetEdit, overrides }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: "1px solid var(--good)", borderRadius: 10, background: "var(--surface)", padding: 12, marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Oswald, sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>
          <Shield size={14} color="var(--good)" /> Core Routine
        </span>
        {open ? <ChevronUp size={16} color="var(--dim)" /> : <ChevronDown size={16} color="var(--dim)" />}
      </button>
      {open && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 11, color: "var(--dim)", margin: "0 0 8px" }}>{CORE_ROUTINE_NOTE}</p>
          {items.map((exc) => (
            <ExerciseCard
              key={exc.id}
              exercise={exc}
              sets={sessionState[exc.id] || []}
              onSetChange={(idx, val) => onSetChange(exc.id, idx, val)}
              onAddSet={() => onAddSet(exc.id, exc.unilateral)}
              onRemoveSet={(idx) => onRemoveSet(exc.id, idx)}
              lastEntry={findLastEntry(allSessions, exc.id, selectedWeek, "week")}
              onSaveEdit={(fields) => onSaveEdit(exc.id, fields)}
              onResetEdit={() => onResetEdit(exc.id)}
              isOverridden={!!overrides.exercises?.[exc.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StretchChecklist({ items, done, onToggle, finisher, finisherDone, onToggleFinisher, footnote, footwork }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <ListChecks size={15} color="var(--good)" />
        <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>{finisher ? "Finisher & Stretch" : "Stretch"}</span>
      </div>
      {footwork && <p style={{ fontSize: 12, color: "var(--dim)", margin: "0 0 8px", lineHeight: 1.5 }}>{footwork}</p>}
      {finisher && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "5px 0", cursor: "pointer" }}>
          <input type="checkbox" checked={finisherDone} onChange={onToggleFinisher} />
          {finisher}
        </label>
      )}
      {items.map((s) => (
        <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "5px 0", cursor: "pointer", color: done.includes(s) ? "var(--dim)" : "var(--text)" }}>
          <input type="checkbox" checked={done.includes(s)} onChange={() => onToggle(s)} />
          <span style={{ textDecoration: done.includes(s) ? "line-through" : "none" }}>{s}</span>
        </label>
      ))}
      {footnote && <p style={{ fontSize: 11, color: "var(--dim)", marginTop: 8, fontStyle: "italic" }}>{footnote}</p>}
    </div>
  );
}

function HevyPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", padding: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Oswald, sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>
          <Info size={15} color="var(--accent)" /> Using this alongside Hevy
        </span>
        {open ? <ChevronUp size={16} color="var(--dim)" /> : <ChevronDown size={16} color="var(--dim)" />}
      </button>
      {open && (
        <div style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.6, marginTop: 10 }}>
          <p style={{ margin: "0 0 8px" }}>
            Hevy is built for fast in-session logging — rest timers, automatic "previous" reference, watch sync, and native superset support. Use it for the straightforward strength sets during your session.
          </p>
          <p style={{ margin: "0 0 8px" }}>
            Use this app for what Hevy doesn't model: this week's RIR target, the strength-at-length notes, the Core Routine and Week 5 recovery content, and quality-based logging on athletic days.
          </p>
          <p style={{ margin: 0 }}>
            RIR vs. RPE: this app logs RIR, Hevy logs RPE — they're inverse on a 0–10 scale (RPE ≈ 10 − RIR). Use <b style={{ color: "var(--text)" }}>Export CSV</b> in the History tab to keep your own copy of everything logged here.
          </p>
        </div>
      )}
    </div>
  );
}

function HistoryView({ sessions, onExport }) {
  const sorted = sessions.slice().sort((a, b) => b.week - a.week || b.day - a.day);
  return (
    <div>
      <button onClick={onExport} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "var(--bg)", border: "none", borderRadius: 8, padding: "9px 14px", fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: 0.4, cursor: "pointer", marginBottom: 14 }}>
        <Download size={14} /> Export CSV
      </button>
      {sorted.length === 0 && <p style={{ color: "var(--dim)", fontSize: 13 }}>No sessions saved yet — log a workout and it'll show up here.</p>}
      {sorted.map((s) => {
        const dayMeta = DAY_META[s.day - 1];
        const setCount = Object.values(s.entries || {}).reduce((acc, e) => acc + (e.sets || []).filter((x) =>
          isUnilateralSet(x) ? (x.left?.load || x.left?.reps || x.right?.load || x.right?.reps) : (x.load || x.reps)
        ).length, 0);
        return (
          <div key={s.id} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13 }}>Week {s.week} · Day {s.day} — {dayMeta ? `${dayMeta.name} (${dayMeta.style})` : ""}</div>
              <div style={{ fontSize: 11, color: "var(--dim)" }}>{s.date} · {setCount} sets logged</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProtocolBlock({ sections, optionalNote }) {
  return (
    <div>
      {sections.map((sec) => (
        <div key={sec.region} style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", padding: 12, marginBottom: 10 }}>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--accent)", marginBottom: 6 }}>{sec.region}</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text)", lineHeight: 1.8 }}>
            {sec.items.map((it) => <li key={it}>{it}</li>)}
          </ul>
        </div>
      ))}
      {optionalNote && <p style={{ fontSize: 12, color: "var(--dim)", fontStyle: "italic", lineHeight: 1.5 }}>{optionalNote}</p>}
    </div>
  );
}

function Week5View({ selectedRecoveryDay, onSelectDay }) {
  const info = WEEK5_SCHEDULE[selectedRecoveryDay - 1];
  return (
    <div>
      <DayTabs selectedDay={selectedRecoveryDay} onSelect={onSelectDay} count={7} />
      <div style={{ height: 12 }} />
      <div style={{ border: "1px solid var(--good)", borderRadius: 8, padding: "10px 14px", background: "var(--surface)", marginBottom: 12 }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.4 }}>{CONTENT_LABEL[info.content]}</div>
        <p style={{ fontSize: 13, color: "var(--dim)", margin: "4px 0 0" }}>{info.extra}</p>
      </div>
      {(info.content === "flexibility" || info.content === "both-short") && (
        <>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>Flexibility Protocol</div>
          <ProtocolBlock sections={FLEXIBILITY_PROTOCOL} optionalNote={FLEXIBILITY_OPTIONAL} />
        </>
      )}
      {(info.content === "stability" || info.content === "both-short") && (
        <>
          <div style={{ height: 8 }} />
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>Stability Protocol</div>
          <ProtocolBlock sections={STABILITY_PROTOCOL} />
        </>
      )}
      {info.content === "active-rest" && (
        <p style={{ fontSize: 13, color: "var(--dim)" }}>No structured protocol today — walk, light mobility only. This is deliberate recovery, not a day to fill with extra work.</p>
      )}
      {info.content === "rest" && (
        <p style={{ fontSize: 13, color: "var(--dim)" }}>Full rest. Nothing structured today.</p>
      )}
    </div>
  );
}

export default function SpartanProgram() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedRecoveryDay, setSelectedRecoveryDay] = useState(1);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionState, setSessionState] = useState({});
  const [stretchDone, setStretchDone] = useState([]);
  const [finisherDone, setFinisherDone] = useState(false);
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
    const program = PROGRAM[selectedDay];
    const parity = weekParityOf(selectedWeek);
    const existing = allSessions.find((s) => s.week === selectedWeek && s.day === selectedDay);
    const initial = {};
    const seedExercise = (exc) => {
      const merged = applyExerciseOverride(exc, overrides);
      const found = existing && existing.entries && existing.entries[exc.id];
      initial[exc.id] = found && found.sets && found.sets.length ? found.sets : Array.from({ length: Math.max(parseInt(merged.sets, 10) || 3, 1) }, () => emptySet(merged.unilateral));
    };
    program.main
      .filter((exc) => !exc.weekParity || exc.weekParity === parity)
      .forEach(seedExercise);
    if (program.coreRoutine) {
      CORE_ROUTINE.forEach(seedExercise);
    }
    setSessionState(initial);
    setStretchDone((existing && existing.stretchDone) || []);
    setFinisherDone((existing && existing.finisherDone) || false);
  }, [selectedWeek, selectedDay, loading]); // eslint-disable-line

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
  function toggleStretch(name) {
    setStretchDone((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));
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
    const program = PROGRAM[selectedDay];
    const parity = weekParityOf(selectedWeek);
    const entries = {};
    const captureExercise = (exc) => {
      const merged = applyExerciseOverride(exc, overrides);
      entries[exc.id] = { name: merged.name, unilateral: merged.unilateral, sets: sessionState[exc.id] || [] };
    };
    program.main
      .filter((exc) => !exc.weekParity || exc.weekParity === parity)
      .forEach(captureExercise);
    if (program.coreRoutine) {
      CORE_ROUTINE.forEach(captureExercise);
    }
    const dayMeta = DAY_META[selectedDay - 1];
    const newSession = {
      id: `w${selectedWeek}d${selectedDay}`,
      week: selectedWeek,
      day: selectedDay,
      dayName: `${dayMeta.name} — ${dayMeta.style}`,
      date: new Date().toISOString().slice(0, 10),
      entries,
      stretchDone,
      finisherDone,
    };
    const newSessions = [...allSessions.filter((s) => !(s.week === selectedWeek && s.day === selectedDay)), newSession];
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

  const weekInfo = WEEK_PLAN[selectedWeek - 1];
  const isRecoveryWeek = !!weekInfo.recoveryWeek;
  const program = isRecoveryWeek ? null : PROGRAM[selectedDay];
  const parity = weekParityOf(selectedWeek);
  const visibleMain = program
    ? program.main.filter((e) => !e.weekParity || e.weekParity === parity).map((e) => applyExerciseOverride(e, overrides))
    : [];
  const groups = program ? groupExercises(visibleMain) : [];

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>Spartan Training Tracker</div>
        <div style={{ fontSize: 12, color: "var(--dim)" }}>6-day cycle · 8-week progression · race week Sep 8–14</div>
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
          <WeekStrip selectedWeek={selectedWeek} onSelect={setSelectedWeek} />
          <div style={{ height: 10 }} />
          <WeekBanner info={weekInfo} />
          <div style={{ height: 12 }} />

          {isRecoveryWeek ? (
            <Week5View selectedRecoveryDay={selectedRecoveryDay} onSelectDay={setSelectedRecoveryDay} />
          ) : (
            <>
              <DayTabs selectedDay={selectedDay} onSelect={setSelectedDay} count={6} />
              <div style={{ height: 14 }} />

              <details style={{ marginBottom: 12 }}>
                <summary style={{ cursor: "pointer", fontSize: 12, color: "var(--dim)", fontFamily: "Oswald, sans-serif", letterSpacing: 0.4, textTransform: "uppercase" }}>Warm-up</summary>
                <ul style={{ fontSize: 12, color: "var(--dim)", marginTop: 6, paddingLeft: 18, lineHeight: 1.7 }}>
                  {program.warmup.map((w) => <li key={w}>{w}</li>)}
                </ul>
              </details>

              {program.coreRoutine && (
                <CoreRoutineSection
                  items={CORE_ROUTINE.map((c) => applyExerciseOverride(c, overrides))}
                  sessionState={sessionState}
                  onSetChange={updateSet}
                  onAddSet={addSet}
                  onRemoveSet={removeSet}
                  allSessions={allSessions}
                  selectedWeek={selectedWeek}
                  onSaveEdit={saveExerciseOverride}
                  onResetEdit={resetExerciseOverride}
                  overrides={overrides}
                />
              )}

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
                        lastEntry={findLastEntry(allSessions, exc.id, selectedWeek, "week")}
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
                    lastEntry={findLastEntry(allSessions, g.items[0].id, selectedWeek, "week")}
                    onSaveEdit={(fields) => saveExerciseOverride(g.items[0].id, fields)}
                    onResetEdit={() => resetExerciseOverride(g.items[0].id)}
                    isOverridden={!!overrides.exercises?.[g.items[0].id]}
                  />
                )
              )}

              <div style={{ height: 4 }} />
              <StretchChecklist
                items={program.stretch}
                done={stretchDone}
                onToggle={toggleStretch}
                finisher={program.finisher}
                finisherDone={finisherDone}
                onToggleFinisher={() => setFinisherDone(!finisherDone)}
                footnote={program.footnote}
                footwork={program.footwork}
              />

              <div style={{ height: 14 }} />
              <button
                onClick={handleSave}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: saveStatus === "saved" ? "var(--good)" : "var(--accent)", color: "var(--bg)", border: "none", borderRadius: 10, padding: "12px", fontFamily: "Oswald, sans-serif", fontSize: 14, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer" }}
              >
                {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? <><Check size={16} /> Saved</> : saveStatus === "error" ? "Couldn't save — try again" : <><Save size={16} /> Save Workout</>}
              </button>
            </>
          )}

          <div style={{ height: 14 }} />
          <HevyPanel />
        </>
      ) : (
        <HistoryView sessions={allSessions} onExport={() => exportCSV(allSessions, "training-log-export.csv")} />
      )}
    </div>
  );
}
