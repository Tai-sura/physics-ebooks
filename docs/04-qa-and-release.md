# QA and release

## 1. Preview locally

The reader loads its files as modules and JSON, so it must be served over HTTP; double-clicking `index.html` does not work.

```powershell
cd "<project folder>"
python -m http.server 8090
```

- This computer: <http://127.0.0.1:8090/>, then pick the book (or go straight to `reader.html?book=<id>`).
- iPad on the same Wi-Fi: start with `python -m http.server 8090 --bind 0.0.0.0`, then open `http://<this PC's IPv4 from ipconfig>:8090/`. Allow Python through Windows Firewall on private networks. Offline install needs https, so test that on the live site.

## 2. Automatic checks

```powershell
cd tools/qa
npm install                      # first time only
node check_book.mjs <id>         # checks only
node check_book.mjs <id> --shots # checks + screenshots in books/<id>/reference/qa/
```

The script serves the site itself, and opens the book in Chrome emulating an iPad: 1180 × 820, touch, Retina, with Pencil input sent as pen events. It reports:

| Result | Meaning | Fix |
| --- | --- | --- |
| FAIL no anchor found | A question in `book.json` is missing from `layout.json`. | Fix `extract.anchors` or `fixedAnchors`, then re-run `extract_pages.py`. |
| FAIL no entry in solutions.js | A question has no solution. | Add it, or remove it from `book.json`. |
| FAIL phrase not found | A link's `q` phrase doesn't match the printed words. | Copy the words exactly as printed; a phrase may wrap across lines. |
| FAIL no marked answer part | A link has nothing to point to. | Add `L()`, `lk()` or `[[key|…]]`. |
| FAIL underline does not sit under all of … | An answer underline is shorter than, or cuts through, the maths it marks (fractions, powers, roots). | A measuring bug in `inkRects()` in `engine/viewer/links.js`; the book content is fine. |
| FAIL graphic threw / drew nothing | A widget crashed. | Fix it in `widgets.js`. |
| FAIL page error / HTTP 404 | Broken code or a missing file. | Read the message. |
| FAIL Pencil stroke / finger tap | An input regression in the engine. | See [05-engine-notes.md](05-engine-notes.md). |
| WARN answer scrolls inside its region | The answer is taller than its region at the book's type size. | Acceptable for teaching; add `space` in `extract.overrides` when a short answer should show in full. |
| WARN shrunk to N % | The text was scaled down to fit. | Acceptable down to about 62 %. |

Exit code 0 means nothing blocks a release.

Two results are newer than the rest and protect against the fault that shipped in `p5m07a`:

| Result | Meaning | Fix |
| --- | --- | --- |
| FAIL answer region is inverted | `layout.json` has `region[3] < region[1]`: the reader would cut the page above the answer and the card would sit on the next question's text. | Re-run `extract_pages.py`; a page with no blank row needs `answerCards` (or `answers: "cards"`), not a hand-made region. |
| WARN answer region runs past the page | The region's bottom is below the page height (a footer, or a page grown by `relayout_pdf.py`). | Move the region up, or record the page's real height in `layout.json`. |

For a book with answer cards (`"answers": "cards"` or `answerCards`), also run:

```powershell
python -X utf8 tools/qa/check_answer_chips.py <id>
```

It maps every chip's `cardAt` back through the page JPEG and fails when a chip covers printed ink. `check_book` already opens every card once, so its fit and scroll warnings cover cards too.

Then check the printed page numbers, because a clean text layer does not prove a folio is visible:

```powershell
python tools/qa/check_folio.py <id>      # --verbose lists every page
```

| Result | Meaning | Fix |
| --- | --- | --- |
| MISS pN | The folio's own box on `pages/pNN.jpg` is empty: the number was never drawn there, usually because a figure or a white box covers it. | Place the glyph by hand — [05-engine-notes.md](05-engine-notes.md) → Page numbers. |
| LOOK pN | Something else (a figure edge, a rule, a neighbour label) runs through the folio box, so the number may be unreadable. | Look at a 3× crop of the footer; if the number cannot be read, treat it as MISS. |

