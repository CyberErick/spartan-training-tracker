// Exercise library organized by training category. Each exercise includes a
// description, its training purpose, key form cues, and a breathing cue.
// Visuals (ExerciseDB GIFs) are wired in separately once an API key is set up.

export const LIBRARY_CATEGORIES = [
  { id: "strength", name: "Strength", description: "Building maximal force production in a muscle or muscle group — heavier loads, lower-to-moderate reps." },
  { id: "stability", name: "Stability", description: "Training the ability to control joint position under a destabilizing load or unstable surface." },
  { id: "isometric", name: "Isometric", description: "Muscle produces force without changing length or moving the joint — holds under tension." },
  { id: "isolateral", name: "Iso-lateral", description: "Each side of the body works independently against its own resistance, exposing side-to-side imbalances." },
  { id: "mobility", name: "Mobility", description: "Actively moving a joint through its full available range of motion under control." },
  { id: "flexibility", name: "Flexibility", description: "Passively lengthening a muscle or tendon to increase resting range of motion." },
  { id: "speed", name: "Speed", description: "Maximizing rate of movement and limb turnover — short-duration, high-velocity linear work." },
  { id: "power", name: "Plyometrics / Power", description: "Rapid stretch-shortening cycle movements producing maximal force in minimal time." },
  { id: "cardio", name: "Cardiovascular / Endurance", description: "Sustained aerobic work training the heart, lungs, and muscular endurance over time." },
  { id: "agility", name: "Agility & Coordination", description: "Rapidly changing direction or speed while staying in control, and sequencing movement smoothly." },
  { id: "core", name: "Core / Trunk", description: "Muscles of the trunk that control and transfer force between the upper and lower body." },
  { id: "resistance", name: "Resistance Training", description: "General training against external resistance — bands, machines, and cables." },
  { id: "balance", name: "Balance", description: "Controlling the body's center of mass over its base of support, static or dynamic." },
  { id: "sport", name: "Sports Specific Training", description: "Movement patterns and drills that closely mimic the demands of a sport or obstacle race." },
];

const lib = (o) => ({ description: "", purpose: "", formCues: [], breathingCue: "", unilateral: false, ...o });

