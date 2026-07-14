import React, { useState } from "react";
import { ChevronDown, ChevronUp, Shield, Plus, X, Pencil } from "lucide-react";
import { emptySide, formatSetsSummary, rirToRpe } from "./helpers.js";

export function EffortPicker({ value, onChange, type }) {
  const options = type === "quality" ? ["Crisp", "Slowing", "Grinding"] : ["0", "1", "2", "3", "4", "5+"];
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(value === opt ? null : opt)}
          style={{
            fontSize: 11, padding: "4px 8px", borderRadius: 6, cursor: "pointer",
            fontFamily: "JetBrains Mono, monospace",
            background: value === opt ? "var(--accent)" : "var(--surface2)",
            color: value === opt ? "var(--bg)" : "var(--dim)",
            border: "1px solid var(--line)",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const setInputStyle = { width: 56, background: "var(--surface2)", border: "1px solid var(--line)", borderRadius: 6, padding: "6px 8px", color: "var(--text)", fontFamily: "JetBrains Mono, monospace", fontSize: 13 };

export function SetRow({ idx, set, repUnit, onChange, onRemove, effortType, unilateral }) {
  const repsPlaceholder = repUnit === "sec" ? "sec" : repUnit === "m" ? "m" : "reps";

  if (unilateral) {
    const left = set.left || emptySide();
    const right = set.right || emptySide();
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
        <span style={{ width: 22, fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--dim)" }}>{idx + 1}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "var(--dim)", fontFamily: "JetBrains Mono, monospace" }}>L</span>
          <input
            type="number" inputMode="decimal" placeholder="load"
            value={left.load}
            onChange={(e) => onChange({ ...set, left: { ...left, load: e.target.value } })}
            style={{ ...setInputStyle, width: 52 }}
          />
          <input
            type="number" inputMode="decimal" placeholder={repsPlaceholder}
            value={left.reps}
            onChange={(e) => onChange({ ...set, left: { ...left, reps: e.target.value } })}
            style={{ ...setInputStyle, width: 48 }}
          />
        </div>
        <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "var(--dim)", fontFamily: "JetBrains Mono, monospace" }}>R</span>
          <input
            type="number" inputMode="decimal" placeholder="load"
            value={right.load}
            onChange={(e) => onChange({ ...set, right: { ...right, load: e.target.value } })}
            style={{ ...setInputStyle, width: 52 }}
          />
          <input
            type="number" inputMode="decimal" placeholder={repsPlaceholder}
            value={right.reps}
            onChange={(e) => onChange({ ...set, right: { ...right, reps: e.target.value } })}
            style={{ ...setInputStyle, width: 48 }}
          />
        </div>
        <EffortPicker value={set.rir} onChange={(v) => onChange({ ...set, rir: v })} type={effortType} />
        {effortType === "rir" && set.rir && (
          <span style={{ fontSize: 10, color: "var(--dim)", fontFamily: "JetBrains Mono, monospace" }}>RPE {rirToRpe(set.rir)}</span>
        )}
        <button onClick={onRemove} style={{ marginLeft: "auto", color: "var(--dim)", cursor: "pointer" }} aria-label="Remove set">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
      <span style={{ width: 22, fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--dim)" }}>{idx + 1}</span>
      <input
        type="number" inputMode="decimal" placeholder="load"
        value={set.load}
        onChange={(e) => onChange({ ...set, load: e.target.value })}
        style={{ ...setInputStyle, width: 64 }}
      />
      <input
        type="number" inputMode="decimal" placeholder={repsPlaceholder}
        value={set.reps}
        onChange={(e) => onChange({ ...set, reps: e.target.value })}
        style={setInputStyle}
      />
      <EffortPicker value={set.rir} onChange={(v) => onChange({ ...set, rir: v })} type={effortType} />
      {effortType === "rir" && set.rir && (
        <span style={{ fontSize: 10, color: "var(--dim)", fontFamily: "JetBrains Mono, monospace" }}>RPE {rirToRpe(set.rir)}</span>
      )}
      <button onClick={onRemove} style={{ marginLeft: "auto", color: "var(--dim)", cursor: "pointer" }} aria-label="Remove set">
        <X size={14} />
      </button>
    </div>
  );
}

export const editLabelStyle = { display: "flex", flexDirection: "column", gap: 3, fontSize: 11, color: "var(--dim)", flex: 1 };
export const editInputStyle = { background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 6, padding: "6px 8px", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: 13 };
export const editBtnPrimary = { background: "var(--accent)", color: "var(--bg)", border: "none", borderRadius: 6, padding: "6px 12px", fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.3, cursor: "pointer" };
export const editBtnSecondary = { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--line)", borderRadius: 6, padding: "6px 12px", fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.3, cursor: "pointer" };

export function ExerciseEditForm({ exercise, onSave, onCancel, onReset, isOverridden }) {
  const [form, setForm] = useState({
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    repUnit: exercise.repUnit || "reps",
    load: exercise.load,
    loadUnit: exercise.loadUnit,
    rest: exercise.rest,
    unilateral: !!exercise.unilateral,
  });
  return (
    <div style={{ marginTop: 8, border: "1px solid var(--accent)", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={editLabelStyle}>
        Exercise name
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={editInputStyle} />
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <label style={editLabelStyle}>
          Sets
          <input value={form.sets} onChange={(e) => setForm({ ...form, sets: e.target.value })} style={editInputStyle} />
        </label>
        <label style={editLabelStyle}>
          {form.repUnit === "sec" ? "Time (per set)" : "Reps"}
          <input value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} style={editInputStyle} />
        </label>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 11, color: "var(--dim)" }}>Logged as</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => setForm({ ...form, repUnit: "reps" })}
            style={{ flex: 1, padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "JetBrains Mono, monospace", fontSize: 12, background: form.repUnit !== "sec" ? "var(--accent)" : "var(--surface2)", color: form.repUnit !== "sec" ? "var(--bg)" : "var(--dim)", border: "1px solid var(--line)" }}
          >
            Sets &amp; Reps
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, repUnit: "sec" })}
            style={{ flex: 1, padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "JetBrains Mono, monospace", fontSize: 12, background: form.repUnit === "sec" ? "var(--accent)" : "var(--surface2)", color: form.repUnit === "sec" ? "var(--bg)" : "var(--dim)", border: "1px solid var(--line)" }}
          >
            Sets &amp; Time
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <label style={editLabelStyle}>
          Target load
          <input value={form.load} onChange={(e) => setForm({ ...form, load: e.target.value })} style={editInputStyle} />
        </label>
        <label style={editLabelStyle}>
          Unit
          <input value={form.loadUnit} onChange={(e) => setForm({ ...form, loadUnit: e.target.value })} style={editInputStyle} />
        </label>
        <label style={editLabelStyle}>
          Rest
          <input value={form.rest} onChange={(e) => setForm({ ...form, rest: e.target.value })} style={editInputStyle} />
        </label>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text)", cursor: "pointer" }}>
        <input type="checkbox" checked={form.unilateral} onChange={(e) => setForm({ ...form, unilateral: e.target.checked })} />
        Log per side (separate left / right weight &amp; reps)
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
        <button onClick={() => onSave(form)} style={editBtnPrimary}>Save</button>
        <button onClick={onCancel} style={editBtnSecondary}>Cancel</button>
        {isOverridden && <button onClick={onReset} style={{ ...editBtnSecondary, color: "var(--hot)" }}>Reset to default</button>}
      </div>
    </div>
  );
}

