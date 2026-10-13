# Planning-mode prompt (as-built record)

This is the detailed prompt this project was planned against — written up after
the fact as the prompt I would hand to Claude Code's plan mode to produce this
same build from scratch. Keep it in sync if the page set changes; it's the
source of truth for "what pages exist and why," which `CLAUDE.md` points back to.

---

**Prompt:**

Build the front end for "Byte & Scale," a tutoring service teaching Python and
System Design. No backend, no database, no deployment — static HTML/CSS/JS
only, openable directly from disk. Two deliberate layers of tooling on top of
the site itself: a design system with a subagent that audits pages against it,
and a skill that automates adding new curriculum content.

**Design system** — before any page markup, derive a style guide from real
reference sites (not invented from scratch): pull actual production CSS from
python.org (Python brand heritage), wyzant.com (1:1 tutoring marketplace
patterns), and educative.io (a system-design course competitor). Extract real
hex colors, font stacks, radii, and shadows via grep, and write every design
token and every style-guide rule to cite back to specific evidence from those
extracts. Deliverables: `references/` (raw pulls + `NOTES.md` summarizing the
grep evidence), `design-system/style-guide.md` (numbered rules, each citing a
reference), `design-system/tokens.css` (one CSS custom property per rule),
`design-system/component-specs.md` (which component uses which token, under
which rule), `design-system/base.css` + `design-system/components.css` (the
implementation).

**Structured content** — the site's real content (course curriculum,
instructor bios, pricing plans, testimonials, weekly schedule) lives as JSON
under `content/`, each validated against a JSON Schema under
`content/schemas/`. A page is never hand-authored with content baked in — it's
rendered from the validated JSON by `scripts/build.mjs`, which refuses to
render if `scripts/validate-content.mjs` fails. Pages:

1. **`index.html`** — home. Hero, stats row, a two-track overview (Python /
   System Design cards), a testimonials grid pulled from `testimonials.json`,
   and a newsletter signup banner.
2. **`python-track.html`** — the full Python curriculum, one `.card-course`
   per module from `courses.json` (`track: "python"`), in `order`.
3. **`system-design-track.html`** — same, for `track: "system-design"`, on a
   dark (`.section-dark`) hero to visually distinguish the track.
4. **`pricing.html`** — plans from `pricing.json`, one `.card-trust` each, the
   `highlighted` plan calling out "Most popular."
5. **`about.html`** — instructor bios from `instructors.json`.
6. **`contact.html`** — this week's open slots from `schedule.json`, a booking
   form (front-end only, no submission backend), and an FAQ accordion.
7. **`styleguide.html`** — living component reference, plus one worked example
   that traces a single component's value through its token to its
   style-guide rule to its reference evidence, with no gap in the chain.

**Subagent** — `.claude/agents/design-system-auditor.md`. Read-only
(`Read, Grep, Glob`). Given any HTML/CSS in the repo, it must find every
literal value that bypasses a token and cite the exact numbered rule it
breaks — never a vague "doesn't match the design system." Verify it by
planting three deliberate violations in one real component (a wrong literal
color, a wrong literal radius, a wrong literal font-family) and confirming the
agent's report names the correct rule ID for each.

**Skill** — `.claude/skills/new-lesson-page/`, wrapping
`scripts/add-course-module.mjs`: the one repeatable frontend task of "add a
curriculum module" done atomically — append to `courses.json`, validate, and
rebuild, reverting the content file if validation fails. Verify it by
capturing the module count/titles on a track page before running it, running
it once for a real new module, and diffing the same page after — the page
itself must change, not just the data file.

**Out of scope for this pass**: any live database, any deployment target, any
AI evaluation pipeline. Those are a separate assignment.