Run it on every book after any engine change, and on a book whenever its page images or `layout.json` are rebuilt. It is a standing part of the gate, not a one-off.

For a book with scenario boards (`"infographics": true`):

```powershell
node check_boards.mjs <id> [q1 q5 ...]
```

It draws every board with all its steps showing and reports handwriting that overlaps other handwriting, is crossed by a table rule, or runs off the board. Open the screenshots in `books/<id>/reference/boards/`: rings and braces must not cut through numbers, and labels must not sit on bar edges.

### The cut line: `check_cuts.py`

```powershell
py -3.12 tools/qa/check_cuts.py <id>
```

An inline answer opens the page by inserting a band across the **whole page width**
at `region[3]` (`growSheet()` in `engine/viewer/answers.js`), while `region` was
chosen from the answer column. The line can therefore run through a printed rule,
a figure or a box on the far side of the page, and the reader sees that shape torn
in two — not a moved answer, so `check_book` stays green. The script samples every
column of each cut line on `pages/pNN.jpg` (±1.5 pt) and fails on ink.

Physics books have 129 `space` keys across 19 books, so this check runs on every
book. Threshold note: a darkest value of 230–244 is page noise and can be ignored
after a look; anything below ~200 is printed ink and must be fixed by moving
`region[3]` to a row that is blank across the whole width.

This check was written for the maths book and ported back (2026-11-25). On the day it
arrived it flagged **34 lines across the 19 books**: 16 were page noise (darkest 218–244)
and **18 are printed ink** — `jpfm08` 12, `spem02` 5, `jm29c` 1. Every other book,
including `phy11` (19 lines), passes.

**Those 18 are recorded, not fixed.** The secondary books are finished, approved copies:
re-cutting a page moves every answer below the cut and changes a layout the teacher has
already seen. The maths book is the one where a cut must fall on blank paper, because its
figures cross the full page width. Treat that list as a warning to look at a cut before
reusing its region in a new book ? not as a licence to re-cut a published one.

## 3. Visual pass (screenshots)

Open every `sheet-*.png` and `graphic-*.png` in `books/<id>/reference/qa/` and check:

- [ ] every answer box sits inside its blank space with a margin, and covers no printed text;
- [ ] the controls don't overlap the boxes, the next question or the page edge;
- [ ] the maths renders properly: no raw LaTeX and no red KaTeX errors;
- [ ] review link boxes sit on their words, and the tags stay inside the page;
- [ ] graphics have no overlapping labels, and the question card matches the solution;
- [ ] a long answer scrolls inside its region with a visible bar; wheel and drag move the answer before the page.

## 4. iPad checklist (real device, Apple Pencil)

Run this on the live link after release, or on the local Wi-Fi preview.

- [ ] The library shows the book; tapping the card opens it; the top-left brand returns to the library.
- [ ] Every page shows its printed page number, and no figure line runs through it (`python tools/qa/check_folio.py <id>`).
- [ ] Pencil writing starts instantly, with no delay between strokes; a resting palm neither scrolls nor makes marks.
- [ ] One finger scrolls and two fingers pinch-zoom, in every tool.
- [ ] A tap in a box reveals one step; ▸ » ◂ ↺ work; Show all and Hide all work.
- [ ] Dashed review links open and close on tap (finger, or Pencil in Read mode).
- [ ] Every graphic opens, and its slider and buttons respond.
- [ ] Holding still at the end of a stroke snaps it to a line, circle, rectangle or triangle.
- [ ] Tapping ink opens the edit menu (colour, size, Shape, Copy, Delete, move, resize).
- [ ] A two-finger tap undoes and a three-finger tap redoes.
- [ ] Present mode works: swipe between pages, and only the Exit button leaves. On iPad it does not use Safari full screen (no "Swipe down to exit"), so a zoomed page scrolls up and down with one finger; desktop browsers go full screen, and Esc there only drops full screen. After a two-finger pinch, one-finger drags pan without leaving the zoom; a double tap returns to the whole page.
- [ ] Export PDF opens the share sheet.
- [ ] Rotate the iPad, then close and reopen the app: the ink is still there.

