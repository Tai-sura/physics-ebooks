/**
 * Interactive graphics for this book, opened from a question's graphic button.
 * Build them from the shared kit; house rules are in docs/03-authoring-style.md.
 *
 * Only q1 is registered. (The mathematics template's marble example that shipped here by
 * mistake was removed; nothing of it is left.)
 */

import { C, S, T, scene, clear, sector, slider, readout, question, buttonRow } from "../../engine/widgets/kit.js";

/* ---------------- Q1: the moment of a force on a door, tau = F d sin(theta) ----------------
 *
 * q1 prints a top-view door with the hinge at one end and the force at the other, and the
 * printed concept box draws it with the hinge O on the RIGHT (red dot) and the force acting
 * at the left end A, at theta to the door:
 *     middle panel  F from A at theta   moment arm = d sin(theta),  moment = F d sin(theta)
 *     right panel   F along the door    moment arm = 0,            moment = 0
 *     tau = 20 sin(theta) x 2  ->  20 N m, 28.3 N m, 0 N m
 * This widget keeps that handedness: O on the right, A on the left, the force leaving A and
 * tipping BELOW the door line (the printed arrow points down as well). With the pivot on the
 * right and the free end pushed down, the door turns ANTICLOCKWISE as the reader sees it, and
 * that label is computed from the drawn vectors (r x F), not written by hand.
 *
 * The moment arm always starts at O and drops perpendicular onto the force's line of action,
 * with a right-angle mark at the foot. At theta = 90 the force is square to the door, so that
 * perpendicular lies along the door; it is then drawn as a thicker amber dashed line over the
 * bar rather than moved out of the way, so the geometry stays true.
 */
const J_D = 2;          // m, the printed distance from the hinge to the force
const J_F0 = 20;        // N, the printed force
const PX_PER_N = 4.8;   // drawing scale for the force vectors
const AX = 80, EY = 200;   // A is where the force acts, on the left
const OX = 340;            // O is the hinge, on the right (as the printed figure has it)
const CX = 555;            // the fixed reading column, top right

function jq1(root) {
  const CW = 620, CH = 430;
  const svg = scene(CW, CH);
  const fS = slider({ label: "force F (N)", min: 10, max: 40, step: 1, value: J_F0,
    fmt: (v) => v.toFixed(0) + " N", play: false });
  const tS = slider({ label: "angle \u03B8 (degrees)", min: 0, max: 90, step: 1, value: 30,
    fmt: (v) => v.toFixed(0) + "\u00B0", play: false });
  const r = readout();

  /* ---- the swing: the whole door turns about the hinge and comes back ---- */
  let phi = 0;                      // live rotation, degrees; negative swings the free end A down
  let raf = 0;                      // the running requestAnimationFrame id, 0 when idle
  const SWING = 30;                 // degrees, as asked
  const spin = () => {
    if (raf) cancelAnimationFrame(raf);
    const t0 = performance.now();
    const down = 700, hold = 220, back = 700;
    const total = down + hold + back;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / total);
      const ms = t * total;
      let k;
      if (ms <= down) k = ms / down;
      else if (ms <= down + hold) k = 1;
      else k = 1 - (ms - down - hold) / back;
      k = Math.max(0, Math.min(1, k));
      k = k * k * (3 - 2 * k);                 // smooth ease in and out
      phi = -SWING * k;
      render();
      raf = t < 1 ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
  };

  root.append(
    question("A 20 N force acts on a door 2 m from the hinge, at an angle \u03B8 to the door. Find the torque, then the torque when \u03B8 is 45\u00B0 and when the force is along the door.", [
      "Moment about the hinge: $\\tau = F d \\sin\\theta$",
      "Only the part perpendicular to the door turns it: $F\\sin\\theta$",
      "Along the door the moment arm is 0, so $\\tau = 0$",
    ]),
    svg,
    fS.el, tS.el,
    buttonRow([
      ["\u03B8 = 30\u00B0", () => { fS.set(J_F0); tS.set(30); }],
      ["\u03B8 = 45\u00B0", () => { fS.set(J_F0); tS.set(45); }],
      ["\u03B8 = 0\u00B0", () => { fS.set(J_F0); tS.set(0); }],
      ["play \u25B6 30\u00B0 swing", spin],
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
      caption = "The force lies along the door, so its perpendicular part is zero and the moment arm is zero: the door does not turn (\u03C4 = 0).";
    } else if (th === 90) {
      caption = "The force is square to the door: the whole of it turns the door and the moment arm is the full 2 m (it now lies along the door), so \u03C4 = 2F = " + tau.toFixed(1) + " N m. Press play to swing the door 30\u00B0 about the hinge and back.";
    } else {
      caption = "Only F sin\u03B8 turns the door; it acts 2 m from the hinge, so \u03C4 = F d sin\u03B8 = " + tau.toFixed(1) +
        " N m. The F cos\u03B8 part runs along the door and has no moment arm. The free end A is pushed down, so the door turns " + sense + ".";
    }
    r.set(latex, true, caption, { yes: "live readings" });
  };

  [fS, tS].forEach((s) => s.on(render));
  render();
}

const REGISTRY = { q1: jq1 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