export function ExerciseCard({ exercise, sets, onSetChange, onAddSet, onRemoveSet, lastEntry, supersetLabel, onSaveEdit, onResetEdit, isOverridden }) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);

  function handleSave(form) {
    onSaveEdit(form);
    setEditing(false);
  }
  function handleReset() {
    onResetEdit();
    setEditing(false);
  }

  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", padding: 12, marginBottom: supersetLabel ? 6 : 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
        <button onClick={() => setOpen(!open)} style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", textAlign: "left", background: "none", border: "none", padding: 0 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, letterSpacing: 0.2 }}>{exercise.name}</span>
              {exercise.isBackSafety && (
                <span title="Back-safety exception — always conservative" style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: "var(--hot)", border: "1px solid var(--hot)", borderRadius: 999, padding: "1px 6px" }}>
                  <Shield size={10} /> back
                </span>
              )}
              {exercise.tag === "length" && (
                <span title="Strength-at-length addition" style={{ fontSize: 10, color: "var(--good)", border: "1px solid var(--good)", borderRadius: 999, padding: "1px 6px" }}>
                  length
                </span>
              )}
              {exercise.optional && (
                <span style={{ fontSize: 10, color: "var(--dim)", border: "1px solid var(--line)", borderRadius: 999, padding: "1px 6px" }}>
                  optional
                </span>
              )}
              {exercise.unilateral && (
                <span title="Logged per side — left and right tracked separately" style={{ fontSize: 10, color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: 999, padding: "1px 6px" }}>
                  per side
                </span>
              )}
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--dim)", marginTop: 3 }}>
              {exercise.sets}×{exercise.reps}{exercise.repUnit && exercise.repUnit !== "reps" ? ` ${exercise.repUnit}` : ""} {exercise.load ? `@ ${exercise.load} ${exercise.loadUnit}` : ""} · rest {exercise.rest}
            </div>
            {lastEntry && (
              <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 3 }}>
                Last: {formatSetsSummary(lastEntry.sets)}
              </div>
            )}
          </div>
          {open ? <ChevronUp size={16} color="var(--dim)" /> : <ChevronDown size={16} color="var(--dim)" />}
        </button>
        <button onClick={() => setEditing(!editing)} aria-label="Edit exercise" style={{ color: editing ? "var(--accent)" : "var(--dim)", cursor: "pointer", padding: 4, flexShrink: 0 }}>
          <Pencil size={14} />
        </button>
      </div>

      {editing && (
        <ExerciseEditForm
          exercise={exercise}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          onReset={handleReset}
          isOverridden={isOverridden}
        />
      )}

      {open && !editing && (
        <div style={{ marginTop: 8 }}>
          {exercise.notes && <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.5, margin: "0 0 8px" }}>{exercise.notes}</p>}
          {exercise.isBackSafety && (
            <p style={{ fontSize: 12, color: "var(--hot)", margin: "0 0 8px", display: "flex", gap: 6, alignItems: "flex-start" }}>
              <Shield size={13} style={{ marginTop: 2, flexShrink: 0 }} />
              Prioritize control and pain-free reps over load here, every week, regardless of the target above.
            </p>
          )}
          {sets.map((set, i) => (
            <SetRow
              key={i}
              idx={i}
              set={set}
              repUnit={exercise.repUnit}
              effortType={exercise.effortType}
              unilateral={exercise.unilateral}
              onChange={(val) => onSetChange(i, val)}
              onRemove={() => onRemoveSet(i)}
            />
          ))}
          <button onClick={onAddSet} style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>
            <Plus size={13} /> Add set
          </button>
        </div>
      )}
    </div>
  );
}
