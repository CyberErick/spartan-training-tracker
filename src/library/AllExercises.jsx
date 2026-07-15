import React, { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import exercises from "./generated/exercises.json";
import taxonomy from "./generated/taxonomy.json";

const PAGE_SIZE = 30;

function titleCase(s) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0) + w.slice(1).toLowerCase());
}

function FilterChips({ label, options, selected, onToggle }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--dim)", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {options.map((opt) => {
          const active = selected === opt.name;
          return (
            <button
              key={opt.name}
              onClick={() => onToggle(active ? null : opt.name)}
              style={{
                flex: "0 0 auto", padding: "6px 10px", borderRadius: 16, cursor: "pointer", whiteSpace: "nowrap",
                fontSize: 11, fontFamily: "Oswald, sans-serif", letterSpacing: 0.3,
                background: active ? "var(--accent)" : "var(--surface2)",
                color: active ? "var(--bg)" : "var(--dim)",
                border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
              }}
            >
              {titleCase(opt.name)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseResultCard({ exercise }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", padding: 10, marginBottom: 10, display: "flex", gap: 10 }}>
      <img
        src={exercise.imageUrl}
        alt={exercise.name}
        loading="lazy"
        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "var(--surface2)" }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", background: "none", border: "none", padding: 0, textAlign: "left" }}
        >
          <div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, letterSpacing: 0.2 }}>{exercise.name}</div>
            <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>
              {(exercise.bodyParts || []).map(titleCase).join(", ")} · {(exercise.equipments || []).map(titleCase).join(", ")}
            </div>
          </div>
          {open ? <ChevronUp size={14} color="var(--dim)" style={{ flexShrink: 0 }} /> : <ChevronDown size={14} color="var(--dim)" style={{ flexShrink: 0 }} />}
        </button>
        {open && (
          <div style={{ marginTop: 6, fontSize: 11, color: "var(--text)", lineHeight: 1.6 }}>
            <div><b>Target:</b> {(exercise.targetMuscles || []).map(titleCase).join(", ") || "—"}</div>
            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div><b>Secondary:</b> {exercise.secondaryMuscles.map(titleCase).join(", ")}</div>
            )}
            <div><b>Type:</b> {titleCase(exercise.exerciseType || "—")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllExercises() {
  const [search, setSearch] = useState("");
  const [bodyPart, setBodyPart] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exercises.filter((e) => {
      if (q && !e.name.toLowerCase().includes(q)) return false;
      if (bodyPart && !(e.bodyParts || []).includes(bodyPart)) return false;
      if (equipment && !(e.equipments || []).includes(equipment)) return false;
      return true;
    });
  }, [search, bodyPart, equipment]);

  const visible = filtered.slice(0, visibleCount);

  function resetFilters() {
    setSearch("");
    setBodyPart(null);
    setEquipment(null);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, letterSpacing: 0.5, textTransform: "uppercase" }}>All Exercises</div>
        <div style={{ fontSize: 12, color: "var(--dim)" }}>{exercises.length} exercises with images, via ExerciseDB</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 10px", marginBottom: 12 }}>
        <Search size={15} color="var(--dim)" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
          placeholder="Search by name…"
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 13 }}
        />
        {(search || bodyPart || equipment) && (
          <button onClick={resetFilters} aria-label="Clear filters" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)", display: "flex" }}>
            <X size={15} />
          </button>
        )}
      </div>

      <FilterChips label="Body Part" options={taxonomy.bodyParts} selected={bodyPart} onToggle={(v) => { setBodyPart(v); setVisibleCount(PAGE_SIZE); }} />
      <FilterChips label="Equipment" options={taxonomy.equipments} selected={equipment} onToggle={(v) => { setEquipment(v); setVisibleCount(PAGE_SIZE); }} />

      <div style={{ fontSize: 11, color: "var(--dim)", margin: "10px 0" }}>{filtered.length} result{filtered.length === 1 ? "" : "s"}</div>

      {visible.map((exc) => <ExerciseResultCard key={exc.exerciseId} exercise={exc} />)}

      {filtered.length === 0 && (
        <p style={{ color: "var(--dim)", fontSize: 13, textAlign: "center", padding: "24px 0" }}>No exercises match those filters.</p>
      )}

      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          style={{ width: "100%", padding: "10px", borderRadius: 8, cursor: "pointer", background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--line)", fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.3, marginTop: 4 }}
        >
          Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
        </button>
      )}
    </div>
  );
}
