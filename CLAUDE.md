# Byte & Scale — Python & System Design tutoring site

Static front end only — no database, no deployment, no AI eval in this repo
(that's a separate, later assignment). Everything here runs from disk or via
plain Node scripts.

See [`PLANNING_PROMPT.md`](PLANNING_PROMPT.md) for the full original plan
(pages, rationale, verification criteria) — read it before making structural
changes. See [`references/NOTES.md`](references/NOTES.md) for the real-site
evidence the design system is derived from.

## Commands

```
npm run validate   # validate content/*.json against content/schemas/*.schema.json (ajv)
npm run build      # validate, then render content/*.json onto pages/*.template.html -> *.html at repo root
```

`npm run build` always runs validation first and refuses to render if it
fails. There is no other way pages get their content — never hand-edit the
generated `*.html` files at the repo root; edit the `pages/*.template.html`
source or the `content/*.json` data and rebuild.

## Layout

- `content/*.json` + `content/schemas/*.schema.json` — the site's real content
  (courses, instructors, pricing, testimonials, schedule) and the JSON Schema
  "stated rules" each one must satisfy. `scripts/validate-content.mjs` checks
  schema conformance plus one extra rule schemas can't express: unique `id`s
  per file.
- `design-system/style-guide.md` — numbered rules (`COLOR-1`, `TYPE-2`,
  `RADIUS-3`, `SHADOW-1/2`, `SPACE-1`, ...), each citing which real reference
  site it came from. This is the single source of truth for "is this value
  allowed."
- `design-system/tokens.css` — one CSS custom property per rule, commented
  with the rule ID it implements.
- `design-system/component-specs.md` — which component class may use which
  token, under which rule.
- `design-system/base.css`, `design-system/components.css` — the
  implementation. No literal color/font/radius/shadow/spacing value belongs
  in either file — always a `var(--token)`.
- `pages/*.template.html` — page source, with `<!--NAV-->`, `<!--FOOTER-->`,
  and content placeholders (`<!--COURSES:python-->`,
  `<!--COURSES:system-design-->`, `<!--PRICING-->`, `<!--TESTIMONIALS-->`,
  `<!--INSTRUCTORS-->`, `<!--SCHEDULE-->`) that `scripts/build.mjs` fills in.
- `*.html` at repo root — generated output. Open these directly in a browser.
- `references/` — raw HTML/CSS pulled live from python.org, wyzant.com, and
  educative.io, plus `NOTES.md` summarizing the grep evidence each
  style-guide rule cites.
- `.claude/agents/design-system-auditor.md` — read-only subagent that scans
  HTML/CSS for literal values that bypass a token, citing the specific rule
  ID each violation breaks.
- `.claude/skills/new-lesson-page/` — wraps
  `scripts/add-course-module.mjs`, which appends a module to
  `content/courses.json`, validates, and rebuilds (reverting on validation
  failure). Use this — not a hand edit — to add curriculum content.

## Design-system discipline

Every color, font, border-radius, box-shadow, and spacing value in
`design-system/*.css` and in the page templates must be a `var(--token)`
defined in `tokens.css`. If you add a new component or edit an existing one,
either reuse an existing token or add a new token **and** a new numbered rule
in `style-guide.md` that cites real evidence (don't invent a rule after the
fact to justify a literal). Run the `design-system-auditor` subagent after
any CSS/markup change — it exists specifically to catch literals that slipped
through.

## Content discipline

Adding or editing course modules: use `scripts/add-course-module.mjs` (or the
`new-lesson-page` skill, which wraps it) — never hand-edit
`content/courses.json` directly for new entries, since the script is what
guarantees validation + rebuild happen together. Editing other content files
(`instructors.json`, `pricing.json`, `testimonials.json`, `schedule.json`)
directly is fine as long as you run `npm run validate` (or `npm run build`,
which includes it) afterward.
