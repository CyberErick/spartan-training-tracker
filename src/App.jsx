import React, { useState, useEffect } from "react";
import {
  Save, Download, ChevronDown, ChevronUp,
  Shield, Leaf, Flame, Plus, X, Check, Info, History, ListChecks, Pencil
} from "lucide-react";

/* ============================== DATA ============================== */

const WEEK_PLAN = [
  { week: 1, dates: "Jun 30–Jul 6", block: "Accumulation", phase: "build", mainRIR: "2–3", accRIR: "2–3", volume: "100%", note: "Ease into the lengthened-position exercises light — extra soreness the first time is normal." },
  { week: 2, dates: "Jul 7–13", block: "Accumulation", phase: "build", mainRIR: "2", accRIR: "2", volume: "100%", note: "Start double progression: top of rep range at RIR ≤2 on every set → add load next time." },
  { week: 3, dates: "Jul 14–20", block: "Accumulation", phase: "build", mainRIR: "1–2", accRIR: "2", volume: "100%", note: "Push load wherever last week's rep target was met cleanly." },
  { week: 4, dates: "Jul 21–27", block: "Accumulation", phase: "build", mainRIR: "1–2", accRIR: "1–2", volume: "100%", note: "Peak of this block. Accumulated fatigue is expected here, not a red flag." },
  { week: 5, dates: "Jul 28–Aug 3", block: "Full Recovery", phase: "recovery", mainRIR: "—", accRIR: "—", volume: "0% lifting", note: "No lifting at all this week. Flexibility Protocol + Stability Protocol replace the 6-day cycle entirely — see the Week 5 tab.", recoveryWeek: true },
  { week: 6, dates: "Aug 4–10", block: "Intensification", phase: "intensify", mainRIR: "1–2", accRIR: "2–3", volume: "~90%", note: "Running Phase 2 begins. Resume the double-progression scheme exactly where Week 4 left off." },
  { week: 7, dates: "Aug 11–17", block: "Intensification", phase: "intensify", mainRIR: "1", accRIR: "2–3", volume: "~90%", note: "Keep pushing the anchor lifts." },
  { week: 8, dates: "Aug 18–24", block: "Intensification", phase: "intensify", mainRIR: "0–1*", accRIR: "2–3", volume: "~85%", note: "Final push of this block. *Back Extension / RDL / Jefferson Curl stay conservative regardless." },
  { week: 9, dates: "Aug 25–31", block: "Taper", phase: "taper", mainRIR: "2–3", accRIR: "3–4", volume: "~70%", note: "Begin stepping down — mirrors the running plan's own taper logic." },
  { week: 10, dates: "Sep 1–7", block: "Taper", phase: "taper", mainRIR: "2–3", accRIR: "4+", volume: "~55%", note: "Drop to-failure work entirely." },
  { week: 11, dates: "Sep 8–14", block: "Race Week", phase: "taper", mainRIR: "3+", accRIR: "4+", volume: "~40%", note: "Freshness over fitness. Save it for race day." },
];

const DAY_META = [
  { id: 1, name: "Push", style: "Hypertrophy", short: "D1" },
  { id: 2, name: "Pull", style: "Hypertrophy", short: "D2" },
  { id: 3, name: "Legs", style: "Hypertrophy", short: "D3" },
  { id: 4, name: "Push", style: "Athletic / Isometric", short: "D4" },
  { id: 5, name: "Pull", style: "Athletic / Isometric", short: "D5" },
  { id: 6, name: "Legs", style: "Athletic / Isometric", short: "D6" },
];

const CORE_ROUTINE = [
  { id: "plank-hold", name: "Plank Hold", dose: "3 x 30–45 sec", note: "Anti-extension, back-friendly bracing" },
  { id: "dead-bug", name: "Dead Bug", dose: "3 x 10/side", note: "Anti-extension, spine stays neutral throughout" },
  { id: "side-plank", name: "Side Plank", dose: "3 x 20–30 sec/side", note: "Anti-lateral flexion, obliques" },
  { id: "bird-dog", name: "Bird Dog", dose: "3 x 10/side", note: "Anti-rotation, spinal stability" },
  { id: "pallof-press", name: "Pallof Press", dose: "3 x 10/side", note: "Anti-rotation under load — light-moderate band/cable" },
];
const CORE_ROUTINE_NOTE = "Done fresh, right after warm-up, before the main lift — same 5 exercises every hypertrophy day, ~10–12 min total.";

const NECK_CARE_LINE = "Neck care routine (see Neck Health Protocol) — 3–5 min";

const ex = (o) => ({ sets: "3", reps: "10", repUnit: "reps", load: "", loadUnit: "lb", rest: "60", notes: "", tag: null, superset: null, isBackSafety: false, effortType: "rir", optional: false, weekParity: null, unilateral: false, ...o });

