# Fresh-session CLAUDE.md pickup test

Goal: confirm that `CLAUDE.md` gives a brand-new session (zero memory of how
this project was built) enough context to work correctly without the context
being re-explained.

## Method

A general-purpose subagent with no prior turns in this conversation was given
only this instruction: read `CLAUDE.md` at the repo root, use only that (plus
whatever else it chose to read in the repo) to answer four questions, and not
ask anything back.

## Questions asked and answers received (verbatim)

> 1. What is the exact command (and which script does it wrap) to correctly
>    add a new curriculum module to this site, and why is hand-editing
>    content/courses.json directly discouraged?

> **Command/script**: Use the `new-lesson-page` skill
> (`.claude/skills/new-lesson-page/`), which wraps
> `scripts/add-course-module.mjs` — per `CLAUDE.md` lines 53-56, 71-74. That
> script appends a module to `content/courses.json`, validates, and rebuilds,
> **reverting on validation failure**. Hand-editing `content/courses.json` is
> discouraged because the script is what guarantees validation + rebuild
> happen together — a manual edit could leave invalid/unvalidated content
> with no rebuild (`CLAUDE.md`, "Content discipline" section).

> 2. Which file defines the numbered rule(s) governing when a card should use
>    the "soft" shadow versus the "block" shadow, and what are those rule IDs?

> **File**: `design-system/style-guide.md`, "Shadow" section (lines 65-76).
> Rule IDs: **SHADOW-1** (trust/marketing cards — pricing, testimonials, nav
> — use `--shadow-soft`) and **SHADOW-2** (course/module cards use
> `--shadow-block`, not soft).

> 3. Run `npm run validate` in the repo root and report its exit status and
>    output.

> Ran `npm run validate` in repo root → **exit status 0**. Output:
> ```
> ✓ courses.json — valid (13 items)
> ✓ instructors.json — valid (3 items)
> ✓ pricing.json — valid (3 items)
> ✓ schedule.json — valid (6 items)
> ✓ testimonials.json — valid (4 items)
> All content files valid.
> ```

> 4. Where did the real-world evidence for this project's design tokens come
>    from, and name at least two of the specific source sites.

> Evidence came from **raw HTML/CSS pulled live from real sites**, stored in
> `references/` and summarized with grep evidence in `references/NOTES.md`.
> Specific sources: **python.org** (brand colors/monospace font stack),
> **wyzant.com** (tutoring-marketplace trust pattern), and **educative.io**
> (system-design technical aesthetic). Codecademy's CSS was also pulled but
> not used as a source.

## Result

All four answers were correct, specific, and cited the exact file/line they
came from — the agent never asked a clarifying question and never guessed at
a command or file name that doesn't exist. Cost: **32,021 tokens**, 5 tool
calls, ~25 seconds.
