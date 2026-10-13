# Byte & Scale — build summary

Python + System Design tutoring site, built per [`PLANNING_PROMPT.md`](../PLANNING_PROMPT.md).
Frontend/design-system work, subagent creation, and skill creation only — no
database, deployment, or AI eval in this repo.

## What's where

| Area | Path |
|---|---|
| Visual references (real sites, with grep evidence) | [`references/`](../references/) |
| Style guide, tokens, component specs | [`design-system/`](../design-system/) |
| Structured content + JSON Schemas | [`content/`](../content/) |
| Build pipeline (validate → render) | [`scripts/`](../scripts/) |
| Page templates | [`pages/`](../pages/) |
| Rendered site | repo root `*.html` |
| Design-system compliance subagent | [`.claude/agents/design-system-auditor.md`](../.claude/agents/design-system-auditor.md) |
| Curriculum-module skill | [`.claude/skills/new-lesson-page/`](../.claude/skills/new-lesson-page/) |
| Fresh-session context file | [`CLAUDE.md`](../CLAUDE.md) |
| Detailed reports | [`reports/subagent-audit-report.md`](subagent-audit-report.md), [`reports/skill-before-after.md`](skill-before-after.md), [`reports/fresh-session-test.md`](fresh-session-test.md) |

## Browser verification

All 7 generated pages were loaded headlessly (Playwright/Patchright) directly
from disk (`file://`) after the chromium browser binary was installed in this
environment:

```
index.html                 200, 0 console errors, 0 failed requests
python-track.html          200, 0 console errors, 0 failed requests
system-design-track.html   200, 0 console errors, 0 failed requests
pricing.html                200, 0 console errors, 0 failed requests
about.html                  200, 0 console errors, 0 failed requests
contact.html                 200, 0 console errors, 0 failed requests
styleguide.html              200, 0 console errors, 0 failed requests
```

Screenshots of the home page and style guide page are saved at the repo root
as `screenshot-index.png` and `screenshot-styleguide.png`.

## Traceability chain (the explicit pass condition)

Worked in full on `styleguide.html` for `.card-course`'s shadow:

1. **Component** — `.card-course` in `design-system/components.css`:
   `box-shadow: var(--shadow-block);`
2. **Token** — `design-system/tokens.css`:
   `--shadow-block: .35rem .35rem 0 var(--color-ink);`
3. **Style-guide rule** — `design-system/style-guide.md`, **SHADOW-2**:
   course/module cards use the hard block shadow, not the soft one.
4. **Reference evidence** — `references/NOTES.md`, educative.io section:
   `box-shadow:0 0 .25rem rgba(0,0,0,.15),.5rem .5rem 0 #172963`, grepped
   live from educative.io's production CSS.

No gap in the chain — the hex color cited in step 4 is a real, re-grep-able
value in `references/educative-*.css`, not an invented number.

## Tokens and sessions

- **Sessions:** 1 continuous conversation. Three subagent calls were spawned
  within it to test the auditor, the skill's automation, and the
  fresh-session pickup of `CLAUDE.md`.
- **Subagent tokens** (exact, from tool telemetry): audit run with
  violations **78,430**; re-audit clean **80,221**; fresh-session pickup
  test **32,021** — **190,672 tokens** across those three calls alone.
- **Main-session total:** not queryable from inside the session itself —
  run `/cost` in Claude Code for the authoritative figure, which includes
  the subagent totals above plus every direct file write, edit, and command
  run in this conversation.
