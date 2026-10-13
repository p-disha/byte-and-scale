# new-lesson-page skill: before/after evidence

Governing files: [`.claude/skills/new-lesson-page/SKILL.md`](../.claude/skills/new-lesson-page/SKILL.md)
wrapping [`scripts/add-course-module.mjs`](../scripts/add-course-module.mjs).

Like the subagent, a project skill added mid-session isn't yet selectable by
name in that same session (skills also register at session start). The
automation it wraps was run directly instead — `scripts/add-course-module.mjs`
*is* the skill's step 2, so this exercises the exact same code path a future
session's `new-lesson-page` invocation would.

## Before

```
$ grep -c "card-course" python-track.html
6
$ grep -o '<h3>[0-9]*\. [^<]*</h3>' python-track.html
<h3>1. Python Foundations</h3>
<h3>2. Data Structures That Matter</h3>
<h3>3. Object-Oriented Python</h3>
<h3>4. Decorators &amp; Generators</h3>
<h3>5. Testing &amp; TDD</h3>
<h3>6. APIs &amp; Capstone Project</h3>
```

`content/courses.json` had 12 validated entries.

## Command run

```
node scripts/add-course-module.mjs '{"track":"python","title":"Async Python & Concurrency","level":"advanced","duration_weeks":2,"summary":"asyncio, coroutines, and when concurrency actually helps your program.","topics":["async/await syntax","Coroutines & the event loop","Threading vs. multiprocessing vs. asyncio","When concurrency does not help"],"prerequisites":["python-decorators-generators"]}'
```

Output:

```
✓ courses.json — valid (13 items)
✓ instructors.json — valid (3 items)
✓ pricing.json — valid (3 items)
✓ schedule.json — valid (6 items)
✓ testimonials.json — valid (4 items)
All content files valid.
built about.html
built contact.html
built index.html
built pricing.html
built python-track.html
built styleguide.html
built system-design-track.html

Added "Async Python & Concurrency" (async-python-concurrency) as module 7 of the python track, and rebuilt pages.
```

## After

```
$ grep -c "card-course" python-track.html
7
$ grep -o '<h3>[0-9]*\. [^<]*</h3>' python-track.html
<h3>1. Python Foundations</h3>
<h3>2. Data Structures That Matter</h3>
<h3>3. Object-Oriented Python</h3>
<h3>4. Decorators &amp; Generators</h3>
<h3>5. Testing &amp; TDD</h3>
<h3>6. APIs &amp; Capstone Project</h3>
<h3>7. Async Python &amp; Concurrency</h3>

$ grep -A6 "7\. Async Python" python-track.html
  <h3>7. Async Python &amp; Concurrency</h3>
  <p class="text-muted">asyncio, coroutines, and when concurrency actually helps your program.</p>
  <ul><li>async/await syntax</li><li>Coroutines &amp; the event loop</li><li>Threading vs. multiprocessing vs. asyncio</li><li>When concurrency does not help</li></ul>
  <p class="text-muted"><strong>Prerequisite:</strong> python-decorators-generators</p>
</div></div>
</section>
```

`content/courses.json` now has 13 validated entries. The real page
(`python-track.html`), not just the data file, changed — module count 6 → 7,
with the new module's title, level badge, duration, topic list, and
prerequisite all rendered correctly from the validated JSON.

## What the validation guard actually does

`add-course-module.mjs` writes the new entry, then runs
`scripts/validate-content.mjs`. If that fails — a bad enum value, a duplicate
id, anything the schemas in `content/schemas/` reject — the script reverts
`content/courses.json` to its pre-run contents and exits non-zero *before*
`scripts/build.mjs` ever runs, so a rejected module never reaches a page.
