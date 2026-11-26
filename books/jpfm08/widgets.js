/**
 * Interactive graphics for this book, opened from a question's graphic button.
 * Build them from the shared kit; house rules are in docs/03-authoring-style.md.
 *
 * q1 is the question's own figure (force above the door, pointing away from the hinge); p1 is the
 * unchanged copy of the summary panel's picture, held for the page-1 play button. (The mathematics
 * template's marble example that shipped here by mistake was removed; nothing of it is left.)
 */

import { C, S, T, H, scene, clear, sector, tabs, slider, readout, question, buttonRow } from "../../engine/widgets/kit.js";

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
    const tauOut = Math.abs(tau) < 0.05 ? 0 : tau;   // never print a signed zero
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
    col(190, "\u03C4 = " + tauOut.toFixed(1) + " N m", C.blue, 16);
    col(218, sense, C.grey, 11.5);

    /* ---- the reading row ---- */
    const latex = "\\tau = F d \\sin\\theta = " + F.toFixed(0) + "\\times 2\\times\\sin " + th.toFixed(0) +
      "^\\circ = " + tauOut.toFixed(1) + "\\ \\text{N m}";
    let caption;
    if (th === 0) {
      caption = "The force lies along the door's line, so its line of action runs straight through the hinge: the moment arm is zero and the door cannot turn (\u03C4 = 0), so the play button is off.";
    } else if (th === 90) {
      caption = "The force is square to the door: the whole of it turns the door and the moment arm is the full 2 m, so \u03C4 = 2F = " + tau.toFixed(1) + " N m. Press play: the bigger the torque, the faster the door swings.";
    } else {
      caption = "Only F sin\u03B8 turns the door; it acts 2 m from the hinge, so \u03C4 = F d sin\u03B8 = " + tauOut.toFixed(1) +
        " N m. The F cos\u03B8 part runs along the door and has no moment arm. The force lifts the free edge A, so the door turns clockwise. Press play: the bigger the torque, the faster the swing.";
    }
    r.set(latex, true, caption, { yes: "live readings" });
  };

  [fS, tS].forEach((s) => s.on(render));
  render();
}

/* ---------------- Page 1: the summary panel's own picture, swept through 0-360 degrees --------
 *
 * The printed summary panel at the top of page 1 draws the hinge O on the RIGHT (red dot) and
 * the force hanging BELOW the door at A, with theta measured from the door towards O: the right
 * panel is theta = 0 (force along the door, towards the hinge, moment arm 0) and the left panel is
 * theta = 90 (force square to the door, moment arm the full d). Measured on pages/p01.jpg the red
 * arrows run (+3,+115) px, (+58,+92) px and (+123,-3) px, i.e. straight down, down-towards-O and
 * along the door towards O - this widget keeps that convention and now lets theta run right round,
 * 0-360 deg, so the reader can see the force go below, behind and above the door.
 *
 * Over the whole turn the signed moment is F d sin(theta): positive (anticlockwise) while the force
 * is on the A side, negative (clockwise) once it swings round past 180 deg, and zero at 0/180/360
 * where its line of action runs through the hinge. The swing always follows that sign, so play
 * turns the door the way the moment would, and the button is off where the moment vanishes.
 *
 * The layout is sized for the swing as well as the still picture: turning the whole figure 30 deg
 * about O sweeps every drawn point round O, so O sits near the middle of a 670 x 580 frame and the
 * door is 210 px with the force at most 152 px long (scale 3.8). That way the largest force stays
 * inside the frame at every angle, during the swing too. (Checked for 36 angles at F = 40 N with
 * the swing running: no pixel leaves the frame.)
 */
const AX = 170, EY = 290;   // A is where the force acts, on the left
const OX = 380;             // O is the hinge, on the right (as the printed figure has it)
const CX = 600;             // the fixed reading column, top right
const P1_PX_PER_N = 3.8;    // p1's own force scale (the question's widget keeps 4.8)

