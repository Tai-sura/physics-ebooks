/**
 * Interactive graphics for this book, opened from a question's graphic button.
 * Build them from the shared kit; house rules are in docs/03-authoring-style.md.
 */

import { C, S, T, scene, clear, readout, question, tabs, slider, buttonRow } from "../../engine/widgets/kit.js";

/* ---------------- Q2: charge = current x time, and the mA h rating ----------------
 *
 * q2 prints a 1800 mA h battery driving a toy train that draws 0.4 A, and works
 *     1800 mA h = 1.8 A h,   time = Q / I = 1.8 / 0.4 = 4.5 h
 * The widget starts on exactly those two printed numbers and recomputes Q = I t whenever
 * the reader moves a slider. The ray from the origin IS Q = I t (its slope is the current),
 * the dashed horizontal line is the charge the battery really holds (1800 mA h — the
 * question gives no other capacity), so the crossing of the two is how long the train runs.
 *
 * Axes are fixed (t 0..9 h, Q 0..6000 mA h) so two different currents can be compared
 * directly. With I in 0.20..0.60 A and t in 0.5..9 h every reading stays inside the frame:
 * Q <= 0.60 x 9 = 5400 mA h, and the crossing is at 1800/I >= 3 h and <= 9 h.
 */
const Q2_CAP = 1800;    // mA h, the rating q2 gives; also the charge the battery holds
const Q2_I0 = 0.4;      // A, the current q2 gives
const Q2_T0 = 4.5;      // h, the time q2 answers