function weekParityOf(week) {
  return week % 2 === 1 ? "odd" : "even";
}

const PROGRAM = {
  1: {
    warmup: ["Incline treadmill walk — 5 min", "Arm circles — 20 each direction", "Band pull-aparts — 20", "Scapular push-ups — 10", "Band internal/external rotation — 10 each direction", "Wall slides — 10"],
    coreRoutine: true,
    main: [
      ex({ id: "d1-1", name: "Flat Bench Press", sets: "4", reps: "5–6", load: "225", rest: "90", isMain: true, superset: "A", weekParity: "odd", notes: "Heavy compound — your anchor lift on odd weeks (1, 3, 7, 9, 11). Alternates with Incline DB Press on even weeks." }),
      ex({ id: "d1-1b", name: "Incline DB Press", sets: "4", reps: "5–6", load: "", rest: "90", isMain: true, superset: "A", weekParity: "even", notes: "Alternate anchor lift on even weeks (2, 4, 6, 8, 10). Incline + dumbbells allow a bit more stretch at the bottom than a barbell bench does." }),
      ex({ id: "d1-2", name: "Champagne Raises (Incline Y-Raise)", sets: "4", reps: "~10", load: "30", loadUnit: "lb/arm", rest: "60", superset: "A", unilateral: true, notes: "Superset with whichever press is on this week — lower traps / rear delts." }),
      ex({ id: "d1-3", name: "Pec-Dec (Butterfly)", sets: "3", reps: "10–12", load: "165", rest: "60", notes: "1 sec hold at peak squeeze, focus on scapular retraction." }),
      ex({ id: "d1-4", name: "Lateral Raise", sets: "4", reps: "12–15", load: "20", loadUnit: "lb/arm", rest: "60", tag: "length", unilateral: true, notes: "Sets 1–2: standard DB. Sets 3–4: Lean-Away Cable Lateral Raise, ~30–40% lighter." }),
      ex({ id: "d1-5", name: "External Lateral Rotation", sets: "4", reps: "12–15", load: "7", loadUnit: "lb/arm", rest: "60", unilateral: true, notes: "Rotator cuff health." }),
      ex({ id: "d1-6", name: "Overhead Cable/DB Tricep Extension", sets: "3–4", reps: "failure", load: "", rest: "60", tag: "length", weekParity: "odd", notes: "Odd weeks — loads the tricep long head at full stretch. Alternates with Tricep Pushdown on even weeks." }),
      ex({ id: "d1-6b", name: "Tricep Pushdown", sets: "3–4", reps: "failure", load: "", rest: "60", weekParity: "even", notes: "Even weeks — standard shortened-position tricep work. Alternates with Overhead Extension on odd weeks." }),
    ],
    finisher: null,
    stretch: ["Doorway pec stretch — 20–30 sec ×2", "Cross-body rear delt stretch — 20–30 sec ×2 each side", "Overhead tricep stretch — 20–30 sec ×2 each side", "Child's pose — 30–45 sec", NECK_CARE_LINE],
  },
  2: {
    warmup: ["Steep incline walk — 5 min", "Wrist circles — 20 each direction", "Elbow circles — 20 each direction", "Bent-over arm circles — 45 each direction, both arms", "Lat reach/sweep — 8–10 each side", "World's Greatest Stretch — 5 each side", "Cat-cows — 10", "Thread the needle — 8–10 each side", "Scapular wall slides — 10", "Banded scapular retractions — 10"],
    coreRoutine: true,
    main: [
      ex({ id: "d2-1", name: "Weighted Back Extension", sets: "4", reps: "10", load: "45", loadUnit: "lb plate", rest: "75–90", isBackSafety: true, notes: "Heavy/loaded spinal extension. Control the lockout." }),
      ex({ id: "d2-2", name: "Lat Pulldown", sets: "4", reps: "10", load: "80% max", rest: "—", superset: "B", tag: "length", notes: "Superset, part 1. Add a 1–2 sec pause at full stretch (top) before pulling." }),
      ex({ id: "d2-3", name: "Reverse Grip Pulldown", sets: "4", reps: "10", load: "100", rest: "60", superset: "B", notes: "Superset, part 2 — different lat angle." }),
      ex({ id: "d2-4", name: "ISO-Lateral Row (neutral grip)", sets: "4", reps: "10", load: "135 (80%)", loadUnit: "lb/arm", rest: "60", unilateral: true, notes: "Back thickness. If gassed late, trim a set here first." }),
      ex({ id: "d2-5", name: "Face Pull", sets: "4", reps: "12–15", load: "light", rest: "60", notes: "Rear delt / scap health. If gassed late, trim a set here first." }),
      ex({ id: "d2-6", name: "Internal Lateral Rotation", sets: "3", reps: "12–15", load: "light", loadUnit: "lb/arm", rest: "60", unilateral: true, notes: "Arm at 90°, stay mindful of scapular retraction." }),
      ex({ id: "d2-7", name: "Incline DB Curl", sets: "4", reps: "failure", load: "", rest: "75–90", tag: "length", notes: "Swapped from Cable Bicep Curl. Never cut this for time — nothing else in the week hits it." }),
      ex({ id: "d2-8", name: "Reverse Curl (brachioradialis)", sets: "4", reps: "failure", load: "", rest: "75–90", notes: "To-failure work — rest-cap exception. Never cut this for time either." }),
    ],
    finisher: null,
    stretch: ["Lat stretch (overhead side-bend / doorway) — 20–30 sec ×2 each side", "Cross-body rear delt stretch — 20–30 sec ×2 each side", "Standing bicep wall stretch — 20–30 sec ×2", "Doorway pec stretch — 20–30 sec ×2", "Child's pose with reach — 30–45 sec", NECK_CARE_LINE],
    footnote: "Jefferson curls are intentionally not on this day — see Day 5. Stacking loaded spinal flexion on top of heavy back extension is too much for a weak lower back.",
  },
  3: {
    warmup: ["Single-leg balance pad w/ weight pass — 3×10/leg", "Tibialis raise (tib bar) — 3–4×10 @ 35 lb", "Banded crab walks — 3×15/side", "Banded hip thrusts (bilateral, then unilateral) — 3×10"],
    coreRoutine: true,
    main: [
      ex({ id: "d3-1", name: "Deficit Calf Raise", sets: "4", reps: "10", load: "270–305", rest: "60", tag: "length", notes: "Modified from Standing Calf Raise (340 lb) — stand on a small plate/step for added stretch. Drop load ~10–20% to start." }),
      ex({ id: "d3-2", name: "Lying Leg Curl", sets: "4", reps: "10", load: "158", rest: "60", notes: "Hamstring isolation before the hinge." }),
      ex({ id: "d3-3", name: "Romanian Deadlift (RDL)", sets: "4", reps: "8–10", load: "moderate–heavy", rest: "75–90", isBackSafety: true, tag: "length", notes: "Add a 1–2 sec pause at your deepest comfortable, back-safe stretch." }),
      ex({ id: "d3-4", name: "Hack Squat (elevated heel)", sets: "3", reps: "10", load: "260", rest: "75–90", notes: "Heavy compound — rest-cap exception." }),
      ex({ id: "d3-5", name: "Weighted Hip Thrust Machine", sets: "4", reps: "10", load: "3×45 plates/side", rest: "60", notes: "Glute focus." }),
      ex({ id: "d3-6", name: "Single-Leg Seated Leg Curl", sets: "4", reps: "10", load: "55", rest: "60", unilateral: true, notes: "Unilateral hamstring finisher." }),
      ex({ id: "d3-7", name: "Rear-Foot-Elevated (Bulgarian) Split Squat", sets: "3", reps: "8–10/leg", load: "light–moderate DB", rest: "60", tag: "length", unilateral: true, notes: "Replaces the Single-Leg Leg Extension finisher." }),
    ],
    finisher: null,
    stretch: ["Standing quad stretch — 20–30 sec ×2 each side", "Standing/seated hamstring stretch — 20–30 sec ×2 each side", "Figure-4 glute stretch — 20–30 sec ×2 each side", "Couch stretch (hip flexor) — 30–45 sec each side", "Calf stretch against wall — 20–30 sec ×2 each side", NECK_CARE_LINE],
  },
  4: {
    warmup: ["Jump rope or row machine — 5 min", "Band pull-aparts — 20", "Arm circles — 20 each direction", "Wall push-up taps — 10", "World's Greatest Stretch — 5 each side"],
    main: [
      ex({ id: "d4-1", name: "Plyo Push-Ups (or med ball chest pass)", sets: "4", reps: "6–8", load: "BW", rest: "30–45", effortType: "quality", notes: "Explosive intent, full reset between reps." }),
      ex({ id: "d4-2", name: "Landmine Press (single arm)", sets: "3", reps: "8/side", load: "moderate", rest: "30–45", unilateral: true, notes: "Athletic pressing pattern, anti-rotation core demand." }),
      ex({ id: "d4-3", name: "Isometric Bench Press Pause (mid-range)", sets: "3", reps: "30–45", repUnit: "sec", load: "light–moderate", rest: "30–45", notes: "Hold time increased — builds positional strength under tension." }),
      ex({ id: "d4-4", name: "Single-Arm DB Push Press", sets: "3", reps: "6/side", load: "moderate", rest: "30–45", effortType: "quality", unilateral: true, notes: "Leg drive + press, full-body athletic power." }),
      ex({ id: "d4-5", name: "Shadow Boxing Combinations (jab-cross-hook-uppercut)", sets: "4", reps: "1 min rounds", repUnit: "sec", load: "BW", rest: "30–45", effortType: "quality", notes: "Rotational hand speed and power; pairs with landmine press's anti-rotation demand." }),
      ex({ id: "d4-6", name: "Plank-to-Push-Up / Plank Hold", sets: "3", reps: "45–60", repUnit: "sec", load: "BW", rest: "30–45", tag: "length", notes: "Hold time increased. Sets 1–2: as programmed. Set 3: swap to a Bottom-of-Push-Up Isometric Hold for end-range stability." }),
    ],
    footwork: "Boxing Footwork Drill — 5 min, open floor or agility ladder: lateral shuffles, pivot steps, in-and-out steps. Placed right after the lift, before cardio.",
    finisher: "Cardio — full intervals here per the Running Progression, OR just the 8–10 min non-negotiable floor as the very last thing before leaving if energy's low (both count — small and done beats skipped)",
    stretch: ["Doorway pec stretch — 20–30 sec ×2", "Cross-body rear delt stretch — 20–30 sec ×2 each side", "Overhead tricep stretch — 20–30 sec ×2 each side", "Standing quad stretch (post-cardio) — 20–30 sec ×2 each side", "Calf stretch (post-cardio) — 20–30 sec ×2 each side", NECK_CARE_LINE],
  },
  5: {
    warmup: ["Row machine or jump rope — 5 min", "Band pull-aparts — 20", "Scap pull-ups (on a bar) — 10", "World's Greatest Stretch — 5 each side", "Light kettlebell swings — 15"],
    main: [
      ex({ id: "d5-1", name: "Pull-Ups (weighted or BW)", sets: "4", reps: "5–8", load: "BW/added", rest: "30–45", notes: "Explosive on the pull, controlled on the way down." }),
      ex({ id: "d5-2", name: "Active Hang", sets: "2", reps: "20–30", repUnit: "sec", load: "BW", rest: "—", tag: "length", notes: "Before or after pull-ups. Low fatigue cost. Stop short of full passive hang if it aggravates the back." }),
      ex({ id: "d5-3", name: "Single-Arm DB Row", sets: "4", reps: "8/side", load: "moderate", rest: "30–45", unilateral: true, notes: "Powerful initiation, not just slow tempo." }),
      ex({ id: "d5-4", name: "Kettlebell Swings", sets: "4", reps: "20 or 45", repUnit: "sec", load: "moderate KB", rest: "30–45", notes: "Volume increased. Hip-hinge power; complements the RDL pattern from Day 3." }),
      ex({ id: "d5-5", name: "Battle Ropes or Med Ball Slams", sets: "4", reps: "45–60", repUnit: "sec", load: "—", rest: "30–45", notes: "Work time increased. Explosive upper-body conditioning." }),
      ex({ id: "d5-6", name: "Renegade Rows", sets: "3", reps: "8/side", load: "light–moderate DB", rest: "30–45", unilateral: true, notes: "Core + pull stability combined." }),
      ex({ id: "d5-7", name: "Face Pulls", sets: "3", reps: "15", load: "light", rest: "30–45", notes: "Shoulder health maintenance." }),
      ex({ id: "d5-8", name: "Farmer's Carry", sets: "3", reps: "40", repUnit: "m", load: "heavy", loadUnit: "lb/hand", rest: "45–60", unilateral: true, notes: "Rest-cap exception for grip/rack safety, not just intensity." }),
      ex({ id: "d5-9", name: "Jefferson Curl", sets: "2", reps: "6–8", load: "empty bar / 5–10", rest: "—", isBackSafety: true, tag: "length", notes: "Slow tempo: 3–4 sec down, 3–4 sec up, full pause at bottom. Get a doctor/PT's input before progressing past light loads." }),
    ],
    finisher: "Cardio — full intervals here per the Running Progression, OR just the 8–10 min non-negotiable floor as the very last thing before leaving if energy's low",
    stretch: ["Lat stretch — 20–30 sec ×2 each side", "Cross-body rear delt stretch — 20–30 sec ×2 each side", "Hamstring stretch — 20–30 sec ×2 each side (Jefferson curls already pre-stretch this)", "Child's pose — 30–45 sec", NECK_CARE_LINE],
    footnote: "Jefferson Curl already does the heavy lifting for strength-at-length on this day — that's why it's programmed here instead of Day 2's heavy back-extension day.",
  },
  6: {
    warmup: ["Jump rope or light jog — 5 min", "Leg swings (front-back, side-side) — 10/leg", "Walking lunges — 10/leg", "Lateral band walks — 10/side", "High knees / butt kicks — 20m each"],
    main: [
      ex({ id: "d6-1", name: "Box Jumps or Broad Jumps", sets: "4", reps: "5", load: "BW", rest: "45–60", effortType: "quality", notes: "Rest-cap exception for landing quality. Explosive, full reset between reps." }),
      ex({ id: "d6-2", name: "Single-Leg RDL", sets: "3", reps: "8/side", load: "BW or light DB", rest: "30–45", unilateral: true, notes: "Balance + posterior chain control, race-relevant on uneven terrain." }),
      ex({ id: "d6-3", name: "Walking Lunges (loaded carry)", sets: "3", reps: "10/leg", load: "moderate", rest: "30–45", unilateral: true, notes: "Mimics sandbag/bucket carries in Spartan obstacles." }),
      ex({ id: "d6-4", name: "Wall Sit (isometric)", sets: "3", reps: "45–60", repUnit: "sec", load: "BW", rest: "30–45", notes: "Hold time increased. Quad endurance under static load." }),
      ex({ id: "d6-5", name: "Taekwondo Horse Stance Hold", sets: "3", reps: "30–45", repUnit: "sec", load: "BW", rest: "30–45", notes: "Static hip/adductor/quad strength, deep stance endurance." }),
      ex({ id: "d6-6", name: "Taekwondo Side-Kick Chamber Hold", sets: "3", reps: "20–30", repUnit: "sec", load: "BW", rest: "30–45", unilateral: true, notes: "Single-leg balance + hip stability under isometric load." }),
      ex({ id: "d6-7", name: "Lateral Bounds", sets: "3", reps: "8/side", load: "BW", rest: "45–60", effortType: "quality", unilateral: true, notes: "Rest-cap exception for landing quality. Lateral power, ankle stability." }),
      ex({ id: "d6-8", name: "Sled Push or Drag (if available)", sets: "3", reps: "20", repUnit: "m", load: "moderate", rest: "30–45", notes: "Direct carryover to Spartan sled/carry obstacles." }),
      ex({ id: "d6-9", name: "Cossack Squat", sets: "3", reps: "8/side", load: "BW or light", rest: "30–45", tag: "length", optional: true, unilateral: true, notes: "Optional — skip if the day feels long, especially with the new Taekwondo holds added." }),
    ],
    footwork: "Taekwondo Footwork Drill — 5 min, open floor: step-slide (forward/back), pivot steps, quick direction changes. Same slot as Day 4's boxing footwork drill.",
    finisher: "Cardio — full intervals per the Running Progression, OR the 8–10 min non-negotiable floor if energy's low, then Pallof Press 3×10/side either way",
    stretch: ["Standing quad stretch — 20–30 sec ×2 each side", "Hamstring stretch — 20–30 sec ×2 each side", "Couch stretch (hip flexor) — 30–45 sec each side", "Figure-4 glute stretch — 20–30 sec ×2 each side", "Calf stretch — 20–30 sec ×2 each side", NECK_CARE_LINE],
  },
};