function jp1(root) {
  const CW = 670, CH = 580;
  const svg = scene(CW, CH);
  const fS = slider({ label: "force F (N)", min: 10, max: 40, step: 1, value: J_F0,
    fmt: (v) => v.toFixed(0) + " N", play: false });
  const tS = slider({ label: "angle \u03B8 (degrees)", min: 0, max: 360, step: 1, value: 30,
    fmt: (v) => v.toFixed(0) + "\u00B0", play: false });
  const r = readout();

  /* ---- the swing: the door turns about the hinge and comes back ----
   * Timed by the moment, not by a fixed timer: a door of moment of inertia I kicked by a moment
   * tau sweeps an angle A in t = sqrt(2 A I / |tau|), so the same 30 deg takes longer at a small F
   * or a small theta. I = 14 kg m^2 keeps the printed case near 0.7 s; clamped to 0.35-1.6 s so
   * the ends stay watchable. The direction follows the sign of the moment, and at tau = 0 (force
   * along the door, line of action through the hinge) the door cannot turn at all.
   */
  let phi = 0;                      // live rotation, degrees; negative swings the free end A down
  let raf = 0;                      // the running requestAnimationFrame id, 0 when idle
  const SWING = 30;                 // degrees, as asked
  const INERTIA = 14.0;             // kg m^2, see above
  const spin = () => {
    const th0 = (tS.get() * Math.PI) / 180;
    const tauNow = fS.get() * J_D * Math.sin(th0);
    if (Math.abs(tauNow) < 0.05) return;            // no moment: the door cannot turn
    if (raf) cancelAnimationFrame(raf);
    // screen sense: with A left of O, a downward force turns the door anticlockwise (A drops),
    // an upward one clockwise (A rises)
    const dir = Math.sin(th0) > 0 ? -1 : 1;
    const arc = (SWING * Math.PI) / 180;
    const tSwing = Math.max(350, Math.min(1600, 1000 * Math.sqrt((2 * arc * INERTIA) / Math.abs(tauNow))));
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
      phi = dir * SWING * k;
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
    const sinT = Math.sin(rad), cosT = Math.cos(rad);
    const tau = F * J_D * sinT;                      // signed: the sign is the sense, see below
    const L = F * P1_PX_PER_N;                       // force arrow length, px
    const ux = cosT, uy = sinT;                      // from A, along the door towards O and below it
    const perp = L * sinT;                           // square to the door, signed (below is +)
    const along = L * cosT;                          // along the door, signed (towards O is +)
    const a = (phi * Math.PI) / 180;
    /* sin(360 deg) comes back as a tiny negative number, which would print as "-0.0"; anything that
     * small is simply zero, and it must not carry a sign */
    const tauOut = Math.abs(tau) < 0.05 ? 0 : tau;
    /* the explanatory labels (the two parts and the moment arm) fade out while the door is turning,
     * so the moving figure is not crossed by text; the numbers stay in the reading column */
    const fade = Math.max(0, 1 - Math.abs(phi) / 1.2);
    const showParts = fade > 0.05;

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

    /* ---- the moment arm: from O, perpendicular onto the force's line of action ----
     * The foot is where the perpendicular lands; at 0, 180 and 360 deg it is O itself (the line of
     * action runs through the hinge), at 90 and 270 deg it is A (the arm lies along the door). */
    const tt = (OX - AX) * ux;                       // (O - A) projected on the force line
    const fx = AX + ux * tt, fy = EY + uy * tt;
    const arm = Math.hypot(fx - OX, fy - EY);
    if (arm > 4) {
      // the line of action itself, so the foot is visibly on it
      const t0 = Math.min(0, tt) - 24, t1 = Math.max(0, tt) + 24;
      S("line", { x1: AX + ux * t0, y1: EY + uy * t0, x2: AX + ux * t1, y2: EY + uy * t1,
        stroke: C.grey, "stroke-width": 1, "stroke-dasharray": "3 4" }, g);
      // starts at O, never moved: at 90/270 deg this lies along the door, which is correct
      S("line", { x1: OX, y1: EY, x2: fx, y2: fy, stroke: C.amber, "stroke-width": 2.6,
        "stroke-dasharray": "7 4", "stroke-opacity": 0.92 }, g);
      // the right angle at the foot, skipped when the arm is only a few pixels long
      const wnX = (OX - fx) / arm, wnY = (EY - fy) / arm, k = 10;
      if (arm > 20) {
        S("path", { d: "M " + (fx - ux * k) + " " + (fy - uy * k) + " L " + (fx - ux * k + wnX * k) + " " +
          (fy - uy * k + wnY * k) + " L " + (fx + wnX * k) + " " + (fy + wnY * k),
          fill: "none", stroke: C.amber, "stroke-width": 1.3 }, g);
      }
      // the arm's label: below the bar when the arm lies on it, inside the corner between the arm
      // and the hinge when it is long, and under the foot when it is short. It fades out while the
      // door is turning (see `fade`), so the moving figure stays clean
      if (showParts && Math.abs(fy - EY) < 0.25 * arm) {
        put((OX + fx) / 2, EY + 36, "d sin\u03B8",
          { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber, "fill-opacity": fade });
      } else if (showParts && arm > 130) {
        const nx = -(fy - EY) / arm, ny = (fx - OX) / arm;
        put((OX + fx) / 2 + nx * 13, (EY + fy) / 2 + ny * 13, "d sin\u03B8",
          { "text-anchor": "start", "font-size": 11, "font-weight": 700, fill: C.amber, "fill-opacity": fade });
      } else if (showParts) {
        put(fx - 14, fy > EY ? fy + (arm < 130 ? 30 : 16) : fy - (arm < 130 ? 24 : 10), "d sin\u03B8",
          { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.amber, "fill-opacity": fade });
      }
    } else {
      put(OX - 14, EY + 46, "moment arm = 0",
        { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.amber });
    }

    /* ---- the force and its two parts ----
     * Both parts are signed: past 90 deg F sin(theta) points up and past 180 deg F cos(theta)
     * points away from the hinge, which is what the drawing has to show. */
    if (Math.abs(perp) > 8) {
      S("line", { x1: AX, y1: EY, x2: AX, y2: EY + perp, stroke: C.blue, "stroke-width": 2,
        "stroke-dasharray": "6 4", "marker-end": "url(#arr-" + svg.dataset.uid + ")" }, g);
      if (showParts && Math.abs(perp) > 24) {
        put(AX + 10, EY + perp / 2, "F sin\u03B8",
          { "text-anchor": "start", "font-size": 11, "font-weight": 700, fill: C.blue, "fill-opacity": fade });
      }
    }
    if (Math.abs(along) > 8) {
      S("line", { x1: AX, y1: EY, x2: AX + along, y2: EY, stroke: C.green, "stroke-width": 2,
        "stroke-dasharray": "6 4", "marker-end": "url(#arrGreen-" + svg.dataset.uid + ")" }, g);
      // drawn on the bar's own line (as the printed right panel draws F), so its label goes above
      // the bar where the theta arc cannot reach it
      if (showParts && Math.abs(along) > 34) {
        put(AX + along / 2, EY - 30, "F cos\u03B8",
          { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.green, "fill-opacity": fade });
      }
    }
    S("line", { x1: AX, y1: EY, x2: tipX, y2: tipY, stroke: C.red, "stroke-width": 3,
      "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, g);
    /* the label sits off the arrowhead, offset square to the arrow and anchored outward along that
     * offset, so it clears the shaft at every angle of the turn; if that side would run off the
     * canvas (the force points left, so the tip is near the left edge) it goes on the other side */
    const fnx = -uy, fny = ux;
    const F_W = 70;                            // generous width of "F = nn N" at 12 px bold
    const place = (sign) => {
      const nx = fnx * sign, ny = fny * sign;
      const ax = tipX + nx * 26;
      const anchor = nx > 0.3 ? "start" : nx < -0.3 ? "end" : "middle";
      const left = anchor === "start" ? ax : anchor === "end" ? ax - F_W : ax - F_W / 2;
      const right = anchor === "start" ? ax + F_W : anchor === "end" ? ax : ax + F_W / 2;
      return { ax, ay: tipY + ny * 26, anchor, fits: left > 8 && right < CW - 8 };
    };
    const fl = place(1).fits ? place(1) : place(-1);
    put(fl.ax, fl.ay, "F = " + F.toFixed(0) + " N",
      { "text-anchor": fl.anchor, "font-size": 12, "font-weight": 700, fill: C.red });

    /* ---- the angle between the door and the force, at A, swept through the full turn ---- */
    if (th > 2) {
      const r0 = 34;
      const x1 = AX + r0 * Math.cos(rad), y1 = EY + r0 * Math.sin(rad);
      S("path", { d: "M " + (AX + r0) + " " + EY + " A " + r0 + " " + r0 + " 0 " +
        (rad > Math.PI ? 1 : 0) + " 1 " + x1 + " " + y1,
        fill: "none", stroke: C.amber, "stroke-width": 1.5, "stroke-opacity": 0.85 }, g);
      // the glyph sits at the middle of the swept angle; it is dropped where that middle falls on
      // the door itself (angles near 0 and 360 deg), where it would sit on the bar
      const bis = rad / 2;
      const onDoor = Math.abs(Math.sin(bis)) < 0.35;
      if (!onDoor && th <= 90) {
        put(AX + 46 * Math.cos(bis), EY + 46 * Math.sin(bis), "\u03B8",
          { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.amber });
      }
    } else {
      put(AX + 32, EY + 20, "\u03B8 = 0\u00B0",
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
    }

    /* ---- which way the door turns, read off r x F (positive z is clockwise on screen) ---- */
    const tz = (AX - OX) * uy - (EY - EY) * ux;
    const turning = Math.abs(tz) > 1e-9;
    const clockwise = tz > 0;
    if (turning) {
      const up = "M " + (OX - 30 * 0.342) + " " + (EY - 30 * 0.940) + " A 30 30 0 0 0 " +
        (OX - 30 * 0.342) + " " + (EY + 30 * 0.940);
      const down = "M " + (OX - 30 * 0.342) + " " + (EY + 30 * 0.940) + " A 30 30 0 0 1 " +
        (OX - 30 * 0.342) + " " + (EY - 30 * 0.940);
      S("path", { d: clockwise ? down : up, fill: "none", stroke: C.red, "stroke-width": 1.8,
        "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, svg);
    }

    /* ---- the play control: a real button, so it works with a mouse, a finger and the keyboard ---- */
    const canPlay = Math.abs(tau) >= 0.05;        // no moment means nothing to play
    playBtn.disabled = !canPlay;
    /* the shared sheet gives every button cursor:pointer and has no :disabled override, so a
     * disabled play would still show a hand and read as clickable; set it per state here
     * rather than touching engine/styles.css */
    playBtn.style.cursor = canPlay ? "pointer" : "default";
    playBtn.title = canPlay
      ? "swing the door 30\u00B0 about the hinge, the way the moment turns it; the bigger the moment, the faster"
      : "no moment: the force's line of action passes through the hinge, so the door cannot turn";

    /* ---- the reading column, top right, clear of the drawing ---- */
    const sense = !turning ? "no moment" : clockwise ? "clockwise" : "anticlockwise";
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(66, "F = " + F.toFixed(0) + " N", C.red, 13);
    col(96, "\u03B8 = " + th.toFixed(0) + "\u00B0", C.amber, 13);
    col(126, "d = 2 m", C.grey, 12);
    col(156, "arm = " + (J_D * Math.abs(sinT)).toFixed(2) + " m", C.amber, 12);
    col(190, "\u03C4 = " + tauOut.toFixed(1) + " N m", C.blue, 16);
    col(218, sense, C.grey, 11.5);

    /* ---- the reading row ---- */
    const latex = "\\tau = F d \\sin\\theta = " + F.toFixed(0) + "\\times 2\\times\\sin " + th.toFixed(0) +
      "^\\circ = " + tauOut.toFixed(1) + "\\ \\text{N m}";
    let caption;
    if (arm <= 4) {
      caption = "The force lies along the door's line, so its line of action runs through the hinge: the moment arm is zero and the door cannot turn (\u03C4 = 0), so the play button is off.";
    } else if (Math.abs(th % 180 - 90) < 0.5) {
      caption = "The force is square to the door: the whole of it turns the door and the moment arm is the full 2 m, so \u03C4 = " + tauOut.toFixed(1) + " N m. Press play: the bigger the moment, the faster the door swings.";
    } else if (th > 180) {
      caption = "Past 180\u00B0 the force has swung round to the other side of the door, so \u03C4 = F d sin\u03B8 is negative: the door turns the other way. Only F sin\u03B8 turns it, and the moment arm is still 2|sin\u03B8| = " + (J_D * Math.abs(sinT)).toFixed(2) + " m. Press play: it swings " + sense + ".";
    } else {
      caption = "Only F sin\u03B8 turns the door; it acts 2 m from the hinge, so \u03C4 = F d sin\u03B8 = " + tauOut.toFixed(1) +
        " N m. The F cos\u03B8 part runs along the door and has no moment arm. Press play: the door swings " + sense + ", faster the bigger the moment.";
    }
    r.set(latex, true, caption, { yes: "live readings" });
  };

  [fS, tS].forEach((s) => s.on(render));
  render();
}

/* ---------------- Q2: the moment of a force about a point you can move ----------------
 *
 * The teacher's own brief: pick one of four objects, drag the pivot anywhere (inside the object,
 * on its edge, or right off it), and add up to three forces whose position, direction and size
 * can all be changed. Every force then shows its line of action, the perpendicular arm from P to
 * that line (dashed, with a right angle at the foot), its own moment with the sense in words, and
 * the net moment. Moving P re-solves everything - that is the point of the widget.
 *
 * Nothing is written by hand. With r = point - P, the drawn force vector F and screen y down,
 *   z = r_x F_y - r_y F_x      z > 0 turns clockwise on screen (the same reading q1 uses)
 *   d = |z| / F                tau = F d, sense = z > 0 ? clockwise : anticlockwise
 * The numbers below were read back out of the reader, not worked on paper only:
 *   F = 30 N at d = 0.40 m -> 12.0 N m clockwise;
 *   F = 18 N at d = 0.50 m -> 9.0 N m clockwise;
 *   30 N at 0.40 m against 12 N at 1.00 m -> 12.0 and 12.0, net 0, "balanced - does not turn".
 *
 * The drawing is 620 x 400 with 150 px per metre. The object sits at (232, 190) and never
 * moves; the reading column lives at x = 462..614, clear of it. Point targets are 47 px across
 * at the drawer width an iPad gives (24 viewBox units) so a finger can hold them.
 */
const Q2_W = 620, Q2_H = 400;
let Q2_S = 150;                      // px per metre; every printed case brings its own scale
const Q2_CX = 232, Q2_CY = 190;      // centre of the object
const Q2_COLX = 462;                 // the reading column starts here
const Q2_COL = [C.red, C.blue, C.green];   // F1, F2, F3
const Q2_SUB = ["\u2081", "\u2082", "\u2083"];
const Q2_PIVOT_R = 24, Q2_PT_R = 22, Q2_TIP_R = 22;   // hit radii, viewBox units

/* ---- the six printed cases (a)-(f) on page 2 ----
 *
 * The bar, P and the force of each case are the printed ones, and each case brings its own
 * px-per-metre S, chosen so that tau = F * d_px / S lands on the number in
 * books/jpfm08/solutions.js q2 (checked on paper, then read back out of the reader):
 *   (a) 30 x 0.4                  = 12    anticlockwise
 *   (b) 30 x 0.4 x sin 60         = 10.4  clockwise
 *   (c) 120 x 1.5 x cos 40        = 138   clockwise
 *   (d) 50 x 1 x sin 0            = 0
 *   (e) 6 x 0.4                   = 2.4   clockwise
 *   (f) 20(7+3) sin 70 + 15(3) sin 60 = 227 anticlockwise
 *
 * deg is the screen angle: 0 = +x (right), 90 = +y (down), so a = deg * PI / 180.
 * (d)'s 369.81 / -30 deg is deliberate: cos(-30) * 300 = 259.808 and sin(-30) * 300 = -150 put
 * the line of action exactly through P, so d reads 0.000 rather than 0.001.
 * (e) keeps the sandbox plate and its 150 px/m frame; P = (-0.42, -0.40) m = (169, 130) and the
 * force acts at P + (0.40, 0.30) m = (229, 175), straight down.
 */
const Q2_CASES = [
  { label: "(a)", S: 700, bar: [[120, 190], [400, 190]], pivot: [400, 190],
    forces: [{ x: 120, y: 190, deg: 90, F: 30 }],
    note: "30 N at 0.4 m from P",
    answer: "\u03C4 = 30 \u00D7 0.4 = 12 N m anticlockwise" },
  { label: "(b)", S: 700, bar: [[120, 250], [400, 250]], pivot: [400, 250],
    forces: [{ x: 120, y: 250, deg: -60, F: 30 }],
    note: "30 N at 0.4 m from P, 60\u00B0 to the bar",
    answer: "\u03C4 = 30 \u00D7 0.4 \u00D7 sin 60\u00B0 = 10.4 N m clockwise" },
  { label: "(c)", S: 220, bar: [[80, 200], [450, 200]], pivot: [80, 200],
    forces: [{ x: 410, y: 200, deg: 130, F: 120 }],
    note: "120 N at 1.5 m from P",
    answer: "\u03C4 = 120 \u00D7 1.5 \u00D7 cos 40\u00B0 = 138 N m clockwise" },
  { label: "(d)", S: 300, bar: [[110, 290], [355.746, 117.927]], pivot: [110, 290],
    forces: [{ x: 355.746, y: 117.927, deg: -35, F: 50 }],
    note: "50 N, its line of action passes through P",
    answer: "\u03C4 = 50 \u00D7 1 \u00D7 sin 0\u00B0 = 0" },
  { label: "(e)", S: 150, plate: true, pivot: [169, 130],
    forces: [{ x: 229, y: 175, deg: 90, F: 6 }],
    note: "6 N at 0.4 m from P",
    answer: "\u03C4 = 6 \u00D7 0.4 = 2.4 N m clockwise" },
  { label: "(f)", S: 40, bar: [[40, 200], [440, 200]], pivot: [440, 200],
    forces: [{ x: 40, y: 200, deg: 70, F: 20 }, { x: 320, y: 200, deg: 120, F: 15 }],
    note: "20 N at 10 m and 15 N at 3 m from P",
    answer: "\u03C4 = 20(7+3) sin 70\u00B0 + 15(3) sin 60\u00B0 = 227 N m anticlockwise" },
];

/* 3 significant figures with the trailing zeros dropped, so the live reading reads word for word
 * like the printed answer: 12, 10.4, 138, 0, 2.4, 227, 39, 188. */
const sig3 = (v) => {
  if (!Number.isFinite(v) || Math.abs(v) < 0.0005) return "0";
  const dp = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(v))));
  const s = Math.abs(v).toFixed(dp);
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
};

function jq2(root) {
  const svg = scene(Q2_W, Q2_H);
  svg.style.touchAction = "none";          // dragging inside must not scroll the drawer
  const r = readout();

  /* The four objects. Each is drawn from metres about the centre, with the state it opens in:
   * the pivot where the printed figures put P (the rod's end, the box's corner, the door's
   * hinge, the plate's printed P) and one force to start from. */
  const SHAPES = {
    rod: { name: "rod", pivot: [-0.86, 0], at: [0.55, 0], F: 30 },
    box: { name: "box", pivot: [-0.60, 0.42], at: [0.34, -0.42], F: 30 },
    door: { name: "flat door", pivot: [-0.85, 0], at: [0.60, 0], F: 30 },
    plate: { name: "irregular plate", pivot: [-0.42, -0.40], at: [0.12, 0.22], F: 30 },
  };

  let shape = "rod";
  let caseIdx = -1;                    // >= 0 while a printed case (a)-(f) is showing
  let pivot = [0, 0];                  // screen px
  let forces = [];                     // {x, y, a, F}: screen px, radians (screen), newtons

  const X = (m) => Q2_CX + m * Q2_S;
  const Y = (m) => Q2_CY + m * Q2_S;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ---- the objects ---- */
  function drawShape() {
    if (caseIdx >= 0) {                  // a printed case draws its own bar (or the plate)
      const c = Q2_CASES[caseIdx];
      if (c.plate) drawPlate();
      else drawBar(c.bar[0], c.bar[1]);
      return;
    }
    if (shape === "rod") {
      S("rect", { x: X(-0.86), y: Y(-0.055), width: 1.72 * Q2_S, height: 0.11 * Q2_S, rx: 5,
        fill: C.soft, stroke: C.line, "stroke-width": 2 }, svg);
      S("line", { x1: X(-0.86) + 6, y1: Y(0), x2: X(0.86) - 6, y2: Y(0), stroke: C.line,
        "stroke-width": 1, "stroke-opacity": 0.25 }, svg);
    } else if (shape === "box") {
      S("rect", { x: X(-0.6), y: Y(-0.42), width: 1.2 * Q2_S, height: 0.84 * Q2_S, rx: 3,
        fill: C.soft, stroke: C.line, "stroke-width": 2 }, svg);
    } else if (shape === "door") {
      /* the flat door, drawn as a door and not as a second rod: a panel with real thickness
       * (0.34 m against the rod's 0.11 m), an inset panel line, two hinge knuckles straddling
       * its left edge, and a lever handle high on the free edge - high so the force arrow at
       * mid-height stays clear of it. Same object box as the other three (x -0.85..0.85 m,
       * y -0.17..0.17 m), so P, every arm and every moment are unchanged: only the picture
       * got readable. */
      const L = X(-0.85), R = X(0.85), TP = Y(-0.17), BT = Y(0.17), HH = BT - TP;
      S("rect", { x: L, y: TP, width: R - L, height: HH, rx: 3,
        fill: C.soft, stroke: C.line, "stroke-width": 2.2 }, svg);
      S("rect", { x: L + 8, y: TP + 8, width: R - L - 16, height: HH - 16, rx: 2,
        fill: "none", stroke: C.line, "stroke-width": 1.2, "stroke-opacity": 0.3 }, svg);
      [-1, 1].forEach((s) => {                    // two hinges, centred on the hinge edge
        S("rect", { x: L - 7, y: Y(0) + s * 17 - 4.5, width: 14, height: 9, rx: 3.5,
          fill: C.line }, svg);
      });
      const hx = R - 12, hy = TP + 14;            // the lever handle: a grey rose and a short
      S("circle", { cx: hx, cy: hy, r: 4.2, fill: C.grey, "fill-opacity": 0.85 }, svg);
      S("line", { x1: hx, y1: hy, x2: hx - 16, y2: hy, stroke: C.grey, "stroke-width": 3.4,
        "stroke-linecap": "round", "stroke-opacity": 0.85 }, svg);
    } else {
      drawPlate();
    }
  }

  /* the kidney plate of printed case (e): a smooth outline with the concave left edge */
  function drawPlate() {
    const P = (mx, my) => `${X(mx)},${Y(my)}`;
    S("path", {
      d: `M${P(-0.55, -0.60)} C${P(-0.28, -0.74)} ${P(0.20, -0.70)} ${P(0.46, -0.48)} `
        + `C${P(0.74, -0.24)} ${P(0.78, 0.16)} ${P(0.54, 0.44)} `
        + `C${P(0.30, 0.70)} ${P(-0.06, 0.74)} ${P(-0.20, 0.58)} `
        + `C${P(-0.36, 0.40)} ${P(-0.26, 0.12)} ${P(-0.40, -0.06)} `
        + `C${P(-0.52, -0.22)} ${P(-0.62, -0.44)} ${P(-0.55, -0.60)} Z`,
      fill: C.soft, stroke: C.line, "stroke-width": 2,
    }, svg);
  }

  /* a printed case's bar: 10 px thick with round ends, C.soft fill and a 2 px C.line edge, drawn
   * between the two printed endpoints whatever the bar's angle. The soft core is 6 px, so the
   * outline shows 2 px all round and the total is the printed 10 px. */
  function drawBar(p, q) {
    const [x1, y1] = p, [x2, y2] = q;
    S("line", { x1, y1, x2, y2, stroke: C.line, "stroke-width": 10, "stroke-linecap": "round" }, svg);
    S("line", { x1, y1, x2, y2, stroke: C.soft, "stroke-width": 6, "stroke-linecap": "round" }, svg);
    S("line", { x1, y1, x2, y2, stroke: C.line, "stroke-width": 1, "stroke-opacity": 0.25 }, svg);
  }

  /* ---- one arrowhead, drawn rather than a marker, so any colour works ---- */
  function arrow(x1, y1, x2, y2, color, w, head) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - Math.cos(a) * head, by = y2 - Math.sin(a) * head;
    const nx = -Math.sin(a) * head * 0.42, ny = Math.cos(a) * head * 0.42;
    S("line", { x1, y1, x2: bx, y2: by, stroke: color, "stroke-width": w, "stroke-linecap": "round" }, svg);
    S("polygon", { points: `${x2},${y2} ${bx + nx},${by + ny} ${bx - nx},${by - ny}`, fill: color }, svg);
  }

  /* ---- the geometry of one force: its arrow tip, its arm, its moment ---- */
  const lenOf = (F) => clamp(26 + F * 0.58, 26, 84);          // px; never zero, never off the frame
  const tipOf = (f) => {
    const L = lenOf(f.F);
    return [f.x + Math.cos(f.a) * L, f.y + Math.sin(f.a) * L];
  };
  const armOf = (f) => {
    const ux = Math.cos(f.a), uy = Math.sin(f.a);
    const rx = f.x - pivot[0], ry = f.y - pivot[1];
    const along = rx * ux + ry * uy;                          // projection of r on the force line
    const foot = [f.x - ux * along, f.y - uy * along];
    const z = rx * uy - ry * ux;                              // > 0: clockwise on screen
    return { foot, z, d: Math.abs(z), ux, uy, along };
  };

  /* ---- the drawing ---- */
  function render() {
    clear(svg);
    drawShape();

    // which printed case is on show: a thin line in the empty top-left corner of the canvas
    if (caseIdx >= 0) {
      const c = Q2_CASES[caseIdx];
      T(svg, 14, 20, `${c.label} ${c.note}`,
        { "font-size": 11.5, "font-weight": 700, fill: C.grey, "class": "g-case-tag" });
    }

    const sums = [];
    forces.forEach((f, i) => {
      const col = Q2_COL[i];
      const { foot, z, d, ux, uy, along } = armOf(f);
      const tau = f.F * d / Q2_S;                             // N m: arm in px -> m
      sums.push({ tau: Math.sign(z) * tau, F: f.F, d: d / Q2_S, col, i });

      if (f.F < 0.5) {
        // no force: the point stays, so it can be found and turned again, but nothing acts
        S("circle", { cx: f.x, cy: f.y, r: 5, fill: "#fff", stroke: col, "stroke-width": 2.4 }, svg);
        T(svg, f.x + 10, f.y - 9, `F${Q2_SUB[i]} = 0 N`, { "font-size": 11.5, "font-weight": 700, fill: col });
        return;
      }

      /* the line of action, carried a little past the point and the foot so both sit on it.
       * Measured, not guessed: the foot lies at t = -along on the u axis measured from the force
       * point, so the span must be [min(0,-along) - ext, max(0,-along) + ext]. The old form used
       * |x - foot.x| with a fixed sign and, once the force pointed away from P, drew the dashed
       * line on the foot side only - seen in the anticlockwise shot at 23:06. */
      const ext = 26;
      const t0 = Math.min(0, -along) - ext, t1 = Math.max(0, -along) + ext;
      S("line", {
        x1: f.x + ux * t0, y1: f.y + uy * t0,
        x2: f.x + ux * t1, y2: f.y + uy * t1,
        stroke: C.grey, "stroke-width": 1.1, "stroke-dasharray": "7 5", "stroke-opacity": 0.8,
      }, svg);

      // the arm: the perpendicular from P to that line, with a right angle at the foot
      if (d > 3) {
        S("line", { x1: pivot[0], y1: pivot[1], x2: foot[0], y2: foot[1], stroke: col,
          "stroke-width": 2.2, "stroke-dasharray": "8 5" }, svg);
        if (d > 16) {
          const wx = (pivot[0] - foot[0]) / d, wy = (pivot[1] - foot[1]) / d, k = 9;
          S("path", {
            d: `M${foot[0] - ux * k},${foot[1] - uy * k} L${foot[0] - ux * k + wx * k},${foot[1] - uy * k + wy * k} L${foot[0] + wx * k},${foot[1] + wy * k}`,
            fill: "none", stroke: col, "stroke-width": 1.4,
          }, svg);
        }
        // the arm's value, set square to the arm so it never lies along it. Its spot along the
        // arm is staggered by the force's index, so three arms that cross near the middle do not
        // stack their numbers on top of each other.
        const tLab = clamp(0.28 + i * 0.15, 0.26, 0.55);
        const mx = pivot[0] + (foot[0] - pivot[0]) * tLab;
        const my = pivot[1] + (foot[1] - pivot[1]) * tLab;
        const ox = (pivot[1] - foot[1]) / d * 28, oy = (foot[0] - pivot[0]) / d * 28;
        T(svg, mx + ox, my + oy + 4, (d / Q2_S).toFixed(3) + " m",
          { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: col, "class": "g-arm-lab",
            stroke: "#fff", "stroke-width": 3.2, "paint-order": "stroke", "stroke-linejoin": "round" });
      } else {
        T(svg, foot[0] + 10, foot[1] + 18, `d${Q2_SUB[i]} = 0 (line through P)`,
          { "font-size": 11, "font-weight": 700, fill: col });
      }

      // the force itself, ending at the round knob so the head is not buried in it
      const [tx, ty] = tipOf(f);
      arrow(f.x, f.y, tx - Math.cos(f.a) * 8, ty - Math.sin(f.a) * 8, col, 3.4, 11);
      // the label runs beside the shaft, on the far side from P, and is anchored away from the
      // shaft: centred 12 px off a vertical shaft the text still crossed it (seen at 22:48).
      // Where that side would push the text off the frame it hops to the other side of the
      // shaft instead of sliding onto it: case (f) puts a force at x = 40, and a label clamped
      // to the edge there lost its first character and then sat under the arrow (23:41, 23:45).
      const side = Math.sign((pivot[0] - f.x) * uy - (pivot[1] - f.y) * ux) || 1;
      const nx = -uy * side, ny = ux * side;
      const anchor = nx > 0.25 ? "start" : nx < -0.25 ? "end" : "middle";
      const off = anchor === "middle" ? 18 : 14;
      const mid = Math.max(20, lenOf(f.F) * 0.55);
      let anc = anchor;
      let lx = f.x + ux * mid + nx * off;
      let ly = f.y + uy * mid + ny * off + 4;
      if ((anc === "end" && lx < 54) || (anc === "start" && lx > 566)) {
        anc = anc === "end" ? "start" : "end";
        lx = f.x + ux * mid - nx * off;
        ly = f.y + uy * mid - ny * off + 4;
      }
      T(svg, clamp(lx, 6, 614), ly,
        `F${Q2_SUB[i]} ${f.F.toFixed(0)} N`,
        { "text-anchor": anc, "font-size": 11.5, "font-weight": 700, fill: col,
          stroke: "#fff", "stroke-width": 3.2, "paint-order": "stroke", "stroke-linejoin": "round" });

      // the point it acts at, and a hollow knob on the head: both are drag handles
      S("circle", { cx: f.x, cy: f.y, r: 5.5, fill: col, stroke: "#fff", "stroke-width": 1.6 }, svg);
      S("circle", { cx: tx, cy: ty, r: 6.5, fill: "#fff", stroke: col, "stroke-width": 2 }, svg);
    });

    // the pivot, drawn last so it is always grabbable, and its label
    S("circle", { cx: pivot[0], cy: pivot[1], r: 8.5, fill: C.ink, stroke: "#fff", "stroke-width": 2.2 }, svg);
    T(svg, pivot[0], pivot[1] - 15, "P", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });

    nudgeArmLabels();
    drawColumn(sums);
    writeReading(sums);
  }

  /* ---- keep the arm numbers clear: nudge each one until its box clears every other text and
   * every drag handle (the dots and knobs are drawn after the labels, so a label under one is
   * hidden). Gives up and leaves it alone if the widget is not laid out yet. ---- */
  function nudgeArmLabels() {
    let texts, circles;
    try {
      texts = [...svg.querySelectorAll("text")].map((el) => ({ el, box: el.getBBox(), arm: el.classList.contains("g-arm-lab") }));
      circles = [...svg.querySelectorAll("circle")].map((c) => {
        const cx = Number(c.getAttribute("cx")), cy = Number(c.getAttribute("cy")), r = Number(c.getAttribute("r")) || 0;
        return { x: cx - r - 2, y: cy - r - 2, width: 2 * r + 4, height: 2 * r + 4 };
      });
    } catch {
      return;
    }
    const hit = (a, b) => Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) + 1
      && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y) + 1;
    const fixed = [...texts.filter((o) => !o.arm).map((o) => o.box), ...circles];
    const D = [];
    for (const dy of [0, 13, -13, 26, -26, 39, -39, 52, -52]) for (const dx of [0, 20, -20, 38, -38]) D.push([dx, dy]);
    D.sort((a, b) => Math.abs(a[0]) + Math.abs(a[1]) - (Math.abs(b[0]) + Math.abs(b[1])));
    for (const o of texts.filter((x) => x.arm)) {
      const x0 = Number(o.el.getAttribute("x")), y0 = Number(o.el.getAttribute("y"));
      let placed = o.box;
      for (const [dx, dy] of D) {
        const b = { x: o.box.x + dx, y: o.box.y + dy, width: o.box.width, height: o.box.height };
        if (!fixed.some((f) => hit(f, b))) {
          if (dx) o.el.setAttribute("x", x0 + dx);
          if (dy) o.el.setAttribute("y", y0 + dy);
          placed = b;
          break;
        }
      }
      fixed.push(placed);
    }
  }

  /* ---- the reading column: one block per force, then the net ----
   * Measured on the render: a 12 px line box is 15.5 px tall and a 10.5 px one is 13.4, so the
   * old 13 px step put the sense line 0.4 px inside the tau line and the old 56 px block pitch
   * put the next "F2 = ..." line on top of it. The steps below are 17 px inside a block and
   * 70 px between blocks; the reader showed every gap positive (see the bbox report). */
  function drawColumn(sums) {
    const x = Q2_COLX;
    T(svg, x, 34, "about P", { "font-size": 11, fill: C.grey });
    sums.forEach((s, k) => {
      const y = 60 + k * 70;
      T(svg, x, y, `F${Q2_SUB[s.i]} = ${s.F.toFixed(0)} N`, { "font-size": 12, "font-weight": 700, fill: s.col });
      T(svg, x, y + 17, `d${Q2_SUB[s.i]} = ${s.d.toFixed(3)} m`, { "font-size": 11.5, fill: C.amber });
      if (s.F < 0.5) {
        T(svg, x, y + 34, "no force", { "font-size": 11, fill: C.grey });
      } else {
        T(svg, x, y + 34, `\u03C4${Q2_SUB[s.i]} = ${sig3(s.tau)} N m`,
          { "font-size": 11.5, "font-weight": 700, fill: s.col });
        T(svg, x + 2, y + 51, Math.abs(s.tau) < 0.05 ? "\u2014" : s.tau > 0 ? "clockwise" : "anticlockwise",
          { "font-size": 10.5, fill: C.grey });
      }
    });

    /* ---- the net, on the canvas: it is the answer, so it must not sit below the fold (the
     * drawer scrolls, and the reading used to be outside the picture) ---- */
    const live = sums.filter((s) => s.F >= 0.5);
    const net = live.reduce((a, s) => a + s.tau, 0);
    const y0 = Math.max(232, 60 + sums.length * 70 + 16);
    S("line", { x1: x, y1: y0, x2: Q2_W - 14, y2: y0, stroke: C.grey, "stroke-width": 1, "stroke-opacity": 0.45 }, svg);
    T(svg, x, y0 + 22, live.length ? `\u03A3\u03C4 = ${sig3(net)} N m` : "\u03A3\u03C4 = 0 N m",
      { "font-size": 14, "font-weight": 700, fill: C.ink });
    const flat = !live.length ? "no force"
      : Math.abs(net) < 0.05 ? "balanced \u2014 does not turn"
        : net > 0 ? "clockwise" : "anticlockwise";
    T(svg, x, y0 + 40, flat,
      { "font-size": 11, "font-weight": 700, fill: !live.length || Math.abs(net) < 0.05 ? C.green : C.grey });
  }

  function writeReading(sums) {
    const live = sums.filter((s) => s.F >= 0.5);
    const net = live.reduce((a, s) => a + s.tau, 0);
    /* a moment under 0.05 N m is zero: without this, case (d) - whose line of action runs through
     * P, so d = 0 - printed "0 (acw)" and read "0 N m anticlockwise" */
    const acts = live.filter((s) => Math.abs(s.tau) >= 0.05);
    const cw = acts.filter((s) => s.tau > 0);
    const acw = acts.filter((s) => s.tau < 0);
    const tot = (list) => list.reduce((a, s) => a + Math.abs(s.tau), 0);
    const names = (list) => list.map((s) => `F${Q2_SUB[s.i]}`).join(" and ");
    const parts = acts.map((s) => `${sig3(s.tau)}\\ (${s.tau > 0 ? "cw" : "acw"})`);
    const latex = acts.length
      ? `\\Sigma\\tau = ${parts.join(" + ")} = ${sig3(net)}\\ \\text{N m}`
      : `\\Sigma\\tau = 0\\ \\text{N m}`;
    let caption;
    if (!live.length) {
      caption = "No force acting: add one by tapping the object, then drag its dot to move it, its knob to turn it, or use the slider for its size. Drag P anywhere \u2014 the arms and moments follow.";
    } else if (Math.abs(net) < 0.05) {
      // Say how the two senses cancel, never "the same size in opposite senses" unless that is
      // true. A force whose line runs through P has no moment at all: that is not a cancellation.
      const sides = [cw.length ? `${sig3(tot(cw))} N m clockwise from ${names(cw)}` : "",
        acw.length ? `${sig3(tot(acw))} N m anticlockwise from ${names(acw)}` : ""].filter(Boolean);
      caption = sides.length
        ? `The moments cancel: ${sides.join(" against ")} give a net moment of zero, so the object does not turn.`
        : `The line of action of ${names(live)} passes through P, so ${live.length > 1 ? "the arm is zero for each force" : "the arm is zero"} and the moment is zero: the object does not turn.`;
    } else {
      // Name the forces that act each way and add up each side. Never say a force "wins": the
      // moment is what is being summed, and two equal moments are not a contest.
      const phrase = cw.length && acw.length
        ? `${names(cw)} ${cw.length > 1 ? "give" : "gives"} ${sig3(tot(cw))} N m clockwise against ${names(acw)} (${sig3(tot(acw))} N m anticlockwise)`
        : (() => {
          const one = cw.length ? cw : acw;
          const w = cw.length ? "clockwise" : "anticlockwise";
          return one.length > 1
            ? `${names(one)} all act ${w}, adding to ${sig3(tot(one))} N m`
            : `${names(one)} acts ${w}, ${sig3(tot(one))} N m`;
        })();
      caption = `Net moment ${sig3(net)} N m ${net > 0 ? "clockwise" : "anticlockwise"}: ${phrase}. Move P and watch every arm and moment change \u2014 the moment is F times the perpendicular distance from P to the line of action, not the distance to the point of application.`;
    }
    r.set(latex, null, caption);
  }

  /* ---- the controls ---- */
  const sfc = [0, 1, 2].map((i) => slider({
    label: `F${Q2_SUB[i]} (N)`, min: 0, max: 150, step: 1, value: 30, play: false,
    fmt: (v) => v.toFixed(0) + " N",
  }));
  let syncing = false;
  const rows = sfc.map((s, i) => {
    s.on((v) => {
      if (syncing) return;
      if (!forces[i]) return;
      forces[i].F = v;
      render();
    });
    const del = H("button", { type: "button", class: "g-nudge", title: `remove F${i + 1}`, onclick: () => removeForce(i) }, ["\u2715"]);
    s.el.append(del);
    s.el.hidden = true;
    return s.el;
  });

  const addBtn = H("button", { type: "button", onclick: () => addForce() }, ["+ add a force"]);
  const resetBtn = H("button", { type: "button", onclick: () => reset() }, ["reset this object"]);
  const tools = H("div", { class: "g-btns" }, [addBtn, resetBtn]);

  /* the printed answer, kept visually apart from the live reading below the canvas: a static
   * line on a tinted card, so a student can compare their own sum with the book's */
  const printed = H("div", {
    class: "g-printed",
    style: "margin:2px 0 8px;padding:7px 10px;border-left:3px solid #c8a24a;background:#fdf9ef;"
      + "border-radius:6px;font-size:12.5px;line-height:1.4;color:#3c3c3c",
  });
  printed.hidden = true;

  function syncUI() {
    syncing = true;
    sfc.forEach((s, i) => {
      const on = i < forces.length;
      s.el.hidden = !on;
      if (on) s.set(clamp(Math.round(forces[i].F), 0, 150));
    });
    syncing = false;
    addBtn.disabled = forces.length >= 3;
    addBtn.title = forces.length >= 3 ? "three forces is the limit" : "add a force at the middle of the object";
  }

  /* two forces on the same spot bury each other's dot, knob, arm and label: step a new one
   * sideways until it is clear of every force already there */
  function clearSpot(x, y) {
    let nx = clamp(x, 40, 456), ny = clamp(y, 34, 370);
    for (let k = 0; k < 6 && forces.some((f) => Math.hypot(f.x - nx, f.y - ny) < 46); k++) {
      nx = clamp(nx + 44, 40, 456);
      if (k % 2) ny = clamp(ny + 34, 34, 370);
    }
    return [nx, ny];
  }

  function addForce(at) {
    if (forces.length >= 3) return;
    const p = at ?? [Q2_CX + 0.2 * Q2_S, Q2_CY];
    const [nx, ny] = clearSpot(p[0], p[1]);
    forces.push({ x: nx, y: ny, a: Math.PI / 2, F: 30 });
    syncUI();
    render();
  }

  function removeForce(i) {
    if (i >= forces.length) return;
    forces.splice(i, 1);
    syncUI();
    render();
  }

  /* ---- a printed case: set its scale, its object, its P and its forces in one go ----
   * Every case carries its own px/m, so tau = F * d_px / S comes out on the printed number. */
  function applyCase(k) {
    const c = Q2_CASES[k];
    caseIdx = k;
    Q2_S = c.S;
    shape = "case";
    pivot = [c.pivot[0], c.pivot[1]];
    forces = c.forces.map((f) => ({ x: f.x, y: f.y, a: f.deg * Math.PI / 180, F: f.F }));
    clearTabs(shapeTabs);              // the object tabs stop being lit: this is a case now
    printed.textContent = "Printed answer: " + c.answer;
    printed.hidden = false;
    syncUI();
    render();
  }

  function reset() {
    if (caseIdx >= 0) { applyCase(caseIdx); return; }      // "reset" here = back to this case
    const s = SHAPES[shape];
    pivot = [X(s.pivot[0]), Y(s.pivot[1])];
    forces = [{ x: X(s.at[0]), y: Y(s.at[1]), a: Math.PI / 2, F: s.F }];
    syncUI();
    render();
  }

  const clearTabs = (row) => [...row.children].forEach((b) => b.classList.remove("on"));
  let caseTabs;                        // built below; the object tabs have to un-highlight it

  const shapeTabs = tabs(["rod", "box", "flat door", "irregular plate"], (i) => {
    caseIdx = -1;                      // picking an object leaves case mode
    Q2_S = 150;
    shape = Object.keys(SHAPES)[i];
    clearTabs(caseTabs);
    printed.hidden = true;
    reset();
  });

  caseTabs = tabs(Q2_CASES.map((c) => c.label), (i) => applyCase(i));
  clearTabs(caseTabs);                 // nothing is on show until a case is picked

  /* ---- dragging: one handler on the svg, hit-tested by distance so a finger has 47 px ---- */
  let drag = null;
  let down = null;
  const at = (e) => {
    const b = svg.getBoundingClientRect();
    const k = Q2_W / b.width;
    return [(e.clientX - b.left) * k, (e.clientY - b.top) * k];
  };
  const hit = (x, y) => {
    let best = null, bestD = Infinity;
    const see = (kind, i, hx, hy, rad) => {
      const d = Math.hypot(x - hx, y - hy);
      if (d <= rad && d < bestD) { bestD = d; best = { kind, i }; }
    };
    for (let i = forces.length - 1; i >= 0; i--) {
      const f = forces[i];
      if (f.F >= 0.5) {
        const t = tipOf(f);
        see("tip", i, t[0], t[1], Q2_TIP_R);
      }
      see("pt", i, f.x, f.y, Q2_PT_R);
    }
    see("pivot", -1, pivot[0], pivot[1], Q2_PIVOT_R);
    return best;
  };

  svg.addEventListener("pointerdown", (e) => {
    const [x, y] = at(e);
    drag = null;                    // never inherit a drag whose pointerup went missing
    const h = hit(x, y);
    down = [x, y];
    if (h) {
      drag = h;
      try { svg.setPointerCapture(e.pointerId); } catch { /* no capture: the moves still arrive */ }
      e.preventDefault();
    }
  });
  svg.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const [x, y] = at(e);
    if (drag.kind === "pivot") {
      // the safe area is the whole canvas bar the reading column: (f) puts P at x = 440, so a
      // 432 ceiling would drag it away the moment the reader touched it
      pivot = [clamp(x, 26, 456), clamp(y, 34, 370)];
    } else {
      const f = forces[drag.i];
      if (!f) { drag = null; return; }
      if (drag.kind === "pt") {
        f.x = clamp(x, 40, 456);
        f.y = clamp(y, 34, 370);
      } else {
        f.a = Math.atan2(y - f.y, x - f.x);          // the head sets the direction
      }
    }
    render();
    e.preventDefault();
  });
  const up = (e) => {
    if (drag) {
      drag = null;
      try { svg.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
      return;
    }
    // a tap that never became a drag adds a force where it landed
    if (!down) return;
    const [x, y] = at(e);
    const moved = Math.hypot(x - down[0], y - down[1]);
    down = null;
    if (moved < 6 && forces.length < 3) {
      const [nx, ny] = clearSpot(x, y);
      forces.push({ x: nx, y: ny, a: Math.PI / 2, F: 30 });
      syncUI();
      render();
    }
  };
  svg.addEventListener("pointerup", up);
  svg.addEventListener("pointercancel", () => { drag = null; down = null; });

  root.append(
    question("In each case below, find the net moment of force F about point P. Here you can move P, add up to three forces, and change any force's position, direction and size.", [
      "Moment about P: $\\tau = F d$, where $d$ is the perpendicular distance from P to the line of action",
      "The arm is measured to the line of action, never to the point where the force is applied",
      "Net moment: add the moments, clockwise against anticlockwise",
      "Drag P anywhere (even off the object) \u00B7 tap the object to add a force \u00B7 drag a force's dot to move it, its round knob to turn it",
    ]),
    shapeTabs,
    caseTabs,
    printed,
    svg,
    tools,
    ...rows,
    r.el,
  );

  reset();
}