export const LIBRARY_EXERCISES = [
  // Strength
  lib({
    id: "lib-strength-1", category: "strength", name: "Barbell Back Squat",
    description: "A barbell rests across the upper back while you squat down until the hip crease passes below the knee, then drive back up to standing.",
    purpose: "Builds maximal lower-body strength across the quads, glutes, and hamstrings, and reinforces hip/knee/ankle coordination under load.",
    formCues: ["Brace the core before unracking the bar", "Knees track over the toes, not caving inward", "Keep weight balanced through the whole foot, not just the toes"],
    breathingCue: "Inhale and brace at the top; hold that brace through the descent and drive; exhale at or just past the sticking point on the way up.",
  }),
  lib({
    id: "lib-strength-2", category: "strength", name: "Conventional Deadlift",
    description: "A loaded barbell is lifted from the floor to hip level by extending the hips and knees together, keeping the bar close to the body.",
    purpose: "The most direct test and builder of total-body pulling strength — posterior chain, grip, and spinal bracing all under one load.",
    formCues: ["Bar stays over mid-foot the entire lift", "Neutral spine — no rounding of the lower back", "Push the floor away rather than yanking the bar up"],
    breathingCue: "Big breath into the belly and brace before the pull; hold it through the lift; exhale only once the bar passes the knees or the lift is complete.",
    isBackSafety: true,
  }),
  lib({
    id: "lib-strength-3", category: "strength", name: "Barbell Bench Press",
    description: "Lying on a flat bench, the bar is lowered to the mid-chest and pressed back to lockout.",
    purpose: "Primary builder of horizontal pressing strength in the chest, shoulders, and triceps.",
    formCues: ["Shoulder blades pulled back and down, pinned to the bench", "Slight arch, feet flat and driving into the floor", "Bar path is a slight diagonal, not straight up and down"],
    breathingCue: "Inhale on the way down, hold briefly at the chest, exhale forcefully as you press up and away from the sticking point.",
  }),
  lib({
    id: "lib-strength-4", category: "strength", name: "Weighted Pull-Up",
    description: "A pull-up performed with additional load (belt, vest, or dumbbell) once bodyweight reps are no longer challenging.",
    purpose: "Progressive overload for back and grip strength beyond what bodyweight alone can provide.",
    formCues: ["Full hang at the bottom before each rep", "Chin clears the bar, chest driving toward it", "Controlled descent — no dropping or bouncing at the bottom"],
    breathingCue: "Exhale through the pull to the top, inhale during the controlled lowering phase.",
  }),

  // Stability
  lib({
    id: "lib-stability-1", category: "stability", name: "Single-Leg Romanian Deadlift",
    description: "Standing on one leg, hinge at the hip while the free leg extends back, lowering a weight toward the floor before returning to standing.",
    purpose: "Trains hip and ankle stability under a hinge pattern, and exposes/corrects side-to-side hamstring or balance deficits.",
    formCues: ["Hips stay square to the floor throughout", "Soft bend in the standing knee, not locked", "Weight travels close to the standing leg"],
    breathingCue: "Inhale as you hinge and lower, exhale as you drive the hips forward back to standing.",
    unilateral: true,
  }),
  lib({
    id: "lib-stability-2", category: "stability", name: "Stability Ball Push-Up",
    description: "A push-up performed with hands (or feet) on a stability ball, adding a balance and core-control demand to the standard pressing pattern.",
    purpose: "Builds shoulder and core stability alongside pressing strength — the unstable surface forces continuous micro-corrections.",
    formCues: ["Keep the body in a straight line, no sagging hips", "Move slowly — speed defeats the point of the instability", "Brace the core hard before lowering"],
    breathingCue: "Inhale on the way down, exhale as you press back up.",
  }),
  lib({
    id: "lib-stability-3", category: "stability", name: "Half-Kneeling Landmine Press",
    description: "From a half-kneeling position, a landmine-anchored barbell is pressed overhead and away from the body with one arm.",
    purpose: "Combines anti-rotation core control with single-arm pressing — carries over well to athletic pressing under fatigue.",
    formCues: ["Front knee, hip, and shoulder stacked vertically", "Ribs stay down — avoid arching to compensate", "Press travels in a slight arc, not straight up"],
    breathingCue: "Exhale on the press, inhale on the return to the shoulder.",
    unilateral: true,
  }),
  lib({
    id: "lib-stability-4", category: "stability", name: "Single-Arm Farmer's Carry",
    description: "Carrying a single heavy weight in one hand for distance or time while keeping the torso upright and level.",
    purpose: "Trains anti-lateral-flexion core stability and grip endurance under an offset load.",
    formCues: ["Shoulders stay level — resist leaning away from the load", "Tall posture, ribs stacked over the pelvis", "Short, controlled steps, not a stumbling gait"],
    breathingCue: "Steady, rhythmic breathing through the carry — don't hold your breath for the duration.",
    unilateral: true,
  }),

  // Isometric
  lib({
    id: "lib-isometric-1", category: "isometric", name: "Plank Hold",
    description: "A front-facing hold on the forearms and toes, keeping the body in a straight line from head to heels.",
    purpose: "Builds anti-extension core endurance and teaches full-body bracing without any joint movement.",
    formCues: ["Ribs pulled down, no sagging in the lower back", "Squeeze the glutes to keep the hips from piking up", "Neck neutral, eyes toward the floor"],
    breathingCue: "Breathe in a slow, controlled rhythm throughout — don't lock the breath, which raises intra-abdominal pressure unnecessarily.",
  }),
  lib({
    id: "lib-isometric-2", category: "isometric", name: "Wall Sit",
    description: "Back flat against a wall, knees bent to roughly 90°, holding the seated position without a chair.",
    purpose: "Builds quad and glute isometric endurance, useful for athletes who need to hold a low, ready athletic stance.",
    formCues: ["Knees stay above the ankles, not pushed past the toes", "Full back contact with the wall", "Weight distributed evenly through both feet"],
    breathingCue: "Slow nasal breathing throughout; exhaling fully helps manage the burning sensation without breaking form.",
  }),
  lib({
    id: "lib-isometric-3", category: "isometric", name: "Isometric Mid-Range Bench Press Hold",
    description: "The barbell is paused and held motionless at the mid-point of the bench press range for a set duration.",
    purpose: "Builds positional strength and confidence at a specific sticking point in the press.",
    formCues: ["Full-body tension, not just the arms", "Shoulder blades stay pinned back", "Choose a load you can hold with control, not just briefly survive"],
    breathingCue: "Take controlled breaths during the hold rather than holding your breath for the full duration.",
  }),
  lib({
    id: "lib-isometric-4", category: "isometric", name: "Glute Bridge Hold",
    description: "Lying on the back with knees bent, the hips are lifted and held at the top position, squeezing the glutes.",
    purpose: "Isolates and trains sustained glute activation, useful for correcting under-active glutes in runners and lifters.",
    formCues: ["Squeeze the glutes hard at the top, not just lift with the lower back", "Ribs stay down, avoid over-arching", "Weight through the heels, not the toes"],
    breathingCue: "Exhale as you lift into the hold, then breathe steadily while holding the top position.",
  }),

  // Iso-lateral
  lib({
    id: "lib-isolateral-1", category: "isolateral", name: "Single-Arm Dumbbell Row",
    description: "One hand and knee braced on a bench, a dumbbell is rowed from a hang to the hip with the free arm.",
    purpose: "Trains each side of the back independently, preventing a stronger side from compensating for a weaker one.",
    formCues: ["Pull with the elbow, not just the hand", "Avoid rotating the torso to help the weight up", "Full stretch at the bottom of each rep"],
    breathingCue: "Exhale on the pull up, inhale on the controlled lowering.",
    unilateral: true,
  }),
  lib({
    id: "lib-isolateral-2", category: "isolateral", name: "Iso-Lateral Chest Press (machine)",
    description: "A plate-loaded or pin-loaded press machine where each arm moves an independent lever, rather than one shared bar.",
    purpose: "Removes the ability for a dominant arm to take over the lift, evening out left/right pressing strength over time.",
    formCues: ["Press both handles at the same tempo", "Keep shoulder blades set against the pad", "Full range without banging the weight stack"],
    breathingCue: "Exhale on the press, inhale on the return.",
    unilateral: true,
  }),
  lib({
    id: "lib-isolateral-3", category: "isolateral", name: "Bulgarian Split Squat",
    description: "The rear foot is elevated on a bench while the front leg performs a single-leg squat.",
    purpose: "Heavily loads one leg at a time, building unilateral leg strength and exposing side-to-side strength gaps.",
    formCues: ["Front shin stays close to vertical at the bottom", "Torso stays upright, don't lean forward to compensate", "Control the descent — don't drop into the bottom"],
    breathingCue: "Inhale on the way down, exhale driving back up.",
    unilateral: true,
  }),
  lib({
    id: "lib-isolateral-4", category: "isolateral", name: "Single-Arm Overhead Press",
    description: "A dumbbell or kettlebell is pressed overhead with one arm while the opposite side resists rotating.",
    purpose: "Builds pressing strength per side and heavily challenges anti-lateral-flexion core control at the same time.",
    formCues: ["Ribs stay down through the press, don't lean away from the load", "Press travels slightly back, ending over the ear, not in front of the face", "Brace the core hard before pressing"],
    breathingCue: "Exhale on the press up, inhale on the way back down.",
    unilateral: true,
  }),

  // Mobility
  lib({
    id: "lib-mobility-1", category: "mobility", name: "World's Greatest Stretch",
    description: "A multi-plane flow: from a deep lunge, the same-side hand reaches down, then rotates up and overhead, opening the hips, spine, and shoulders in sequence.",
    purpose: "One movement that actively opens hip flexors, hamstrings, thoracic spine, and shoulders — a common full-body warm-up.",
    formCues: ["Keep the back knee off the floor, engaged", "Rotate from the mid-back, not just the arm", "Move slowly through each phase rather than rushing the flow"],
    breathingCue: "Exhale into each new range as you reach it; use the exhale to sink slightly deeper.",
  }),
  lib({
    id: "lib-mobility-2", category: "mobility", name: "90/90 Hip Switch",
    description: "Seated on the floor with both knees bent at 90°, one in front and one to the side, the hips are actively rotated to switch which leg is in front.",
    purpose: "Builds active internal and external hip rotation range, directly useful for squatting depth and change-of-direction sports.",
    formCues: ["Keep both sit bones on the floor as long as possible", "Lead the switch with the hips, not by using the arms to muscle through", "Stay tall through the torso, don't collapse forward"],
    breathingCue: "Exhale as you rotate through the switch.",
  }),
  lib({
    id: "lib-mobility-3", category: "mobility", name: "Thoracic Spine Rotation (Open Book)",
    description: "Lying on one side with knees stacked and bent, the top arm opens across the body and rotates toward the floor behind you, following it with the eyes.",
    purpose: "Restores rotational range in the mid-back, which is commonly restricted and often mistaken for a shoulder mobility issue.",
    formCues: ["Keep the knees stacked and still — the rotation comes from the spine, not the hips", "Let the head and eyes follow the moving hand", "Move only as far as control allows, don't force the range"],
    breathingCue: "Exhale as you rotate open, inhale as you return to the start.",
  }),
  lib({
    id: "lib-mobility-4", category: "mobility", name: "Ankle Dorsiflexion Rock",
    description: "In a half-kneeling position, the front knee is driven forward over the toes while keeping the heel down, then rocked back.",
    purpose: "Improves ankle dorsiflexion range, which directly affects squat depth and running mechanics.",
    formCues: ["Heel stays glued to the floor throughout", "Knee tracks over the second/third toe, not caving inward", "Small controlled range — quality over how far the knee travels"],
    breathingCue: "Breathe naturally throughout; exhale gently as you rock into the deeper end range.",
  }),

  // Flexibility
  lib({
    id: "lib-flex-1", category: "flexibility", name: "Standing Hamstring Stretch",
    description: "One heel is placed on a slightly elevated surface with the knee straight, then the torso hinges forward from the hips.",
    purpose: "Increases resting hamstring length, which can reduce lower-back strain from a chronically tight posterior chain.",
    formCues: ["Hinge from the hips, keep the back flat rather than rounding", "Stop at a point of mild tension, not pain", "Keep the standing leg's knee soft"],
    breathingCue: "Long, slow exhales while holding — each exhale can allow a small amount of extra release.",
    unilateral: true,
  }),
  lib({
    id: "lib-flex-2", category: "flexibility", name: "Doorway Pec Stretch",
    description: "Forearm placed on a door frame at shoulder height, then the body steps forward and slightly rotates away.",
    purpose: "Lengthens the chest, which tends to shorten from heavy pressing volume and forward-hunched posture.",
    formCues: ["Keep the shoulder blade down, not shrugged toward the ear", "Step through slowly rather than lunging into it", "Adjust arm height to target upper vs. lower chest fibers"],
    breathingCue: "Exhale as you step into the stretch, then breathe steadily while holding.",
    unilateral: true,
  }),
  lib({
    id: "lib-flex-3", category: "flexibility", name: "Couch Stretch (Hip Flexor)",
    description: "Rear foot propped up against a wall or couch behind you in a half-kneeling position, sinking the hips forward and down.",
    purpose: "Targets the hip flexors, which are commonly tight from prolonged sitting and can limit hip extension in running and sprinting.",
    formCues: ["Keep the torso upright, avoid leaning far forward", "Squeeze the glute on the stretched side to deepen it safely", "Ease into depth gradually over multiple breaths"],
    breathingCue: "Slow diaphragmatic breathing; a deep exhale often allows the hips to settle slightly deeper.",
    unilateral: true,
  }),
  lib({
    id: "lib-flex-4", category: "flexibility", name: "Cross-Body Shoulder Stretch",
    description: "One arm is drawn straight across the chest and gently pulled closer with the opposite hand or forearm.",
    purpose: "Lengthens the posterior shoulder and upper back, commonly tight from pressing-dominant training.",
    formCues: ["Keep the shoulder of the stretched arm down, away from the ear", "Pull from the upper arm, not by yanking the wrist", "Avoid rotating the torso to fake extra range"],
    breathingCue: "Exhale into the stretch, hold with steady breathing.",
    unilateral: true,
  }),

  // Speed
  lib({
    id: "lib-speed-1", category: "speed", name: "Acceleration Sprints (10–20m)",
    description: "Short, maximal-effort sprints from a stationary or rolling start, focused purely on the first several strides.",
    purpose: "Trains the acceleration phase of sprinting — the most obstacle-race and field-sport relevant part of top-end speed.",
    formCues: ["Aggressive forward lean out of the start", "Drive the knees, punch the arms front-to-back", "Full recovery between reps — this is a quality-over-fatigue drill"],
    breathingCue: "Take a full breath before each rep; sprint effort itself doesn't allow for controlled breathing, so recovery breathing matters most between reps.",
  }),
  lib({
    id: "lib-speed-2", category: "speed", name: "Resisted Sled Sprint",
    description: "Sprinting while pulling or pushing a lightly loaded sled, adding resistance to the acceleration pattern.",
    purpose: "Reinforces proper forward-lean sprint mechanics by making it physically necessary to drive hard off the ground.",
    formCues: ["Keep the lean coming from the ankles, not just bending at the waist", "Full extension through the driving leg each stride", "Load light enough that sprint mechanics don't break down"],
    breathingCue: "Forceful exhales timed with each hard drive step.",
  }),
  lib({
    id: "lib-speed-3", category: "speed", name: "A-Skip",
    description: "A skipping drill emphasizing a high knee drive paired with an active, clawing foot strike under the hips.",
    purpose: "Reinforces proper sprint mechanics — knee drive, foot strike position, and arm action — at a controllable speed.",
    formCues: ["Knee drives to hip height", "Foot strikes actively under the hips, not out in front", "Opposite arm drives forward in sync with the knee"],
    breathingCue: "Rhythmic breathing matched to the skip cadence.",
  }),
  lib({
    id: "lib-speed-4", category: "speed", name: "Fast Feet Drill",
    description: "Rapid, small, quick steps in place or over a short distance, emphasizing ground contact speed over stride length.",
    purpose: "Trains fast-twitch firing rate and quick ground contact time, useful for first-step quickness in agile sports.",
    formCues: ["Stay on the balls of the feet", "Keep the torso tall and relaxed", "Prioritize turnover speed over how high the knees come up"],
    breathingCue: "Short, controlled breaths matched to the quick tempo of the drill.",
  }),

  // Plyometrics / Power
  lib({
    id: "lib-power-1", category: "power", name: "Box Jump",
    description: "A two-foot jump from the ground onto an elevated box, landing softly in a stable squat position.",
    purpose: "Trains vertical power output and teaches safe, absorbable landing mechanics.",
    formCues: ["Land quietly, absorbing through the hips and knees", "Step down off the box rather than jumping down", "Full reset between reps — this is a quality movement, not a conditioning tool"],
    breathingCue: "Exhale explosively on the jump, inhale during the reset before the next rep.",
  }),
  lib({
    id: "lib-power-2", category: "power", name: "Broad Jump",
    description: "A maximal-effort two-foot jump for horizontal distance, landing balanced and under control.",
    purpose: "Trains horizontal power production, which transfers directly to sprinting and change-of-direction sports.",
    formCues: ["Use a full arm swing to help drive the jump", "Land with knees bent, absorbing forward momentum", "Stick the landing before resetting for the next rep"],
    breathingCue: "Exhale forcefully through the jump, inhale during the reset.",
  }),
  lib({
    id: "lib-power-3", category: "power", name: "Medicine Ball Chest Pass",
    description: "A medicine ball is pressed and thrown explosively away from the chest, often against a wall or to a partner.",
    purpose: "Trains upper-body power output at speeds too fast to safely train with a barbell.",
    formCues: ["Full extension through the arms at release", "Drive from the legs and hips, not just the arms", "Catch and reset with control before the next rep"],
    breathingCue: "Sharp exhale on the release of the ball.",
  }),
  lib({
    id: "lib-power-4", category: "power", name: "Depth Jump",
    description: "Stepping off a low box, then immediately jumping maximally upon landing, minimizing ground contact time.",
    purpose: "An advanced reactive-strength drill training the stretch-shortening cycle — how quickly force can be absorbed and redirected.",
    formCues: ["Step off, don't jump off the box", "Minimize time on the ground between landing and jumping again", "Only appropriate once basic jump landing mechanics are solid"],
    breathingCue: "Exhale sharply on the reactive jump.",
  }),

  // Cardiovascular / Endurance
  lib({
    id: "lib-cardio-1", category: "cardio", name: "Steady-State Incline Walk",
    description: "Walking at a brisk pace on an inclined treadmill or hill for a sustained duration at a conversational effort.",
    purpose: "Low-impact aerobic base-building that's easy to recover from, useful alongside heavy lifting days.",
    formCues: ["Tall posture, don't hold the handrails", "Consistent, moderate pace — should be able to hold a conversation", "Arms swing naturally rather than staying rigid"],
    breathingCue: "Steady nasal or mixed nasal/mouth breathing at a conversational pace throughout.",
  }),
  lib({
    id: "lib-cardio-2", category: "cardio", name: "Interval Bike Sprints",
    description: "Alternating short bursts of maximal-effort cycling with longer periods of easy spinning to recover.",
    purpose: "Builds both aerobic capacity and anaerobic power in the same session, with low joint impact.",
    formCues: ["Maintain a stable upper body during the hard efforts", "Full, controlled recovery between hard intervals", "Increase resistance rather than just spinning faster if the bike allows"],
    breathingCue: "Deep recovery breathing during easy intervals to prepare for the next hard effort.",
  }),
  lib({
    id: "lib-cardio-3", category: "cardio", name: "Rowing Machine Intervals",
    description: "Structured work-to-rest intervals on a rowing ergometer, combining full-body effort with cardiovascular demand.",
    purpose: "Trains conditioning while also reinforcing a hip-hinge pattern, useful as active recovery from heavy lower-body lifting.",
    formCues: ["Drive with the legs first, then lean back, then pull with the arms", "Reverse the sequence on the return: arms, then hips, then legs", "Keep the back flat throughout, no rounding"],
    breathingCue: "Exhale on the drive, inhale on the recovery slide forward.",
  }),
  lib({
    id: "lib-cardio-4", category: "cardio", name: "Jump Rope Circuit",
    description: "Sustained or interval jump-rope work, cycling through basic bounces, alternating feet, and high-knee variations.",
    purpose: "Builds cardiovascular conditioning alongside coordination and calf/ankle stiffness for running economy.",
    formCues: ["Small, quiet jumps — just enough clearance for the rope", "Elbows stay close to the body, wrists do the turning", "Land on the balls of the feet, not flat-footed"],
    breathingCue: "Rhythmic breathing matched to the jump cadence, exhaling every few skips.",
  }),

  // Agility & Coordination
  lib({
    id: "lib-agility-1", category: "agility", name: "Lateral Shuffle Drill",
    description: "Shuffling sideways between two cones or lines while staying low and facing forward the entire time.",
    purpose: "Builds lateral movement quality and hip mobility under speed, common in field-sport and obstacle-race change of direction.",
    formCues: ["Stay low, don't let the hips rise between shuffles", "Feet stay wide, avoid crossing them over", "Lead with the hip, not just reaching with the foot"],
    breathingCue: "Short, controlled breaths timed to the shuffle rhythm.",
  }),
  lib({
    id: "lib-agility-2", category: "agility", name: "5-10-5 Pro Agility Drill",
    description: "A sprint-and-cut drill: 5 yards one direction, 10 yards back the other way, then 5 yards back to the start, touching each line.",
    purpose: "Trains rapid deceleration, direction change, and re-acceleration — the core skill set of most field and obstacle sports.",
    formCues: ["Plant hard and low on each direction change", "Touch the line with the hand for a full, honest turn", "Explode out of each cut rather than coasting into the next segment"],
    breathingCue: "Full breath before starting; effort is too high during the drill for controlled breathing, recover fully between reps.",
  }),
  lib({
    id: "lib-agility-3", category: "agility", name: "Ladder Icky Shuffle",
    description: "A footwork pattern through an agility ladder alternating in-in-out-out foot placement through each rung.",
    purpose: "Builds foot coordination and rhythm, translating to better body control during fast direction changes.",
    formCues: ["Stay on the balls of the feet throughout", "Keep the pattern rhythmic rather than rushed and sloppy", "Arms move naturally, don't let them go stiff"],
    breathingCue: "Steady breathing matched to the drill's rhythm.",
  }),
  lib({
    id: "lib-agility-4", category: "agility", name: "Reactive Ball Drop Drill",
    description: "A partner drops a ball from shoulder height without warning; the athlete reacts and catches it before the second bounce.",
    purpose: "Trains reaction time and hand-eye coordination under an unpredictable stimulus, rather than a pre-planned movement.",
    formCues: ["Start in an athletic ready position, weight balanced", "React with the whole body, not just reaching with one arm", "Reset fully between reps to keep each one a true reaction"],
    breathingCue: "Stay relaxed with normal breathing in the ready position — tension in the breath slows reaction time.",
  }),

  // Core / Trunk
  lib({
    id: "lib-core-1", category: "core", name: "Dead Bug",
    description: "Lying on the back with arms and knees at 90°, one arm and the opposite leg extend and lower toward the floor without the lower back arching off the ground.",
    purpose: "Teaches anti-extension core control and coordination between opposite limbs while keeping the spine neutral.",
    formCues: ["Lower back stays pressed into the floor the entire time", "Move slowly — this is a control drill, not a speed drill", "Only lower the limbs as far as the back can stay flat"],
    breathingCue: "Exhale as the arm and leg extend away from the body, inhale as they return to center.",
    unilateral: true,
  }),
  lib({
    id: "lib-core-2", category: "core", name: "Pallof Press",
    description: "Standing side-on to a cable or band anchor, the handle is pressed straight out from the chest and back, resisting the pull that wants to rotate the torso.",
    purpose: "Trains anti-rotation core strength — the ability to resist an unwanted twisting force.",
    formCues: ["Hips and shoulders stay square to the front the entire time", "Press straight out, not at an angle toward the anchor", "Brace before the press, not after resistance is felt"],
    breathingCue: "Exhale on the press out, inhale on the return to the chest.",
    unilateral: true,
  }),
  lib({
    id: "lib-core-3", category: "core", name: "Hanging Leg Raise",
    description: "Hanging from a bar, the legs are raised toward the chest or to parallel using controlled abdominal contraction rather than momentum.",
    purpose: "Builds lower-abdominal and hip-flexor strength through a full range of motion.",
    formCues: ["Avoid swinging — control the tempo up and down", "Curl the pelvis under at the top rather than just lifting straight legs", "Keep the shoulders engaged, not just hanging passively"],
    breathingCue: "Exhale as the legs raise, inhale on the controlled lowering.",
  }),
  lib({
    id: "lib-core-4", category: "core", name: "Side Plank",
    description: "Propped on one forearm and the side of one foot, the body forms a straight line held against gravity's pull toward the floor.",
    purpose: "Trains anti-lateral-flexion strength in the obliques and lateral hip stabilizers.",
    formCues: ["Stack the hips directly over one another, don't let them rotate forward", "Keep the supporting elbow directly under the shoulder", "Squeeze the top glute to help keep the hips lifted"],
    breathingCue: "Steady breathing throughout the hold — don't brace so hard that breathing stops.",
    unilateral: true,
  }),

  // Resistance Training
  lib({
    id: "lib-resistance-1", category: "resistance", name: "Leg Press",
    description: "Seated or reclined in a machine, weight is pressed away using the legs through a fixed track.",
    purpose: "Loads the quads, glutes, and hamstrings heavily with less technical demand and lower back involvement than a squat.",
    formCues: ["Don't let the lower back round off the pad at the bottom", "Avoid locking the knees out hard at the top", "Feet placement shifts emphasis — higher on the platform biases glutes/hamstrings"],
    breathingCue: "Inhale as the sled lowers, exhale as you press it away.",
  }),
  lib({
    id: "lib-resistance-2", category: "resistance", name: "Lat Pulldown",
    description: "Seated at a cable machine, a bar is pulled from an overhead position down to the upper chest.",
    purpose: "Builds vertical pulling strength in the lats, a foundational pattern for pull-up progressions.",
    formCues: ["Lead the pull with the elbows, not the hands", "Avoid leaning back excessively to use momentum", "Control the weight back up to a full stretch"],
    breathingCue: "Exhale on the pull down, inhale on the controlled return.",
  }),
  lib({
    id: "lib-resistance-3", category: "resistance", name: "Resistance Band Row",
    description: "Anchored to a fixed point, a band is rowed back toward the torso, mimicking a cable or machine row.",
    purpose: "A portable, joint-friendly way to train the same pulling pattern as a cable row, useful when equipment is limited.",
    formCues: ["Squeeze the shoulder blades together at the end of the pull", "Keep the elbows close to the body", "Control the band back out rather than letting it snap forward"],
    breathingCue: "Exhale on the pull, inhale on the return.",
  }),
  lib({
    id: "lib-resistance-4", category: "resistance", name: "Cable Triceps Pushdown",
    description: "Standing at a cable stack, a bar or rope attachment is pressed down by extending the elbows.",
    purpose: "Isolates the triceps with constant tension throughout the range, complementing compound pressing work.",
    formCues: ["Keep the elbows pinned at the sides, not flaring out", "Avoid using body weight/leaning to move the bar", "Full extension at the bottom without hyperextending the elbow"],
    breathingCue: "Exhale on the press down, inhale on the controlled return.",
  }),

  // Balance
  lib({
    id: "lib-balance-1", category: "balance", name: "Single-Leg Balance Reach",
    description: "Standing on one leg, the free leg and opposite arm reach out in different directions while maintaining balance.",
    purpose: "Trains proprioception and ankle/hip stability, foundational for injury resilience in running and cutting sports.",
    formCues: ["Keep a slight bend in the standing knee, not locked", "Move slowly and with control, not rushed reaches", "Reset fully between directions if balance is lost"],
    breathingCue: "Normal, relaxed breathing — holding the breath tends to increase wobble, not reduce it.",
    unilateral: true,
  }),
  lib({
    id: "lib-balance-2", category: "balance", name: "Bosu Ball Single-Leg Stand",
    description: "Standing on one leg atop an unstable Bosu ball dome, holding a steady position for time.",
    purpose: "Adds an unstable surface to single-leg balance work, increasing the proprioceptive demand further.",
    formCues: ["Eyes forward on a fixed point to help stabilize", "Small, quick corrections rather than large overcorrections", "Keep the core braced throughout"],
    breathingCue: "Steady, relaxed breathing throughout the hold.",
    unilateral: true,
  }),
  lib({
    id: "lib-balance-3", category: "balance", name: "Heel-to-Toe Walk",
    description: "Walking in a straight line, placing the heel of the front foot directly against the toe of the back foot with each step.",
    purpose: "A simple, effective drill for dynamic balance and coordination, often used in rehab and warm-ups alike.",
    formCues: ["Arms out slightly for a counterbalance if needed", "Look ahead, not down at the feet", "Move at a controlled pace, not rushed"],
    breathingCue: "Normal breathing throughout — no need to hold the breath for a low-intensity drill like this.",
  }),
  lib({
    id: "lib-balance-4", category: "balance", name: "Single-Leg Deadlift Balance Reach",
    description: "A single-leg RDL pattern performed specifically for balance training rather than load — reaching toward the floor and back up with minimal or no weight.",
    purpose: "Bridges balance training and the hip-hinge pattern, building both stability and posterior chain awareness together.",
    formCues: ["Hips stay square, avoid opening up toward the ceiling", "Keep the reaching hand tracking toward the standing foot", "Move slowly enough to catch any balance loss early"],
    breathingCue: "Inhale on the way down, exhale returning to standing.",
    unilateral: true,
  }),

  // Sports Specific Training
  lib({
    id: "lib-sport-1", category: "sport", name: "Sled Push/Pull",
    description: "Pushing or pulling a weighted sled across a set distance, using a low, driving body position.",
    purpose: "Directly carries over to Spartan Race sled-drag/push obstacles and builds full-body work capacity under load.",
    formCues: ["Stay low with a strong forward lean on the push", "Drive through the whole foot, not just the toes", "Keep the arms extended and locked, let the legs do the work"],
    breathingCue: "Forceful exhales timed with each hard driving step.",
  }),
  lib({
    id: "lib-sport-2", category: "sport", name: "Farmer's Carry Medley",
    description: "A combination of carries — heavy two-hand carry, single-arm carry, and overhead carry — performed back to back for distance.",
    purpose: "Builds the grip, core, and carrying capacity directly relevant to Spartan Race bucket and sandbag carries.",
    formCues: ["Maintain tall posture across every carry variation", "Transition between carries without setting the weight down if possible", "Keep steps controlled, not rushed and sloppy"],
    breathingCue: "Steady rhythmic breathing throughout, adjusting pace to avoid breath-holding under the heavier holds.",
  }),
  lib({
    id: "lib-sport-3", category: "sport", name: "Battle Ropes",
    description: "Heavy ropes anchored at one end are whipped in alternating or double waves for a set time.",
    purpose: "High-intensity conditioning that also builds grip and shoulder endurance, transferring to sustained obstacle efforts.",
    formCues: ["Athletic stance, knees bent, core braced", "Waves originate from the shoulders, not just the wrists", "Keep a consistent rhythm rather than short all-out bursts followed by stopping"],
    breathingCue: "Fast, rhythmic breathing matched to the wave tempo — avoid holding the breath during the effort.",
  }),
  lib({
    id: "lib-sport-4", category: "sport", name: "Monkey Bar Hang & Traverse",
    description: "Hanging from and moving hand-over-hand across an overhead bar system, sometimes skipping bars for grip/reach practice.",
    purpose: "Directly trains the grip endurance and shoulder stability needed for Spartan Race monkey-bar-style obstacles.",
    formCues: ["Keep the shoulders engaged, not just passively hanging", "Swing with control, using momentum deliberately rather than flailing", "Look ahead to the next bar, not down at your hands"],
    breathingCue: "Steady breathing throughout; avoid holding the breath through the full traverse, which fatigues grip faster.",
  }),
];