const FLEXIBILITY_PROTOCOL = [
  { region: "Neck & Upper Back", items: ["Upper trap stretch — 30–45 sec each side", "Levator scap stretch — 30–45 sec each side", "Suboccipital stretch (chin tuck + gentle nod) — 30–45 sec", "Thread the needle — 8–10 slow reps each side", "Cat-cow — 10–15 slow reps"] },
  { region: "Shoulders & Chest", items: ["Doorway pec stretch — 30–45 sec ×2", "Cross-body rear delt stretch — 30–45 sec each side", "Overhead tricep stretch — 30–45 sec each side", "Banded shoulder dislocates — 10–12 slow reps"] },
  { region: "Lats & Spine", items: ["Overhead side-bend lat stretch — 30–45 sec each side", "Child's pose with reach — 45–60 sec", "Seated spinal twist — 30–45 sec each side"] },
  { region: "Hips", items: ["Couch stretch (hip flexor) — 45–60 sec each side", "Figure-4 glute stretch — 30–45 sec each side", "90/90 hip stretch — 30–45 sec each side"] },
  { region: "Hamstrings, Quads & Calves", items: ["Standing hamstring stretch — 30–45 sec each side", "Standing quad stretch — 30–45 sec each side", "Calf stretch against wall — 30–45 sec each side", "Tibialis stretch (kneel back, top of foot flat) — 20–30 sec each side"] },
];
const FLEXIBILITY_OPTIONAL = "Optional: Jefferson Curl — light load only (empty bar or 5–10 lb), same slow tempo as Day 5. Keep it light regardless of how good it feels; this is maintenance, not a place to progress load.";

