# jpwm01 media: where each film comes from

Every file in this folder must be rebuildable from this record alone (docs/06 § 17).
A media file with no row here is not delivered. Values below are the **shipped**
(committed) file; when a film is re-cut the row is updated in the same commit, and the
old row stays while the old file is still in the folder (the live site may still point
at it).

The scene sources ship with the films — `tools/manim/jpwm01.py` (`P10Graphs`),
`tools/manim/jpwm01_phase.py` (`P8Phase`), `tools/manim/jpwm01_p04.py` (`P4Period`)
and `tools/manim/jpwm01_p01.py` (`P1Longitudinal`) are all tracked, so
`git ls-files tools/manim` lists them. Byte sizes and md5 below were measured on this
folder's files (`Get-FileHash -Algorithm MD5`); frame count, frame size and duration
were measured on the delivered mp4 (`ffprobe`), not taken from the manifest.

| file | source | rebuild | duration | frame | bytes | md5 |
|---|---|---|---|---|---|---|
| `jpwm01-p10-dxdt-v2.mp4` | Manim scene `tools/manim/jpwm01.py` :: `P10Graphs`, drawn at the printed G2 panel's own box (533.6 × 196.5 pt = 2.71 : 1), laid over that panel by the `book.json` `media` entry on page 10. Scene commit `55cf9cd` (readout and graphs on one clock: `t` runs continuously 0.000–1.000 T, no `k/12 T` step labels) | master `films\jpwm01_p10\P10Graphs_v2_1600x590_30fps.mp4` (562,376 B, md5 `783BC8803FD3E18AD531DEC479777477`) → lossless frames `films\jpwm01_p10\png\0000–0250.png` → `python films\tools\encode_panel.py --name jpwm01-p10-dxdt --version 2 --frames films\jpwm01_p10\png --outdir <delivery> --poster-t 6.367` | 8.367 s | 1600 × 590, 30 fps, 251 frames, h264 High yuv420p, +faststart, no audio | 329,995 | `7FC5346F3BFA2CA6BBBA66799FEC968E` |
| `jpwm01-p10-dxdt-v2-poster.jpg` | frame 191 (6.367 s) of that mp4: two graphs complete, 13 points on the right graph, readout `t = 1.000 T / d = 0.0 cm`, closing caption not yet started | written by the same `--poster-t 6.367` run (q:v 3) | 8.367 s | 1600 × 590 | 58,801 | `CD9095FB7C9CCFEC1C11430B95820840` |
| `jpwm01-p10-dxdt-v3.mp4` | same scene `P10Graphs`, same region, **plus the `amplitude = 20 cm` dimension line at x = 100 cm** (drawn from d = 0 to d = +20) that the printed G2 panel has and v2 did not. Scene commit `86a6d1e` | master `films\jpwm01_p10\P10Graphs_master_v3_1600x590_30fps.mp4` (594,337 B, md5 `4E191119A5F9DA2E11E6C292C9AC0676`) → lossless frames `films\jpwm01_p10\png_v3\0000–0250.png` → `python films\tools\encode_panel.py --name jpwm01-p10-dxdt --version 3 --frames films\jpwm01_p10\png_v3 --outdir <delivery> --poster-t 6.400`. **Encode from `png_v3`, not from the CRF 15 master**: the master path gave 472,432 B (+43 % over v2) and was rejected, the lossless frames gave 349,783 B (+6.0 %, the size of the new annotation) | 8.367 s | 1600 × 590, 30 fps, 251 frames, h264 High yuv420p, +faststart, no audio | 349,783 | `6F0BCB61F3B9684DB8041079FCB117D9` |
| `jpwm01-p10-dxdt-v3-poster.jpg` | frame 192 (6.400 s) of that mp4: the last frame whose caption band is still pure white — frame 193 is where the closing caption starts fading in (min grey 246 against 251) | written by the same `--poster-t 6.400` run (q:v 3). Checked against all 251 decoded frames of the delivered mp4: frame 192 scores best (PSNR 44.56 dB), 191 and 193 tie within 0.15 dB because the motion has finished | 8.367 s | 1600 × 590 | 61,989 | `3AABEBF5A2A7BF7EB0A5AA9FC85B3AEB` |
| `jpwm01-p08-phase-v2.mp4` | Manim scene `tools/manim/jpwm01_phase.py` :: `P8Phase`, drawn at the printed Phase panel's box (554.4 × 222.7 pt = 2.49 : 1). **Not a `book.json` `media` entry** — it plays inside the reader's embed drawer, `explainers/jpwm01-p08-phase/jpwm01-p08-phase.html`, opened from the tab at the printed panel's top-right corner — `book.json` `embeds[0].at` is the authority (printed-page points; the engine adds the sheet's +96 itself, so the reader draws it at sheet `at + 96`). Scene commit `716a162` (v4 wording: `Same height and the same direction at every instant = same phase.`) | master `films\jpwm01_p08\P8Phase_master_v4_1668x698_30fps.mp4` (754,892 B, md5 `64A1512A4B09E0A9980A4984359D45B3`, 386 frames) → `python films\tools\encode_panel.py --name jpwm01-p08-phase --version 2 --master films\jpwm01_p08\P8Phase_master_v4_1668x698_30fps.mp4 --outdir <delivery> --poster-t 2.000 --width 1600 --height 670` (the 1668 × 698 master is scaled to 1600 × 670, the same 2.388 : 1) | 12.867 s | 1600 × 670, 30 fps, 386 frames, h264 High yuv420p, +faststart, no audio | 1,026,134 | `66509B35C1E5ABF639829F2A8D3B7B6F` |
| `jpwm01-p08-phase-v2-poster.jpg` | frame at 2.000 s of that mp4: the **bare panel before the first case** — the heading `Wave travels right; d–x at one instant`, the wave, the seven numbered particles with their arrows, and the axis marks `0` / `λ` / `2λ` / `x`; no grey case sentence is on screen yet (measured on this file: the first one starts fading in at frame 103 = 3.433 s). Chosen so the poster shows the panel the panel is about, without giving away any of the three cases | written by the same `--poster-t 2.000` run (q:v 3) | 12.867 s | 1600 × 670 | 33,498 | `DEB4CFA7D0A3DA44BEF363AA7BA54D8B` |
| `jpwm01-p04-period-v1.mp4` | Manim scene `tools/manim/jpwm01_p04.py` :: `P4Period` (scene commit `654c39e`: the λ glyph was mangled, and two measurement-driven fixes). A **drawer film**, so it is not drawn to the printed panel's aspect: the printed Period panel is a 535.3 × 62.7 pt strip (8.5 : 1) and the drawer gives the film its own 2.39 : 1 canvas. Opens from the tab at p04 `at` `[546.3, 367.7]` (printed-page points; the engine adds that page's +143 itself, so the reader draws it at sheet `at + 143`) | master `films\jpwm01_p04\P4Period_master_1668x698_30fps.mp4` (301,076 B, md5 `76CB64B446078F0539C76EE12BFB61EF`, 219 frames) → `python films\tools\encode_panel.py --name jpwm01-p04-period --version 1 --master films\jpwm01_p04\P4Period_master_1668x698_30fps.mp4 --outdir <delivery> --poster-frame 190 --width 1600 --height 670` (the 1668 × 698 master is scaled to 1600 × 670) | 7.300 s | 1600 × 670, 30 fps, 219 frames, h264 High yuv420p, +faststart, no audio | 426,709 | `FBF4D1A8DB883A710BC45F4C0E751BA1` |
| `jpwm01-p04-period-v1-poster.jpg` | frame **190** (6.333 s), not the frame the script first named (136): at 136 the label `one complete oscillation` is still fading in and reads as a half-transparent ghost; frames 188–216 are pixel-identical with the label fully drawn, `t = 1.000 T`, and both brackets in place. The poster is the finished state, so it looks like the printed panel before ▶ | written by the same `--poster-frame 190` run (q:v 3). PSNR against frames 188 / 189 / 190 / 191 / 216 is the same value (44.668) because they are the same picture | 7.300 s | 1600 × 670 | 70,245 | `A58457F7FAF0F56420F71A4EDC359497` |
| `jpwm01-p01-longitudinal-v1.mp4` | Manim scene `tools/manim/jpwm01_p01.py` :: `P1Longitudinal` (scene commit `654c39e`). A **drawer film** like p04; opens from the tab at p01 `at` `[558.3, 465.3]` (printed-page points; this page inserts no space, so sheet = printed) | master `films\jpwm01_p01\P1Longitudinal_master_1668x698_30fps.mp4` (267,518 B, md5 `5B2EDB842EADAA35BF3FB24394806A44`, 192 frames) → `python films\tools\encode_panel.py --name jpwm01-p01-longitudinal --version 1 --master films\jpwm01_p01\P1Longitudinal_master_1668x698_30fps.mp4 --outdir <delivery> --poster-frame 191 --width 1600 --height 670` | 6.400 s | 1600 × 670, 30 fps, 192 frames, h264 High yuv420p, +faststart, no audio | 353,601 | `93DC67C0AF1FD99AC172065A5B8AE43D` |
| `jpwm01-p01-longitudinal-v1-poster.jpg` | last frame (frame 191, 6.367 s): the finished state, `C : Compression` / `R : Rarefaction`, both λ brackets and the two sentences; frames 189–191 are pixel-identical, so there is no fade to catch | written by the same `--poster-frame 191` run (q:v 3) | 6.400 s | 1600 × 670 | 51,458 | `00C403C4A9CAB4054CB93F71F9AFCD84` |

