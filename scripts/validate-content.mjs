import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const schemaDir = join(contentDir, "schemas");

const ajv = new Ajv({ allErrors: true });

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const schemaFiles = readdirSync(schemaDir).filter((f) => f.endsWith(".schema.json"));

let hasError = false;

for (const schemaFile of schemaFiles) {
  const name = schemaFile.replace(".schema.json", "");
  const contentFile = join(contentDir, `${name}.json`);
  const schema = loadJson(join(schemaDir, schemaFile));
  const validate = ajv.compile(schema);

  let data;
  try {
    data = loadJson(contentFile);
  } catch (err) {
    console.error(`✗ ${name}.json — could not read/parse: ${err.message}`);
    hasError = true;
    continue;
  }

  const valid = validate(data);
  if (valid) {
    console.log(`✓ ${name}.json — valid (${data.length} item${data.length === 1 ? "" : "s"})`);
  } else {
    hasError = true;
    console.error(`✗ ${name}.json — ${validate.errors.length} violation(s):`);
    for (const err of validate.errors) {
      const loc = err.instancePath || "(root)";
      console.error(`    ${loc} ${err.message} ${JSON.stringify(err.params)}`);
    }
  }

  // Extra rule beyond JSON Schema's reach: ids must be unique within the file.
  if (Array.isArray(data)) {
    const ids = data.map((item) => item.id).filter(Boolean);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) {
      hasError = true;
      console.error(`✗ ${name}.json — duplicate id(s): ${[...new Set(dupes)].join(", ")}`);
    }
  }
}

if (hasError) {
  console.error("\nContent validation FAILED.");
  process.exit(1);
} else {
  console.log("\nAll content files valid.");
}
