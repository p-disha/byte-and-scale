# Component specs

Each spec lists the tokens a component is allowed to pull from and the
style-guide rule that requires it. Implementations live in
[`components.css`](components.css); class names below match exactly.

## `.btn` (and `.btn-primary`, `.btn-indigo`, `.btn-outline`)

| Property | Token | Rule |
|---|---|---|
| border-radius | `--radius-md` | RADIUS-2 |
| font-family | `--font-body` | TYPE-1, TYPE-3 |
| padding | `--space-3` `--space-5` | SPACE-1 |
| `.btn-primary` background | `--color-primary` | COLOR-1 |
| `.btn-primary:hover` background | `--color-primary-dark` | COLOR-1 |
| `.btn-indigo` background | `--color-indigo` | COLOR-4 |
| `.btn-outline` border/text | `--color-primary` | COLOR-1 |

## `.card` (base) and `.card-course`, `.card-trust`

| Property | Token | Rule |
|---|---|---|
| border-radius | `--radius-lg` | RADIUS-3 |
| padding | `--space-5` | SPACE-1 |
| `.card-trust` box-shadow (pricing, testimonial, instructor cards) | `--shadow-soft` | SHADOW-1 |
| `.card-course` box-shadow (curriculum module cards) | `--shadow-block` | SHADOW-2 |
| `.card-course` border | `--color-ink` (1px solid) | COLOR-4 |

`.card-course` and `.card-trust` are never combined on the same element — a
card is either a curriculum/technical card (block shadow) or a trust/marketing
card (soft shadow), never both. This is the single rule the
`design-system-auditor` subagent checks most often (SHADOW-1 / SHADOW-2).

## `.badge-level` (beginner / intermediate / advanced)

| Property | Token | Rule |
|---|---|---|
| border-radius | `--radius-pill` | RADIUS-1 |
| font-family | `--font-mono` | TYPE-2 |
| font-size | `--text-xs` | TYPE-3 |
| `.badge-level--beginner` background | `--color-success` tint | COLOR-3 (n/a — not a confirmation state, see note) |
| `.badge-level--advanced` background | `--color-indigo-tint` | COLOR-4 |

Note: level badges intentionally do *not* use `--color-success` for "beginner" —
that token is reserved for confirmed-booking states only (COLOR-3). Beginner
badges use a muted version of `--color-primary` instead.

## `.badge-track` (Python / System Design)

| Property | Token | Rule |
|---|---|---|
| `.badge-track--python` | `--color-primary` text, `--color-accent` underline | COLOR-1, COLOR-2 |
| `.badge-track--system-design` | `--color-indigo-tint` text on `--color-ink` background | COLOR-4 |

`.badge-track--system-design` uses the *tint* (`--color-indigo-tint`, `#cccbff`) rather than
the base `--color-indigo` (`#5553ff`) for its text color specifically for contrast on the
`--color-ink` background — both are COLOR-4 tokens, the tint is still governed by the same rule.

## `.nav`, `.footer`

| Property | Token | Rule |
|---|---|---|
| background | `--color-paper` | — |
| box-shadow (nav, on scroll) | `--shadow-soft` | SHADOW-1 |
| link color | `--color-primary`, hover `--color-primary-dark` | COLOR-1 |

## `.code-block`

| Property | Token | Rule |
|---|---|---|
| font-family | `--font-mono` | TYPE-2 |
| background | `--color-ink` | COLOR-4 |
| text color | `--color-paper` | — |
| border-radius | `--radius-md` | RADIUS-2 |

## `.input`, `.textarea`, `.select` (contact/booking form)

| Property | Token | Rule |
|---|---|---|
| border-radius | `--radius-md` | RADIUS-2 |
| border | `--color-border` (1px solid) | — |
| font-family | `--font-body` | TYPE-1 |
| focus border | `--color-primary` | COLOR-1 |
