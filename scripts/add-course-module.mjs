// Repeatable frontend task: add one curriculum module, validated against
// content/schemas/courses.schema.json, then re-render it onto the real page.
// Usage: node scripts/add-course-module.mjs '<json object: track, title, level, duration_weeks, summary, topics[], prerequisites[]?>'
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const coursesPath = join(root, "content", "courses.json");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const input = JSON.parse(process.argv[2]);
for (const field of ["track", "title", "level", "duration_weeks", "summary", "topics"]) {
  if (input[field] === undefined) {
    console.error(`Missing required field: ${field}`);
    process.exit(1);
  }
}

const original = readFileSync(coursesPath, "utf8");
const courses = JSON.parse(original);

const sameTrack = courses.filter((c) => c.track === input.track);
const order = sameTrack.length ? Math.max(...sameTrack.map((c) => c.order)) + 1 : 1;
const id = slugify(input.title);

if (courses.some((c) => c.id === id)) {
  console.error(`A module with id "${id}" already exists — choose a different title.`);
  process.exit(1);
}

const newModule = {
  id,
  track: input.track,
  title: input.title,
  level: input.level,
  duration_weeks: input.duration_weeks,
  order,
  summary: input.summary,
  topics: input.topics,
  ...(input.prerequisites ? { prerequisites: input.prerequisites } : {}),
};

courses.push(newModule);
writeFileSync(coursesPath, JSON.stringify(courses, null, 2) + "\n");

try {
  execFileSync(process.execPath, [join(root, "scripts", "validate-content.mjs")], {
    stdio: "inherit",
    cwd: root,
  });
} catch (err) {
  console.error(`\nNew module failed content validation — reverting content/courses.json.`);
  writeFileSync(coursesPath, original);
  process.exit(1);
}

execFileSync(process.execPath, [join(root, "scripts", "build.mjs")], {
  stdio: "inherit",
  cwd: root,
});

console.log(`\nAdded "${newModule.title}" (${id}) as module ${order} of the ${input.track} track, and rebuilt pages.`);
