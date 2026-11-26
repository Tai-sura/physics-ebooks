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

## 7. Process docs

`docs/01-workflow.md` … `06-layout-controls-and-media.md` live in the **maths** repository
(`tools/`), not here. That is an asymmetry of history, not a decision: they are shared
process material and apply to both subjects. Read them there when authoring here.