## 5. Release

0. **A physics book needs `physics-lead`'s content sign-off first.** It is a read-only pass,
   booked at intake rather than on the eve of release: the ANS reading, every solution's
   physics (direction, angle definition, units, significant figures), every widget's model
   against the printed figure, and any simplification that would teach a student something
   wrong. It ends with a per-question verdict (correct / problem + evidence + fix). Fix its
   findings first. A geometry measurement or a green `check_book` does not replace it:
   spem05 reached the live site with a q4 widget whose model was wrong, and both gates were
   green, because nobody but its author had ever read the physics.
1. **Every check in §2 must be 0 FAIL *and* 0 WARN.** A WARN is not a pass; bring it to
   zero or write down why it cannot be, before anything else.
2. Set `"status": "live"` in `books/<id>/book.json`, and make sure the id is in `books/catalog.json`.
3. Bump `CACHE` in `sw.js` (`ebooks-v5` → `ebooks-v6`). Never reuse a number and never
   publish without bumping it: iPads that already opened the site keep the old files.
4. Build the deploy clone from the source clone (`tools/build_deploy.ps1`). **Only the deploy
   clone pushes**; the source clone only commits. A build that copies `tools/` and `docs/`
   must filter the temp harnesses (`_*.py`, `_*.mjs`, `_*.html`) — they are not for the
   public repo.
5. Tag the rollback point **before** the release commit, and push the tag on its own:
   ```powershell
   git tag pre-<id>-vNNN <the commit before this release>
   git push origin refs/tags/pre-<id>-vNNN
   git ls-remote --tags origin | Select-String 'pre-<id>-vNNN'   # paste this as proof
   ```
   `git push` does **not** push tags, and `--tags` pushes every stray tag in the clone.
6. Confirm what the live site serves:
   ```powershell
   node tools/qa/check_live.mjs <id> --expect-cache ebooks-vNNN
   ```
   It reads the published `sw.js` cache, the book's `status` and the reader/layout/solutions
   responses. It must print `OK the live site serves this build`.
7. **Media releases are atomic.** The `mp4` and its `poster` change in the same batch, and
   `region` is never touched without re-checking the frame ratio. The poster is the video's
   **frame 0** (`ffmpeg -y -i <src> -vf "select=eq(n\,0)" -frames:v 1 <poster>`), pixel-identical
   to it (`PSNR inf`), and the animation starts and ends on that same image — never a fade to
   blank. The region is measured on the **printed frame lines** (ink bands at 1 pt = 3 px), not
   on a coloured fill.
8. On the iPad, close and reopen the app (or the tab) once, so it loads the new version.

**What is public.** The GitHub repo and Pages site are public. `.gitignore` keeps out the PDFs (`*.pdf`, `books/*/source/`) and the reference crops and screenshots (`books/*/reference/`). The page images, solutions and graphics are published.

## 6. Rolling back

- **One bad release:** `git revert <commit>`, then `git push`. Ink saved on iPads is untouched, because it lives in the browser, not in the repo.
- **An aesthetic experiment:** restore from the backup folder made before the change (e.g. `… (backup before review links)`), or `git checkout <commit> -- <files>`.
- **Never** change a live book's `id` or `storage`. The saved ink is keyed by `storage`.

## 7. Read the printed figure before you write a widget

A widget is only as right as the model behind it, and the model must come from the
**pixels**, not from the PDF text layer.

**First, get a picture.** If an image read comes back stripped (an "image omitted" or image-limit
notice), you have **not** seen the figure, and the text layer is not a substitute. Either open the
page crop yourself as pixels (below) or have a Bot crop and describe it, and say which one
happened. The wording is part of the rule: never write "I have seen the figure" — or tell the user
the question is clear — unless a measurement or a rendered crop backs it. On spem05 q4 that claim
reached the user while both image reads had in fact been dropped.

