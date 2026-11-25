import { BOOK, BOOK_DIR, BOOK_ID, STORAGE } from "../book.js";

/** Landscape slide at the notes' width (595 × 380 pt), so presentation mode shows the whole card. */
export const DECK_H = 380;

/**
 * Pages after the printed ones, from book.json "endPages":
 *   { "key": "summary", "label": "Summary", "image": "pages/summary.png" }   an A4 picture (595 × 842 pt)
 *   { "key": "cards", "label": "Flashcards", "deck": "flashcards.js" }       a flashcard deck (engine/deck)
 *   { "key": "film", "label": "Film", "video": "media/film.mp4",
 *     "poster": "media/film-poster.jpg", "height": 334.87 }                  a 16:9 teaching film page
 * The sheet key is "end-<key>" and ink is saved under it, so never rename a key once a book is in use.
 * Optional `height` (page points); a deck defaults to DECK_H so it fits on one presentation page,
 * a video page should carry its own height (595.32 × 9/16 = 334.87 for 16:9, so nothing is letterboxed).
 *
 * A video page exists because a printed page has no free 16:9 area to lay a film over: the film keeps
 * its own shape here instead of being squeezed into a region that is not 16:9.
 */
export const END_PAGES = (BOOK.endPages || []).map((item) => ({
  ...item,
  sheetKey: `end-${item.key}`,
  src: item.image ? `${BOOK_DIR}${item.image}` : "",
  video: item.video ? `${BOOK_DIR}${item.video}` : "",
  poster: item.poster ? `${BOOK_DIR}${item.poster}` : "",
  height: item.height || (item.deck ? DECK_H : undefined),
}));

/** Fills an end page's overlay; a deck loads its book module the first time. */
export async function mountEndPage(item, overlay) {
  if (item.video) mountFilm(item, overlay);
  if (!item.deck) return;
  try {
    const [{ mountDeck }, mod] = await Promise.all([
      import("../deck/deck.js"),
      import(new URL(`../../books/${BOOK_ID}/${item.deck}`, import.meta.url).href),
    ]);
    mountDeck(overlay, mod.DECK, `${STORAGE}-deck-${item.key}`);
  } catch (err) {
    console.error(`End page "${item.key}" failed to load`, err);
  }
}

/**
 * A teaching film at its own aspect.  The element is the whole sheet, so `object-fit: contain`
 * never has to crop or stretch it; the sheet height decides the shape, not the film.
 */
function mountFilm(item, overlay) {
  const box = document.createElement("div");
  box.className = "end-video";
  const video = document.createElement("video");
  video.src = item.video;
  if (item.poster) video.poster = item.poster;
  video.controls = true;
  video.playsInline = true;
  // Poster only until the reader presses play: a 0.7 MB film is not fetched by opening the book.
  video.preload = "none";
  video.setAttribute("playsinline", "");
  video.setAttribute("controlsList", "nodownload");
  box.append(video);
  overlay.append(box);
}
