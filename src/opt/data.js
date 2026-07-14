// NASM Optimum Performance Training (OPT) model — 5 phases.
// Reps/intensity ranges per https://www.nasm.org/certified-personal-trainer/the-opt-model,
// combined with the standard NASM sets/tempo/rest chart for each phase.

export const OPT_PHASES = [
  {
    phase: 1,
    name: "Stabilization Endurance",
    goal: "Build stabilization strength, muscular endurance, and neuromuscular efficiency. Correct form and technique come before load.",
    reps: "12–20",
    sets: "1–3",
    tempo: "Slow, controlled (~4/2/1)",
    rest: "0–90 sec",
    intensity: "Low load, high stability demand",
    focus: "Controlled instability — stability-ball, single-leg, and balance work with light loads. Suitable as a base phase for new trainees.",
  },
  {
    phase: 2,
    name: "Strength Endurance",
    goal: "\"Gateway phase\" — acclimate to heavier loads and higher intensity via supersets pairing a strength exercise with a stabilization exercise.",
    reps: "8–12 (strength) + 12–20 (stabilization), superset",
    sets: "2–4",
    tempo: "Medium, controlled",
    rest: "0–60 sec",
    intensity: "Moderate",
    focus: "Superset format: a traditional strength movement immediately followed by a stabilization variant of a similar pattern.",
  },
  {
    phase: 3,
    name: "Muscular Development (Hypertrophy)",
    goal: "Maximize muscle growth through high training volume and moderate-to-high intensity.",
    reps: "6–12",
    sets: "3–6",
    tempo: "Medium, controlled",
    rest: "0–60 sec",
    intensity: "75–85% of 1RM",
    focus: "Standard resistance training — compound and isolation movements, higher volume.",
  },
  {
    phase: 4,
    name: "Maximal Strength",
    goal: "Increase maximal force production through neuromuscular adaptation.",
    reps: "1–5",
    sets: "4–6",
    tempo: "Fast, explosive concentric / controlled eccentric",
    rest: "3–5 min",
    intensity: "85–100% of 1RM",
    focus: "Heavy compound, multi-joint lifts. Longer rest is required to sustain output across sets.",
  },
  {
    phase: 5,
    name: "Power",
    goal: "Increase rate of force production — combining high force with high velocity.",
    reps: "1–5 (strength) + 8–10 (power/explosive)",
    sets: "3–5",
    tempo: "Fast / explosive",
    rest: "3–5 min",
    intensity: "Heavy strength load paired with a light, fast power load",
    focus: "Superset contrasting loads: a heavy strength lift followed immediately by an explosive/plyometric version of a similar movement pattern.",
  },
];

const mk = (phaseDefaults, o) => ({
  sets: phaseDefaults.sets, reps: phaseDefaults.reps, repUnit: "reps",
  load: "", loadUnit: "lb", rest: phaseDefaults.rest,
  notes: "", tag: null, superset: null, isBackSafety: false, effortType: "rir",
  optional: false, unilateral: false,
  ...o,
});

function phaseDefaultsFor(phaseNum) {
  const p = OPT_PHASES[phaseNum - 1];
  return { sets: p.sets.split("–")[0], reps: p.reps.split(" ")[0], rest: p.rest };
}