/* ---------------- Q26: the smallest push that gets a wheel up a step ----------------
 *
 * Printed page 11: a wheel of radius 1 m rests against a 0.5 m step, and a horizontal 50 N
 * pushes the top of its 0.2 m axle to the right. Every moment is taken about the step corner P:
 *   (a) W(0.866) = 50(0.700)  ->  W = 40.4 N
 *   (b) F(2.000) = W(0.866)   ->  F = 17.5 N     (2R = 2.000 m is the longest arm possible)
 * Nothing below is typed in as an answer: every arm is measured on the drawn force with
 *   z = r_x u_y - r_y u_x    (z > 0 turns clockwise on screen, the reading q1 and q2 use)
 *   arm = |z| / 120 m        moment = F * arm, its sign from z
 * The drawing is 620 x 400 at 120 px per metre, y down: ground y = 300, step corner
 * P = (403.92, 240), wheel centre C = (300, 180), R = 120 px, axle 24 px. P is exactly one
 * radius from C - hypot(103.92, 60) = 120 - so the rim passes through the corner.
 */
const Q26_S = 120;                   // px per metre
const Q26_CX = 300, Q26_CY = 180;    // the wheel's centre
const Q26_R = 120, Q26_AXR = 24;     // 1 m wheel, 0.2 m axle
const Q26_PX = 403.92, Q26_PY = 240; // the step corner, the pivot for both moments
const Q26_GROUND = 300, Q26_TOP = 240, Q26_STEP_END = 470;
const Q26_W0 = 40.4;                 // the printed weight, solutions.js q26(a)