function q2(root) {
  const CW = 560, CH = 240;
  const svg = scene(CW, CH);
  const iS = slider({ label: "current I (A)", min: 0.2, max: 0.6, step: 0.05, value: Q2_I0,
    fmt: (v) => v.toFixed(2) + " A", play: false });
  const tS = slider({ label: "time t (h)", min: 0.5, max: 9, step: 0.1, value: Q2_T0,
    fmt: (v) => v.toFixed(1) + " h", play: false });
  const r = readout();

  root.append(
    question("A 1800 mA h battery drives a toy train that draws 0.4 A. At most, how long can the train run?", [
      "Charge, current and time: $Q = It$",
      "A mA h is a charge: $1\\ \\text{A h} = 3600\\ \\text{C}$",
      "So the running time is $t = Q/I$",
    ]),
    svg,
    iS.el, tS.el, r.el,
  );

  // fixed plot frame: t 0..9 h across, Q 0..6000 mA h up
  const X0 = 74, X1 = 470, Y0 = 40, Y1 = 200;
  const TMAX = 9, QMAX = 6000;
  const TX = (t) => X0 + (t / TMAX) * (X1 - X0);
  const QY = (q) => Y1 - (q / QMAX) * (Y1 - Y0);

  const render = () => {
    clear(svg);
    const I = iS.get(), t = tS.get();
    const q = I * 1000 * t;              // mA h delivered in that time
    const qC = I * t * 3600;             // the same charge in coulombs
    const tLife = Q2_CAP / (I * 1000);   // h, how long the battery actually lasts

    /* ---- fixed axes ---- */
    S("line", { x1: X0, y1: Y1, x2: X1 + 10, y2: Y1, stroke: C.line, "stroke-width": 1.6 }, svg);
    S("line", { x1: X0, y1: Y1, x2: X0, y2: Y0 - 12, stroke: C.line, "stroke-width": 1.6 }, svg);
    for (let h = 0; h <= TMAX; h++) {
      S("line", { x1: TX(h), y1: Y1, x2: TX(h), y2: Y1 + 5, stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, TX(h), Y1 + 18, String(h), { "text-anchor": "middle", "font-size": 11, fill: "#444" });
    }
    for (let m = 0; m <= QMAX; m += 1000) {
      S("line", { x1: X0 - 4, y1: QY(m), x2: X0, y2: QY(m), stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, X0 - 8, QY(m) + 4, String(m), { "text-anchor": "end", "font-size": 10.5, fill: "#444" });
    }
    T(svg, X1, Y1 + 32, "t (h)", { "text-anchor": "end", "font-size": 12, fill: C.line });
    T(svg, X0 - 8, Y0 - 18, "Q (mA h)", { "text-anchor": "start", "font-size": 12, fill: C.line });

    /* ---- what the battery holds (fixed: the question gives 1800 mA h) ---- */
    const capY = QY(Q2_CAP);
    S("line", { x1: X0, y1: capY, x2: X1, y2: capY, stroke: C.amber, "stroke-width": 1.8,
      "stroke-dasharray": "7 5" }, svg);
    // label above the line at its left end: the ray is far below there, and the crossing
    // label lives on the other side near the right, so the two can never meet
    T(svg, X0 + 4, capY - 8, "battery: 1800 mA h",
      { "font-size": 11, "font-weight": 700, fill: C.amber });

    /* ---- the live Q = I t ray, solid while the battery lasts ---- */
    const tEnd = Math.min(TMAX, tLife);
    S("line", { x1: TX(0), y1: QY(0), x2: TX(tEnd), y2: QY(I * 1000 * tEnd),
      stroke: C.blue, "stroke-width": 2.6 }, svg);
    if (tLife < TMAX) {
      S("line", { x1: TX(tEnd), y1: QY(I * 1000 * tEnd), x2: TX(TMAX), y2: QY(I * 1000 * TMAX),
        stroke: C.grey, "stroke-width": 1.8, "stroke-dasharray": "5 4" }, svg);
    }
    // the slope label sits 45% of the way along the run, which is always the same height
    // (45% of the 1800 mA h the battery holds = 810 mA h), and just BELOW the ray, the empty
    // side; above the ray it would be crossed by the ray itself at the steeper currents
    const rl = tEnd * 0.45;
    T(svg, TX(rl) + 4, QY(I * 1000 * rl) + 15, "I = " + I.toFixed(2) + " A",
      { "text-anchor": "start", "font-size": 11.5, "font-weight": 700, fill: C.blue });

    /* ---- where the ray meets the capacity line: the running time ----
     * below-right of the crossing is always empty (past the crossing the ray is above the
     * line); near the right edge the label flips to the empty side above-left. */
    const runX = TX(tEnd);
    S("circle", { cx: runX, cy: capY, r: 4, fill: C.amber, stroke: C.amber, "stroke-width": 1 }, svg);
    const flip = runX > 452;
    T(svg, flip ? runX - 8 : runX + 8, flip ? capY - 9 : capY + 18, "runs " + tLife.toFixed(2) + " h",
      { "text-anchor": flip ? "end" : "start", "font-size": 11, "font-weight": 700, fill: C.amber });

    /* ---- the live charge, in a fixed corner of the plot that nothing else reaches ---- */
    T(svg, X0 + 6, Y0 + 17, "Q = " + Math.round(q) + " mA h",
      { "font-size": 12.5, "font-weight": 700, fill: C.blue });

    /* ---- the point the two sliders choose ---- */
    S("circle", { cx: TX(t), cy: QY(q), r: 5.5, fill: "#fff", stroke: C.blue, "stroke-width": 2.4 }, svg);

    /* ---- the reading row ---- */
    const f0 = (v) => String(Math.round(v));
    const latex = "Q = It = " + I.toFixed(2) + "\\ \\text{A}\\times " + t.toFixed(2) +
      "\\ \\text{h} = " + f0(q) + "\\ \\text{mA h} = " + f0(qC) + "\\ \\text{C}";
    const over = q > Q2_CAP + 1e-9;
    const caption = over
      ? "That is more charge than the battery holds: 1800 mA h at " + I.toFixed(2) +
        " A only lasts " + tLife.toFixed(2) + " h."
      : "1800 mA h = 1.8 A h = " + f0(1800 * 3.6) + " C. At " + I.toFixed(2) + " A the train runs " +
        tLife.toFixed(2) + " h, because t = Q/I = 1.8/" + I.toFixed(2) + ".";
    r.set(latex, !over, caption, { yes: "live readings", no: "beyond the battery" });
  };

  [iS, tS].forEach((s) => s.on(render));
  render();
}

/* ---------------- Q3: potential difference = energy per unit charge ----------------
 *
 * q3 prints a 3 V battery that has delivered 12 J to a bulb and asks for the charge:
 *     V = E/Q  ->  Q = E/V = 12/3 = 4 C
 * The widget starts on those two printed numbers. The ray from the origin is every (Q, E)
 * pair the chosen battery can be at — its slope IS the potential difference, in joules per
 * coulomb, which is what makes 1 V = 1 J/C. The short amber bar at Q = 1 C is that slope
 * read off at one coulomb, so the unit identity is visible, not just stated.
 *
 * Axes are fixed (Q 0..12 C, E 0..18 J) and the slider ranges keep every reading inside
 * them: E <= 18 J always, and Q = E/V <= 18/1.5 = 12 C at the shallowest battery.
 */
const Q3_V0 = 3;     // V, the battery q3 gives
const Q3_E0 = 12;    // J, the energy q3 gives

function q3(root) {
  const CW = 560, CH = 240;
  const svg = scene(CW, CH);
  const vS = slider({ label: "battery V (V)", min: 1.5, max: 6, step: 0.5, value: Q3_V0,
    fmt: (v) => v.toFixed(1) + " V", play: false });
  const eS = slider({ label: "energy E (J)", min: 2, max: 18, step: 1, value: Q3_E0,
    fmt: (v) => v.toFixed(0) + " J", play: false });
  const r = readout();

  root.append(
    question("A light bulb is connected to a 3-V battery. If the battery has delivered 12 J of energy to the bulb, how much charge has passed through it?", [
      "Potential difference is the energy per unit charge: $V = E/Q$",
      "So the charge that flowed is $Q = E/V$",
      "$1\\ \\text{V} = 1\\ \\text{J C}^{-1}$",
    ]),
    svg,
    vS.el, eS.el, r.el,
  );

  // fixed plot frame: Q 0..12 C across, E 0..18 J up; the reading column sits clear of it
  const X0 = 74, X1 = 436, Y0 = 40, Y1 = 200, CX = 500;
  const QMAX = 12, EMAX = 18;
  const TX = (q) => X0 + (q / QMAX) * (X1 - X0);
  const QY = (e) => Y1 - (e / EMAX) * (Y1 - Y0);

  const render = () => {
    clear(svg);
    const V = vS.get(), E = eS.get();
    const Q = E / V;

    /* ---- fixed axes ---- */
    S("line", { x1: X0, y1: Y1, x2: X1 + 10, y2: Y1, stroke: C.line, "stroke-width": 1.6 }, svg);
    S("line", { x1: X0, y1: Y1, x2: X0, y2: Y0 - 12, stroke: C.line, "stroke-width": 1.6 }, svg);
    for (let q = 0; q <= QMAX; q++) {
      S("line", { x1: TX(q), y1: Y1, x2: TX(q), y2: Y1 + 5, stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, TX(q), Y1 + 18, String(q), { "text-anchor": "middle", "font-size": 10.5, fill: "#444" });
    }
    for (let e = 0; e <= EMAX; e += 2) {
      S("line", { x1: X0 - 4, y1: QY(e), x2: X0, y2: QY(e), stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, X0 - 8, QY(e) + 4, String(e), { "text-anchor": "end", "font-size": 10.5, fill: "#444" });
    }
    T(svg, X1, Y1 + 32, "Q (C)", { "text-anchor": "end", "font-size": 12, fill: C.line });
    T(svg, X0 - 8, Y0 - 18, "E (J)", { "text-anchor": "start", "font-size": 12, fill: C.line });

    /* ---- the ray: every (Q, E) pair for this battery, slope V ---- */
    const qEnd = Math.min(QMAX, EMAX / V);
    S("line", { x1: TX(0), y1: QY(0), x2: TX(qEnd), y2: QY(V * qEnd),
      stroke: C.blue, "stroke-width": 2.6 }, svg);

    /* ---- one coulomb carries V joules: the unit identity, drawn at Q = 1 ---- */
    S("line", { x1: TX(1), y1: QY(0), x2: TX(1), y2: QY(V), stroke: C.amber, "stroke-width": 2.2 }, svg);

    /* ---- where the two sliders sit, with guides out to both axes ---- */
    const px = TX(Q), py = QY(E);
    S("line", { x1: px, y1: py, x2: px, y2: Y1, stroke: C.grey, "stroke-width": 1, "stroke-dasharray": "3 3" }, svg);
    S("line", { x1: X0, y1: py, x2: px, y2: py, stroke: C.grey, "stroke-width": 1, "stroke-dasharray": "3 3" }, svg);
    S("circle", { cx: px, cy: py, r: 5.5, fill: "#fff", stroke: C.blue, "stroke-width": 2.4 }, svg);

    /* ---- the reading column: no text in the plot itself, so nothing can collide ---- */
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(84, "V = " + V.toFixed(1) + " V", C.blue, 13);
    col(112, "1 C \u2192 " + V.toFixed(1) + " J", C.amber, 12.5);
    col(148, "Q = " + Q.toFixed(2) + " C", C.blue, 15);
    col(176, "E = " + E.toFixed(0) + " J", C.grey, 12);

    /* ---- the reading row ---- */
    const latex = "Q = \\frac{E}{V} = \\frac{" + E.toFixed(0) + "\\ \\text{J}}{" + V.toFixed(1) +
      "\\ \\text{V}} = " + Q.toFixed(2) + "\\ \\text{C}";
    const caption = "A volt is one joule per coulomb (1 V = 1 J/C): every coulomb this " +
      V.toFixed(1) + " V battery pushes carries " + V.toFixed(1) + " J, so " + E.toFixed(0) +
      " J is " + Q.toFixed(2) + " C.";
    r.set(latex, true, caption, { yes: "live readings" });
  };

  [vS, eS].forEach((s) => s.on(render));
  render();
}

/* ---------------- Q6: the V-I line of one conductor, slope = R ----------------
 *
 * q6 reads a V-I graph and answers R = 12/3 = 4 ohm for the straight part, then notes that
 * above 12 V the line is steeper, so the resistance falls. The widget keeps the printed
 * data point (3 A, 12 V) and the single-conductor idea: one straight line through the
 * origin, slope R, and the same current I = 3 A marked on it. At R = 4 ohm the line passes
 * exactly through the printed point, which is where the printed answer comes from.
 *
 * The graph is V against I (V up, I across), which is how the printed figure is drawn, so a
 * BIGGER resistance makes the line STEEPER — the printed solution says the same in words
 * ("the line is steeper, so the resistance falls"). Axes are fixed at I 0..6 A and
 * V 0..20 V; the live point sits at I = 3 A, so it is inside the frame for every R.
 */
const Q6_R0 = 4;     // ohm, the printed R = 12/3
const Q6_I = 3;      // A, the current the printed point is read at
const Q6_V = 12;     // V, the printed point

function q6(root) {
  const CW = 560, CH = 240;
  const svg = scene(CW, CH);
  const rS = slider({ label: "resistance R (\u03A9)", min: 0.5, max: 5, step: 0.1, value: Q6_R0,
    fmt: (v) => v.toFixed(1) + " \u03A9", play: false });
  const r = readout();

  root.append(
    question("The V-I graph of a conductor is a straight line through the origin, reading 12 V at 3 A. What is its resistance?", [
      "For a fixed resistance $V = RI$, so the line through the origin has slope $R$",
      "Reading the printed point: $R = V/I = 12/3$",
      "A bigger $R$ makes the line steeper; a smaller $R$ flattens it",
    ]),
    svg,
    rS.el, r.el,
  );

  // fixed plot frame: I 0..6 A across, V 0..20 V up; the reading column sits clear of it
  const X0 = 74, X1 = 436, Y0 = 40, Y1 = 200, CX = 500;
  const IMAX = 6, VMAX = 20;
  const TX = (i) => X0 + (i / IMAX) * (X1 - X0);
  const QY = (v) => Y1 - (v / VMAX) * (Y1 - Y0);

  const render = () => {
    clear(svg);
    const R = rS.get();
    const V = R * Q6_I;

    /* ---- fixed axes ---- */
    S("line", { x1: X0, y1: Y1, x2: X1 + 10, y2: Y1, stroke: C.line, "stroke-width": 1.6 }, svg);
    S("line", { x1: X0, y1: Y1, x2: X0, y2: Y0 - 12, stroke: C.line, "stroke-width": 1.6 }, svg);
    for (let i = 0; i <= IMAX; i++) {
      S("line", { x1: TX(i), y1: Y1, x2: TX(i), y2: Y1 + 5, stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, TX(i), Y1 + 18, String(i), { "text-anchor": "middle", "font-size": 10.5, fill: "#444" });
    }
    for (let v = 0; v <= VMAX; v += 5) {
      S("line", { x1: X0 - 4, y1: QY(v), x2: X0, y2: QY(v), stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, X0 - 8, QY(v) + 4, String(v), { "text-anchor": "end", "font-size": 10.5, fill: "#444" });
    }
    T(svg, X1, Y1 + 32, "I (A)", { "text-anchor": "end", "font-size": 12, fill: C.line });
    T(svg, X0 - 8, Y0 - 18, "p.d. (V)", { "text-anchor": "start", "font-size": 12, fill: C.line });

    /* ---- one straight line through the origin, slope R ---- */
    const iEnd = Math.min(IMAX, VMAX / R);
    S("line", { x1: TX(0), y1: QY(0), x2: TX(iEnd), y2: QY(R * iEnd),
      stroke: C.blue, "stroke-width": 2.6 }, svg);

    /* ---- the printed reading, which is where q6's 4 ohm comes from ----
     * drawn as a box a little larger than the live dot, so at R = 4 ohm (when the two
     * coincide) the amber frame still shows around the blue dot instead of vanishing */
    const px = TX(Q6_I), py = QY(Q6_V);
    S("rect", { x: px - 7, y: py - 7, width: 14, height: 14, fill: "none", stroke: C.amber, "stroke-width": 2 }, svg);

    /* ---- the same current on this conductor, with guides to both axes ---- */
    const ly = QY(V);
    S("line", { x1: px, y1: QY(0), x2: px, y2: ly, stroke: C.grey, "stroke-width": 1, "stroke-dasharray": "3 3" }, svg);
    S("line", { x1: X0, y1: ly, x2: px, y2: ly, stroke: C.grey, "stroke-width": 1, "stroke-dasharray": "3 3" }, svg);
    S("circle", { cx: px, cy: ly, r: 5.5, fill: "#fff", stroke: C.blue, "stroke-width": 2.4 }, svg);

    /* ---- the reading column: no text in the plot itself, so nothing can collide ---- */
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(84, "R = " + R.toFixed(1) + " \u03A9", C.blue, 15);
    col(112, "V = RI", C.grey, 12);
    col(140, "at I = " + Q6_I.toFixed(1) + " A", C.grey, 11.5);
    col(168, "V = " + V.toFixed(1) + " V", C.blue, 13.5);

    /* ---- the reading row ---- */
    const latex = "R = \\frac{V}{I} = \\frac{" + V.toFixed(1) + "\\ \\text{V}}{" + Q6_I.toFixed(1) +
      "\\ \\text{A}} = " + R.toFixed(1) + "\\ \\Omega";
    const same = Math.abs(R - Q6_R0) < 0.05;
    const caption = same
      ? "This is the printed conductor: at 3.0 A the p.d. is 12.0 V, so R = 4.0 \u03A9 — the line is straight through the origin, which is what constant resistance looks like."
      : "One straight line through the origin means R does not change. At " + R.toFixed(1) +
        " \u03A9 the same 3.0 A needs " + V.toFixed(1) + " V, so the line is " +
        (R > Q6_R0 ? "steeper" : "flatter") + " than the printed 4.0 \u03A9 one.";
    r.set(latex, true, caption, { yes: "live readings" });
  };

  rS.on(render);
  render();
}

/* ---------------- Q9: resistance from the length of a wire, R = rho l / A ----------------
 *
 * q9 prints a metal wire 70 cm long, 1 mm across, R = 0.6 ohm, and gets
 *     A = pi r^2 = pi (0.0005)^2 = 7.854e-7 m^2,   rho = RA/l = 6.73e-7 ohm m
 * and part (b) halves the length: the resistance halves to 0.3 ohm, the resistivity does
 * not change. The widget keeps exactly those printed numbers — the diameter stays 1 mm and
 * rho stays the value part (a) found — and only the length is on the slider, which is the
 * thing q9 (b) varies. The wire is drawn to a fixed 0..100 cm scale, so its length on
 * screen is the length in the question.
 */
const Q9_RHO = 6.73e-7;    // ohm m, what q9 (a) finds
const Q9_D = 1e-3;         // m, the printed diameter (radius 0.5 mm)
const Q9_L0 = 70;          // cm, the printed length
const Q9_A = Math.PI * (Q9_D / 2) ** 2;   // m^2, the printed cross-section

function q9(root) {
  const CW = 560, CH = 240;
  const svg = scene(CW, CH);
  const lS = slider({ label: "length l (cm)", min: 10, max: 100, step: 5, value: Q9_L0,
    fmt: (v) => v.toFixed(0) + " cm", play: false });
  const r = readout();

  root.append(
    question("A metal wire 70 cm long has a resistance of 0.6 \u03A9; its diameter is 1 mm. Find the resistivity, then the resistance and resistivity when the length is halved.", [
      "Resistance of a wire: $R = \\rho\\dfrac{l}{A}$, so $\\rho = \\dfrac{RA}{l}$",
      "Cross-section $A = \\pi r^2$ with $r = 0.5\\ \\text{mm}$",
      "Halving the length halves $R$; $\\rho$ is a property of the metal, so it does not change",
    ]),
    svg,
    lS.el, r.el,
  );

  // fixed drawing scale: 0..100 cm across 350 px, so the wire length on screen means something
  const WX = 80, WMAX = 350, WY = 84, WH = 16, SY = 122;
  const XW = (cm) => WX + (cm / 100) * WMAX;
  const CX = 498;

  // one text element with a superscript tail, so "10^-7" is a real exponent, not a caret
  const sci = (x, y, head, sup, tail, attrs) => {
    const t = S("text", Object.assign({ x, y }, attrs), svg);
    S("tspan", {}, t).textContent = head;
    if (sup) S("tspan", { "baseline-shift": "super", "font-size": (attrs["font-size"] || 11) * 0.72 }, t).textContent = sup;
    if (tail) S("tspan", {}, t).textContent = tail;
    return t;
  };

  const render = () => {
    clear(svg);
    const l = lS.get();                 // cm
    const R = (Q9_RHO * (l / 100)) / Q9_A;

    /* ---- the wire, drawn to the fixed scale ---- */
    S("rect", { x: WX, y: WY, width: XW(l) - WX, height: WH, rx: 8,
      fill: C.amberSoft, stroke: C.amber, "stroke-width": 2 }, svg);
    // a couple of marks inside the wire, so a long wire does not read as a plain block
    for (let cm = 20; cm < l; cm += 20) {
      S("line", { x1: XW(cm), y1: WY + 2, x2: XW(cm), y2: WY + WH - 2, stroke: C.amber,
        "stroke-width": 1, "stroke-dasharray": "2 3" }, svg);
    }

    /* ---- the length scale under it ---- */
    S("line", { x1: WX, y1: SY, x2: WX + WMAX, y2: SY, stroke: C.line, "stroke-width": 1.4 }, svg);
    for (let cm = 0; cm <= 100; cm += 10) {
      const big = cm % 20 === 0;
      S("line", { x1: XW(cm), y1: SY, x2: XW(cm), y2: SY + (big ? 6 : 3), stroke: C.line, "stroke-width": 1 }, svg);
      if (big) T(svg, XW(cm), SY + 20, String(cm), { "text-anchor": "middle", "font-size": 10, fill: "#444" });
    }
    T(svg, WX + WMAX, SY + 36, "length (cm)", { "text-anchor": "end", "font-size": 10.5, fill: C.line });

    /* ---- the 1 mm diameter, drawn as the cross-section it is ---- */
    S("circle", { cx: 102, cy: 176, r: 9, fill: C.amberSoft, stroke: C.amber, "stroke-width": 2 }, svg);
    S("line", { x1: 93, y1: 176, x2: 111, y2: 176, stroke: C.amber, "stroke-width": 1.4 }, svg);
    T(svg, 120, 172, "diameter " + (Q9_D * 1000).toFixed(0) + " mm", { "font-size": 10.5, "font-weight": 700, fill: C.ink });
    sci(120, 190, "A = \u03C0r\u00B2 = 7.85 \u00D7 10", "-7", " m\u00B2", { "font-size": 10.5, fill: C.grey });

    /* ---- the reading column, clear of the wire and the scale ---- */
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(84, "l = " + l.toFixed(0) + " cm", C.grey, 12);
    sci(CX - 52, 114, "\u03C1 = 6.73 \u00D7 10", "-7", " \u03A9 m", { "font-size": 11, "font-weight": 700, fill: C.amber });
    col(152, "R = " + R.toFixed(2) + " \u03A9", C.blue, 17);

    /* ---- the reading row ---- */
    const latex = "R = \\rho\\frac{l}{A} = " + R.toFixed(2) + "\\ \\Omega,\\quad l = " + l.toFixed(0) +
      "\\ \\text{cm},\\quad \\rho = 6.73\\times10^{-7}\\ \\Omega\\,\\text{m}";
    const half = Math.abs(l - Q9_L0 / 2) < 2.6;
    const full = Math.abs(l - Q9_L0) < 2.6;
    const caption = full
      ? "The printed wire: 70 cm of 1 mm metal with \u03C1 = 6.73 \u00D7 10\u207B\u2077 \u03A9 m gives R = 0.60 \u03A9."
      : half
        ? "Halved to 35 cm: the resistance halves to 0.30 \u03A9, but \u03C1 stays 6.73 \u00D7 10\u207B\u2077 \u03A9 m — resistivity belongs to the metal, not to the piece."
        : "A and \u03C1 are fixed, so R is proportional to the length: " + l.toFixed(0) + " cm of this wire is "
          + R.toFixed(2) + " \u03A9, and half the length would be " + (R / 2).toFixed(2) + " \u03A9.";
    r.set(latex, true, caption, { yes: "live readings" });
  };

  lS.on(render);
  render();
}

/* ---------------- Q36: collapse a symmetric network, step by step ----------------
 *
 * q36 has no variable resistor: it is a fixed symmetric network, and the printed working is
 * a sequence of equipotential merges, so this widget is a step-through, not a slider.
 *
 * (a) printed p13: P - 12 - 12 - 12 - Q on one line, with a top wire joining d1 to d3 and a
 *     bottom wire joining d2 to d4 (the four junction dots in the figure). Therefore all
 *     three 12 ohm resistors hang between the same two nodes, and
 *         R_PQ = 12/3 = 4 ohm            <- the printed answer
 * (b) printed p13: a square with 1 ohm on the top edge, 1 ohm on the left, 1 ohm on the
 *     right, 2 ohm on the bottom, and two plain diagonals (with a hop, so they do NOT meet)
 *     joining A to the top-right corner and the top-left corner to B. Merging the equal
 *     potentials leaves four branches in parallel:
 *         1 || 1 || 1 || 2  ->  R_AB = 1/(1+1+1+1/2) = 2/7 ohm ~ 0.29 ohm
 *
 * Only printed values are used: 12, 12, 12 for (a) and 1, 1, 1, 2 for (b).
 */
const Q36_CHAIN = [12, 12, 12];      // ohm, printed in figure (a)
const Q36_BRIDGE = [1, 1, 1, 2];     // ohm, printed in figure (b)

function q36(root) {
  const CW = 560, CH = 310;
  const svg = scene(CW, CH);
  const r = readout();
  const state = { tab: 0, step: 0 };

  const stepBtn = buttonRow([
    ["next step \u25B8", () => { state.step = Math.min(3, state.step + 1); render(); }],
    ["reset \u21BA", () => { state.step = 0; render(); }],
  ]);

  root.append(
    question("Find the equivalent resistance between P and Q. In (a) three 12 \u03A9 resistors sit on one line with two cross wires; in (b) a square of 1 \u03A9, 1 \u03A9, 1 \u03A9 and 2 \u03A9 has two plain diagonals.", [
      "Points joined by a plain wire are at the same potential, so they are one node",
      "Between the same two nodes the resistors are in parallel: $\\frac{1}{R} = \\sum \\frac{1}{R_i}$",
      "Nothing changes value: the same printed resistors are regrouped",
    ]),
    svg,
    tabs(["three 12 \u03A9", "the 1 \u03A9 square"], (i) => { state.tab = i; state.step = 0; render(); }),
    stepBtn,
    r.el,
  );

  const CX = 486;

  const render = () => {
    clear(svg);
    const step = state.step;
    const chain = state.tab === 0;
    const parts = chain ? Q36_CHAIN : Q36_BRIDGE;
    const req = 1 / parts.reduce((s, x) => s + 1 / x, 0);

    const wire = (pts, color, w) => S("path", {
      d: pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" "),
      fill: "none", stroke: color || C.line, "stroke-width": w || 2, "stroke-linejoin": "round",
    }, svg);
    const resH = (cx, cy, w, h, label) => {
      S("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, fill: C.paper,
        stroke: C.line, "stroke-width": 2 }, svg);
      T(svg, cx, cy - h / 2 - 6, label, { "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, fill: C.ink });
    };
    const resV = (cx, cy, w, h, label) => {
      S("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, fill: C.paper,
        stroke: C.line, "stroke-width": 2 }, svg);
      T(svg, cx - w / 2 - 8, cy + 4, label, { "text-anchor": "end", "font-size": 11.5, "font-weight": 700, fill: C.ink });
    };
    const dot = (x, y, color) => S("circle", { cx: x, cy: y, r: 4, fill: color || C.line }, svg);
    const term = (x, y, label, anchor) => {
      S("circle", { cx: x, cy: y, r: 4.5, fill: C.paper, stroke: C.line, "stroke-width": 1.8 }, svg);
      T(svg, x + (anchor === "end" ? -10 : 10), y + 5, label,
        { "text-anchor": anchor || "start", "font-size": 13, "font-weight": 700, fill: C.ink });
    };

    /* ---------------- (a) ---------------- */
    if (chain) {
      if (step <= 1) {
        const Y = 170, d = [84, 168, 252, 336];
        wire([[50, Y], [d[0], Y]]);
        d.forEach((x, i) => {
          const col = step === 1 ? (i % 2 === 0 ? C.blue : C.green) : C.line;
          dot(x, Y, col);
        });
        const boxes = [[84, 168], [168, 252], [252, 336]];
        boxes.forEach(([a, b], i) => {
          wire([[a, Y], [a + 10, Y]]);
          resH((a + b) / 2, Y, 62, 16, parts[i] + " \u03A9");
          wire([[b - 10, Y], [b, Y]]);
        });
        wire([[d[3], Y], [368, Y]]);
        term(46, Y, "P", "end");
        term(372, Y, "Q", "start");
        // the two cross wires exactly as printed: d1-d3 over the top, d2-d4 underneath
        const topCol = step === 1 ? C.blue : C.line;
        const botCol = step === 1 ? C.green : C.line;
        wire([[d[0], Y], [d[0], 122], [d[2], 122], [d[2], Y]], topCol);
        wire([[d[1], Y], [d[1], 218], [d[3], 218], [d[3], Y]], botCol);
        if (step === 1) {
          T(svg, 210, 112, "d1 and d3 are wired together", { "text-anchor": "middle", "font-size": 10.5, "font-weight": 700, fill: C.blue });
          T(svg, 210, 240, "d2 and d4 are wired together", { "text-anchor": "middle", "font-size": 10.5, "font-weight": 700, fill: C.green });
          T(svg, 210, 262, "same potential at both ends", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
        }
      } else {
        // the collapse: three branches between the same two nodes
        const LX = 104, RX = 320, ys = [104, 170, 236];
        wire([[LX, ys[0]], [LX, ys[2]]], C.line, 2.4);
        wire([[RX, ys[0]], [RX, ys[2]]], C.line, 2.4);
        ys.forEach((y, i) => {
          wire([[LX, y], [LX + 14, y]]);
          resH(212, y, 62, 16, parts[i] + " \u03A9");
          wire([[RX - 14, y], [RX, y]]);
        });
        wire([[62, 170], [LX, 170]]);
        wire([[RX, 170], [362, 170]]);
        term(56, 170, "P", "end");
        term(368, 170, "Q", "start");
        T(svg, 212, 262, parts.join(" \u2225 "), { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: C.blue });
        if (step === 3) {
          T(svg, 212, 288, "R = 12/3 = 4.00 \u03A9", { "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: C.blue });
        }
      }
    } else {
      /* ---------------- (b) ---------------- */
      if (step <= 1) {
        const TL = [128, 76], TR = [304, 76], A = [128, 232], B = [304, 232];
        const colFor = (n) => (step === 1 ? n : C.line);
        // the four edges
        wire([[TL[0], TL[1]], [TL[0] + 40, TL[1]]], colFor(1));
        wire([[TR[0] - 40, TR[1]], [TR[0], TR[1]]], colFor(1));
        resH((TL[0] + TR[0]) / 2, TL[1], 62, 16, parts[0] + " \u03A9");
        wire([[A[0], A[1]], [A[0] + 40, A[1]]], colFor(1));
        wire([[B[0] - 40, B[1]], [B[0], B[1]]], colFor(1));
        resH((A[0] + B[0]) / 2, A[1], 62, 16, parts[3] + " \u03A9");
        wire([[TL[0], TL[1] + 40], [TL[0], A[1] - 40]], colFor(1));
        resV(TL[0], (TL[1] + A[1]) / 2, 16, 62, parts[1] + " \u03A9");
        wire([[TR[0], TR[1] + 40], [TR[0], B[1] - 40]], colFor(2));
        resV(TR[0], (TR[1] + B[1]) / 2, 16, 62, parts[2] + " \u03A9");
        // the two plain diagonals, with a hop so the crossing is not a junction
        const cxm = (TL[0] + TR[0]) / 2, cym = (TL[1] + A[1]) / 2;
        wire([[A[0], A[1]], [TR[0], TR[1]]], C.line, 1.8);
        const dx = B[0] - TL[0], dy = B[1] - TL[1], dl = Math.hypot(dx, dy);
        const ux2 = dx / dl, uy2 = dy / dl, hop = 11;
        S("path", { d: "M " + TL[0] + " " + TL[1] +
          " L " + (cxm - ux2 * hop) + " " + (cym - uy2 * hop) +
          " A " + hop + " " + hop + " 0 0 0 " + (cxm + ux2 * hop) + " " + (cym + uy2 * hop) +
          " L " + B[0] + " " + B[1],
          fill: "none", stroke: C.line, "stroke-width": 1.8, "stroke-linejoin": "round" }, svg);
        dot(TL[0], TL[1], step === 1 ? C.green : C.line);
        dot(TR[0], TR[1], step === 1 ? C.blue : C.line);
        dot(A[0], A[1], step === 1 ? C.blue : C.line);
        dot(B[0], B[1], step === 1 ? C.green : C.line);
        T(svg, A[0] - 10, A[1] + 12, "A", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });
        T(svg, B[0] + 10, B[1] + 12, "B", { "text-anchor": "start", "font-size": 13, "font-weight": 700, fill: C.ink });
        if (step === 1) {
          T(svg, 216, 290, "A and the top-right corner are one node;", { "text-anchor": "middle", "font-size": 10.5, "font-weight": 700, fill: C.blue });
          T(svg, 216, 306, "so are the top-left corner and B", { "text-anchor": "middle", "font-size": 10.5, "font-weight": 700, fill: C.green });
        }
      } else {
        const LX = 116, RX = 316, ys = [70, 122, 174, 226];
        wire([[LX, ys[0]], [LX, ys[3]]], C.line, 2.4);
        wire([[RX, ys[0]], [RX, ys[3]]], C.line, 2.4);
        ys.forEach((y, i) => {
          wire([[LX, y], [LX + 14, y]]);
          resH(216, y, 58, 15, parts[i] + " \u03A9");
          wire([[RX - 14, y], [RX, y]]);
        });
        wire([[78, 148], [LX, 148]]);
        wire([[RX, 148], [356, 148]]);
        T(svg, 72, 153, "A", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });
        T(svg, 362, 153, "B", { "text-anchor": "start", "font-size": 13, "font-weight": 700, fill: C.ink });
        T(svg, 216, 262, parts.join(" \u2225 "), { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: C.blue });
        if (step === 3) {
          T(svg, 216, 290, "R_AB = 1/(1+1+1+1/2) = 2/7 = " + req.toFixed(2) + " \u03A9",
            { "text-anchor": "middle", "font-size": 13.5, "font-weight": 700, fill: C.blue });
        }
      }
    }

    /* ---- the fixed reading column ---- */
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(74, chain ? "three 12 \u03A9" : "1 \u03A9, 1 \u03A9, 1 \u03A9, 2 \u03A9", C.ink, 12.5);
    col(112, step >= 2 ? parts.join(" \u2225 ") : step === 1 ? "same potential" : "not merged yet",
      step >= 2 ? C.blue : C.grey, 11.5);
    col(160, step >= 3 ? (chain ? "R_PQ = 12/3" : "R_AB = 2/7") : (chain ? "R_PQ = ?" : "R_AB = ?"),
      step >= 3 ? C.grey : C.grey, 12);
    col(206, step >= 3 ? "= " + req.toFixed(2) + " \u03A9" : "\u2014", step >= 3 ? C.blue : C.grey, 17);

    /* ---- the reading row ---- */
    const par = parts.join(" \\parallel ");
    const latex = step < 2
      ? (chain ? "R_{PQ} = \\;" : "R_{AB} = \\;") + "?"
      : step === 2
        ? par
        : (chain ? "R_{PQ} = \\frac{12}{3} = 4.00\\ \\Omega" : "R_{AB} = \\frac{2}{7} = " + req.toFixed(2) + "\\ \\Omega");
    const captions = [
      chain
        ? "Three 12 \u03A9 resistors on one line between P and Q, with a top wire and a bottom wire. Press next step to collapse it."
        : "A square of 1 \u03A9, 1 \u03A9, 1 \u03A9 and 2 \u03A9 with two plain diagonals crossing (they hop, so they are not joined). Press next step.",
      "A plain wire puts its two ends at the same potential, so the marked junctions become one node each: every resistor now hangs between the same two nodes.",
      chain
        ? "So the three printed 12 \u03A9 resistors are in parallel, not in series."
        : "So the four printed resistors are four parallel branches: 1 \u03A9, 1 \u03A9, 1 \u03A9 and 2 \u03A9.",
      chain
        ? "R_PQ = 12/3 = 4.00 \u03A9 — the printed answer; no value was changed, the network was only regrouped."
        : "R_AB = 1/(1+1+1+1/2) = 2/7 = " + req.toFixed(2) + " \u03A9 — the printed answer.",
    ];
    r.set(latex, step >= 3 ? true : null, captions[Math.min(step, 3)], { yes: "printed answer" });
  };

  render();
}

/* ---------------- Q19: one switch, two equivalent resistances ----------------
 *
 * q19 prints a 12 V battery feeding R1 = 3 ohm, after which the rail B feeds three vertical
 * branches: R2 = 3 ohm through the switch S, and R3 = 3 ohm and R4 = 3 ohm straight to the
 * bottom rail. The printed answers are
 *     (a) S open:   R3 || R4 = 1.5, R_AD = 3 + 1.5 = 4.5 ohm
 *     (b) S closed: R2 || (R3 || R4) = 1, R_AD = 3 + 1 = 4 ohm
 *     (c) I = 12/4 = 3 A, V_R1 = 3 x 3 = 9 V
 *     (d) C and D are on the same bottom wire, so V_AC = V_AD = 12 V
 * The widget is the printed circuit with the switch as the only control — a switch, not a
 * slider — and every number is recomputed from the printed 12 V and 3, 3, 3 ohms.
 */
const Q19_V = 12;        // V, printed
const Q19_R1 = 3;        // ohm, printed
const Q19_R2 = 3;        // ohm, printed (through S)
const Q19_R3 = 3;        // ohm, printed
const Q19_R4 = 3;        // ohm, printed

function q19(root) {
  const CW = 560, CH = 310;
  const svg = scene(CW, CH);
  const r = readout();
  const state = { closed: false };

  const swBtn = buttonRow([["close S", () => { state.closed = !state.closed; render(); }]]);
  const swLabel = () => (state.closed ? "open S" : "close S");

  root.append(
    question("A 12 V battery feeds a network: R1 = 3 \u03A9, then three branches \u2014 R2 = 3 \u03A9 behind the switch S, and R3 = 3 \u03A9, R4 = 3 \u03A9. Find R_AD with S open and closed, then the current and the p.d. across R1.", [
      "S open: only $R_3 \\parallel R_4$ hangs from B",
      "S closed: $R_2$ is in parallel with that pair",
      "Series part adds on: $R_{AD} = R_1 + R_{\\text{parallel}}$",
    ]),
    svg,
    swBtn,
    r.el,
  );

  const render = () => {
    clear(svg);
    const closed = state.closed;
    const r34 = 1 / (1 / Q19_R3 + 1 / Q19_R4);          // 1.5 ohm
    const rp = closed ? 1 / (1 / Q19_R2 + 1 / r34) : r34; // 1 or 1.5 ohm
    const rad = Q19_R1 + rp;
    const I = Q19_V / rad;
    const vR1 = I * Q19_R1;
    const vAC = Q19_V;                                   // C sits on D's wire

    const wire = (pts, color, w) => S("path", {
      d: pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" "),
      fill: "none", stroke: color || C.line, "stroke-width": w || 2, "stroke-linejoin": "round",
    }, svg);
    const resV = (cx, cy, h, label) => {
      S("rect", { x: cx - 8, y: cy - h / 2, width: 16, height: h, fill: C.paper, stroke: C.line, "stroke-width": 2 }, svg);
      T(svg, cx - 14, cy + 4, label, { "text-anchor": "end", "font-size": 11.5, "font-weight": 700, fill: C.ink });
    };
    const node = (x, y) => S("circle", { cx: x, cy: y, r: 3.6, fill: C.line }, svg);
    const contact = (x, y) => S("circle", { cx: x, cy: y, r: 3.4, fill: C.paper, stroke: C.line, "stroke-width": 1.8 }, svg);

    const TOP = 88, BOT = 252, BAT = 52, AX = 100, SX = 240, R3X = 340, R4X = 430;

    /* ---- the battery, printed as a two-cell source ---- */
    wire([[BAT, TOP], [BAT, 162]]);
    wire([[BAT, 192], [BAT, BOT]]);
    S("line", { x1: BAT - 13, y1: 162, x2: BAT + 13, y2: 162, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: BAT - 7, y1: 171, x2: BAT + 7, y2: 171, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: BAT - 13, y1: 180, x2: BAT + 13, y2: 180, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: BAT - 7, y1: 190, x2: BAT + 7, y2: 190, stroke: C.line, "stroke-width": 3 }, svg);
    T(svg, BAT - 22, 181, "12 V", { "text-anchor": "end", "font-size": 12.5, "font-weight": 700, fill: C.ink });

    /* ---- the rails ---- */
    wire([[BAT, TOP], [SX, TOP], [R4X, TOP]]);
    wire([[BAT, BOT], [R4X, BOT]]);

    /* ---- R1 on the top rail, between A and B ---- */
    wire([[AX, TOP], [133, TOP]]);
    S("rect", { x: 133, y: TOP - 8, width: 70, height: 16, fill: C.paper, stroke: C.line, "stroke-width": 2 }, svg);
    wire([[203, TOP], [SX, TOP]]);
    T(svg, 168, TOP - 14, "R\u2081", { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.ink });

    /* ---- the switch S: pivot on the rail, blade down-right when open ---- */
    wire([[SX, TOP], [SX, 113]]);
    contact(SX, 116);
    if (closed) {
      S("line", { x1: SX, y1: 116, x2: SX, y2: 145, stroke: C.green, "stroke-width": 2.6 }, svg);
    } else {
      S("line", { x1: SX, y1: 116, x2: SX + 17, y2: 143, stroke: C.line, "stroke-width": 2.6 }, svg);
    }
    contact(SX, 148);
    wire([[SX, 151], [SX, 165]]);
    T(svg, SX + 8, 132, "S", { "font-size": 12.5, "font-weight": 700, fill: closed ? C.green : C.line });

    /* ---- R2, R3, R4 down to the bottom rail ---- */
    resV(SX, 192, 54, "R\u2082");
    wire([[SX, 219], [SX, BOT]]);
    resV(R3X, 192, 54, "R\u2083");
    wire([[R3X, TOP], [R3X, 165]]);
    wire([[R3X, 219], [R3X, BOT]]);
    resV(R4X, 192, 54, "R\u2084");
    wire([[R4X, TOP], [R4X, 165]]);
    wire([[R4X, 219], [R4X, BOT]]);

    /* ---- the marked points, as printed ---- */
    node(AX, TOP);
    node(300, TOP);
    node(295, BOT);
    node(AX, BOT);
    T(svg, AX, TOP - 16, "A", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });
    T(svg, 300, TOP - 16, "B", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });
    T(svg, 295, BOT + 18, "C", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });
    T(svg, AX, BOT + 18, "D", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });

    /* ---- the fixed reading column ---- */
    const CX = 505;
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(70, closed ? "S = closed" : "S = open", closed ? C.green : C.grey, 13);
    col(110, "R_AD = " + rad.toFixed(1) + " \u03A9", C.blue, 15);
    col(146, "I = " + I.toFixed(2) + " A", C.red, 13);
    col(180, "V_R1 = " + vR1.toFixed(1) + " V", C.blue, 12.5);
    col(214, "V_AC = " + vAC.toFixed(1) + " V", C.amber, 12.5);
    col(248, closed ? "R\u2082 \u2225 (R\u2083\u2225R\u2084) = 1" : "R\u2083\u2225R\u2084 = 1.5", C.grey, 11);

    /* ---- the reading row ---- */
    const latex = "R_{AD} = 3 + " + rp.toFixed(1) + " = " + rad.toFixed(1) + "\\ \\Omega,\\quad I = \\frac{12}{" +
      rad.toFixed(1) + "} = " + I.toFixed(2) + "\\ \\text{A},\\quad V_{R1} = " + vR1.toFixed(1) + "\\ \\text{V}";
    const caption = closed
      ? "S closed: R\u2082 = 3 \u03A9 is in parallel with R\u2083 \u2225 R\u2084 = 1.5 \u03A9, so that part is 1 \u03A9. R_AD = 3 + 1 = 4 \u03A9, I = 12/4 = 3.00 A and V_R1 = 3 \u00D7 3 = 9.0 V. C is on D's wire, so V_AC = 12 V."
      : "S open: R\u2082 is cut off, so only R\u2083 \u2225 R\u2084 = 1.5 \u03A9 hangs from B. R_AD = 3 + 1.5 = 4.5 \u03A9, I = 12/4.5 = 2.67 A and V_R1 = 2.67 \u00D7 3 = 8.0 V. C is on D's wire, so V_AC = 12 V.";
    r.set(latex, true, caption, { yes: closed ? "S closed" : "S open" });

    // the toggle button's label follows the state
    const btn = swBtn.querySelector("button");
    if (btn) btn.textContent = swLabel();
  };

  render();
}

/* ---------------- Q20: three resistors in series, same current, V split in R's ratio ----
 *
 * q20 prints three resistors X, Y, Z of 1, 2 and 3 ohm in series on a battery, and answers
 *     I_X : I_Y : I_Z = 1 : 1 : 1        (series: one path, one current)
 *     V_X : V_Y : V_Z = 1 x 1 : 1 x 2 : 1 x 3 = 1 : 2 : 3
 * The widget is that circuit with the battery voltage on a slider. The moving dots are the
 * same current all the way round the single loop: one dot pattern travelling one closed path
 * at one speed, so at any instant they are evenly spaced and all move the same distance —
 * that is what "the current is the same everywhere" looks like. The three lower bars are the
 * p.d.s, and because V_i = I R_i each bar is R_i/6 of the battery bar whatever the slider
 * says, so th eir heights stay 1 : 2 : 3 and they add up to the battery's.
 */
const Q20_R = [1, 2, 3];       // ohm, printed
const Q20_RTOT = 6;            // ohm, 1 + 2 + 3
const Q20_V0 = 6;              // V, the default the numbers come out tidy at

function q20(root) {
  const CW = 560, CH = 310;
  const svg = scene(CW, CH);
  const vS = slider({ label: "battery V (V)", min: 1, max: 12, step: 1, value: Q20_V0,
    fmt: (v) => v.toFixed(0) + " V", play: false });
  const r = readout();
  const state = { playing: true };

  const playBtn = buttonRow([["pause current \u2016", () => {
    state.playing = !state.playing;
    playBtn.querySelector("button").textContent = state.playing ? "pause current \u2016" : "run current \u25B6";
  }]]);

  root.append(
    question("Three resistors X, Y and Z of 1 \u03A9, 2 \u03A9 and 3 \u03A9 are connected in series to a battery. Find I_X : I_Y : I_Z and V_X : V_Y : V_Z.", [
      "In series there is one path, so the current is the same everywhere: $I_X = I_Y = I_Z$",
      "The p.d. across each is $V_i = I R_i$, so $V \\propto R$",
      "$1 : 2 : 3$ for the p.d.s, $1 : 1 : 1$ for the currents",
    ]),
    svg,
    vS.el, playBtn, r.el,
  );

  // the single loop the dots run round, and the drawing frame
  const TOP = 80, BOT = 230, BATX = 64, RIGX = 400, BASE = 214, BARH = 70;
  const RX = [160, 260, 360];                    // the three resistors' centres
  const LOOP = [[BATX, TOP], [RIGX, TOP], [RIGX, BOT], [BATX, BOT], [BATX, TOP]];
  const SEG = [];
  let TOTAL = 0;
  for (let i = 1; i < LOOP.length; i++) {
    const a = LOOP[i - 1], b = LOOP[i];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    SEG.push({ a, b, L, s0: TOTAL });
    TOTAL += L;
  }
  const at = (s) => {
    let t = ((s % TOTAL) + TOTAL) % TOTAL;
    for (const g of SEG) {
      if (t <= g.s0 + g.L) {
        const k = g.L ? (t - g.s0) / g.L : 0;
        return [g.a[0] + (g.b[0] - g.a[0]) * k, g.a[1] + (g.b[1] - g.a[1]) * k];
      }
    }
    return LOOP[0];
  };

  let raf = 0, last = 0, phase = 0;
  const NDOT = 16;

  const render = () => {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    last = 0;
    clear(svg);
    const V = vS.get();
    const I = V / Q20_RTOT;
    const VX = I * Q20_R[0], VY = I * Q20_R[1], VZ = I * Q20_R[2];

    const wire = (pts, color, w) => S("path", {
      d: pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" "),
      fill: "none", stroke: color || C.line, "stroke-width": w || 2, "stroke-linejoin": "round",
    }, svg);

    /* ---- the loop, with the current dots drawn first so they pass behind the resistors ---- */
    wire(LOOP);
    const dots = [];
    for (let i = 0; i < NDOT; i++) {
      dots.push(S("circle", { cx: -10, cy: -10, r: 3, fill: C.red }, svg));
    }
    const place = () => {
      for (let i = 0; i < NDOT; i++) {
        const [x, y] = at(phase + (i * TOTAL) / NDOT);
        dots[i].setAttribute("cx", x.toFixed(2));
        dots[i].setAttribute("cy", y.toFixed(2));
      }
    };
    place();

    /* ---- the battery ---- */
    wire([[BATX, TOP], [BATX, 140]]);
    wire([[BATX, 192], [BATX, BOT]]);
    S("line", { x1: BATX - 13, y1: 140, x2: BATX + 13, y2: 140, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: BATX - 7, y1: 149, x2: BATX + 7, y2: 149, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: BATX - 13, y1: 160, x2: BATX + 13, y2: 160, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: BATX - 7, y1: 169, x2: BATX + 7, y2: 169, stroke: C.line, "stroke-width": 3 }, svg);
    T(svg, BATX - 22, 160, "V = " + V.toFixed(0) + " V", { "text-anchor": "end", "font-size": 12 },
      svg);

    /* ---- the three resistors in series along the top rail ---- */
    const names = ["X", "Y", "Z"];
    RX.forEach((cx, i) => {
      S("rect", { x: cx - 28, y: TOP - 8, width: 56, height: 16, fill: C.paper, stroke: C.line, "stroke-width": 2 }, svg);
      T(svg, cx, TOP - 15, names[i], { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: C.ink });
      T(svg, cx, TOP + 24, Q20_R[i] + " \u03A9", { "text-anchor": "middle", "font-size": 11, "fill": C.grey });
    });

    /* ---- the p.d. bars: R_i/6 of the battery bar, so they stay 1 : 2 : 3 ---- */
    const hOf = (v) => (v / 12) * BARH;      // the battery bar is 70 px at 12 V
    const bar = (cx, h, color, label, txt) => {
      S("rect", { x: cx - 13, y: BASE - h, width: 26, height: h, fill: color,
        "fill-opacity": "0.28", stroke: color, "stroke-width": 1.6 }, svg);
      T(svg, cx, BASE - h - 5, txt, { "text-anchor": "middle", "font-size": 10, "font-weight": 700, fill: color });
      T(svg, cx, BASE + 12, label, { "text-anchor": "middle", "font-size": 10, fill: C.grey });
    };
    bar(100, hOf(V), C.line, "V", V.toFixed(1) + " V");
    bar(RX[0], hOf(VX), C.blue, "V_X", VX.toFixed(2) + " V");
    bar(RX[1], hOf(VY), C.green, "V_Y", VY.toFixed(2) + " V");
    bar(RX[2], hOf(VZ), C.amber, "V_Z", VZ.toFixed(2) + " V");

    /* ---- the fixed reading column ---- */
    const CX = 505;
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(64, "V = " + V.toFixed(0) + " V", C.ink, 12.5);
    col(94, "I = " + I.toFixed(2) + " A", C.red, 13);
    col(126, "V_X = " + VX.toFixed(2) + " V", C.blue, 12);
    col(152, "V_Y = " + VY.toFixed(2) + " V", C.green, 12);
    col(178, "V_Z = " + VZ.toFixed(2) + " V", C.amber, 12);
    col(212, "I_X:I_Y:I_Z = 1:1:1", C.red, 12);
    col(238, "V_X:V_Y:V_Z = 1:2:3", C.blue, 12);
    col(266, "same current everywhere", C.grey, 10.5);

    /* ---- the reading row ---- */
    const latex = "I = \\frac{V}{6} = " + I.toFixed(2) + "\\ \\text{A},\\quad V_X = " + VX.toFixed(2) +
      "\\ \\text{V},\\quad V_Y = " + VY.toFixed(2) + "\\ \\text{V},\\quad V_Z = " + VZ.toFixed(2) + "\\ \\text{V}";
    const caption = "In series one current runs through all three, so I_X : I_Y : I_Z = 1 : 1 : 1. The p.d. is V_i = I R_i, so V_X : V_Y : V_Z = 1 : 2 : 3 and the three add up to the " +
      V.toFixed(0) + " V of the battery (" + VX.toFixed(2) + " + " + VY.toFixed(2) + " + " + VZ.toFixed(2) + " = " + (VX + VY + VZ).toFixed(2) + " V).";
    r.set(latex, true, caption, { yes: "live readings" });

    /* ---- run the current round the loop; speed follows the current, one path so one speed ---- */
    const speed = 12 + 30 * (I / 2);       // px per second at this current
    const tick = (ts) => {
      raf = requestAnimationFrame(tick);
      if (!last) { last = ts; return; }
      const dt = Math.min(0.06, (ts - last) / 1000);
      last = ts;
      if (!state.playing) return;
      phase = (phase + dt * speed) % TOTAL;
      place();
    };
    raf = requestAnimationFrame(tick);
  };

  vS.on(render);
  render();
}