**A glyph is not a meaning.** `⊗` reaches the text layer as separate `○` and `×` glyphs, and a run
of `×` from a printed page can be cross-sections, check marks or a multiplication sign. Take the
shape from pixels; use the text layer only to find words and positions.

**Do not import a neighbouring question's words.** The model comes from *this* figure. spem05 q6
says in print that its crosses are a field, and that sentence is what contaminated q4.

**The failure this prevents (spem05 q4, 2026-11).** The text layer of `pages/p02.jpg`'s
source extracts a run of `×` characters, which reads like "external field into paper", and
the same chapter's q6 says in words that its crosses are a uniform field. So the brief for
the q4 widget said "× is the field, use Fleming's left-hand rule". Wrong: q4 has **no
external field**. All 21 round marks on that band are **wire cross-sections** — 10 ⊗ and
11 ⊙ — and the force is the force between parallel wires: same direction attracts, opposite
repels, along the line joining them. Written from the text layer, all twelve cases would
have come out wrong. An independent measurement caught it before any code was written.

**What the marks are.** At 3 px/pt a wire cross-section is a **43–44 px** round blob
(14.3–14.7 pt across, 1 pt ring, a 4.7 pt centre dot for ⊙ or a cross for ⊗). A long wire
lying in the page is a **316 × 31 px** strip (105.3 × 10.3 pt). Measure it:

```python
dark = arr.mean(axis=2) < 120                 # arr = RGB of pages/pNN.jpg
# connected components; keep 38 <= w,h <= 48 and |w-h| <= 4  -> wire cross-sections
```

**Which mark is "P".** Match the **centre of the `P` label's bbox** to the nearest mark.
Never read it off the layout: in spem05 q4(b) the `P` sits over the **left** ⊗ and the ⊙ on
the right is just another wire, so the layout-first reading gives the opposite answer to
the key. The same trap exists in (e), (f), (j), (k) and (l).

**Two sources before a brief goes out.** For a figure with several cases (six or more), or
any question whose answer is a direction, commission a measurement from a Bot that will
**not** write the widget, then diff the two tables at **±0.5 pt** before the authoring
brief leaves. jpeg edges plus print antialiasing put ±0.3–0.5 px on a single centre, so
agreement to 0.5 pt is the signal, not agreement to three decimals.

**In the brief itself**, separate (a) the requirement and its acceptance, (b) every claim
about the figure that has not been measured yet, marked as an assumption, and (c) a veto:
*if your measurement disagrees with (b), stop and report — do not follow it.* A brief that
states an unmeasured model in the imperative voice will be built as written.

**Orientation is part of the model, not decoration.** The widget's picture must be the printed
figure: the wall on the same side, `P` on the same side, every force arrow pointing the same
way, every marked angle opening on the same side, and every distance measured from the same
end. A reflected figure is a *different* figure, and a student holds the two side by side.

**The failure this prevents (jpfm08 q30, 2026-11).** The widget shipped as a mirror image: wall
on the right, ladder foot `P` on the left, `N` pointing left, `f` pointing right, the 60°
opening to the right. The printed Fig. a–c have the wall on the **left**, `P` on the **right**,
`N` pointing **right**, `f` pointing **left**, and the 60° opening **left**. Every number was
correct — 289 N at x = 0, 363 N at 1.03 m, 400 N at the limit, every moment and the 1.54 m slip
point — and the figure was still unreachable from the page. Numbers cannot catch this; only a
side-by-side against the crop can.

**How to check it.** Put the printed crop and the widget's canvas side by side at one scale and
write six answers down: which side is the wall, which side is `P`, which way does each arrow
point, which side does each marked angle open on, from which end is a distance measured, and
which way does the body move in the motion the widget shows. A figure that fails any one of the
six is redrawn, however good its numbers are. Ask for these six lines in the delivery report —
an author who has not been asked will choose whichever side leaves the readout column more room.
