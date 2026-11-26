# spem05 — Magnetic force on current-carrying wires (SPEM05)

- **book id**: `spem05` (never rename: it is the pen-ink storage key on every iPad)
- **form**: S5   **code**: SPEM05   **title**: Magnetic force on current-carrying wires   **topic**: E and M (Magnetic force)
- **source**: 12-page QUE + 12-page ANS, both A4 595.3 × 841.9 pt, text layer present
  (`Chapter 5 Current-carrying conductor in magnetic field 2026-27 @Uni.pdf` and `… (Ans) @Uni.pdf`)
- **ansPageOffset**: **0** (verified 2026-11-25: ANS page N carries the same running head and the same
  question numbers as QUE page N; the template default of −1 is wrong here)
- **status**: stage 2 done 2026-11-25 — pages rendered, 19 questions listed, answer regions computed,
  ANS crops taken. No solution written yet (`solutions.js` is still the template skeleton).

## How the answers show

`python tools/layout_triage.py spem05` (2026-11-25):

```
19 questions on 10 pages
 inline (fits the printed space): 19
 inline + space (page opens under it): 0
 no blank row to cut at: 0
VERDICT: inline answers (the usual in-page working)
```

So this book stays **inline**: the working is printed under its question, the page never opens.
`book.json` therefore has **no** `"answers": "cards"` (the repo has no book that uses cards yet).
Page 2 is the tightest (last gap 67.8 pt, blank band 9.0 pt) — watch it when the first solution
there is written.

## Sections

The chapter prints five headings; pages 7 and 8 are concept pages with no questions.

| id | label | pages | questions |
| --- | --- | --- | --- |
| `force` | Force on a current in a magnetic field | 1–5 | q1–q12 (12) |
| `parallel` | Force between parallel wires | 6 | q13 (1) |
| `turning` | Turning effect on a coil | 7, 9 | q14 (1) |
| `motor` | Electric motor and galvanometer | 8–11 | q15–q18 (4) |
| `torque` | Torque on a coil | 12 | q19 (1) |

`turning` and `motor` share page 9: q14 is the plain coil (turning effect, why it stops at the
vertical), q15 is already the d.c. motor. `motor` also carries q16–q17, the two galvanometer
questions on page 10, because the notes treat the moving-coil galvanometer as the same device family
(coil in a field, springs give the opposing torque).

## Question map

- **19 questions on 12 pages**, printed numbers **1–19**, no omitted number and no number printed
  twice (unlike spem02, which printed 33 twice).
- Per page: p1 2, p2 3, p3 2, p4 2, p5 3, p6 1, p7 0, p8 0, p9 2, p10 2, p11 1, p12 1.
- p7 has no question: it is the four-case figure set of the turning effect (couple on AB/CD, the
  four forces at the vertical, the coil by inertia, the coil settling vertical).
- p8 has no question: it is the whole "Electrical motor" concept page (speed factors, commutator and
  brushes, how a simple d.c. motor works, why curved magnets).
- **No printed worked examples** in this chapter: there is not one question whose answer is printed
  on the page. The only printed answers are the two formula boxes (p4 `F = BIl sinθ`, p6
  `F = μ₀I₁I₂l / 2πr`, p12 `τ = NBAI sinφ`) — those stay printed, no button.
- The anchored numbers all sit at x < 90 pt and nothing on the pages produced a false hit, so the
  scan list went into `book.json` unchanged.

## Answer regions

`extract_pages.py spem05` computed 19 regions; two things need attention before solutions are
written:

1. **Four questions got a 2 pt region** — the page has no free band under them, so the tool fell
   back to a 40 pt cut and then to the blank row itself:

   | question | page | computed region | what is under the question |
   | --- | --- | --- | --- |
   | q1 | 1 | `[66, 571.5, 546, 573.5]` | four printed answer boxes (a)–(d) fill the width |
   | q4 | 2 | `[66, 616.5, 546, 618.5]` | a printed field diagram across the page |
   | q8 | 4 | `[66, 308.1, 546, 310.1]` | the `F = BIl sinθ` box and a figure |
   | q10 | 5 | `[66, 174.0, 546, 176.0]` | a printed rod-on-rails figure |

   Each needs an explicit `extract.overrides.<q>.region` (a free column beside the figure) or a
   `space` that opens the page. **Not decided yet** — it is a per-question call once the working is
   laid out, and every region must be re-checked on `sheet-*.png`, because `check_book` cannot
   report a region that quietly swallows a printed box.