// Each phase's exercise library, grouped by movement category (Push / Pull / Legs / Core).
// Phase 2 and Phase 5 use `superset` pairing to reuse the app's superset UI, matching
// how the OPT model actually prescribes those phases (strength + stabilization / strength + power).
export const EXERCISE_LIBRARY = {
  1: {
    Push: [
      mk(phaseDefaultsFor(1), { id: "opt1-push-1", name: "Stability Ball Push-Up", notes: "Hands on a stability ball — added instability demands shoulder/core control." }),
      mk(phaseDefaultsFor(1), { id: "opt1-push-2", name: "Standing Single-Arm Cable Press", unilateral: true, notes: "Single-arm press from a split stance — anti-rotation core demand." }),
    ],
    Pull: [
      mk(phaseDefaultsFor(1), { id: "opt1-pull-1", name: "Standing Cable Row (single-leg stance)", unilateral: true, notes: "Row while balancing on one leg — pairs pulling strength with stability." }),
      mk(phaseDefaultsFor(1), { id: "opt1-pull-2", name: "Stability Ball Dumbbell Row", unilateral: true, notes: "Chest supported on a ball, light dumbbell row each arm." }),
    ],
    Legs: [
      mk(phaseDefaultsFor(1), { id: "opt1-legs-1", name: "Single-Leg Squat Touchdown", unilateral: true, notes: "Balance on one leg, tap the opposite hand to the floor with control." }),
      mk(phaseDefaultsFor(1), { id: "opt1-legs-2", name: "Stability Ball Wall Squat", notes: "Ball between low back and wall — controlled tempo, light or bodyweight load." }),
    ],
    "Core / Total Body": [
      mk(phaseDefaultsFor(1), { id: "opt1-core-1", name: "Plank Hold", reps: "20–60", repUnit: "sec", notes: "Anti-extension bracing — hold with a neutral spine." }),
      mk(phaseDefaultsFor(1), { id: "opt1-core-2", name: "Bird Dog", unilateral: true, notes: "Opposite arm/leg extension — anti-rotation, spinal stability." }),
    ],
  },
  2: {
    Push: [
      mk(phaseDefaultsFor(2), { id: "opt2-push-1", name: "Flat Bench Press", superset: "push", reps: "8–12", notes: "Strength half of the superset." }),
      mk(phaseDefaultsFor(2), { id: "opt2-push-1b", name: "Stability Ball Push-Up", superset: "push", reps: "12–20", notes: "Stabilization half — go straight into this after the bench press set." }),
    ],
    Pull: [
      mk(phaseDefaultsFor(2), { id: "opt2-pull-1", name: "Seated Cable Row", superset: "pull", reps: "8–12", notes: "Strength half of the superset." }),
      mk(phaseDefaultsFor(2), { id: "opt2-pull-1b", name: "Stability Ball Dumbbell Row", superset: "pull", reps: "12–20", unilateral: true, notes: "Stabilization half — light dumbbells, controlled tempo." }),
    ],
    Legs: [
      mk(phaseDefaultsFor(2), { id: "opt2-legs-1", name: "Barbell Back Squat", superset: "legs", reps: "8–12", notes: "Strength half of the superset." }),
      mk(phaseDefaultsFor(2), { id: "opt2-legs-1b", name: "Single-Leg Squat Touchdown", superset: "legs", reps: "12–20", unilateral: true, notes: "Stabilization half — bodyweight, controlled." }),
    ],
    "Core / Total Body": [
      mk(phaseDefaultsFor(2), { id: "opt2-core-1", name: "Standing Overhead Press", superset: "core", reps: "8–12", notes: "Strength half of the superset." }),
      mk(phaseDefaultsFor(2), { id: "opt2-core-1b", name: "Single-Leg Overhead Press", superset: "core", reps: "12–20", unilateral: true, notes: "Stabilization half — light dumbbell, opposite-leg balance." }),
    ],
  },
  3: {
    Push: [
      mk(phaseDefaultsFor(3), { id: "opt3-push-1", name: "Barbell Bench Press", notes: "Primary compound press for the day." }),
      mk(phaseDefaultsFor(3), { id: "opt3-push-2", name: "Incline Dumbbell Press", notes: "Upper-chest emphasis." }),
      mk(phaseDefaultsFor(3), { id: "opt3-push-3", name: "Cable Fly", notes: "Isolation finisher, constant tension." }),
    ],
    Pull: [
      mk(phaseDefaultsFor(3), { id: "opt3-pull-1", name: "Lat Pulldown", notes: "Vertical pulling volume." }),
      mk(phaseDefaultsFor(3), { id: "opt3-pull-2", name: "Barbell Row", notes: "Horizontal pulling, back thickness." }),
      mk(phaseDefaultsFor(3), { id: "opt3-pull-3", name: "Face Pull", notes: "Rear delt / scapular health." }),
    ],
    Legs: [
      mk(phaseDefaultsFor(3), { id: "opt3-legs-1", name: "Back Squat", notes: "Primary compound lower-body movement." }),
      mk(phaseDefaultsFor(3), { id: "opt3-legs-2", name: "Leg Press", notes: "Additional quad/glute volume, lower systemic fatigue." }),
      mk(phaseDefaultsFor(3), { id: "opt3-legs-3", name: "Romanian Deadlift", notes: "Posterior chain — hamstrings and glutes." }),
    ],
    "Core / Total Body": [
      mk(phaseDefaultsFor(3), { id: "opt3-core-1", name: "Cable Woodchop", unilateral: true, notes: "Rotational core strength." }),
      mk(phaseDefaultsFor(3), { id: "opt3-core-2", name: "Weighted Sit-Up", notes: "Flexion strength, hold a plate at the chest." }),
      mk(phaseDefaultsFor(3), { id: "opt3-core-3", name: "Hanging Leg Raise", notes: "Lower-abdominal and hip-flexor strength." }),
    ],
  },
  4: {
    Push: [
      mk(phaseDefaultsFor(4), { id: "opt4-push-1", name: "Barbell Bench Press (heavy)", notes: "Top sets near 1RM — use a spotter." }),
      mk(phaseDefaultsFor(4), { id: "opt4-push-2", name: "Standing Overhead Press (heavy)", notes: "Full-body bracing, strict form." }),
    ],
    Pull: [
      mk(phaseDefaultsFor(4), { id: "opt4-pull-1", name: "Deadlift", isBackSafety: true, notes: "Heaviest lift of the block — prioritize bracing and bar path over load." }),
      mk(phaseDefaultsFor(4), { id: "opt4-pull-2", name: "Weighted Pull-Up", notes: "Add load once bodyweight reps are no longer near-maximal." }),
    ],
    Legs: [
      mk(phaseDefaultsFor(4), { id: "opt4-legs-1", name: "Back Squat (heavy)", notes: "Top sets near 1RM — use safety bars/spotter." }),
      mk(phaseDefaultsFor(4), { id: "opt4-legs-2", name: "Front Squat", notes: "Quad-dominant variation, more upright torso." }),
    ],
    "Core / Total Body": [
      mk(phaseDefaultsFor(4), { id: "opt4-core-1", name: "Heavy Farmer's Carry", reps: "20–30", repUnit: "m", loadUnit: "lb/hand", unilateral: true, notes: "Grip and total-body bracing under a heavy, near-maximal load." }),
      mk(phaseDefaultsFor(4), { id: "opt4-core-2", name: "Weighted Plank", reps: "20–30", repUnit: "sec", notes: "Plate on the back — heavy isometric core loading." }),
    ],
  },
  5: {
    Push: [
      mk(phaseDefaultsFor(5), { id: "opt5-push-1", name: "Bench Press", superset: "push", reps: "1–5", notes: "Heavy strength half of the superset." }),
      mk(phaseDefaultsFor(5), { id: "opt5-push-1b", name: "Medicine Ball Chest Pass", superset: "push", reps: "8–10", effortType: "quality", notes: "Explosive power half — throw for speed, not fatigue." }),
    ],
    Pull: [
      mk(phaseDefaultsFor(5), { id: "opt5-pull-1", name: "Bent-Over Row", superset: "pull", reps: "1–5", notes: "Heavy strength half of the superset." }),
      mk(phaseDefaultsFor(5), { id: "opt5-pull-1b", name: "Medicine Ball Slam", superset: "pull", reps: "8–10", effortType: "quality", notes: "Explosive power half — full-body, maximal speed." }),
    ],
    Legs: [
      mk(phaseDefaultsFor(5), { id: "opt5-legs-1", name: "Back Squat", superset: "legs", reps: "1–5", notes: "Heavy strength half of the superset." }),
      mk(phaseDefaultsFor(5), { id: "opt5-legs-1b", name: "Box Jump", superset: "legs", reps: "8–10", effortType: "quality", notes: "Explosive power half — step down, don't jump down, between reps." }),
    ],
    "Core / Total Body": [
      mk(phaseDefaultsFor(5), { id: "opt5-core-1", name: "Weighted Sit-Up", superset: "core", reps: "1–5", notes: "Heavy strength half of the superset." }),
      mk(phaseDefaultsFor(5), { id: "opt5-core-1b", name: "Rotational Medicine Ball Throw", superset: "core", reps: "8–10", effortType: "quality", unilateral: true, notes: "Explosive power half — throw against a wall, alternate sides." }),
    ],
  },
};
