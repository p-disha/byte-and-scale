# Byte &amp; Scale — Style Guide

Brand: a Python + System Design tutoring service. Every rule below was derived from
a real reference pulled into [`/references`](../references/NOTES.md) — see that file
for the exact `grep` evidence. Each rule has a stable ID (e.g. `COLOR-2`) that the
`design-system-auditor` subagent cites when it flags a violation, and that
[`design-system/tokens.css`](tokens.css) implements as one or more CSS custom
properties. The chain is meant to run in both directions: token → rule → reference,
and reference → rule → token.

## Color

- **COLOR-1 — Primary brand color is Python blue.**
  Nav, links, and primary buttons use `--color-primary` (`#3776ab`), with
  `--color-primary-dark` (`#2b5b84`) as its hover/active state.
  Source: `python-org.css`, the two most frequent non-neutral hex values on python.org.

- **COLOR-2 — Accent yellow is a highlight, never a fill.**
  `--color-accent` (`#ffd343`, Python's brand yellow) may only be used for
  underlines, small badges, or icon accents — never as a background fill larger
  than a badge or button. python.org itself uses this yellow the same way (47
  occurrences, all small accents; the blue carries every large surface).

- **COLOR-3 — Success green is reserved for confirmed actions.**
  `--color-success` (`#60ad56`) may only appear on a booking-confirmed state, a
  submitted-form state, or a "seats available" indicator — never decoratively.
  Source: wyzant.com uses this green exclusively for "booked" confirmation UI.

- **COLOR-4 — System Design track uses the indigo/navy pair, not the Python pair.**
  Anything scoped to the System Design track (badges, section headers, the track's
  card accent) uses `--color-indigo` (`#5553ff`) on `--color-ink` (`#0c1322`)
  instead of `--color-primary`/`--color-accent`. Source: educative.io's system
  design course page — a distinct indigo-on-navy palette, not python.org's blue/yellow.

- **COLOR-5 — Muted text on a dark surface uses `--color-text-muted-inverse`, not `--color-text-muted`.**
  `--color-text-muted` (`#4b5566`) is tuned for light backgrounds and is unreadable
  on `--color-ink`. Any muted/secondary text inside `.footer` or `.section-dark`
  must use `--color-text-muted-inverse` (`#9ca3af`) instead. Source: this is the
  exact muted gray educative.io uses for secondary text on its own dark/navy
  surfaces (see `references/NOTES.md`).

## Typography

- **TYPE-1 — Body copy uses the system sans stack, never a bare font name.**
  All prose uses `--font-body`, a `ui-sans-serif, system-ui, …` fallback chain
  (no network font dependency). Source: educative.io's own body font declaration.

- **TYPE-2 — Code and level badges use the python.org monospace stack verbatim.**
  Any `<code>`, code block, or difficulty badge uses `--font-mono`, which is
  copied unmodified from python.org's CSS (`Consolas, "Lucida Console", …`).

- **TYPE-3 — No inline `font-family` or `font-size` declarations.**
  Every element gets its type from a utility class or component rule that reads
  a token — never a one-off `style="font-size:…"` or a hardcoded `font-family`
  in a component's own CSS rule.

## Radius

- **RADIUS-1 — Badges, tags, and avatars are circular/pill: `--radius-pill` (999px).**
- **RADIUS-2 — Buttons and inputs use `--radius-md` (8px).**
  A blend of wyzant's 10px buttons and educative's smaller control radius.
- **RADIUS-3 — Cards use `--radius-lg` (10px).**
  Source: wyzant's cards and buttons cluster at exactly `10px`.

## Shadow

- **SHADOW-1 — Trust/marketing cards (pricing, testimonials, nav) use `--shadow-soft`.**
  A soft diffuse shadow (`0 1px 15px rgba(0,0,0,.12)`), copied from wyzant's card
  shadow pattern — the "marketplace trust" feel.

- **SHADOW-2 — Course/module cards use `--shadow-block`, not `--shadow-soft`.**
  A hard offset block shadow (`.35rem .35rem 0 var(--color-ink)`), the same shape
  as educative.io's module-tile shadow (`.5rem .5rem 0 <color>`) — this is what
  signals "technical/curriculum content" versus "marketing content" at a glance.
  A course card using the soft shadow, or a pricing card using the block shadow,
  is a violation of this rule.

## Spacing

- **SPACE-1 — All padding/margin/gap values come from the `--space-*` scale**
  (4/8/12/16/24/32/48/64px). No ad-hoc pixel values in component CSS.

## Rule of thumb for the auditor

If a color, font, radius, shadow, or spacing value in any HTML or CSS file in this
project is a literal (`#3776ab`, `10px`, `"Open Sans"`, …) instead of a
`var(--token-name)` reference, that is **always** a violation of whichever rule
category it falls under — cite the most specific rule ID above.