/* ---------------- Q41: the metre-wire with a 10 ohm load from A to the slider X ----------
 *
 * q41 prints: AB is a metre-wire of 10 ohm, a 10 V battery sits across A and B, and a 10 ohm
 * resistor is connected from A down under the wire and back up into the sliding contact X
 * (the printed arrow points up at the wire). With X at the mid-point the printed answer is
 *     R_AX = R_XB = 5 ohm,  R_p = 5*10/(5+10) = 3.33 ohm,
 *     V_AX = 10 x 3.33/(3.33+5) = 4.0 V
 * The 10 ohm is in parallel with the AX part only, so V_AX is NOT proportional to the length:
 * it is 0 V at A, 10 V at B, and 4.0 V at the mid-point instead of the 5 V a bare wire would
 * give. That sentence is on the drawing, and the V_AX-x curve is drawn from the model, so it
 * is visibly not a straight line.
 */
const Q41_WIRE = 10;     // ohm, the metre wire AB (printed)
const Q41_LOAD = 10;     // ohm, the resistor from A to X (printed)
const Q41_V = 10;        // V, the battery across AB (printed)

function q41(root) {
  const CW = 620, CH = 430;
  const svg = scene(CW, CH);
  const xS = slider({ label: "position of X (m)", min: 0, max: 1, step: 0.01, value: 0.5,
    fmt: (v) => v.toFixed(2) + " m", play: false });
  const r = readout();

  root.append(
    question("In the circuit shown, AB is a metre-wire of resistance 10 \u03A9. When X is moved to the mid-point of AB, the p.d. across AX will be", [
      "The 10 \u03A9 resistor hangs between A and X, so it is in parallel with the AX part of the wire",
      "$R_{AX} = 10x$, $R_{XB} = 10(1-x)$, $R_p = \\dfrac{R_{AX}\\times10}{R_{AX}+10}$",
      "Then $V_{AX} = 10\\dfrac{R_p}{R_p+R_{XB}}$ \u2014 not proportional to $x$",
    ]),
    svg,
    xS.el,
    r.el,
  );

  const AX0 = 70, BX = 350, WY = 140;      // the wire AB, A on the left as printed
  const TOPY = 70, BOTY = 225;
  const CX = 530;

  const render = () => {
    clear(svg);
    const x = xS.get();
    const rAX = Q41_WIRE * x;
    const rXB = Q41_WIRE * (1 - x);
    const rp = rAX > 0 ? (rAX * Q41_LOAD) / (rAX + Q41_LOAD) : 0;
    const rtot = rp + rXB;
    const I = Q41_V / rtot;
    const vAX = I * rp;
    const Xx = AX0 + x * (BX - AX0);

    const wire = (pts, color, w) => S("path", {
      d: pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" "),
      fill: "none", stroke: color || C.line, "stroke-width": w || 2, "stroke-linejoin": "round",
    }, svg);

    /* ---- the battery across A and B, on top ---- */
    wire([[AX0, WY], [AX0, TOPY], [BX, TOPY], [BX, WY]]);
    S("line", { x1: 203, y1: TOPY - 11, x2: 203, y2: TOPY + 11, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: 213, y1: TOPY - 6, x2: 213, y2: TOPY + 6, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: 223, y1: TOPY - 11, x2: 223, y2: TOPY + 11, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: 233, y1: TOPY - 6, x2: 233, y2: TOPY + 6, stroke: C.line, "stroke-width": 3 }, svg);
    T(svg, 218, TOPY - 18, "10 V", { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: C.ink });

    /* ---- the metre wire AB, its AX part picked out in amber ---- */
    S("line", { x1: AX0, y1: WY, x2: Xx, y2: WY, stroke: C.amber, "stroke-width": 5 }, svg);
    S("line", { x1: Xx, y1: WY, x2: BX, y2: WY, stroke: C.ink, "stroke-width": 5 }, svg);
    T(svg, AX0 - 12, WY + 5, "A", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });
    T(svg, BX + 12, WY + 5, "B", { "text-anchor": "start", "font-size": 13, "font-weight": 700, fill: C.ink });

    /* ---- the 10 ohm load: A down, through the resistor, back up into X ---- */
    wire([[AX0, WY], [AX0, BOTY], [95, BOTY]]);
    S("rect", { x: 95, y: BOTY - 9, width: 50, height: 18, fill: C.paper, stroke: C.line, "stroke-width": 2 }, svg);
    T(svg, 120, BOTY - 15, "10 \u03A9", { "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, fill: C.ink });
    wire([[145, BOTY], [Xx, BOTY]]);
    wire([[Xx, BOTY], [Xx, WY + 6]], C.ink, 2);
    S("line", { x1: Xx, y1: WY + 22, x2: Xx, y2: WY + 5, stroke: C.ink, "stroke-width": 2.4,
      "marker-end": "url(#arrInk-" + svg.dataset.uid + ")" }, svg);
    T(svg, Xx + 9, WY + 30, "X", { "font-size": 13, "font-weight": 700, fill: C.ink });

    /* ---- the sentence that is the whole point of the question ---- */
    T(svg, 210, 262, "V_AX is not proportional to the length: at the mid-point it is 4.0 V, not 5.0 V,",
      { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
    T(svg, 210, 277, "because the 10 \u03A9 load pulls the AX part down",
      { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });

    /* ---- the V_AX against x curve, from the model: visibly not a straight line ---- */
    const gx0 = 70, gx1 = 350, gy0 = 300, gy1 = 400;
    S("line", { x1: gx0, y1: gy1, x2: gx1 + 8, y2: gy1, stroke: C.line, "stroke-width": 1.4 }, svg);
    S("line", { x1: gx0, y1: gy1, x2: gx0, y2: gy0 - 6, stroke: C.line, "stroke-width": 1.4 }, svg);
    const GX = (t) => gx0 + t * (gx1 - gx0);
    const GY = (v) => gy1 - (v / Q41_V) * (gy1 - gy0);
    for (let v = 0; v <= 10; v += 5) {
      S("line", { x1: gx0 - 4, y1: GY(v), x2: gx0, y2: GY(v), stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, gx0 - 8, GY(v) + 4, String(v), { "text-anchor": "end", "font-size": 10, fill: "#444" });
    }
    for (let t = 0; t <= 1.001; t += 0.25) {
      S("line", { x1: GX(t), y1: gy1, x2: GX(t), y2: gy1 + 4, stroke: C.line, "stroke-width": 1 }, svg);
      T(svg, GX(t), gy1 + 15, t.toFixed(2).replace(/0$/, ""), { "text-anchor": "middle", "font-size": 10, fill: "#444" });
    }
    T(svg, gx1 + 8, gy1 + 30, "x (m)", { "text-anchor": "end", "font-size": 10.5, fill: C.line });
    T(svg, gx0 - 8, gy0 - 12, "V_AX (V)", { "text-anchor": "start", "font-size": 10.5, fill: C.line });
    let d = "";
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const a = Q41_WIRE * t;
      const p = a > 0 ? (a * Q41_LOAD) / (a + Q41_LOAD) : 0;
      const tot = p + Q41_WIRE * (1 - t);
      const v = (Q41_V / tot) * p;
      d += (i ? "L" : "M") + GX(t).toFixed(1) + " " + GY(v).toFixed(1);
    }
    S("path", { d, fill: "none", stroke: C.amber, "stroke-width": 2.2 }, svg);
    S("circle", { cx: GX(x), cy: GY(vAX), r: 4.5, fill: "#fff", stroke: C.ink, "stroke-width": 2.2 }, svg);

    /* ---- the fixed reading column ---- */
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(84, "R_AX = " + rAX.toFixed(2) + " \u03A9", C.amber, 12.5);
    col(114, "R_XB = " + rXB.toFixed(2) + " \u03A9", C.ink, 12.5);
    col(144, "R_p = " + rp.toFixed(2) + " \u03A9", C.amber, 12.5);
    col(174, "I = " + I.toFixed(2) + " A", C.ink, 12.5);
    col(212, "V_AX = " + vAX.toFixed(1) + " V", C.amber, 17);
    col(240, "x = " + x.toFixed(2) + " m", C.grey, 11);

    /* ---- the reading row ---- */
    const latex = "R_{AX} = 10x = " + rAX.toFixed(2) + "\\ \\Omega,\\quad R_p = " + rp.toFixed(2) +
      "\\ \\Omega,\\quad I = \\frac{10}{" + rtot.toFixed(2) + "} = " + I.toFixed(2) + "\\ \\text{A},\\quad V_{AX} = " +
      vAX.toFixed(1) + "\\ \\text{V}";
    let caption;
    if (Math.abs(x - 0.5) < 0.005) {
      caption = "At the mid-point R_AX = R_XB = 5 \u03A9, but the 10 \u03A9 load is in parallel with AX only, so AX drops to 5\u222510 = 3.33 \u03A9. The divider gives 10 \u00D7 3.33/(3.33+5) = 4.0 V \u2014 the printed answer, not 5.0 V.";
    } else if (x < 0.005) {
      caption = "X at A: the AX part is zero, so the load is shorted, V_AX = 0 V and the whole 10 \u03A9 of BX takes the 10 V (I = 1.00 A).";
    } else if (x > 0.995) {
      caption = "X at B: the load spans the whole wire, 10\u222510 = 5 \u03A9, so the battery sees 5 \u03A9, I = 2.00 A and V_AX is the full 10 V.";
    } else {
      caption = "The load is in parallel with AX only, so R_AX and R_XB divide the 10 V unevenly: V_AX rises from 0 V to 10 V but not in a straight line (at 0.50 m it is 4.0 V, not 5.0 V).";
    }
    r.set(latex, true, caption, { yes: "live readings" });
  };

  xS.on(render);
  render();
}

/* ---------------- Q32: an ideal voltmeter in a circuit with one fault ----------------
 *
 * q32 prints a 6 V cell of negligible resistance, a switch S, and three resistors X, Y, Z:
 *     battery(+) -> S -> Z -> bottom-right dot -> { X } -> left dot -> battery(-)
 * and in parallel with X the branch { voltmeter V in series with Y }.
 * The printed conclusion is "the voltmeter reads 6 V only when no current flows, so X is
 * faulty and has become an open circuit" -> answer C.
 *
 * The printed page gives NO resistance values, so this widget stays symbolic: each of the
 * five states shows the reading and the main current as expressions in X and Z, never as
 * invented numbers. The two facts that decide the question are spelled out on the drawing:
 *   * an ideal voltmeter has infinite resistance, so its own branch never carries current
 *     and shorting Y cannot change the reading;
 *   * with the circuit open there is no current, so no resistor drops any p.d. and the whole
 *     6 V stands across the break.
 */
const Q32_E = 6;      // V, the printed e.m.f.

const Q32_STATES = [
  { id: "normal", name: "normal",
    read: "6X/(X+Z)", cur: "6/(X+Z)", tag: "only X and Z carry it" },
  { id: "xs", name: "X shorted",
    read: "0 V", cur: "6/Z", tag: "no p.d. across X" },
  { id: "ys", name: "Y shorted",
    read: "6X/(X+Z)", cur: "6/(X+Z)", tag: "ideal V blocks that branch" },
  { id: "xo", name: "X open",
    read: "6 V", cur: "0", tag: "no current, so no drops" },
  { id: "zo", name: "Z open",
    read: "0 V", cur: "0", tag: "no current \u21D2 no p.d. on X" },
];

function q32(root) {
  const CW = 620, CH = 300;
  const svg = scene(CW, CH);
  const r = readout();
  const state = { s: 0 };

  const row = buttonRow(Q32_STATES.map((st, i) => [st.name, () => { state.s = i; render(); }]));

  root.append(
    question("In the circuit below the e.m.f. of the cell is 6 V and it has negligible resistance; the voltmeter is ideal. When S is closed the voltmeter reads 6 V. If only one fault has developed, which is possible?", [
      "An ideal voltmeter has infinite resistance, so its own branch never carries current",
    ]),
    svg,
    row,
    r.el,
  );

  const LEFT = 90, RIGHT = 420, TOP = 46, BOT = 246, MIDY = 126;
  const D1 = [LEFT, MIDY], D2 = [330, BOT];
  const CX = 530;

  const render = () => {
    clear(svg);
    const st = Q32_STATES[state.s];

    const wire = (pts, color, w, dash) => S("path", {
      d: pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" "),
      fill: "none", stroke: color || C.line, "stroke-width": w || 2, "stroke-linejoin": "round",
      "stroke-dasharray": dash || "none",
    }, svg);
    const box = (x, y, w, h, label, faded, lx, ly, anchor) => {
      S("rect", { x, y, width: w, height: h, fill: C.paper,
        stroke: faded ? C.grey : C.line, "stroke-width": faded ? 1.4 : 2,
        "stroke-dasharray": faded ? "4 3" : "none" }, svg);
      T(svg, lx, ly, label, { "text-anchor": anchor || "middle", "font-size": 12.5, "font-weight": 700,
        fill: faded ? C.grey : C.ink });
    };
    const openGap = (x, y) => {  // two stubs with a gap: the printed-style break
      S("line", { x1: x - 12, y1: y, x2: x - 4, y2: y, stroke: C.grey, "stroke-width": 2 }, svg);
      S("line", { x1: x + 4, y1: y, x2: x + 12, y2: y, stroke: C.grey, "stroke-width": 2 }, svg);
      S("circle", { cx: x - 3, cy: y, r: 2.6, fill: C.paper, stroke: C.amber, "stroke-width": 1.8 }, svg);
      S("circle", { cx: x + 3, cy: y, r: 2.6, fill: C.paper, stroke: C.amber, "stroke-width": 1.8 }, svg);
    };
    const shortBar = (x0, x1, y) => S("line", { x1: x0, y1: y, x2: x1, y2: y,
      stroke: C.amber, "stroke-width": 3.4, "stroke-dasharray": "7 4" }, svg);

    /* ---- battery, switch, Z: the outer loop ---- */
    wire([[LEFT, TOP], [160, TOP]]);
    wire([[240, TOP], [300, TOP]]);
    S("line", { x1: 191, y1: TOP - 13, x2: 191, y2: TOP + 13, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: 200, y1: TOP - 7, x2: 200, y2: TOP + 7, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: 211, y1: TOP - 13, x2: 211, y2: TOP + 13, stroke: C.line, "stroke-width": 3 }, svg);
    S("line", { x1: 220, y1: TOP - 7, x2: 220, y2: TOP + 7, stroke: C.line, "stroke-width": 3 }, svg);
    T(svg, 205, TOP - 22, "6 V", { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: C.ink });
    // the switch, drawn closed: the question is about the closed state
    S("circle", { cx: 300, cy: TOP, r: 3.6, fill: C.paper, stroke: C.line, "stroke-width": 1.8 }, svg);
    S("circle", { cx: 360, cy: TOP, r: 3.6, fill: C.paper, stroke: C.line, "stroke-width": 1.8 }, svg);
    wire([[303, TOP], [357, TOP]], C.ink, 2.2);
    T(svg, 330, TOP - 14, "S", { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: C.ink });
    wire([[360, TOP], [RIGHT, TOP], [RIGHT, 116]]);
    // Z on the right-hand vertical
    wire([[RIGHT, 176], [RIGHT, BOT], [330, BOT]]);
    box(RIGHT - 9, 116, 18, 60, "Z", false, RIGHT + 16, 152, "start");

    /* ---- the left rail, with the printed junction dot ---- */
    wire([[LEFT, TOP], [LEFT, MIDY], [LEFT, BOT], [150, BOT]]);
    S("circle", { cx: D1[0], cy: D1[1], r: 4.2, fill: C.ink }, svg);

    /* ---- the voltmeter and Y, in series between the left rail and the second dot ---- */
    S("circle", { cx: 176, cy: BOT, r: 17, fill: C.paper, stroke: C.line, "stroke-width": 2 }, svg);
    T(svg, 176, BOT + 6, "V", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });
    wire([[193, BOT], [250, BOT]]);
    wire([[320, BOT], [D2[0], BOT]]);
    box(250, BOT - 9, 70, 18, "Y", state.s === 2, 285, BOT - 15, "middle");
    S("circle", { cx: D2[0], cy: D2[1], r: 4.2, fill: C.ink }, svg);

    /* ---- X across the two dots ---- */
    wire([[LEFT, MIDY], [150, MIDY]]);
    wire([[230, MIDY], [330, MIDY], [330, BOT]]);
    box(150, MIDY - 9, 80, 18, "X", state.s === 3, 190, MIDY - 15, "middle");

    /* ---- the fault marks, in amber, never red ---- */
    if (state.s === 1) {
      shortBar(150, 230, MIDY);
      T(svg, 190, MIDY + 26, "short", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
    }
    if (state.s === 2) {
      shortBar(250, 320, BOT);
      T(svg, 285, BOT + 26, "short", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
    }
    if (state.s === 3) {
      openGap(140, MIDY);
      T(svg, 190, MIDY + 26, "open", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });
    }
    if (state.s === 4) {
      S("line", { x1: RIGHT, y1: 134, x2: RIGHT, y2: 142, stroke: C.grey, "stroke-width": 2 }, svg);
      S("line", { x1: RIGHT, y1: 150, x2: RIGHT, y2: 158, stroke: C.grey, "stroke-width": 2 }, svg);
      S("circle", { cx: RIGHT, cy: 137, r: 2.6, fill: C.paper, stroke: C.amber, "stroke-width": 1.8 }, svg);
      S("circle", { cx: RIGHT, cy: 155, r: 2.6, fill: C.paper, stroke: C.amber, "stroke-width": 1.8 }, svg);
      T(svg, RIGHT + 16, 104, "open", { "text-anchor": "start", "font-size": 11, "font-weight": 700, fill: C.amber });
    }

    /* ---- the reading column, on the right ---- */
    const col = (y, s, color, size) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: color });
    col(58, st.name, C.ink, 14);
    col(98, "meter: " + st.read, C.amber, 12.5);
    col(128, "I = " + st.cur, C.ink, 12.5);
    col(164, st.tag, C.grey, 10.5);

    /* ---- the reading row ---- */
    const latex = state.s === 0 || state.s === 2
      ? "V = \\frac{6X}{X+Z}" + (state.s === 2 ? "\\ \\text{(unchanged)}" : "") + ",\\quad I = \\frac{6}{X+Z}"
      : state.s === 1
        ? "V = 0,\\quad I = \\frac{6}{Z}"
        : state.s === 3
          ? "V = 6\\ \\text{V},\\quad I = 0"
          : "V = 0,\\quad I = 0";
    const cap = [
      "Normal: the voltmeter branch carries no current (ideal meter), so the meter reads the p.d. across X, 6X/(X+Z).",
      "X shorted: both ends of X are at the same potential, so the meter reads 0 V and the current is limited by Z alone.",
      "Y shorted: the ideal voltmeter already stops this branch, so the reading cannot change \u2014 this is why B is not possible.",
      "X open: no current anywhere, no p.d. across any resistor, so the whole 6 V appears across the break: the meter reads 6 V. This is the printed answer.",
      "Z open: no current, so no p.d. across X either: the meter reads 0 V.",
    ][state.s];
    r.set(latex, state.s === 3 ? true : null, cap, { yes: "printed answer" });
  };

  render();
}

