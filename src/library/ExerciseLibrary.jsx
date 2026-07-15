import React, { useState } from "react";
import { ChevronDown, ChevronUp, Wind } from "lucide-react";
import { LIBRARY_CATEGORIES, LIBRARY_EXERCISES } from "./data.js";

function CategoryStrip({ selected, onSelect }) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 6 }}>
      <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
        {LIBRARY_CATEGORIES.map((c) => {
          const active = c.id === selected;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              style={{
                flex: "0 0 auto", padding: "8px 12px", borderRadius: 20, cursor: "pointer",
                fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.3, whiteSpace: "nowrap",
                background: active ? "var(--accent)" : "var(--surface)",
                color: active ? "var(--bg)" : "var(--dim)",
                border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LibraryExerciseCard({ exercise }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", padding: 12, marginBottom: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "none", border: "none", padding: 0, textAlign: "left" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, letterSpacing: 0.2 }}>{exercise.name}</span>
            {exercise.unilateral && (
              <span style={{ fontSize: 10, color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: 999, padding: "1px 6px" }}>per side</span>
            )}
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--dim)", lineHeight: 1.5 }}>{exercise.description}</p>
        </div>
        {open ? <ChevronUp size={16} color="var(--dim)" style={{ flexShrink: 0, marginLeft: 8 }} /> : <ChevronDown size={16} color="var(--dim)" style={{ flexShrink: 0, marginLeft: 8 }} />}
      </button>

      {open && (
        <div style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--accent)", marginBottom: 3 }}>Purpose</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{exercise.purpose}</p>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--accent)", marginBottom: 3 }}>Form Cues</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text)", lineHeight: 1.7 }}>
              {exercise.formCues.map((cue) => <li key={cue}>{cue}</li>)}
            </ul>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start", background: "var(--surface2)", borderRadius: 8, padding: 8 }}>
            <Wind size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 12, color: "var(--dim)", lineHeight: 1.5 }}><b style={{ color: "var(--text)" }}>Breathing:</b> {exercise.breathingCue}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState(LIBRARY_CATEGORIES[0].id);
  const category = LIBRARY_CATEGORIES.find((c) => c.id === selectedCategory);
  const exercises = LIBRARY_EXERCISES.filter((e) => e.category === selectedCategory);

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>Exercise Library</div>
        <div style={{ fontSize: 12, color: "var(--dim)" }}>14 training categories · descriptions, purpose, form &amp; breathing cues</div>
      </div>

      <CategoryStrip selected={selectedCategory} onSelect={setSelectedCategory} />
      <div style={{ height: 10 }} />

      <div style={{ border: "1px solid var(--line)", borderLeft: "3px solid var(--accent)", borderRadius: 8, padding: "10px 14px", background: "var(--surface)", marginBottom: 14 }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, textTransform: "uppercase", letterSpacing: 0.4 }}>{category.name}</div>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--dim)", lineHeight: 1.5 }}>{category.description}</p>
      </div>

      {exercises.map((exc) => <LibraryExerciseCard key={exc.id} exercise={exc} />)}

      <p style={{ fontSize: 11, color: "var(--dim)", fontStyle: "italic", marginTop: 8 }}>
        Reference only — this library isn't logged directly. Use the exercise-editing feature in the Spartan or OPT programs to swap any of these in.
      </p>
    </div>
  );
}
