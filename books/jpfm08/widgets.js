/**
 * Interactive graphics for this book, opened from a question's graphic button.
 * Build them from the shared kit; house rules are in docs/03-authoring-style.md.
 *
 * q1 is the question's own figure (force above the door, pointing away from the hinge); p1 is the
 * unchanged copy of the summary panel's picture, held for the page-1 play button. (The mathematics
 * template's marble example that shipped here by mistake was removed; nothing of it is left.)
 */

import { C, S, T, H, scene, clear, sector, slider, readout, question, buttonRow } from "../../engine/widgets/kit.js";

const J_D = 2;          // m, the printed distance from the hinge to the force
const J_F0 = 20;        // N, the printed force
const PX_PER_N = 4.8;   // drawing scale for the force vectors

/* ---------------- Q1: the question's own printed figure ----------------
 *
 * Follow pages/p01.jpg, question 1, not the summary panel above it: that figure has the hinge P
 * on the RIGHT and the 20 N force acting at the free edge A on the LEFT, pointing UP AND TO THE
 * LEFT. The angle theta is measured between the door's line carried on past A (drawn dashed)
 * and the force, so the force leans AWAY from the hinge and ABOVE the door.
 *
 * The moment arm is still 2 sin(theta): the perpendicular from the hinge onto the force's line
 * of action, whose foot lies BELOW the door because the line is carried back down through A.
 * What changes with the direction is the sense: lifting the free edge turns the door CLOCKWISE
 * seen from above, so play swings it by +30 deg (screen clockwise) and A rises. The sense label
 * is still computed from the drawn vectors (r x F), never written by hand.
 */
