# This repository — physics e-books

**Subject: physics only.**
Site: <https://tai-sura.github.io/physics-ebooks/>

The primary maths books are in a different repository: `Tai-sura/primarymaths-ebooks`
(<https://tai-sura.github.io/primarymaths-ebooks/>). Nothing maths is authored here,
and nothing physics is authored there.

---

## 1. What is the truth

- The truth is **`origin/main` of this repository**. Nothing else is a base to build on.
- Deploy from a **clean worktree created from `origin/main`**. A local clone whose `main`
  has its own unrelated history can never be pushed (no common ancestor, so no merge);
  see section 5.
- Every deploy bumps `CACHE` in `sw.js`, and the number must be the **next free number
  across both repositories** — the maths site and this one share one counter. If the maths
  repository already shipped `ebooks-v159`, the next physics deploy is `v160`. Two
  different contents under one number would leave browsers on the old files.
- Tag every deploy `pre-<book>-v<number>` and record commit, tag and CACHE in the report.

## 2. What belongs in the catalogue

`books/catalog.json` decides what the site shows. Physics only:

| code | title | form |
|---|---|---|
| phy11 | Projectile Motion | S4 |
| phy06-force2 | Force II | S4 |
| spem02 | Electric Circuits | S5 |
| jpfm08 | Moment of force | S4 |
| spem05 | Magnetic force on current-carrying wires | S5 |
| jpwm01 | Nature of waves | S4 |

A code belongs to this repository when it starts with `phy`, `spem`, `jpfm` or `jpwm`.
Anything else in the catalogue is a mistake. **`node tools/qa/check_subject.mjs` fails on it.**

## 3. Frozen folders — leave them alone

`books/` also holds **15 folders that are not physics and are not in the catalogue**:

```
jm03b jm03c jm26b jm27a jm27b jm27c jm29a jm29b jm29c jm29d jm29e
jm30a jm30b jm30c m211-4
```

They are here on purpose: students still hold links to them, so the files stay published
and keep answering 200 (checked 2026-11-27: `books/jm29a/book.json` and
`books/m211-4/book.json` both 200). They are the primary maths material of an earlier
setup, and they are **not to be processed** — no re-authoring, no new widgets, no layout
fixes, no re-extraction.

Rules:
- never add them to `books/catalog.json`;
- never edit their content;
- never delete them without an explicit instruction from the owner.

## 4. Shared engine — each repository keeps its own copy

`engine/` is duplicated in the two repositories and the copies have drifted apart.
They are **not** re-synced wholesale. A fix is made in the repository that needs it; if
the other site needs the same fix, it is **ported as a patch** and then checked in both
places (widgets and reader behaviour can differ between the sites).

Current engine trees — update this table in **both** `REPO.md` files after any engine change:

| repository | engine tree | recorded at |
|---|---|---|
| physics-ebooks | `0139772a` | `44fde62` |
| primarymaths-ebooks | `7aa77ca4` | `f1450d9` |

If the two ids are the same, the copies happen to match; if they differ, that is expected
and not a fault — but a fix that should be on both sites must be ported, not assumed.

## 5. Local clones that must never be pushed

| folder | what it is |
|---|---|
| `workspace\ebook-engine` | a clone whose `main` is an unrelated history (117 commits, no common ancestor with `origin/main`). Its files also hold unpushed authoring work (docs/chapters, docs/topics, tools/manim, tools/qa). It is **frozen**: never push it, never merge it. Salvage single files onto a clean worktree when they are needed. |

Everything still wanted from it is moved over one file at a time, as a commit on a
worktree of `origin/main`.

## 6. Checks

`tools/qa` was added here on 2026-11-27, so the published repository can reproduce its own
gates. Before that the tooling existed only in the maths repository and the physics side
had to borrow it, which meant the shipped repository could not check itself.

```
cd tools/qa && npm install          # once: puppeteer-core (needs a local Chrome)
node tools/qa/check_book.mjs jpfm08 --verbose
node tools/qa/measure_ctl.mjs jpfm08
node tools/qa/check_subject.mjs     # catalogue vs subject, and the frozen folders
```

The maths repository has older copies of some of these scripts and they have drifted
(`check_book`, `measure_ctl`, `check_media` all differ in content). The copies here are the
ones the physics work is gated on; do not overwrite them with the maths copies.

## 7. Process docs — now carried here too

`docs/01-workflow.md` … `06-layout-controls-and-media.md`, `docs/tools.md` and
`docs/chapters/` used to exist only in the maths repository and in a local clone that could
never be pushed. They were committed here on 2026-11-27, so the rules they carry are
published instead of sitting on one machine:

| file | copied from | last edit in that source |
|---|---|---|
| `01-workflow.md` | the local physics clone | 2026-11-27 01:15 |
| `02-book-format.md` | the local physics clone | 2026-11-27 00:19 |
| `03-authoring-style.md` | the maths repository | 2026-11-25 17:17 |
| `04-qa-and-release.md` | the local physics clone | 2026-11-27 01:15 |
| `05-engine-notes.md` | the local physics clone | 2026-11-27 00:19 |
| `06-layout-controls-and-media.md` | the local physics clone | 2026-11-26 13:13 |
| `tools.md` | the local physics clone | 2026-11-25 22:16 |
| `chapters/` | the local physics clone, physics books only | — |

Each file came from whichever copy had the newer edit: `03` was newer in the maths
repository, everything else was newer in the local physics clone — which is where the
physics rules were written (a widget must match the printed figure; the physics-lead
sign-off at Stage 0 and Stage 7; the image rule for figures that must not be judged from
memory).

The maths repository keeps its own copy of the same six documents, so from now on they
drift exactly like `engine/` does and are handled the same way: change the copy you are
working in, port as a patch only when the other site really needs it, and never overwrite
a whole file from the other repository.

`docs/chapters/` here holds the notes for physics books only — `_template`, `jpfm08`,
`jpwm01`, `phy06-force2`, `phy11`, `spem02`, `spem05`. The maths chapter notes (jm*,
m211-4, p5m07a) stay with their books in the maths repository.

`docs/topics/` — the maths and physics topic registries (`maths.json`, `physics.json`) that
the book codes and titles must match — is **not** here yet; it still exists only in the
local clone. Salvage it the same way when it is next needed.

