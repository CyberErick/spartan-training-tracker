export function emptySide() { return { load: "", reps: "" }; }

export function emptySet(unilateral) {
  return unilateral ? { left: emptySide(), right: emptySide(), rir: null } : { load: "", reps: "", rir: null };
}

export function isUnilateralSet(set) {
  return !!set && (set.left !== undefined || set.right !== undefined);
}

export function formatSetsSummary(sets) {
  const filled = (sets || []).filter((s) =>
    isUnilateralSet(s)
      ? (s.left?.load || s.left?.reps || s.right?.load || s.right?.reps)
      : (s.load || s.reps)
  );
  if (!filled.length) return "—";
  return filled
    .map((s) =>
      isUnilateralSet(s)
        ? `L ${s.left?.load || "–"}×${s.left?.reps || "–"} / R ${s.right?.load || "–"}×${s.right?.reps || "–"}`
        : `${s.load || "–"}×${s.reps || "–"}`
    )
    .join(", ");
}

export function rirToRpe(rir) {
  if (rir === null || rir === "") return "—";
  if (rir === "5+") return "≤5";
  const n = parseInt(rir, 10);
  return isNaN(n) ? "—" : Math.max(10 - n, 5);
}

export function loadOverrides(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { exercises: {}, core: {} };
  } catch (e) {
    return { exercises: {}, core: {} };
  }
}

export function saveOverrides(storageKey, overrides) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(overrides));
    return true;
  } catch (e) {
    return false;
  }
}

export function applyExerciseOverride(exc, overrides) {
  const o = overrides?.exercises?.[exc.id];
  return o ? { ...exc, ...o } : exc;
}

export function applyCoreOverride(item, overrides) {
  const o = overrides?.core?.[item.id];
  return o ? { ...item, ...o } : item;
}

export async function loadLog(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { sessions: [] };
  } catch (e) {
    return { sessions: [] };
  }
}

export async function saveLogToStorage(storageKey, log) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(log));
    return true;
  } catch (e) {
    return false;
  }
}

export function exportCSV(sessions, filename, options = {}) {
  const headerPrefix = options.headerPrefix || ["date", "week", "day"];
  const rowPrefix = options.rowPrefix || ((s) => [s.date, s.week, s.day]);
  const sortFn = options.sortFn || ((a, b) => (a.week - b.week) || (a.day - b.day));
  const rows = [[...headerPrefix, "exercise", "set", "side", "load", "reps_or_duration", "rir"]];
  sessions
    .slice()
    .sort(sortFn)
    .forEach((s) => {
      const prefix = rowPrefix(s);
      Object.values(s.entries || {}).forEach((entry) => {
        (entry.sets || []).forEach((set, i) => {
          if (isUnilateralSet(set)) {
            if (set.left && (set.left.load || set.left.reps)) {
              rows.push([...prefix, entry.name, i + 1, "L", set.left.load, set.left.reps, set.rir ?? ""]);
            }
            if (set.right && (set.right.load || set.right.reps)) {
              rows.push([...prefix, entry.name, i + 1, "R", set.right.load, set.right.reps, set.rir ?? ""]);
            }
          } else if (set.load || set.reps) {
            rows.push([...prefix, entry.name, i + 1, "", set.load, set.reps, set.rir ?? ""]);
          }
        });
      });
    });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function findLastEntry(sessions, exerciseId, excludeValue, keyField = "week") {
  const matches = sessions
    .filter((s) => s[keyField] !== excludeValue && s.entries && s.entries[exerciseId] && (s.entries[exerciseId].sets || []).some((st) =>
      isUnilateralSet(st) ? (st.left?.load || st.left?.reps || st.right?.load || st.right?.reps) : (st.load || st.reps)
    ))
    .sort((a, b) => b[keyField] - a[keyField]);
  return matches[0] ? matches[0].entries[exerciseId] : null;
}

export function groupExercises(main) {
  const groups = [];
  let i = 0;
  while (i < main.length) {
    const item = main[i];
    if (item.superset) {
      const group = [item];
      let j = i + 1;
      while (j < main.length && main[j].superset === item.superset) {
        group.push(main[j]);
        j++;
      }
      groups.push({ type: "superset", items: group });
      i = j;
    } else {
      groups.push({ type: "single", items: [item] });
      i++;
    }
  }
  return groups;
}