Each film also ships `<name>-manifest.json` (encoder args, source paths, probe facts,
gate result), `<name>-gate.txt` (raw gate output) and `<name>-gate.json`. Those three
are the film's own record: the mp4 is reproducible from the manifest alone.

## Rules that came out of this book

- **A panel film replaces the printed panel inside the frame, not the frame.** p10's
  G2 panel has a 1 pt printed rule; the films paint no border of their own (the poster's
  ink runs from column 0 to column 1565 with no full-length rule). `book.json` therefore
  uses the panel's *inner* rectangle `[41.7, 102.3, 574.2, 298.2]`, 1 pt inside the
  printed `[41.0, 101.7, 574.7, 298.6]`, which keeps the page's frame: 1,575 dark px
  along the top rule, 1,575 along the bottom, 576 down each side. A film laid on the
  printed rectangle would leave a borderless white hole on the page.
- **The poster is what the student sees before pressing ▶.** It must read like the
  printed panel and must not spoil the answer: never frame 0 (on p10 that is two bare
  axes) and never the last frame (it carries the closing caption). p10 has both versions
  of that rule recorded above because the moment the caption starts fading in moved by
  one frame between v2 and v3.
- **Two delivery routes, and they are not interchangeable.** A `media` entry draws the
  film *over* the printed panel in page points, so the panel's shape decides the film's
  aspect (2.71 : 1 for p10). An `embeds` entry opens a page of its own in the reader's
  drawer, where the film gets the drawer's width and only needs its own aspect
  (2.39 : 1 for p08). The p08 Phase film had no room on the page at all: the panel is
  full-width and the page has no 200 × 150 pt blank rectangle anywhere.