function jq1(root) {
  const CW = 620, CH = 430;
  const XA = 230, YA = 250, XO = 490;   // A and O on the door line; 260 px is the printed 2 m
  const XC = 560;                        // fixed reading column, top right
  const svg = scene(CW, CH);
  const fS = slider({ label: "force F (N)", min: 10, max: 40, step: 1, value: J_F0,
    fmt: (v) => v.toFixed(0) + " N", play: false });
  const tS = slider({ label: "angle \u03B8 (degrees)", min: 0, max: 90, step: 1, value: 30,
    fmt: (v) => v.toFixed(0) + "\u00B0", play: false });
  const r = readout();

  /* ---- the swing: the door turns about the hinge and comes back ----
   * Timed by the torque, not a fixed timer: a door of moment of inertia I kicked by a moment
   * tau sweeps an angle A in t = sqrt(2 A I / tau). I = 14 kg m^2 keeps the printed case near
   * 0.7 s; the time is clamped to 0.35-1.6 s so the ends stay watchable.
   */
  let phi = 0;                    // live rotation, degrees; +phi is clockwise on screen, so A rises
  let raf = 0;                    // the running requestAnimationFrame id, 0 when idle
  const SWING = 30;               // degrees, as asked
  const INERTIA = 14.0;           // kg m^2, see above
  const spin = () => {
    const tauNow = fS.get() * J_D * Math.sin((tS.get() * Math.PI) / 180);
    if (tauNow < 0.05) return;                      // no moment: the door cannot turn
    if (raf) cancelAnimationFrame(raf);
    const arc = (SWING * Math.PI) / 180;
    const tSwing = Math.max(350, Math.min(1600, 1000 * Math.sqrt((2 * arc * INERTIA) / tauNow)));  // ms
    const hold = 150;                                                                             // ms
    const total = 2 * tSwing + hold;
    const t0 = performance.now();
    const step = (now) => {
      const ms = Math.min(total, now - t0);
      let k;
      if (ms <= tSwing) k = ms / tSwing;
      else if (ms <= tSwing + hold) k = 1;
      else k = 1 - (ms - tSwing - hold) / tSwing;
      k = Math.max(0, Math.min(1, k));
      k = k * k * (3 - 2 * k);        // smooth ease in and out
      phi = SWING * k;
      render();
      raf = ms < total ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
  };

  const playBtn = H("button", { type: "button", onclick: () => spin() }, ["\u25B6 play 30\u00B0 swing"]);
  const playRow = H("div", { class: "g-btns" }, [playBtn]);

  root.append(
    question("A 20 N force acts on a door 2 m from the hinge, at an angle \u03B8 to the door. Find the torque, then the torque when \u03B8 is 45\u00B0 and when the force is along the door.", [
      "Moment about the hinge: $\\tau = F d \\sin\\theta$",
      "Only the part perpendicular to the door turns it: $F\\sin\\theta$",
      "Along the door the moment arm is 0, so $\\tau = 0$",
    ]),
    playRow,
    svg,
    fS.el, tS.el,
    buttonRow([
      ["\u03B8 = 30\u00B0", () => { fS.set(J_F0); tS.set(30); }],
      ["\u03B8 = 45\u00B0", () => { fS.set(J_F0); tS.set(45); }],
      ["\u03B8 = 0\u00B0", () => { fS.set(J_F0); tS.set(0); }],
    ]),
    r.el,
  );

  const render = () => {
    clear(svg);
    const F = fS.get(), th = tS.get();
    const rad = (th * Math.PI) / 180;
    const tau = F * J_D * Math.sin(rad);
    const L = F * PX_PER_N;                // force arrow length, px
    const ux = -Math.cos(rad), uy = -Math.sin(rad);   // from A, away from the hinge and above the door
    const perp = L * Math.sin(rad);                   // square to the door, upwards
    const along = L * Math.cos(rad);                  // along the door, away from the hinge
    const a = (phi * Math.PI) / 180;

    // every drawing point lives in the door's own frame; the group transform turns it about O,
    // and the labels are placed at rotated anchors but kept upright so they stay readable
    const rp = (x, y) => {
      if (!phi) return [x, y];
      const dx = x - XO, dy = y - YA, c = Math.cos(a), s = Math.sin(a);
      return [XO + dx * c - dy * s, YA + dx * s + dy * c];
    };
    const fit = (p) => [Math.max(26, Math.min(CW - 26, p[0])), Math.max(16, Math.min(CH - 10, p[1]))];
    const put = (x, y, s, attrs) => T(svg, ...fit(rp(x, y)), s, attrs);

    // where the door rests, so the 30 deg it has turned is visible while it is turned
    if (Math.abs(phi) > 0.5) {
      S("rect", { x: XA, y: YA - 6, width: XO - XA, height: 12, fill: "none", stroke: C.grey,
        "stroke-width": 1, "stroke-dasharray": "4 4", "stroke-opacity": 0.55 }, svg);
    }

    const g = S("g", { transform: "rotate(" + phi + " " + XO + " " + YA + ")" }, svg);

    /* ---- the door, seen from above, with its line carried on past the free edge: that dashed
     * run is the line the printed figure measures theta against ---- */
    S("line", { x1: XA - 46, y1: YA, x2: XA, y2: YA, stroke: C.grey, "stroke-width": 1,
      "stroke-dasharray": "3 4" }, g);
    S("rect", { x: XA, y: YA - 6, width: XO - XA, height: 12, fill: C.soft, stroke: C.line, "stroke-width": 2 }, g);
    put((XA + XO) / 2, YA - 12, "d = 2 m", { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.line });
    S("circle", { cx: XO, cy: YA, r: 5.5, fill: C.red, stroke: C.red, "stroke-width": 1 }, g);
    T(svg, XO + 10, YA + 6, "O", { "text-anchor": "start", "font-size": 13, "font-weight": 700, fill: C.red });
    T(svg, XO + 10, YA + 21, "hinge", { "text-anchor": "start", "font-size": 10.5, fill: C.grey });
    put(XA + 16, YA - 10, "A", { "text-anchor": "start", "font-size": 13, "font-weight": 700, fill: C.line });

    const tipX = XA + ux * L, tipY = YA + uy * L;

    /* ---- the moment arm: from O, perpendicular onto the force's line of action ----
     * The line runs back down through A, so its foot sits below the door; at theta = 90 it is
     * the free edge itself and the arm lies along the bar, drawn there rather than moved. */
    const tt = (XO - XA) * ux;                       // (O - A) projected on the force line, negative
    const fx = XA + ux * tt, fy = YA + uy * tt;
    const arm = Math.hypot(fx - XO, fy - YA);        // px; = 260 sin(theta)
    if (arm > 4) {
      // the line of action itself, so the foot is visibly on it
      S("line", { x1: XA + ux * (tt - 24), y1: YA + uy * (tt - 24), x2: XA + ux * 24, y2: YA + uy * 24,
        stroke: C.grey, "stroke-width": 1, "stroke-dasharray": "3 4" }, g);
      S("line", { x1: XO, y1: YA, x2: fx, y2: fy, stroke: C.amber, "stroke-width": 2.6,
        "stroke-dasharray": "7 4", "stroke-opacity": 0.92 }, g);
      // the right angle at the foot (skipped when the arm is a few pixels long, where a 10 px
      // square would swamp the little it marks)
      const wnX = (XO - fx) / arm, wnY = (YA - fy) / arm, k = 10;
      if (arm > 20) {
        S("path", { d: "M " + (fx - ux * k) + " " + (fy - uy * k) + " L " + (fx - ux * k + wnX * k) + " " +
          (fy - uy * k + wnY * k) + " L " + (fx + wnX * k) + " " + (fy + wnY * k),
          fill: "none", stroke: C.amber, "stroke-width": 1.3 }, g);
      }
      // near theta = 90 the arm lies on the bar, so its label drops below the bar's middle. A
      // long arm takes its label inside the corner between the arm and the hinge; a short one
      // would land on the "O"/"hinge" labels there, so it goes under the foot instead.
      if (Math.abs(fy - YA) < 0.25 * arm) {
        put((XO + fx) / 2, YA + 36, "d sin\u03B8",
          { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
      } else if (arm > 90) {
        put((XO + fx) / 2 - wnY * 13, (YA + fy) / 2 + wnX * 13, "d sin\u03B8",
          { "text-anchor": "start", "font-size": 11, "font-weight": 700, fill: C.amber });
      } else {
        put(fx - 14, fy + 16, "d sin\u03B8",
          { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.amber });
      }
    } else {
      put(XO - 14, YA + 30, "moment arm = 0",
        { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.amber });
    }

    /* ---- the force and its two parts: F sin(theta) lifts the free edge, F cos(theta) runs
     * along the door away from the hinge. A part gets its label only once its arrow is long
     * enough to own it; below that the labels would pile onto "A" ---- */
    if (perp > 8) {
      S("line", { x1: XA, y1: YA, x2: XA, y2: YA - perp, stroke: C.blue, "stroke-width": 2,
        "stroke-dasharray": "6 4", "marker-end": "url(#arr-" + svg.dataset.uid + ")" }, g);
      if (perp > 24) {
        put(XA + 10, YA - perp / 2, "F sin\u03B8",
          { "text-anchor": "start", "font-size": 11, "font-weight": 700, fill: C.blue });
      }
    }
    if (along > 8) {
      S("line", { x1: XA, y1: YA, x2: XA - along, y2: YA, stroke: C.green, "stroke-width": 2,
        "stroke-dasharray": "6 4", "marker-end": "url(#arrGreen-" + svg.dataset.uid + ")" }, g);
      if (along > 34) {
        put(XA - along / 2, YA + 16, "F cos\u03B8",
          { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.green });
      }
    }
    S("line", { x1: XA, y1: YA, x2: tipX, y2: tipY, stroke: C.red, "stroke-width": 3,
      "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, g);
    // the label sits just off the arrowhead on the side away from the door
    put(tipX + Math.sin(rad) * 18, tipY - Math.cos(rad) * 18, "F = " + F.toFixed(0) + " N",
      { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.red });

    /* ---- the angle between the door's line and the force, at A ----
     * only the symbol, as the printed figure writes it: a horizontal "theta = 30 deg" is wider
     * than a 30 deg wedge and would sit on the force arrow once the door starts to turn. Under
     * 12 deg the wedge is too narrow for even that, so the reading column carries the number. */
    if (th > 2) {
      const bis = sector(g, XA, YA, 34, Math.PI, Math.PI + rad, "none", C.amber);
      // inside a wedge narrower than about 25 deg a horizontal glyph touches the force arrow,
      // so the arc alone carries it there and the reading column carries the number
      if (th >= 25) {
        put(XA + 46 * Math.cos(bis), YA + 46 * Math.sin(bis), "\u03B8",
          { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.amber });
      }
    } else {
      put(XA - 6, YA - 12, "\u03B8 = 0\u00B0",
        { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.amber });
    }

    /* ---- which way the door turns, read off r x F (positive z is clockwise on screen) ---- */
    const tz = (XA - XO) * uy - (YA - YA) * ux;
    const turning = Math.abs(tz) > 1e-9;
    const clockwise = tz > 0;
    const sense = !turning ? "no moment" : clockwise ? "clockwise" : "anticlockwise";
    if (turning) {
      // a small arc about O, sweeping the way the door turns, its head at the far end
      const r0 = 30, a0 = ((clockwise ? 200 : 250) * Math.PI) / 180, a1 = ((clockwise ? 250 : 200) * Math.PI) / 180;
      S("path", { d: "M " + (XO + r0 * Math.cos(a0)) + " " + (YA + r0 * Math.sin(a0)) +
        " A " + r0 + " " + r0 + " 0 0 " + (clockwise ? 1 : 0) + " " +
        (XO + r0 * Math.cos(a1)) + " " + (YA + r0 * Math.sin(a1)),
        fill: "none", stroke: C.red, "stroke-width": 1.8, "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, svg);
    }

    /* ---- the play control: a real button, so it works with a mouse, a finger and the keyboard ---- */
    const canPlay = tau >= 0.05;                  // tau = 0 means no moment: nothing to play
    playBtn.disabled = !canPlay;
    /* the shared sheet gives every button cursor:pointer and has no :disabled override, so a
     * disabled play would still show a hand and read as clickable; set it per state here
     * rather than touching engine/styles.css */
    playBtn.style.cursor = canPlay ? "pointer" : "default";
    playBtn.title = canPlay
      ? "swing the door 30\u00B0 about the hinge; the bigger the torque, the faster"
      : "no moment: the door cannot turn";

    /* ---- the reading column, top right, clear of the drawing ---- */
    const col = (y, s, color, size) =>
      T(svg, XC, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(66, "F = " + F.toFixed(0) + " N", C.red, 13);
    col(96, "\u03B8 = " + th.toFixed(0) + "\u00B0", C.amber, 13);
    col(126, "d = 2 m", C.grey, 12);
    col(156, "arm = " + (J_D * Math.sin(rad)).toFixed(2) + " m", C.amber, 12);
    col(190, "\u03C4 = " + tau.toFixed(1) + " N m", C.blue, 16);
    col(218, sense, C.grey, 11.5);

    /* ---- the reading row ---- */
    const latex = "\\tau = F d \\sin\\theta = " + F.toFixed(0) + "\\times 2\\times\\sin " + th.toFixed(0) +
      "^\\circ = " + tau.toFixed(1) + "\\ \\text{N m}";
    let caption;
    if (th === 0) {
      caption = "The force lies along the door's line, so its line of action runs straight through the hinge: the moment arm is zero and the door cannot turn (\u03C4 = 0), so the play button is off.";
    } else if (th === 90) {
      caption = "The force is square to the door: the whole of it turns the door and the moment arm is the full 2 m, so \u03C4 = 2F = " + tau.toFixed(1) + " N m. Press play: the bigger the torque, the faster the door swings.";
    } else {
      caption = "Only F sin\u03B8 turns the door; it acts 2 m from the hinge, so \u03C4 = F d sin\u03B8 = " + tau.toFixed(1) +
        " N m. The F cos\u03B8 part runs along the door and has no moment arm. The force lifts the free edge A, so the door turns clockwise. Press play: the bigger the torque, the faster the swing.";
    }
    r.set(latex, true, caption, { yes: "live readings" });
  };

  [fS, tS].forEach((s) => s.on(render));
  render();
}

/* ---------------- Page 1 copy: the summary panel's own picture, kept as it was ----------------
 *
 * The printed summary panel at the top of page 1 draws the hinge O on the RIGHT (red dot) and
 * the force hanging BELOW the door at A. This is the widget that panel is described with, and
 * it is kept exactly as it shipped (force tipping down, door turning anticlockwise) so the page-1
 * play-button widget can carry it unchanged. The question's own figure uses the other direction
 * (see jq1 above), which is why q1 no longer uses this one.
 */
const AX = 80, EY = 200;   // A is where the force acts, on the left
const OX = 340;            // O is the hinge, on the right (as the printed figure has it)
const CX = 555;            // the fixed reading column, top right

function jp1(root) {
  const CW = 620, CH = 430;
  const svg = scene(CW, CH);
  const fS = slider({ label: "force F (N)", min: 10, max: 40, step: 1, value: J_F0,
    fmt: (v) => v.toFixed(0) + " N", play: false });
  const tS = slider({ label: "angle \u03B8 (degrees)", min: 0, max: 90, step: 1, value: 30,
    fmt: (v) => v.toFixed(0) + "\u00B0", play: false });
  const r = readout();

  /* ---- the swing: the door turns about the hinge and comes back ----
   * The swing is driven by the torque, not by a fixed timer: a door of moment of inertia I
   * kicked by a moment tau sweeps an angle A in t = sqrt(2 A I / tau), so the same 30 deg takes
   * longer at a small F or a small theta. I = 14 kg m^2 is chosen so the printed case
   * (tau = 30 N m) takes 0.70 s; the time is clamped to 0.35-1.6 s so the ends stay watchable.
   * At tau = 0 there is no moment at all, so the play chip is drawn disabled and the door
   * does not move.
   */
  let phi = 0;                      // live rotation, degrees; negative swings the free end A down
  let raf = 0;                      // the running requestAnimationFrame id, 0 when idle
  const SWING = 30;                 // degrees, as asked
  const INERTIA = 14.0;             // kg m^2, see above
  const spin = () => {
    const tauNow = fS.get() * J_D * Math.sin((tS.get() * Math.PI) / 180);
    if (tauNow < 0.05) return;                      // no moment: the door cannot turn
    if (raf) cancelAnimationFrame(raf);
    const arc = (SWING * Math.PI) / 180;
    const tSwing = Math.max(350, Math.min(1600, 1000 * Math.sqrt((2 * arc * INERTIA) / tauNow)));  // ms
    const hold = 150;                                                                             // ms
    const total = 2 * tSwing + hold;
    const t0 = performance.now();
    const step = (now) => {
      const ms = Math.min(total, now - t0);
      let k;
      if (ms <= tSwing) k = ms / tSwing;
      else if (ms <= tSwing + hold) k = 1;
      else k = 1 - (ms - tSwing - hold) / tSwing;
      k = Math.max(0, Math.min(1, k));
      k = k * k * (3 - 2 * k);        // smooth ease in and out
      phi = -SWING * k;
      render();
      raf = ms < total ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
  };

  const playBtn = H("button", { type: "button", onclick: () => spin() }, ["\u25B6 play 30\u00B0 swing"]);
  const playRow = H("div", { class: "g-btns" }, [playBtn]);

  root.append(
    question("A 20 N force acts on a door 2 m from the hinge, at an angle \u03B8 to the door. Find the torque, then the torque when \u03B8 is 45\u00B0 and when the force is along the door.", [
      "Moment about the hinge: $\\tau = F d \\sin\\theta$",
      "Only the part perpendicular to the door turns it: $F\\sin\\theta$",
      "Along the door the moment arm is 0, so $\\tau = 0$",
    ]),
    playRow,
    svg,
    fS.el, tS.el,
    buttonRow([
      ["\u03B8 = 30\u00B0", () => { fS.set(J_F0); tS.set(30); }],
      ["\u03B8 = 45\u00B0", () => { fS.set(J_F0); tS.set(45); }],
      ["\u03B8 = 0\u00B0", () => { fS.set(J_F0); tS.set(0); }],
    ]),
    r.el,
  );

  const render = () => {
    clear(svg);
    const F = fS.get(), th = tS.get();
    const rad = (th * Math.PI) / 180;
    const tau = F * J_D * Math.sin(rad);
    const L = F * PX_PER_N;                          // force arrow length, px
    const ux = Math.cos(rad), uy = Math.sin(rad);    // from A, along the door and tipping below it
    const perp = L * Math.sin(rad);                  // square to the door (downwards)
    const along = L * Math.cos(rad);                 // along the door, toward O
    const a = (phi * Math.PI) / 180;

    // every drawing point lives in the door's own frame; the group transform turns it about O,
    // and the labels are placed at rotated anchors but kept upright so they stay readable
    const rp = (x, y) => {
      if (!phi) return [x, y];
      const dx = x - OX, dy = y - EY, c = Math.cos(a), s = Math.sin(a);
      return [OX + dx * c - dy * s, EY + dx * s + dy * c];
    };
    const fit = (p) => [Math.max(26, Math.min(CW - 26, p[0])), Math.max(16, Math.min(CH - 10, p[1]))];
    const put = (x, y, s, attrs) => T(svg, ...fit(rp(x, y)), s, attrs);

    // where the door rests, so the 30 deg it has turned is visible while it is turned
    if (Math.abs(phi) > 0.5) {
      S("rect", { x: AX, y: EY - 6, width: OX - AX, height: 12, fill: "none", stroke: C.grey,
        "stroke-width": 1, "stroke-dasharray": "4 4", "stroke-opacity": 0.55 }, svg);
    }

    const g = S("g", { transform: "rotate(" + phi + " " + OX + " " + EY + ")" }, svg);

    /* ---- the door, seen from above: A on the left, the hinge O on the right ---- */
    S("rect", { x: AX, y: EY - 6, width: OX - AX, height: 12, fill: C.soft, stroke: C.line, "stroke-width": 2 }, g);
    put((AX + OX) / 2, EY - 12, "d = 2 m", { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.line });
    S("circle", { cx: OX, cy: EY, r: 5.5, fill: C.red, stroke: C.red, "stroke-width": 1 }, g);
    T(svg, OX + 10, EY + 6, "O", { "text-anchor": "start", "font-size": 13, "font-weight": 700, fill: C.red });
    T(svg, OX + 10, EY + 21, "hinge", { "text-anchor": "start", "font-size": 10.5, fill: C.grey });
    put(AX - 10, EY - 2, "A", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.line });

    const tipX = AX + ux * L, tipY = EY + uy * L;

    /* ---- the moment arm: from O, perpendicular onto the force's line of action ---- */
    const tt = (OX - AX) * ux;                       // (O - A) projected on the force line
    const fx = AX + ux * tt, fy = EY + uy * tt;
    const arm = Math.hypot(fx - OX, fy - EY);
    if (arm > 4) {
      // the line of action itself, so the foot is visibly on it
      S("line", { x1: AX, y1: EY, x2: AX + ux * (tt + 30), y2: EY + uy * (tt + 30), stroke: C.grey,
        "stroke-width": 1, "stroke-dasharray": "3 4" }, g);
      // starts at O, never moved: at theta = 90 this lies along the door, which is correct
      S("line", { x1: OX, y1: EY, x2: fx, y2: fy, stroke: C.amber, "stroke-width": 2.6,
        "stroke-dasharray": "7 4", "stroke-opacity": 0.92 }, g);
      // the right angle at the foot
      const wnX = (OX - fx) / arm, wnY = (EY - fy) / arm, k = 10;
      S("path", { d: "M " + (fx - ux * k) + " " + (fy - uy * k) + " L " + (fx - ux * k + wnX * k) + " " +
        (fy - uy * k + wnY * k) + " L " + (fx + wnX * k) + " " + (fy + wnY * k),
        fill: "none", stroke: C.amber, "stroke-width": 1.3 }, g);
      const nx = -(fy - EY) / arm, ny = (fx - OX) / arm;
      // near theta = 90 the arm lies on the bar, so its label drops below the bar's middle
      // instead of piling up on the "A" label at the foot
      if (Math.abs(fy - EY) < 0.25 * arm) {
        put((OX + fx) / 2, EY + 36, "d sin\u03B8",
          { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
      } else {
        put(fx + (nx > 0 ? 10 : -10), fy + (ny > 0 ? 16 : -8), "d sin\u03B8",
          { "text-anchor": nx > 0 ? "start" : "end", "font-size": 11, "font-weight": 700, fill: C.amber });
      }
    } else {
      put(OX - 14, EY + 30, "moment arm = 0",
        { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.amber });
    }

    /* ---- the force and its two parts ---- */
    if (perp > 8) {
      S("line", { x1: AX, y1: EY, x2: AX, y2: EY + perp, stroke: C.blue, "stroke-width": 2,
        "stroke-dasharray": "6 4", "marker-end": "url(#arr-" + svg.dataset.uid + ")" }, g);
      put(AX - 8, EY + perp / 2, "F sin\u03B8",
        { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.blue });
    }
    if (along > 8) {
      S("line", { x1: AX, y1: EY, x2: AX + along, y2: EY, stroke: C.green, "stroke-width": 2,
        "stroke-dasharray": "6 4", "marker-end": "url(#arrGreen-" + svg.dataset.uid + ")" }, g);
      // the along-door part is drawn on the bar itself (as the printed right panel draws F),
      // so its label goes ABOVE the bar where the theta arc cannot reach it
      put(AX + along / 2, EY - 24, "F cos\u03B8",
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.green });
    }
    S("line", { x1: AX, y1: EY, x2: tipX, y2: tipY, stroke: C.red, "stroke-width": 3,
      "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, g);
    // the label sits just off the arrowhead on its downhill side, which is empty in every
    // state (the arm's label lies further round, the arc's label nearer the hinge end)
    put(tipX - uy * 20, tipY + ux * 20, "F = " + F.toFixed(0) + " N",
      { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.red });

    /* ---- the angle between the door and the force, at A ---- */
    if (th > 2) {
      const r0 = 44;
      sector(g, AX, EY, r0, 0, rad, "none", C.amber);
      const bis = rad / 2;
      put(AX + (r0 + 24) * Math.cos(bis), EY + (r0 + 24) * Math.sin(bis) + 4,
        "\u03B8 = " + th.toFixed(0) + "\u00B0",
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
    } else {
      put(AX + 32, EY + 20, "\u03B8 = 0\u00B0",
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
    }

    /* ---- which way the door turns, read off r x F (positive z is clockwise on screen) ---- */
    const tz = (AX - OX) * uy - (EY - EY) * ux;
    const turning = Math.abs(tz) > 1e-9;
    const clockwise = tz > 0;
    if (turning) {
      // anticlockwise: the free end A drops, so on the left of O the arc runs downwards
      const up = "M " + (OX - 30 * 0.342) + " " + (EY - 30 * 0.940) + " A 30 30 0 0 0 " +
        (OX - 30 * 0.342) + " " + (EY + 30 * 0.940);
      const down = "M " + (OX - 30 * 0.342) + " " + (EY + 30 * 0.940) + " A 30 30 0 0 1 " +
        (OX - 30 * 0.342) + " " + (EY - 30 * 0.940);
      S("path", { d: clockwise ? down : up, fill: "none", stroke: C.red, "stroke-width": 1.8,
        "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, svg);
    }

    /* ---- the play control: a real button, so it works with a mouse, a finger and the keyboard ---- */
    const canPlay = tau >= 0.05;                  // tau = 0 means no moment: nothing to play
    playBtn.disabled = !canPlay;
    /* the shared sheet gives every button cursor:pointer and has no :disabled override, so a
     * disabled play would still show a hand and read as clickable; set it per state here
     * rather than touching engine/styles.css */
    playBtn.style.cursor = canPlay ? "pointer" : "default";
    playBtn.title = canPlay
      ? "swing the door 30\u00B0 about the hinge; the bigger the torque, the faster"
      : "no moment: the door cannot turn";

    /* ---- the reading column, top right, clear of the drawing ---- */
    const sense = !turning ? "no moment" : clockwise ? "clockwise" : "anticlockwise";
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(66, "F = " + F.toFixed(0) + " N", C.red, 13);
    col(96, "\u03B8 = " + th.toFixed(0) + "\u00B0", C.amber, 13);
    col(126, "d = 2 m", C.grey, 12);
    col(156, "arm = " + (J_D * Math.sin(rad)).toFixed(2) + " m", C.amber, 12);
    col(190, "\u03C4 = " + tau.toFixed(1) + " N m", C.blue, 16);
    col(218, sense, C.grey, 11.5);

    /* ---- the reading row ---- */
    const latex = "\\tau = F d \\sin\\theta = " + F.toFixed(0) + "\\times 2\\times\\sin " + th.toFixed(0) +
      "^\\circ = " + tau.toFixed(1) + "\\ \\text{N m}";
    let caption;
    if (th === 0) {
      caption = "The force lies along the door, so its perpendicular part is zero and the moment arm is zero: the door does not turn (\u03C4 = 0), so the play button is off.";
    } else if (th === 90) {
      caption = "The force is square to the door: the whole of it turns the door and the moment arm is the full 2 m (it now lies along the door), so \u03C4 = 2F = " + tau.toFixed(1) + " N m. Press play: the bigger the torque, the faster the door swings.";
    } else {
      caption = "Only F sin\u03B8 turns the door; it acts 2 m from the hinge, so \u03C4 = F d sin\u03B8 = " + tau.toFixed(1) +
        " N m. The F cos\u03B8 part runs along the door and has no moment arm. The free end A is pushed down, so the door turns " + sense + ". Press play: the bigger the torque, the faster the swing.";
    }
    r.set(latex, true, caption, { yes: "live readings" });
  };

  [fS, tS].forEach((s) => s.on(render));
  render();
}

const REGISTRY = { q1: jq1, p1: jp1 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