/* 3 significant figures, kept the way the printed answers are written: 35.0, 43.3, 17.5, 0.866.
 * 100 or more drops the decimal, under 1 keeps three. */
const n3 = (v) => {
  if (!Number.isFinite(v)) return "\u2014";
  const a = Math.abs(v);
  if (a < 0.0005) return "0";
  return a.toFixed(a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3);
};

function jq26(root) {
  const svg = scene(620, 400);
  svg.style.touchAction = "none";
  const r = readout();

  let mode = 0;                        // 0 = (a) the printed 50 N push, 1 = (b) the smallest force
  let W = 40.0;                        // N, the slider in (a)
  let bx = 300, by = 60;               // (b) where the force acts: always on the rim
  let ba = 0;                          // (b) its direction, radians (screen)
  let knobAt = [bx, by];               // (b) where the direction knob was drawn

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const armW = Math.abs(Q26_CX - Q26_PX) / Q26_S;      // 0.866 m: the weight's arm about P
  const Fmin = Q26_W0 * armW / (2 * Q26_R / Q26_S);    // 17.5 N: at the longest arm, 2.000 m
  const lenOf = (F) => clamp(26 + F * 0.9, 26, 96);

  /* the same reading q2 uses: r from P to the point where the force acts, u its unit direction */
  const armOf = (x, y, a) => {
    const ux = Math.cos(a), uy = Math.sin(a);
    const rx = x - Q26_PX, ry = y - Q26_PY;
    const along = rx * ux + ry * uy;
    const z = rx * uy - ry * ux;
    return { foot: [x - ux * along, y - uy * along], z, d: Math.abs(z), ux, uy, along };
  };

  function arrow(x1, y1, x2, y2, color, w, head) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const bx2 = x2 - Math.cos(a) * head, by2 = y2 - Math.sin(a) * head;
    const nx = -Math.sin(a) * head * 0.42, ny = Math.cos(a) * head * 0.42;
    S("line", { x1, y1, x2: bx2, y2: by2, stroke: color, "stroke-width": w, "stroke-linecap": "round" }, svg);
    S("polygon", { points: `${x2},${y2} ${bx2 + nx},${by2 + ny} ${bx2 - nx},${by2 - ny}`, fill: color }, svg);
  }

  /* the ground, the step and the wheel: the printed picture, at 120 px per metre */
  function drawBase() {
    S("line", { x1: 40, y1: Q26_GROUND, x2: Q26_PX, y2: Q26_GROUND, stroke: C.line, "stroke-width": 2.2 }, svg);
    S("line", { x1: Q26_PX, y1: Q26_TOP, x2: Q26_PX, y2: Q26_GROUND, stroke: C.line, "stroke-width": 2.2 }, svg);
    S("line", { x1: Q26_PX, y1: Q26_TOP, x2: Q26_STEP_END, y2: Q26_TOP, stroke: C.line, "stroke-width": 2.2 }, svg);
    S("circle", { cx: Q26_CX, cy: Q26_CY, r: Q26_R, fill: C.soft, stroke: C.line, "stroke-width": 2.4 }, svg);
    S("circle", { cx: Q26_CX, cy: Q26_CY, r: Q26_AXR, fill: "#fff", stroke: C.line, "stroke-width": 2 }, svg);
    S("circle", { cx: Q26_CX, cy: Q26_CY, r: 3, fill: C.line }, svg);
  }

  /* ---- one force: its line of action, its arm from P (dashed, right angle, value), its arrow ---- */
  function oneForce(f) {
    const { foot, z, d, ux, uy, along } = armOf(f.x, f.y, f.a);
    const arm = d / Q26_S;

    const ext = 24;
    const t0 = Math.min(0, -along) - ext, t1 = Math.max(0, -along) + ext;
    S("line", {
      x1: f.x + ux * t0, y1: f.y + uy * t0, x2: f.x + ux * t1, y2: f.y + uy * t1,
      stroke: C.grey, "stroke-width": 1.1, "stroke-dasharray": "7 5", "stroke-opacity": 0.8,
    }, svg);

    if (d > 3) {
      S("line", { x1: Q26_PX, y1: Q26_PY, x2: foot[0], y2: foot[1], stroke: f.color,
        "stroke-width": 2.2, "stroke-dasharray": "8 5" }, svg);
      if (d > 16) {
        const wx = (Q26_PX - foot[0]) / d, wy = (Q26_PY - foot[1]) / d, k = 9;
        S("path", {
          d: `M${foot[0] - ux * k},${foot[1] - uy * k} L${foot[0] - ux * k + wx * k},${foot[1] - uy * k + wy * k} L${foot[0] + wx * k},${foot[1] + wy * k}`,
          fill: "none", stroke: f.color, "stroke-width": 1.4,
        }, svg);
      }
      const mx = (Q26_PX + foot[0]) / 2, my = (Q26_PY + foot[1]) / 2;
      const ox = (Q26_PY - foot[1]) / d * 16, oy = (foot[0] - Q26_PX) / d * 16;
      /* the value sits at the arm's midpoint, but (b)'s best point makes the arm a diameter, so
       * that midpoint IS the centre of the wheel: slide it back along the arm until it clears the
       * axle instead of printing 2.000 m across the hub (seen at 00:04). */
      let tLab = 0.5;
      const armPx = Math.hypot(foot[0] - Q26_PX, foot[1] - Q26_PY);
      if (armPx > 1) {
        const ux2 = (foot[0] - Q26_PX) / armPx, uy2 = (foot[1] - Q26_PY) / armPx;
        const clear = () => Math.hypot(Q26_PX + ux2 * armPx * tLab - Q26_CX, Q26_PY + uy2 * armPx * tLab - Q26_CY) >= Q26_AXR + 22;
        while (!clear() && tLab > 0.14) tLab -= 0.06;
      }
      T(svg, Q26_PX + (foot[0] - Q26_PX) * tLab + ox, Q26_PY + (foot[1] - Q26_PY) * tLab + oy + 4,
        arm.toFixed(3) + " m",
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: f.color,
          stroke: "#fff", "stroke-width": 3.2, "paint-order": "stroke", "stroke-linejoin": "round" });
    } else {
      T(svg, foot[0] + 10, foot[1] + 16, "line through P: no arm",
        { "font-size": 11, "font-weight": 700, fill: f.color });
    }

    const L = lenOf(f.F);
    const tx = f.x + ux * L, ty = f.y + uy * L;
    arrow(f.x, f.y, tx - ux * 8, ty - uy * 8, f.color, 3.4, 11);

    // the label runs beside the shaft, on the far side from the wheel's centre
    const side = Math.sign((Q26_CX - f.x) * uy - (Q26_CY - f.y) * ux) || 1;
    const nx = -uy * side, ny = ux * side;
    const anchor = nx > 0.25 ? "start" : nx < -0.25 ? "end" : "middle";
    const off = anchor === "middle" ? 16 : 12;
    T(svg, clamp(f.x + ux * (L * 0.55) + nx * off, 34, 588), f.y + uy * (L * 0.55) + ny * off + 4, f.label,
      { "text-anchor": anchor, "font-size": 11.5, "font-weight": 700, fill: f.color,
        stroke: "#fff", "stroke-width": 3.2, "paint-order": "stroke", "stroke-linejoin": "round" });

    // the point it acts at, and the hollow knob that turns it (mode b only)
    S("circle", { cx: f.x, cy: f.y, r: 5.5, fill: f.color, stroke: "#fff", "stroke-width": 1.6 }, svg);
    if (f.knob) S("circle", { cx: tx, cy: ty, r: 6.5, fill: "#fff", stroke: f.color, "stroke-width": 2 }, svg);

    return { arm, tau: Math.sign(z) * f.F * arm, tip: [tx, ty] };
  }

  function render() {
    clear(svg);
    drawBase();

    const list = [];
    if (mode === 0) {
      // (a) the printed push: 50 N horizontal at the top of the axle, weight on the centre
      list.push({ x: Q26_CX, y: Q26_CY - Q26_AXR, a: 0, F: 50, color: C.red, label: "F = 50 N" });
      list.push({ x: Q26_CX, y: Q26_CY, a: Math.PI / 2, F: W, color: C.blue, label: `W = ${n3(W)} N` });
    } else {
      // (b) the weight is the printed 40.4 N and the force is whatever is just enough
      const dpx = armOf(bx, by, ba).d;
      const need = dpx > 3 ? (Q26_W0 * armW * Q26_S) / dpx : Infinity;
      list.push({ x: Q26_CX, y: Q26_CY, a: Math.PI / 2, F: Q26_W0, color: C.blue, label: `W = ${n3(Q26_W0)} N` });
      list.push({ x: bx, y: by, a: ba, F: Number.isFinite(need) ? need : 0, color: C.red,
        label: Number.isFinite(need) ? `F = ${n3(need)} N` : "F = \u2014", knob: true });
    }
    const got = list.map(oneForce);
    if (mode === 1) knobAt = got[1].tip;

    // the pivot, last so it is never covered
    S("circle", { cx: Q26_PX, cy: Q26_PY, r: 8.5, fill: C.ink, stroke: "#fff", "stroke-width": 2.2 }, svg);
    T(svg, Q26_PX + 13, Q26_PY - 12, "P", { "font-size": 13, "font-weight": 700, fill: C.ink });

    if (mode === 0) {
      const tF = got[0].tau, tW = Math.abs(got[1].tau);
      const net = tF - tW;
      const near = Math.abs(net) <= 0.05;
      T(svg, 14, 20, near ? "(a) balanced on P" : net > 0 ? "(a) clockwise \u2014 up the step" : "(a) still on the ground",
        { "font-size": 11.5, "font-weight": 700, fill: near ? C.green : C.grey });

      r.set(
        `\\begin{aligned}\\tau_F &= 50(${got[0].arm.toFixed(3)}) = ${n3(tF)}\\ \\text{N m}\\\\[-2pt] `
        + `\\tau_W &= ${n3(W)}(${got[1].arm.toFixed(3)}) = ${n3(tW)}\\ \\text{N m}\\end{aligned}`,
        null,
        near
          ? `Both moments are ${n3(tF)} N m, so the wheel is balanced on the corner P: it is on the point of climbing. At W = 40.4 N the printed 50 N push is exactly enough \u2014 that is the answer to (a).`
          : net > 0
            ? `The push turns the wheel clockwise about P with ${n3(tF)} N m; the weight holds it back with ${n3(tW)} N m, so ${n3(net)} N m clockwise is left over and the wheel starts up the step. It climbs for any W below 40.4 N.`
            : `The weight holds the wheel with ${n3(tW)} N m about P, more than the ${n3(tF)} N m the 50 N push can give, so it stays on the ground. Bring W down to 40.4 N and the two moments match.`);
      return;
    }

    const arm = armOf(bx, by, ba).d / Q26_S;
    const need = arm > 0.002 ? Q26_W0 * armW / arm : Infinity;
    const atMax = arm >= 1.9995;
    T(svg, 14, 20, atMax ? "(b) d\u22A5 at its maximum \u2014 2.000 m" : "(b) drag the point and its knob",
      { "font-size": 11.5, "font-weight": 700, fill: atMax ? C.green : C.grey });

    /* two lines, like (a): a single-line \frac leaves the readout box 2 px short in this reader
     * (KaTeX's fraction descender), which turns .g-expr into a scroll container - measured 42
     * against 40 at 00:12; the aligned pair measures 79 against 79. */
    const l1 = `F &= \\frac{W(0.866)}{d_\\perp}`;
    const l2 = Number.isFinite(need)
      ? `&= \\frac{${n3(Q26_W0)}(0.866)}{${arm.toFixed(3)}} = ${n3(need)}\\ \\text{N}`
      : `&= \\frac{${n3(Q26_W0)}(0.866)}{${arm.toFixed(3)}}\\ \\text{: no finite force}`;
    r.set(`\\begin{aligned}${l1}\\\\[-2pt] ${l2}\\end{aligned}`, null,
      atMax
        ? `d\u22A5 = 2.000 m is as long as an arm about P can get (the line of action is 2R from P, a diameter away), so ${n3(need)} N is the smallest force that will start the wheel up the step \u2014 the printed answer to (b).`
        : Number.isFinite(need)
          ? `The force acts ${arm.toFixed(3)} m from P, so it takes ${n3(need)} N to match the weight's ${n3(Q26_W0 * armW)} N m. Drag the point round the rim and turn its knob: on the far side the arm reaches 2.000 m and only ${n3(Fmin)} N is needed.`
          : `The line of action now runs through P, so the arm is zero and no force applied this way can turn the wheel about the corner. Drag the point round the rim to give it an arm.`);
  }

  /* ---- controls ---- */
  const modeTabs = tabs(["(a) the 50 N push", "(b) the smallest force"], (i) => {
    mode = i;
    syncUI();
    render();
  });

  const wS = slider({
    label: "W (N)", min: 0, max: 100, step: 0.1, value: 40.0, play: false,
    fmt: (v) => v.toFixed(1) + " N",
  });
  wS.on((v) => { W = v; render(); });

  /* the best point: diametrically opposite P, with the force square to the radius, so the line of
   * action is a full 2R = 2.000 m from P and the force needed drops to 17.5 N */
  const bestBtn = H("button", { type: "button", onclick: () => {
    bx = 2 * Q26_CX - Q26_PX;
    by = 2 * Q26_CY - Q26_PY;
    ba = -60 * Math.PI / 180;
    render();
  } }, ["put it at the best point"]);
  const tools = H("div", { class: "g-btns" }, [bestBtn]);

  function syncUI() {
    /* the hidden attribute alone loses to .g-slider's display:flex, and to nothing else, so the
     * slider needs the inline display too or it stays on screen in (b) (seen at 00:04) */
    wS.el.hidden = mode !== 0;
    wS.el.style.display = mode === 0 ? "" : "none";
    bestBtn.hidden = mode !== 1;
  }

  /* ---- dragging in (b): the point slides round the rim, the knob sets the direction ---- */
  let drag = null;
  const at = (e) => {
    const b = svg.getBoundingClientRect();
    const k = 620 / b.width;
    return [(e.clientX - b.left) * k, (e.clientY - b.top) * k];
  };
  svg.addEventListener("pointerdown", (e) => {
    if (mode !== 1) return;
    const [x, y] = at(e);
    drag = Math.hypot(x - bx, y - by) <= 22 ? "pt"
      : Math.hypot(x - knobAt[0], y - knobAt[1]) <= 22 ? "tip" : null;
    if (!drag) return;
    try { svg.setPointerCapture(e.pointerId); } catch { /* the moves still arrive */ }
    e.preventDefault();
  });
  svg.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const [x, y] = at(e);
    if (drag === "pt") {
      const ang = Math.atan2(y - Q26_CY, x - Q26_CX);   // stay on the rim, wherever the finger is
      bx = Q26_CX + Q26_R * Math.cos(ang);
      by = Q26_CY + Q26_R * Math.sin(ang);
    } else {
      ba = Math.atan2(y - by, x - bx);
    }
    render();
    e.preventDefault();
  });
  const off = () => { drag = null; };
  svg.addEventListener("pointerup", off);
  svg.addEventListener("pointercancel", off);

  root.append(
    question("A wheel of radius 1 m rests against a 0.5 m step. In (a) a horizontal 50 N pushes the top of its 0.2 m axle. In (b) the weight is the printed 40.4 N: find the smallest force, and where to put it.", [
      "Take moments about the step corner P: the wheel climbs when the push's moment beats the weight's",
      "The weight's arm about P is $\\sqrt{1^2 - 0.5^2} = 0.866$ m",
      "In (b) drag the force point round the rim and its knob to turn it; the longest arm possible is $2R = 2.000$ m",
    ]),
    modeTabs,
    svg,
    tools,
    wS.el,
    r.el,
  );

  syncUI();
  render();
}

const REGISTRY = { q1: jq1, q2: jq2, p1: jp1, q26: jq26 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