- **A bigger master does not mean a bigger delivery.** v3's master is 594,337 B against
  v2's 562,376 B, and the first v3 encode started from a CRF 15 copy of it: 472,432 B
  (+43 %). Re-encoding from the lossless `png_v3` frames gave 349,783 B (+6.0 %), the
  cost of the new annotation. Always encode from the lossless sequence.
- **v2 and v3 of p10 both stay in this folder while the release moves.** The live site
  pointed at v2 until the v3 release; `book.json` switches `src` and `poster` to v3 in
  the commit that ships it, and v2's five files are deleted only after that release is
  live. A re-cut that keeps the file name instead would need a `CACHE` bump, which is
  why the version is in the name here.
- **The scene class ships with the film.** Both scenes are tracked, so
  `python -m manim -qk -r <w>,<h> --fps 30 tools/manim/jpwm01.py P10Graphs` (or
  `tools/manim/jpwm01_phase.py P8Phase`) rebuilds the master from the repo; only the
  encode step needs `films\tools\encode_panel.py`.
- **A wording change is a new master, not a re-encode.** p08's in-phase line went
  `Same height at every instant = same phase.` → `Same height and the same direction at
  every instant = same phase.` because the first states the rule the antiphase and
  quarter-period cases contradict. v3 was never encoded, so only v4 (delivered as
  `-v2`) exists: the delivery version counts encodes, the master version counts renders.
