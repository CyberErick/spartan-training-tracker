export const WEEK_PLAN = [
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

export const DAY_META = [
  { id: 1, name: "Push", style: "Hypertrophy", short: "D1" },
  { id: 2, name: "Pull", style: "Hypertrophy", short: "D2" },
  { id: 3, name: "Legs", style: "Hypertrophy", short: "D3" },
  { id: 4, name: "Push", style: "Athletic / Isometric", short: "D4" },
  { id: 5, name: "Pull", style: "Athletic / Isometric", short: "D5" },
  { id: 6, name: "Legs", style: "Athletic / Isometric", short: "D6" },
];

export const CORE_ROUTINE = [
  { id: "plank-hold", name: "Plank Hold", dose: "3 x 30–45 sec", note: "Anti-extension, back-friendly bracing" },
  { id: "dead-bug", name: "Dead Bug", dose: "3 x 10/side", note: "Anti-extension, spine stays neutral throughout" },
  { id: "side-plank", name: "Side Plank", dose: "3 x 20–30 sec/side", note: "Anti-lateral flexion, obliques" },
  { id: "bird-dog", name: "Bird Dog", dose: "3 x 10/side", note: "Anti-rotation, spinal stability" },
  { id: "pallof-press", name: "Pallof Press", dose: "3 x 10/side", note: "Anti-rotation under load — light-moderate band/cable" },
];
export const CORE_ROUTINE_NOTE = "Done fresh, right after warm-up, before the main lift — same 5 exercises every hypertrophy day, ~10–12 min total.";

export const NECK_CARE_LINE = "Neck care routine (see Neck Health Protocol) — 3–5 min";

export const ex = (o) => ({ sets: "3", reps: "10", repUnit: "reps", load: "", loadUnit: "lb", rest: "60", notes: "", tag: null, superset: null, isBackSafety: false, effortType: "rir", optional: false, weekParity: null, unilateral: false, ...o });

export function weekParityOf(week) {
  return week % 2 === 1 ? "odd" : "even";
}

export const PROGRAM = {
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

export const FLEXIBILITY_PROTOCOL = [
  { region: "Neck & Upper Back", items: ["Upper trap stretch — 30–45 sec each side", "Levator scap stretch — 30–45 sec each side", "Suboccipital stretch (chin tuck + gentle nod) — 30–45 sec", "Thread the needle — 8–10 slow reps each side", "Cat-cow — 10–15 slow reps"] },
  { region: "Shoulders & Chest", items: ["Doorway pec stretch — 30–45 sec ×2", "Cross-body rear delt stretch — 30–45 sec each side", "Overhead tricep stretch — 30–45 sec each side", "Banded shoulder dislocates — 10–12 slow reps"] },
  { region: "Lats & Spine", items: ["Overhead side-bend lat stretch — 30–45 sec each side", "Child's pose with reach — 45–60 sec", "Seated spinal twist — 30–45 sec each side"] },
  { region: "Hips", items: ["Couch stretch (hip flexor) — 45–60 sec each side", "Figure-4 glute stretch — 30–45 sec each side", "90/90 hip stretch — 30–45 sec each side"] },
  { region: "Hamstrings, Quads & Calves", items: ["Standing hamstring stretch — 30–45 sec each side", "Standing quad stretch — 30–45 sec each side", "Calf stretch against wall — 30–45 sec each side", "Tibialis stretch (kneel back, top of foot flat) — 20–30 sec each side"] },
];
export const FLEXIBILITY_OPTIONAL = "Optional: Jefferson Curl — light load only (empty bar or 5–10 lb), same slow tempo as Day 5. Keep it light regardless of how good it feels; this is maintenance, not a place to progress load.";

export const STABILITY_PROTOCOL = [
  { region: "Ankle & Foot", items: ["Single-leg balance, eyes open then closed — 30–45 sec each leg", "Single-leg balance pad with reach — 3 x 30 sec each leg"] },
  { region: "Knee & Hip", items: ["Single-Leg RDL hold (bodyweight) — 3 x 20–30 sec each leg", "Controlled lateral step-downs off a low box — 3 x 8 each leg"] },
  { region: "Core", items: ["Dead Bug — 3 x 8 each side", "Bird Dog — 3 x 8 each side", "Pallof Press hold — 3 x 20–30 sec each side", "Side Plank — 3 x 20–30 sec each side"] },
  { region: "Shoulder & Neck", items: ["Band external/internal rotation isometric hold — 3 x 15–20 sec each direction, each arm", "Wall slide hold at top position — 3 x 15–20 sec", "Scapular wall hold (light retraction) — 3 x 15–20 sec", "Gentle self-resisted neck isometrics — 3 x 10 sec each direction, very light effort only"] },
];

export const WEEK5_SCHEDULE = [
  { day: 1, content: "flexibility", extra: "+ 20–30 min easy walk" },
  { day: 2, content: "stability", extra: "+ 15–20 min easy bike or swim" },
  { day: 3, content: "flexibility", extra: "Extra time on the neck & upper back section" },
  { day: 4, content: "stability", extra: "+ 15–20 min very easy jog (conversational pace only)" },
  { day: 5, content: "active-rest", extra: "Walk, light mobility only — no structured protocol" },
  { day: 6, content: "both-short", extra: "Flexibility + Stability, shortened — hit tightest/weakest areas only" },
  { day: 7, content: "rest", extra: "Full rest" },
];
export const CONTENT_LABEL = { flexibility: "Flexibility Protocol (full)", stability: "Stability Protocol (full)", "active-rest": "Active Rest", "both-short": "Flexibility + Stability (shortened)", rest: "Full Rest" };