/* ---------------- Q16: the same two resistors, in series and in parallel ----------------
 *
 * q16 gives 3 ohm, 6 ohm and a 9 V battery, and its answers are
 *     (a)(i) 3 + 6 = 9 ohm     (ii) I = 9/9 = 1 A, V across the 6 ohm = 6 V
 *     (b)(i) 1/(1/3 + 1/6) = 2 ohm   (ii) 9/6 = 1.5 A in the 6 ohm  (iii) 9/2 = 4.5 A total
 * Every number on screen is recomputed from R1, R2 and V below, so the widget cannot drift
 * from the printed answer.  Only the two configurations the question actually has are
 * offered: a "mixed" network would need a third resistance that q16 never gives.
 *
 * Layout: the circuit is drawn in an SVG group that is scaled up and centred, so it fills
 * the card instead of sitting in one corner; the reading column is centred on the same
 * vertical line as the circuit and R_eq is written with a real subscript.
 */
const R16_A = 3;      // ohm
const R16_B = 6;      // ohm
const V16 = 9;        // V
const f16 = (v, u) => `${v.toFixed(2)} ${u}`;

const G_SCALE = 1.55;                 // draw small, then enlarge to fill the card
const G_TX = -120.9, G_TY = -112.0;   // puts the circuit centre near (200, 124)

