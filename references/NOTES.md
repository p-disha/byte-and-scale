# Visual reference notes

Raw HTML + production CSS pulled live from three real sites on 2026-10-13, chosen
because each covers one half of this brand (Python heritage, tutoring-marketplace
trust patterns, system-design technical aesthetic). Codecademy's bundle was pulled
too but turned out to be mostly KaTeX math-rendering CSS — kept in the folder for
completeness but not used as a source below.

Every number in `design-system/style-guide.md` traces back to one of the greps
below. Re-run any grep against the saved file to reproduce the exact evidence.

## python.org — `python-org.css` (from `python-org.html`)

```
grep -oE '#[0-9a-fA-F]{3,6}\b' python-org.css | sort | uniq -c | sort -rn | head
   47 #ffd343   <- Python "yellow", used as a bright accent, never as a large fill
   35 #3776ab   <- Python "blue", the brand's primary color
   20 #2b5b84   <- darker blue, used for hover/pressed states on the primary blue
```

```
grep -oE 'font-family:[^;]+;' python-org.css
font-family: Consolas, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono",
  "Bitstream Vera Sans Mono", "Courier New", monospace, sans-serif;
```
Takeaway: a real, battle-tested monospace stack for code — no single font, a fallback chain.

## wyzant.com — `wyzant-1.css`, `wyzant-2.css` (from `wyzant.html`, a 1:1 tutoring marketplace)

```
grep -oE '#[0-9a-fA-F]{3,6}\b' wyzant-*.css | sort | uniq -c | sort -rn | head
   69 #fff
   40 #056fd2   <- primary CTA blue ("Find a tutor" buttons)
   36 #afabaa    29 #eceaea   <- neutral borders/backgrounds
   36 #60ad56   <- confirmation/success green (booking confirmed)
   23 #e9573f    9 #ed6d20   <- warm orange, used sparingly for highlight badges
```

```
grep -oE 'font-family:[^;}]+[;}]' wyzant-*.css
font-family:Open Sans,Tahoma,Geneva,Sans-Serif;
font-family:Ubuntu,Open Sans,Tahoma,Geneva,Sans-Serif;
```

```
grep -oE 'border-radius:[0-9.]+(px)' wyzant-*.css | sort | uniq -c | sort -rn | head
<cards and buttons cluster at 10px; pills/avatars use 1em/20px>
```

```
grep -oE 'box-shadow:[^;}]{1,80}' wyzant-*.css | head
box-shadow:0 0 10px 0 rgba(0,0,0,.1)
box-shadow:0 0 10px 0 rgba(0,0,0,.1),0 1px 15px 0 rgba(0,0,0,.15)
```
Takeaway: tutoring-marketplace trust pattern = soft diffuse shadow + a single saturated
CTA blue + a green reserved only for "booked/confirmed" states, never decorative.

## educative.io — `educative-*.css` (from `educative-systemdesign.html`, a system-design course page)

```
grep -oE '#[0-9a-fA-F]{3,6}\b' educative-*.css | sort | uniq -c | sort -rn | head
   57 #5553ff   <- primary indigo (buttons, links, active nav)
   57 #0c1322   <- near-black navy (headers, code blocks, dark sections)
   40 #374151    39 #c1c2c6   <- body text / mid-gray borders
   37 #cccbff    30 #7775ff   <- light indigo tints, used for hover and tag backgrounds
```

```
grep -oE 'font-family:[^;}]+[;}]' educative-*.css
font-family:ui-sans-serif,system-ui,BlinkMacSystemFont,Segoe UI,Inter,Apple Color
  Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol}
```

```
grep -oE 'border-radius:[0-9.]+(px|rem|em)' educative-*.css | sort | uniq -c | sort -rn | head
   33 border-radius:.25rem   19 border-radius:.375rem   11 border-radius:9999px
```

```
grep -oE 'box-shadow:[^;}]{1,80}' educative-*.css | head -2
box-shadow:0 0 .25rem rgba(0,0,0,.15),.5rem .5rem 0 #172963
box-shadow:0 0 .25rem rgba(0,0,0,.3),.5rem .5rem 0 #cccbff
```
Takeaway: technical-education pattern = deep navy + one saturated indigo, generous
radius (.25–.375rem) on cards, and a hard offset "block" shadow — not soft/diffuse —
on anything meant to feel like a clickable module tile.
