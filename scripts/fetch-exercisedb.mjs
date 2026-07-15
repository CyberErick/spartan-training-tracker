// One-time fetch of the full ExerciseDB (AscendAPI) dataset into a static JSON
// file bundled with the app. Run locally with your own API key — the key
// never reaches the client or GitHub. Usage:
//   node --env-file=.env scripts/fetch-exercisedb.mjs

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.EXERCISEDB_API_KEY;
const API_HOST = process.env.EXERCISEDB_API_HOST;

if (!API_KEY || !API_HOST) {
  console.error("Missing EXERCISEDB_API_KEY or EXERCISEDB_API_HOST — check your .env file.");
  process.exit(1);
}

const BASE_URL = `https://${API_HOST}/api/v1`;
const HEADERS = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}) for ${url}: ${text}`);
  }
  return res.json();
}

async function fetchReferenceList(name) {
  try {
    const json = await getJson(`${BASE_URL}/${name}`);
    const list = json.data || json;
    console.log(`✓ ${name}: ${Array.isArray(list) ? list.length : "?"} entries`);
    return list;
  } catch (e) {
    console.warn(`⚠ Could not fetch ${name}: ${e.message}`);
    return [];
  }
}

async function fetchAllExercises() {
  const all = [];
  let cursor = null;
  let page = 0;
  while (true) {
    page += 1;
    const url = `${BASE_URL}/exercises?limit=100${cursor ? `&after=${cursor}` : ""}`;
    const json = await getJson(url);
    const batch = json.data || [];
    all.push(...batch);
    process.stdout.write(`\rFetching exercises… page ${page}, total so far: ${all.length}`);
    if (!json.meta || !json.meta.hasNextPage) break;
    cursor = json.meta.nextCursor;
    // Small delay to stay well within rate limits.
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log("");
  return all;
}

async function main() {
  console.log("Fetching reference lists…");
  const [muscles, bodyParts, equipments, exerciseTypes] = await Promise.all([
    fetchReferenceList("muscles"),
    fetchReferenceList("bodyparts"),
    fetchReferenceList("equipments"),
    fetchReferenceList("exercisetypes"),
  ]);

  console.log("Fetching all exercises (this may take a bit)…");
  const exercises = await fetchAllExercises();
  console.log(`✓ Total exercises fetched: ${exercises.length}`);

  const outDir = path.resolve("src/library/generated");
  await mkdir(outDir, { recursive: true });

  await writeFile(path.join(outDir, "exercises.json"), JSON.stringify(exercises));
  await writeFile(
    path.join(outDir, "taxonomy.json"),
    JSON.stringify({ muscles, bodyParts, equipments, exerciseTypes }, null, 2)
  );

  console.log(`\nWrote src/library/generated/exercises.json (${exercises.length} exercises)`);
  console.log("Wrote src/library/generated/taxonomy.json (muscles/bodyParts/equipments/exerciseTypes)");
}

main().catch((e) => {
  console.error("\nFetch failed:", e.message);
  process.exit(1);
});