function q16(root) {
  const CW = 560, CH = 240;
  const svg = scene(CW, CH);
  const r = readout();
  const state = { mode: 0 };

  root.append(
    question("Two resistors, 3 Ω and 6 Ω, are connected across a 9 V battery. Compare the series and the parallel circuit.", [
      "Series: $R_{eq} = R_1 + R_2$, and the same current passes through both",
      "Parallel: $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}$, and both have the same p.d.",
    ]),
    svg,
    tabs(["series", "parallel"], (i) => { state.mode = i; render(); }),
    r.el,
  );

  // R_eq = value as ONE text element, so the subscript and the number cannot overlap
  const reLine = (x, y, value, color, size) => {
    const t = S("text", { x, y, fill: color, "font-size": size, "font-weight": 700,
      "text-anchor": "middle" }, svg);
    S("tspan", {}, t).textContent = "R";
    S("tspan", { "baseline-shift": "sub", "font-size": size * 0.66 }, t).textContent = "eq";
    S("tspan", {}, t).textContent = " = " + value + " Ω";
  };

  const render = () => {
    clear(svg);
    const series = state.mode === 0;
    const R = series ? R16_A + R16_B : (R16_A * R16_B) / (R16_A + R16_B);
    const I = V16 / R;
    const g = S("g", { transform: "translate(" + G_TX + " " + G_TY + ") scale(" + G_SCALE + ")" }, svg);

    const wire = (...pts) => {
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
      S("path", { d, fill: "none", stroke: C.line, "stroke-width": 2.4, "stroke-linejoin": "round" }, g);
    };
    const resBox = (cx, cy, label) => {
      S("rect", { x: cx - 25, y: cy - 9.5, width: 50, height: 19, rx: 2,
        fill: C.greenSoft, stroke: C.green, "stroke-width": 2.2 }, g);
      T(g, cx, cy + 4.8, label, { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.ink });
    };
    const cell = (x, y) => {
      S("line", { x1: x - 12, y1: y - 6, x2: x + 12, y2: y - 6, stroke: C.line, "stroke-width": 3 }, g);
      S("line", { x1: x - 6, y1: y + 6, x2: x + 6, y2: y + 6, stroke: C.line, "stroke-width": 3 }, g);
      T(g, x - 20, y + 4, "9 V", { "text-anchor": "end", "font-size": 12.5, "font-weight": 700, fill: C.ink });
    };
    const note = (x, y, s, color, size) =>
      T(g, x, y, s, { "text-anchor": "middle", "font-size": size || 11.5, fill: color || C.grey });

    const LX = 84, RX = 330, TY = 96, BY = 214, MY = (TY + BY) / 2;

    wire([LX, BY], [LX, MY + 6]);
    wire([LX, MY - 6], [LX, TY]);
    cell(LX, MY);

    if (series) {
      wire([LX, TY], [RX, TY], [RX, BY], [LX, BY]);
      resBox(166, TY, "3 Ω");
      resBox(262, TY, "6 Ω");
      S("line", { x1: 112, y1: TY, x2: 140, y2: TY, stroke: C.red, "stroke-width": 2.6,
        "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, g);
      T(g, 126, TY + 18, "I", { "text-anchor": "middle", "font-size": 12.5, "font-weight": 700, fill: C.red });
      note(166, TY + 32, "V = " + f16(I * R16_A, "V"), C.blue);
      note(262, TY + 32, "V = " + f16(I * R16_B, "V"), C.blue);
    } else {
      const BL = 208, BR = 300, T1 = 132, T2 = 178;
      wire([LX, TY], [BL, TY], [BL, T1]);
      wire([BL, T1], [BL, T2]);
      wire([BR, T1], [BR, T2]);
      wire([BL, T1], [BR, T1]);
      wire([BL, T2], [BR, T2]);
      wire([BR, T2], [BR, BY], [LX, BY]);
      resBox((BL + BR) / 2, T1, "3 Ω");
      resBox((BL + BR) / 2, T2, "6 Ω");
      note((BL + BR) / 2, T1 - 18, "V = " + f16(V16, "V"), C.blue);
      S("line", { x1: BL + 8, y1: T1 + 20, x2: BL + 30, y2: T1 + 20, stroke: C.red, "stroke-width": 2.6,
        "marker-end": "url(#arrRed-" + svg.dataset.uid + ")" }, g);
      T(g, BR + 16, T1 + 4.5, "I₃", { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.red });
      T(g, BR + 16, T2 + 4.5, "I₆", { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.red });
    }

    /* ---- the reading column, centred on the circuit's vertical centre line ---- */
    const CX = 452;
    const txt = (y, s, color, size, bold) =>
      T(svg, CX, y, s, { "text-anchor": "middle", "font-size": size, fill: color,
        "font-weight": bold ? 700 : 400 });
    if (series) {
      txt(78, "same current I", C.grey, 11.5, false);
      txt(106, "I = " + f16(I, "A"), C.red, 14, true);
      reLine(CX, 136, R.toFixed(2), C.green, 14);
      txt(168, "V₃ + V₆ = 9.00 V", C.blue, 11.5, false);
    } else {
      txt(70, "same p.d. V", C.grey, 11.5, false);
      txt(98, "I₃ = " + f16(V16 / R16_A, "A"), C.red, 13, true);
      txt(124, "I₆ = " + f16(V16 / R16_B, "A"), C.red, 13, true);
      txt(152, "I = " + f16(I, "A"), C.ink, 13, true);
      reLine(CX, 184, R.toFixed(2), C.green, 14);
    }

    const latex = series
      ? "R_{eq} = " + f16(R, "\\Omega") + ",\\quad I = " + f16(I, "\\text{A}") +
        ",\\quad V_3 = " + f16(I * R16_A, "\\text{V}") + ",\\quad V_6 = " + f16(I * R16_B, "\\text{V}")
      : "R_{eq} = " + f16(R, "\\Omega") + ",\\quad I = " + f16(I, "\\text{A}") +
        ",\\quad I_3 = " + f16(V16 / R16_A, "\\text{A}") + ",\\quad I_6 = " + f16(V16 / R16_B, "\\text{A}");
    const caption = series
      ? "Series: R_eq = R₁ + R₂, the same current through both, and the p.d. splits in proportion to the resistances."
      : "Parallel: 1/R_eq = 1/R₁ + 1/R₂, both resistors have the full 9 V, and the current splits in proportion to 1/R.";
    r.set(latex, true, caption, { yes: "live readings" });
  };

  render();
}

const REGISTRY = { q2, q3, q6, q9, q19, q20, q32, q36, q41, q16 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