2. **Three regions are small but legal**: q2 `[66, 777.3, 498, 817.3]` (432 × 40), q18
   `[66, 769.3, 492, 817.3]` (426 × 48), q19 `[66, 769.2, 492, 817.2]` (426 × 48). q2 is a
   two-part direction question, q18 has five parts, so both will want `space`; q19 has two parts.

The rest are roomy: q7 282 × 202, q9 316 × 262, q13 378 × 286, q14 480 × 180, q15 336 × 226,
q16 328 × 142, q17 286 × 272.

## ANS crops

**33 crops** in `reference/ans/` (20 red boxes + 13 red-text clusters); `reference/ans_pages/` holds all
12 full-page previews.

| page | red boxes | red-text clusters |
| --- | --- | --- |
| 1 | 0 | 6 (q1 a–d, q2 a–b) |
| 2 | 1 | 0 |
| 3 | 3 | 0 |
| 4 | 3 | 0 |
| 5 | 4 | 0 |
| 6 | 2 | 0 |
| 7, 8 | 0 | 0 (concept pages, nothing to answer) |
| 9 | 2 | 0 |
| 10 | 3 | 1 (q16's "The coil turns in clockwise direction as viewed from P.") |
| 11 | 0 | 5 (q18: the red arrow on the drawing; "B: South C: North"; the two-line "No. It is because…"; the two-line "When the polarities of the battery E are reversed…unchanged."; the numbered list 1/2/3) |
| 12 | 2 | 1 ("clockwise", q19(a)) |

Pages 1, 10, 11 and 12 are the ones whose answers are **red text (and small red arrows) with no red
box**. `extract_ans_refs.py` now has a second pass for exactly this: red spans and small red line art
outside every box are clustered into crops (marks closer than 8 pt are merged). The 20 box crops keep
their file names and byte-for-byte content, so nothing that was already correct moved.

Both passes were checked on the contact sheet
`_demo/spem05-crops/new-crops-v2.png` (13 fallback crops); every one is a complete answer, including
the two answers that run to two lines.

Two tool traps found here and now written into `docs/01-workflow.md` stage 2 step 4:

- `Rect |= other` is **not** an in-place union in PyMuPDF — the first version of the cluster code
  dropped the second line of every two-line answer and cropped only line 1 (seen on p11 before the
  fix: "...broken and no current" with "flows in the coil." missing). The union is now written back.
- red **text** colour is an sRGB integer on the span, not a float tuple like a drawing's colour, so
  the two need separate tests (`is_red` / `is_red_int`).

## Known to-dos outside this log

- `books/spem05/solutions.js` is still the template skeleton (no question has an entry).
  `books/spem05/widgets.js` is the current template with an **empty `REGISTRY`**, which is what the
  skill asks for — the old marbles example is gone from `_template`, so nothing maths-specific can
  leak into this physics book. Animations get written here per question and registered one by one.
- `status` stays `draft` until the book is live; it is already listed in `books/catalog.json`, so the
  library shows it as a draft card.

## Open points for the teacher / Chief

1. **Topic string**: `E and M (Magnetic force)` was chosen to sit beside spem02's `E and M (Circuit)`.
   The notes' own running head says `E and M (Current carrying conductor in magnetic field)`. Say the
   word and it becomes that instead — it is one line in `book.json` and in the library card.
2. **q1 is a fill-in-the-box question** (four printed boxes (a)–(d) for one word each). Inline mode
   will print a short list under the question; if the teacher wants the words written *into* the
   printed boxes instead, that is the cards/`?`-chip mechanism, and it changes the book-level answer
   mode, so it is a user decision, not ours.
3. **p2 is the tightest page** (last gap 67.8 pt, blank band 9.0 pt); if a solution there turns out
   long, the page opens (`space`) — that shows up first in `sheet-02-p2.png`.
