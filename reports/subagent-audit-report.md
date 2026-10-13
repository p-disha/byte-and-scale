# design-system-auditor: violation test report

Governing file: [`.claude/agents/design-system-auditor.md`](../.claude/agents/design-system-auditor.md)
(read-only — `Read`, `Grep`, `Glob` only).

Project agents register with Claude Code's `Agent` tool at session start, so a
subagent added mid-session isn't yet selectable by name in that same session.
To test it anyway, a fresh general-purpose agent (no prior context on this
repo or conversation) was told to read the auditor's persona file and adopt
it exactly — same instructions, same tool restriction, same output contract —
which is what the file itself will drive once a new Claude Code session picks
it up natively.

## Setup: three deliberate violations in one real component

A genuine new component was added — a newsletter signup banner, wired into
`index.html`'s home page — with three planted violations in
`design-system/components.css`:

```css
.newsletter-banner {
  background: #3776ab;              /* should be var(--color-primary) */
  border-radius: 6px;               /* should be var(--radius-md) */
  padding: var(--space-5);
  font-family: Arial, sans-serif;   /* should be var(--font-body) */
  color: var(--color-paper);
  text-align: center;
}
```

## Run 1 — with violations present

The agent was pointed at `design-system/style-guide.md`,
`design-system/tokens.css`, `design-system/component-specs.md`, then told to
scan `design-system/components.css`, `design-system/base.css`, and
`pages/*.template.html`. Verbatim findings:

```
design-system/components.css:108 — color: #9ca3af;
  Rule violated: COLOR (style-guide.md "Rule of thumb for the auditor" — literal color outside tokens.css; no dedicated numbered COLOR-* rule covers generic muted text, but tokens.css already defines the semantic equivalent)
  Fix: replace with var(--color-text-muted)

design-system/components.css:125 — background: #3776ab;
  Rule violated: COLOR-1 (design-system/style-guide.md)
  Fix: replace with var(--color-primary) — this literal is an exact match for the Python-blue token

design-system/components.css:126 — border-radius: 6px;
  Rule violated: RADIUS (style-guide.md "Rule of thumb for the auditor" — literal radius value; no RADIUS-* ID is defined for banner-type containers, nearest token on the scale is --radius-md)
  Fix: replace with var(--radius-md)

design-system/components.css:128 — font-family: Arial, sans-serif;
  Rule violated: TYPE-1, TYPE-3 (design-system/style-guide.md)
  Fix: replace with var(--font-body)

pricing.html:44 — <div class="card card-course"> (Monthly Momentum plan — a pricing card)
  Rule violated: SHADOW-2 (design-system/style-guide.md) — "A course card using the soft shadow, or a pricing card using the block shadow, is a violation of this rule."
  Fix: use class="card card-trust" — pricing cards are trust/marketing content (SHADOW-1), not curriculum content
```

**5 violations found across 2 files.**

**Result: all 3 planted violations caught, each with the correct rule
category cited** (`COLOR-1` for the hex literal, the radius rule for the
6px literal — nearest named token `--radius-md`, and `TYPE-1`/`TYPE-3` for
the bare `font-family`). The agent also caught two real bugs that were not
planted on purpose:

- `components.css:108` — a literal `#9ca3af` on `.footer .text-muted`
  (introduced while writing the footer rule, not part of the plant).
- `pricing.html` — a build-script bug (`scripts/build.mjs` picked
  `card-course` instead of `card-trust` for the `highlighted` pricing plan),
  a genuine SHADOW-2 violation with no literal value involved at all —
  exactly the "wrong token pairing" case the auditor's instructions call out
  as worth double-checking.

## Fixes applied

- Added `COLOR-5` to `style-guide.md` and `--color-text-muted-inverse` to
  `tokens.css` (sourced from educative.io's own muted-gray value, already on
  file in `references/NOTES.md`) and pointed the footer rule at it.
- `.newsletter-banner` now uses `var(--color-primary)`, `var(--radius-md)`,
  `var(--font-body)`.
- `scripts/build.mjs`'s `renderPricingCard` now always emits `card-trust` for
  pricing cards, regardless of `highlighted`.

## Run 2 — after fixes, same scope plus every root HTML page

```
Result: 0 violations found across 16 files.
```

One sub-threshold note the agent flagged for a human (not a formal
violation): `.badge-track--system-design` uses `--color-indigo-tint` for
text where `component-specs.md` had documented `--color-indigo`. Resolved by
updating the spec to document the tint choice and why (contrast on the dark
`--color-ink` background) — both tokens are governed by `COLOR-4`, so this
was a documentation gap, not a design-system violation.