const STABILITY_PROTOCOL = [
  { region: "Ankle & Foot", items: ["Single-leg balance, eyes open then closed — 30–45 sec each leg", "Single-leg balance pad with reach — 3 x 30 sec each leg"] },
  { region: "Knee & Hip", items: ["Single-Leg RDL hold (bodyweight) — 3 x 20–30 sec each leg", "Controlled lateral step-downs off a low box — 3 x 8 each leg"] },
  { region: "Core", items: ["Dead Bug — 3 x 8 each side", "Bird Dog — 3 x 8 each side", "Pallof Press hold — 3 x 20–30 sec each side", "Side Plank — 3 x 20–30 sec each side"] },
  { region: "Shoulder & Neck", items: ["Band external/internal rotation isometric hold — 3 x 15–20 sec each direction, each arm", "Wall slide hold at top position — 3 x 15–20 sec", "Scapular wall hold (light retraction) — 3 x 15–20 sec", "Gentle self-resisted neck isometrics — 3 x 10 sec each direction, very light effort only"] },
];

const WEEK5_SCHEDULE = [
  { day: 1, content: "flexibility", extra: "+ 20–30 min easy walk" },
  { day: 2, content: "stability", extra: "+ 15–20 min easy bike or swim" },
  { day: 3, content: "flexibility", extra: "Extra time on the neck & upper back section" },
  { day: 4, content: "stability", extra: "+ 15–20 min very easy jog (conversational pace only)" },
  { day: 5, content: "active-rest", extra: "Walk, light mobility only — no structured protocol" },
  { day: 6, content: "both-short", extra: "Flexibility + Stability, shortened — hit tightest/weakest areas only" },
  { day: 7, content: "rest", extra: "Full rest" },
];
const CONTENT_LABEL = { flexibility: "Flexibility Protocol (full)", stability: "Stability Protocol (full)", "active-rest": "Active Rest", "both-short": "Flexibility + Stability (shortened)", rest: "Full Rest" };

