---
name: new-lesson-page
description: Add a new curriculum module to the Python or System Design track — validates it against content/schemas/courses.schema.json and re-renders the real track page. Use when asked to add a lesson, module, or curriculum topic to the Byte & Scale site.
---

# Add a curriculum module

This automates one repeatable frontend task on this site: adding a new
curriculum module means (a) adding a validated content entry and (b)
re-rendering the static page that displays it — by hand that's two
error-prone steps; this skill does both atomically.

## Steps

1. Collect from the user (ask if any are missing): `track` (`python` or
   `system-design`), `title`, `level` (`beginner`/`intermediate`/`advanced`),
   `duration_weeks` (1-12), `summary` (10-200 chars), `topics` (1-8 short
   strings), and optionally `prerequisites` (array of existing course ids —
   check `content/courses.json` for valid ids).

2. Run the automation script with a single JSON argument:

   ```bash
   node scripts/add-course-module.mjs '{"track":"python","title":"...","level":"intermediate","duration_weeks":2,"summary":"...","topics":["...","..."],"prerequisites":["..."]}'
   ```

   This script:
   - derives a kebab-case `id` from the title and the next `order` in that track,
   - appends the entry to `content/courses.json`,
   - validates the **entire** content directory against
     `content/schemas/*.schema.json` — if the new entry (or anything else)
     fails validation, it reverts `content/courses.json` and exits non-zero,
   - on success, re-runs `scripts/build.mjs`, which re-renders
     `python-track.html` or `system-design-track.html` (plus any other page
     that includes course data) from the now-updated content.

3. Do not hand-edit `content/courses.json` or the generated `*.html` pages
   directly for this task — always go through the script, so the schema
   validation and rebuild are guaranteed to run together. If the script
   rejects the input, fix the JSON object and re-run it; do not bypass it by
   editing the content file directly.

4. Report back which page changed and show the new module's rendered
   section (grep the relevant `.card-course` block out of the rebuilt HTML)
   as confirmation that the page, not just the data file, changed.
