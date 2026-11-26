# spem05 media: where each film comes from

Every file in this folder must be rebuildable from this record alone (docs/06 § 17).
A media file with no row here is not delivered. Values below are the **shipped**
(committed) file; when a film is re-cut the row is updated in the same commit.

| file | source | rebuild | duration | frame | bytes | md5 |
|---|---|---|---|---|---|---|
| `p07-turning.mp4` | Manim scene `tools/manim/spem05.py` :: `P07Turning` (the printed p07 four-panel page, region `[30, 119, 582, 784]`, overlay only) | `python tools/render_media.py spem05 P07Turning --crf 30 --x264-params aq-mode=3 --poster-seek -0.05 --max-kb 900`. crf 30 + aq-mode=3 is the only setting that fits 900 KB with the page intact: plain crf 30 gives 896 KB but `last` 5.13 (no aq), crf 26 gives 1,631 KB. The scene holds the finished page for 0.72 s before the end (docs/06 12 wants 0.5–1 s): with the old 0.12 s tail the closing GOP never settled and the encoded last frame sat 5.13 luma off the page while the raw render was 4.00 | 11.60 s | 1380 × 1662, 30 fps, 348 frames, yuv420p, +faststart, no audio | 797,282 | `fe0414cae33b6f0bd1dde97d80b87dce` |
| `p07-turning-poster.jpg` | the frame 0.05 s before the end of that mp4 (poster = the printed page) | `--poster-seek -0.05` on the command above. **Not** the default `-0.2`: the closing fade only clears at 10.87 s, so `-0.2` lands on a half-faded frame (meanAbs 5.37 against the page, 4.64 at `-0.05`) | 11.60 s | 1380 × 1662 | 354,283 | `8563319290e6f3402921e4d3113f7d8c` |
| `p1-fleming.mp4` | Manim scene `tools/manim/spem05.py` :: `P1Fleming` (the printed left-hand drawing and the blank column beside it, region `[267, 145, 542, 300]`, overlay only) | `python tools/render_media.py spem05 P1Fleming` (the `media` entry carries that region; SCALE 2.5, 30 fps, crf 26, +faststart) | 9.43 s | 688 × 388, 30 fps, 283 frames, yuv420p, +faststart, no audio | 248,289 | `ade1ece257ad0932443c1f7bb5cd64f5` |
| `p1-fleming-poster.jpg` | last frame of that mp4 (poster = the printed page) | same run writes it (`-sseof -0.2`, `-q:v 3`) | 9.43 s | 688 × 388 | 26,135 | `666991d2d126b1528205f93bb8f2008b` |
| `p08-commutator.mp4` | **not Manim.** Reader cut of the 1080p master `C:\Users\surat\.dsh\bot\workspace\films\s5-motor-commutator-3d\Motor-Commutator-3D.mp4` (6,903,590 B); the cut itself was kept at `films\spem05-reader\motor-commutator-reader.mp4` (752,578 B, md5 identical to this file) | re-encode from the master: H.264, `960x540`, 30 fps, `yuv420p`, `+faststart`, no audio, ≤ 900 KB — **the exact ffmpeg invocation was not recorded; Cine to write it here before the next re-cut** | 28.00 s | 960 × 540, 30 fps, 840 frames, no audio | 752,578 | `8f6b89a294b68c57b895abadf8c4e0ea` |
| `p08-commutator-poster.jpg` | first frame of the same cut | — | — | 960 × 540 | 38,603 | `da3c03f003bfe2b14e1d13c4d3c01bd5` |

## Rules that came out of this book

- **The scene class ships with the film.** spem05 p07 was committed as the `mp4` only:
  `tools/manim/spem05.py` stayed untracked, so the film could not be rebuilt from the
  repo and a fix would have had to start from the page measurements again.
- **Manim films are rendered only through `tools/render_media.py`.** SCALE 2.5, 30 fps,
  crf 26 and `+faststart` live in that script; passing different values by hand makes the
  file unreproducible.
- **A film outside Manim keeps its project folder.** `p08-commutator.mp4` has no scene
  class; the master and the cut live under `films\`, outside this repo, so their paths are
  recorded here and the master must not be moved or deleted.
- **Re-rendering keeps the file name**, so `CACHE` in `sw.js` has to be bumped or readers
  keep the old video.
- **A film is measured, not assumed** (docs/06 § 16): the first p07 cut was 76 % still
  (10.5 s of 13.8 s with no visible change) and the user's verdict was "沒有動態效果".
  The 11.00 s re-cut passes the gates measured by `tools/qa/_p07motion.py` at 8 fps
  (frames 30 luma apart, 1 pt² = 6.25 px): every 0.25 s step changes at least 854 pt²,
  every 1.0 s window at least 4,171 pt² (4,381 summed), and nine 0.25 s windows pass
  12,000 pt², all on the panel dimming rather than the old pale wash. The panels are white
  (75 % above luma 225), which is why the old 0.15 pale-green wash moved almost nothing.
- **A dimmed panel is how the moment is lit.** The three panels not in play carry a 0.28
  teal slab (white 255 → 202, −53 luma); a bar at 0.15 could not clear the 30 luma step
  the gate measures. The highlighter bar over the printed explanation runs at 0.22 (white
  255 → 217, −38), and the comets are 5 pt strokes at 0.55 so the printed "F = 0" labels
  in the annulus stay readable underneath.