/* ============================== HELPERS ============================== */

function emptySide() { return { load: "", reps: "" }; }

function emptySet(unilateral) {
  return unilateral ? { left: emptySide(), right: emptySide(), rir: null } : { load: "", reps: "", rir: null };
}

function isUnilateralSet(set) {
  return !!set && (set.left !== undefined || set.right !== undefined);
}

function formatSetsSummary(sets) {
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

const OVERRIDES_KEY = "program-overrides";

function loadOverrides() {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : { exercises: {}, core: {} };
  } catch (e) {
    return { exercises: {}, core: {} };
  }
}

function saveOverrides(overrides) {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
    return true;
  } catch (e) {
    return false;
  }
}

function applyExerciseOverride(exc, overrides) {
  const o = overrides?.exercises?.[exc.id];
  return o ? { ...exc, ...o } : exc;
}

function applyCoreOverride(item, overrides) {
  const o = overrides?.core?.[item.id];
  return o ? { ...item, ...o } : item;
}

function rirToRpe(rir) {
  if (rir === null || rir === "") return "—";
  if (rir === "5+") return "≤5";
  const n = parseInt(rir, 10);
  return isNaN(n) ? "—" : Math.max(10 - n, 5);
}

async function loadLog() {
  try {
    const raw = localStorage.getItem("training-log");
    return raw ? JSON.parse(raw) : { sessions: [] };
  } catch (e) {
    return { sessions: [] };
  }
}

async function saveLogToStorage(log) {
  try {
    localStorage.setItem("training-log", JSON.stringify(log));
    return true;
  } catch (e) {
    return false;
  }
}

function findLastEntry(sessions, day, exerciseId, excludeWeek) {
  const matches = sessions
    .filter((s) => s.day === day && s.week !== excludeWeek && s.entries && s.entries[exerciseId] && (s.entries[exerciseId].sets || []).some(st => isUnilateralSet(st) ? (st.left?.load || st.left?.reps || st.right?.load || st.right?.reps) : (st.load || st.reps)))
    .sort((a, b) => b.week - a.week);
  return matches[0] ? matches[0].entries[exerciseId] : null;
}

function exportCSV(sessions) {
  const rows = [["date", "week", "day", "exercise", "set", "side", "load", "reps_or_duration", "rir"]];
  sessions
    .slice()
    .sort((a, b) => a.week - b.week || a.day - b.day)
    .forEach((s) => {
      Object.values(s.entries || {}).forEach((entry) => {
        (entry.sets || []).forEach((set, i) => {
          if (isUnilateralSet(set)) {
            if (set.left && (set.left.load || set.left.reps)) {
              rows.push([s.date, s.week, s.day, entry.name, i + 1, "L", set.left.load, set.left.reps, set.rir ?? ""]);
            }
            if (set.right && (set.right.load || set.right.reps)) {
              rows.push([s.date, s.week, s.day, entry.name, i + 1, "R", set.right.load, set.right.reps, set.rir ?? ""]);
            }
          } else if (set.load || set.reps) {
            rows.push([s.date, s.week, s.day, entry.name, i + 1, "", set.load, set.reps, set.rir ?? ""]);
          }
        });
      });
    });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "training-log-export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function groupExercises(main) {
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

const PHASE_COLOR = { build: "var(--accent)", recovery: "var(--good)", intensify: "var(--hot)", taper: "var(--dim)" };
const PHASE_ICON = { build: Flame, recovery: Leaf, intensify: Flame, taper: ChevronDown };

/* ============================== UI PIECES ============================== */

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

function EffortPicker({ value, onChange, type }) {
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

function SetRow({ idx, set, repUnit, onChange, onRemove, effortType, unilateral }) {
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

const editLabelStyle = { display: "flex", flexDirection: "column", gap: 3, fontSize: 11, color: "var(--dim)", flex: 1 };
const editInputStyle = { background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 6, padding: "6px 8px", color: "var(--text)", fontFamily: "Inter, sans-serif", fontSize: 13 };
const editBtnPrimary = { background: "var(--accent)", color: "var(--bg)", border: "none", borderRadius: 6, padding: "6px 12px", fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.3, cursor: "pointer" };
const editBtnSecondary = { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--line)", borderRadius: 6, padding: "6px 12px", fontFamily: "Oswald, sans-serif", fontSize: 12, letterSpacing: 0.3, cursor: "pointer" };

function ExerciseEditForm({ exercise, onSave, onCancel, onReset, isOverridden }) {
  const [form, setForm] = useState({
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
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
          Reps
          <input value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} style={editInputStyle} />
        </label>
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

function ExerciseCard({ exercise, sets, onSetChange, onAddSet, onRemoveSet, lastEntry, supersetLabel, onSaveEdit, onResetEdit, isOverridden }) {
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
              {exercise.sets}×{exercise.reps}{exercise.repUnit !== "reps" ? ` ${exercise.repUnit}` : ""} {exercise.load ? `@ ${exercise.load} ${exercise.loadUnit}` : ""} · rest {exercise.rest}
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
              Prioritize control and pain-free reps over load here, every week, regardless of the RIR target above.
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

function CoreItemEditForm({ item, onSave, onCancel, onReset, isOverridden }) {
  const [form, setForm] = useState({ name: item.name, dose: item.dose, note: item.note });
  return (
    <div style={{ marginTop: 4, marginBottom: 6, border: "1px solid var(--accent)", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={editLabelStyle}>
        Name
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={editInputStyle} />
      </label>
      <label style={editLabelStyle}>
        Dose
        <input value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} style={editInputStyle} />
      </label>
      <label style={editLabelStyle}>
        Note
        <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={editInputStyle} />
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => onSave(form)} style={editBtnPrimary}>Save</button>
        <button onClick={onCancel} style={editBtnSecondary}>Cancel</button>
        {isOverridden && <button onClick={onReset} style={{ ...editBtnSecondary, color: "var(--hot)" }}>Reset to default</button>}
      </div>
    </div>
  );
}

function CoreRoutineBlock({ items, done, onToggle, onSaveEdit, onResetEdit, overriddenIds }) {
  const [open, setOpen] = useState(true);
  const [editingId, setEditingId] = useState(null);
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
          {items.map((c) => (
            <div key={c.id}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "5px 0" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, cursor: "pointer", flex: 1 }}>
                  <input type="checkbox" checked={done.includes(c.id)} onChange={() => onToggle(c.id)} style={{ marginTop: 3 }} />
                  <span>
                    <span style={{ fontFamily: "Oswald, sans-serif", letterSpacing: 0.2 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: "var(--dim)" }}> — {c.dose}</span>
                    <br /><span style={{ fontSize: 11, color: "var(--dim)" }}>{c.note}</span>
                  </span>
                </label>
                <button onClick={() => setEditingId(editingId === c.id ? null : c.id)} aria-label="Edit core exercise" style={{ color: editingId === c.id ? "var(--accent)" : "var(--dim)", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                  <Pencil size={12} />
                </button>
              </div>
              {editingId === c.id && (
                <CoreItemEditForm
                  item={c}
                  isOverridden={overriddenIds.includes(c.id)}
                  onSave={(form) => { onSaveEdit(c.id, form); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                  onReset={() => { onResetEdit(c.id); setEditingId(null); }}
                />
              )}
            </div>
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
        const setCount = Object.values(s.entries || {}).reduce((acc, e) => acc + (e.sets || []).filter(x => x.load || x.reps).length, 0);
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

/* ============================== MAIN APP ============================== */

export default function App() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedRecoveryDay, setSelectedRecoveryDay] = useState(1);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionState, setSessionState] = useState({});
  const [stretchDone, setStretchDone] = useState([]);
  const [coreDone, setCoreDone] = useState([]);
  const [finisherDone, setFinisherDone] = useState(false);
  const [view, setView] = useState("log");
  const [saveStatus, setSaveStatus] = useState(null);
  const [overrides, setOverrides] = useState(() => loadOverrides());

  useEffect(() => {
    (async () => {
      const log = await loadLog();
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
    program.main
      .filter((exc) => !exc.weekParity || exc.weekParity === parity)
      .forEach((exc) => {
        const merged = applyExerciseOverride(exc, overrides);
        const found = existing && existing.entries && existing.entries[exc.id];
        initial[exc.id] = found && found.sets && found.sets.length ? found.sets : Array.from({ length: Math.max(parseInt(merged.sets, 10) || 3, 1) }, () => emptySet(merged.unilateral));
      });
    setSessionState(initial);
    setStretchDone((existing && existing.stretchDone) || []);
    setCoreDone((existing && existing.coreDone) || []);
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
  function toggleCore(id) {
    setCoreDone((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function saveExerciseOverride(id, fields) {
    setOverrides((prev) => {
      const next = { ...prev, exercises: { ...prev.exercises, [id]: fields } };
      saveOverrides(next);
      return next;
    });
  }
  function resetExerciseOverride(id) {
    setOverrides((prev) => {
      const nextExercises = { ...prev.exercises };
      delete nextExercises[id];
      const next = { ...prev, exercises: nextExercises };
      saveOverrides(next);
      return next;
    });
  }
  function saveCoreOverride(id, fields) {
    setOverrides((prev) => {
      const next = { ...prev, core: { ...prev.core, [id]: fields } };
      saveOverrides(next);
      return next;
    });
  }
  function resetCoreOverride(id) {
    setOverrides((prev) => {
      const nextCore = { ...prev.core };
      delete nextCore[id];
      const next = { ...prev, core: nextCore };
      saveOverrides(next);
      return next;
    });
  }

  async function handleSave() {
    setSaveStatus("saving");
    const program = PROGRAM[selectedDay];
    const parity = weekParityOf(selectedWeek);
    const entries = {};
    program.main
      .filter((exc) => !exc.weekParity || exc.weekParity === parity)
      .forEach((exc) => {
        const merged = applyExerciseOverride(exc, overrides);
        entries[exc.id] = { name: merged.name, unilateral: merged.unilateral, sets: sessionState[exc.id] || [] };
      });
    const dayMeta = DAY_META[selectedDay - 1];
    const newSession = {
      id: `w${selectedWeek}d${selectedDay}`,
      week: selectedWeek,
      day: selectedDay,
      dayName: `${dayMeta.name} — ${dayMeta.style}`,
      date: new Date().toISOString().slice(0, 10),
      entries,
      stretchDone,
      coreDone,
      finisherDone,
    };
    const newSessions = [...allSessions.filter((s) => !(s.week === selectedWeek && s.day === selectedDay)), newSession];
    const ok = await saveLogToStorage({ sessions: newSessions });
    if (ok) {
      setAllSessions(newSessions);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
    } else {
      setSaveStatus("error");
    }
  }

  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`;
  const tokens = `
    :root {
      --bg: #1B1916; --surface: #232017; --surface2: #2D2A20; --line: #3D372C;
      --text: #EDE7D9; --dim: #A39B89; --accent: #E08A3E; --good: #7A8B5C; --hot: #C1502E;
    }
  `;

  if (loading) {
    return (
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <style>{fontImport + tokens}</style>
        Loading your log…
      </div>
    );
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
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "Inter, sans-serif", padding: 16, borderRadius: 12, maxWidth: 720, margin: "0 auto" }}>
      <style>{fontImport + tokens}</style>

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
                <CoreRoutineBlock
                  items={CORE_ROUTINE.map((c) => applyCoreOverride(c, overrides))}
                  done={coreDone}
                  onToggle={toggleCore}
                  onSaveEdit={saveCoreOverride}
                  onResetEdit={resetCoreOverride}
                  overriddenIds={Object.keys(overrides.core || {})}
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
                        lastEntry={findLastEntry(allSessions, selectedDay, exc.id, selectedWeek)}
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
                    lastEntry={findLastEntry(allSessions, selectedDay, g.items[0].id, selectedWeek)}
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
        <HistoryView sessions={allSessions} onExport={() => exportCSV(allSessions)} />
      )}
    </div>
  );
}
