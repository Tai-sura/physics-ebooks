/**
 * jpwm01 Nature of waves — interactive graphics.
 *
 * q22 (p08) — direction of motion of the particles on a wave travelling LEFT.
 *
 * Every coordinate below was measured on books/jpwm01/pages/p08.jpg, a
 * 1786 x 2526 px render of the 595.32 x 842 pt page, i.e. 3.000 px per pt.
 * The SVG viewBox is the printed figure's own page-pt box (304,291)-(574,400),
 * so one SVG unit is one printed pt and the seven particles can be compared
 * point by point against the book. Two deliberate deviations from the print:
 * the printed "Direction of the wave travel" line sits at y 268-295 pt and is
 * moved down to 291-297 so the drawer fits without scrolling, and each letter
 * goes to the side where the curve falls away (left while the particle rises,
 * right while it falls, above the dot at a crest or trough) instead of the
 * print's fixed offsets, so neither the curve nor a velocity arrow ever crosses
 * a label.
 *
 *   element                px on p08              pt
 *   axis line y (ink rows 1079-1081)                  360.00
 *   particle A              (957.0, 1077)          (318.99, 359.00)
 *   particle B  crest       (1076.0, 979)          (358.66, 326.34)
 *   particle C              (1197.0, 1077)         (398.99, 359.00)
 *   particle D  trough      (1318.5, 1184)         (439.49, 394.66)
 *   particle E              (1443.0, 1077)         (480.99, 359.00)
 *   particle F  crest       (1561.0, 979)          (520.32, 326.34)
 *   particle G              (1674.0, 1077)         (557.99, 359.00)
 *
 * The red dot centres sit 1.0 pt above the axis ink, and the printed crest dot
 * is 33.67 pt above the axis while the trough dot is 34.67 pt below; the
 * widget draws an ideal sine of the mean amplitude 34.17 pt, so its crest and
 * trough differ from the printed dots by 0.5 pt each. The printed half
 * wavelength is not perfectly even (80.00 / 82.00 / 77.00 pt), so the drawing
 * maps phase to x through the seven measured positions instead of forcing a
 * uniform sine; every particle then sits exactly on the curve at t = 0 and the
 * seven positions are exactly the printed ones.
 *
 * Model (signed off by physics-lead, a8d2877): the wave travels to the LEFT, so
 * a particle moves the way the crest on its right will carry it, i.e. the
 * particle velocity has the same sign as the slope of the y-x graph. Write
 * phase i * 90 degrees for A..G and let phi be the phase the wave has advanced:
 *   y_i = axis - A sin(phase_i + phi),   v_i proportional to +cos(phase_i + phi)
 * At phi = 0: A, E move up; C, G move down; B, D, F are momentarily at rest.
 * That is the printed instant and the book's answer.
 *
 * q26 (p09) - the second pass through the equilibrium position.
 * Measured on the same page render (3.000 px/pt): x-axis ink rows 1353-1354
 * (centre y = 451.17 pt), vertical axis x = 1062.5 px (354.17 pt), x-axis ink
 * from x 963 to 1670 px (321.00-556.82 pt), vertical axis 1230-1442 px
 * (409.99-480.66 pt). The curve crosses the axis at 1159.5 / 1342.0 / 1524.5 px
 * (386.49 / 447.32 / 508.16 pt), evenly spaced by 60.83 pt = 12 cm, so the
 * scale is 5.07 pt per cm and the wavelength is 24 cm. Crest ink 1294.5 px,
 * trough 1412.5 px -> amplitude 59 px = 19.67 pt. P is the dot on the crest at
 * x = 0; the printed labels 0/6/18/30 cm sit within 6 pt of their crossings.
 * The widget therefore uses x = 354.17 + 5.07 * cm pt, lambda = 121.68 pt,
 * A = 19.67 pt, T = 2 s, v = 12 cm/s.
 */

import { C, S, T, H, scene, clear, slider, readout, question } from "../../engine/widgets/kit.js";

const Q22 = {
  view: { x: 304, y: 291, w: 270, h: 109 }, // printed-page pt, 1 unit = 1 pt
  axis: 360.0, // pt
  amp: 34.17, // pt, mean of the printed crest 33.67 and trough 34.67
  arrowMax: 22.0, // pt at a zero crossing
  particles: [
    { id: "A", x: 318.99, ph: 0 },
    { id: "B", x: 358.66, ph: 90 },
    { id: "C", x: 398.99, ph: 180 },
    { id: "D", x: 439.49, ph: 270 },
    { id: "E", x: 480.99, ph: 360 },
    { id: "F", x: 520.32, ph: 450 },
    { id: "G", x: 557.99, ph: 540 },
  ],
};

// phase (deg) -> x (pt), through the seven printed positions plus one knot either side.
const KX = [-90, ...Q22.particles.map((p) => p.ph), 630];
const KXP = [
  Q22.particles[0].x - (Q22.particles[1].x - Q22.particles[0].x),
  ...Q22.particles.map((p) => p.x),
  Q22.particles[6].x + (Q22.particles[6].x - Q22.particles[5].x),
];

function xOfPhase(u) {
  const n = KX.length;
  if (u <= KX[0]) return KXP[0] + ((u - KX[0]) * (KXP[1] - KXP[0])) / (KX[1] - KX[0]);
  if (u >= KX[n - 1]) {
    return KXP[n - 1] + ((u - KX[n - 1]) * (KXP[n - 1] - KXP[n - 2])) / (KX[n - 1] - KX[n - 2]);
  }
  for (let i = 0; i < n - 1; i++) {
    if (u <= KX[i + 1]) {
      const t = (u - KX[i]) / (KX[i + 1] - KX[i]);
      return KXP[i] + t * (KXP[i + 1] - KXP[i]);
    }
  }
  return KXP[n - 1];
}

/** Vertical velocity arrow from a particle's centre; the head is a plain path so it can be any colour. */
function vArrow(svg, x, y, len, up, color) {
  const tip = up ? y - len : y + len;
  const head = 4.4;
  const half = 3.1;
  S("line", {
    x1: x, y1: y, x2: x, y2: up ? tip + head : tip - head,
    stroke: color, "stroke-width": 2, "stroke-linecap": "round",
  }, svg);
  S("path", {
    d: `M${x - half},${up ? tip + head : tip - head} L${x},${tip} L${x + half},${up ? tip + head : tip - head} Z`,
    fill: color,
  }, svg);
}

function q22(root) {
  const svg = scene(Q22.view.w, Q22.view.h);
  svg.setAttribute("viewBox", `${Q22.view.x} ${Q22.view.y} ${Q22.view.w} ${Q22.view.h}`);
  const s = slider({ label: "Wave position", min: 0, max: 360, step: 1, value: 0, fmt: (v) => `${(v / 360).toFixed(2)}T`, play: false });
  const r = readout();

  const legend = H("div", {
    class: "g-cap",
    style: "display:flex;gap:16px;flex-wrap:wrap;margin:0 0 4px;font-size:13px",
  }, [
    H("span", { style: `color:${C.blue};font-weight:700` }, ["↑ moving upwards"]),
    H("span", { style: `color:${C.pink};font-weight:700` }, ["↓ moving downwards"]),
    H("span", { style: `color:${C.grey};font-weight:700` }, ["○ momentarily at rest"]),
  ]);

  root.append(
    question("22. Identify all the particles that are (i) moving upwards, (ii) moving downwards, (iii) momentarily at rest.", [
      "Graph: displacement $y$ against position $x$; the wave travels to the left.",
      "Each particle moves the way the crest on its right will carry it: fastest at the equilibrium position, at rest at a crest or trough.",
    ]),
    svg,
    legend,
    s.el,
    r.el,
  );
  svg.style.margin = "4px 0 4px";
  s.el.style.margin = "4px 0";
  r.el.style.margin = "6px 0";

  let raf = 0;
  let playStart = 0;
  let phaseStart = 0;
  const playBtn = H("button", { type: "button" }, ["▶ Play one cycle"]);
  const stopPlay = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    playBtn.textContent = "▶ Play one cycle";
  };

  const draw = (phiDeg) => {
    clear(svg);
    const phi = (phiDeg * Math.PI) / 180;
    const up = [];
    const down = [];
    const rest = [];

    // the axis
    S("line", { x1: 306, y1: Q22.axis, x2: 572, y2: Q22.axis, stroke: "#2b2b2b", "stroke-width": 1.1 }, svg);

    // direction of travel: printed wording above a left-pointing arrow
    T(svg, 432, 297.4, "Direction of the wave travel", { "text-anchor": "middle", "font-size": 8, fill: "#1f2a3d" });
    S("line", { x1: 500, y1: 304.5, x2: 354, y2: 304.5, stroke: "#1f2a3d", "stroke-width": 1.1 }, svg);
    S("path", { d: "M354,304.5 L362,300.8 L362,308.2 Z", fill: "#1f2a3d" }, svg);

    // the wave: y = axis - A sin(phase + phi), phase mapped to x through the measured positions
    const pts = [];
    for (let u = -240; u <= 780; u += 1.5) {
      const y = Q22.axis - Q22.amp * Math.sin((u * Math.PI) / 180 + phi);
      pts.push(`${xOfPhase(u).toFixed(2)},${y.toFixed(2)}`);
    }
    S("polyline", { points: pts.join(" "), fill: "none", stroke: C.ink, "stroke-width": 1.7, "stroke-linejoin": "round" }, svg);

    for (const p of Q22.particles) {
      const th = (p.ph * Math.PI) / 180 + phi;
      const y = Q22.axis - Q22.amp * Math.sin(th);
      const v = Math.cos(th);
      if (Math.abs(v) > 0.02) {
        vArrow(svg, p.x, y, Q22.arrowMax * Math.abs(v), v > 0, v > 0 ? C.blue : C.pink);
      } else {
        S("circle", { cx: p.x, cy: y, r: 4.6, fill: "none", stroke: C.grey, "stroke-width": 1.4 }, svg);
      }
      if (v > 0.02) up.push(p.id);
      else if (v < -0.02) down.push(p.id);
      else rest.push(p.id);
    }

    // particles on top. The letter goes to the side where the curve falls away
    // (left when the particle rises, right when it falls, as printed); as the
    // speed dies away at a crest or trough it rises to sit above the dot.
    for (const p of Q22.particles) {
      const th = (p.ph * Math.PI) / 180 + phi;
      const y = Q22.axis - Q22.amp * Math.sin(th);
      const v = Math.cos(th);
      const f = Math.max(0, Math.min(1, 1 - Math.abs(v) / 0.45));
      const dx = (v > 0 ? -1 : 1) * 9 * (1 - f);
      S("circle", { cx: p.x, cy: y, r: 2.7, fill: C.red, stroke: "#fff", "stroke-width": 0.8 }, svg);
      T(svg, p.x + dx, y - 3 - 6 * f, p.id, { "text-anchor": "middle", "font-size": 8.2, "font-weight": 700, fill: C.red });
    }

    const list = (a) => (a.length ? a.join(", ") : "none");
    const latex = `\\text{upwards: } ${list(up)} \\quad \\text{downwards: } ${list(down)} \\quad \\text{at rest: } ${list(rest)}`;
    if (Number(phiDeg) === 0) {
      r.set(latex, true, "", { yes: "t = 0: matches the key" });
    } else {
      r.set(latex, null,
        `At ${(phiDeg / 360).toFixed(2)}T (${phiDeg}°) these groups apply; the key's answer is t = 0.`);
    }
  };

  const reset = H("button", { type: "button", onclick: () => { stopPlay(); s.set(0); } }, ["Printed instant (t = 0)"]);

  playBtn.addEventListener("click", () => {
    if (raf) {
      stopPlay();
      return;
    }
    const from = s.get() >= 359.5 ? 0 : s.get();
    if (from === 0) s.set(0);
    phaseStart = from;
    playStart = performance.now();
    playBtn.textContent = "❚❚ Pause";
    const tick = (now) => {
      const t = Math.min(1, (now - playStart) / 2400);
      const p = phaseStart + 360 * t;
      s.set(Math.round(p) % 360);
      if (t >= 1) {
        s.set(0);
        stopPlay();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });

  root.append(H("div", { class: "g-btns" }, [reset, playBtn]));

  // Drag the waveform left or right: dragging left = the wave has advanced (it travels left).
  let dragging = false;
  let dragX = 0;
  let dragPhase = 0;
  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    stopPlay();
    dragging = true;
    dragX = event.clientX;
    dragPhase = s.get();
    svg.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  svg.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const pxPerPt = rect.width / Q22.view.w;
    const degPerPx = 360 / (159.33 * pxPerPt); // one wavelength = 360 degrees
    let p = dragPhase - (event.clientX - dragX) * degPerPx;
    p = ((p % 360) + 360) % 360;
    s.set(Math.round(p));
  });
  const endDrag = () => {
    dragging = false;
  };
  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);
  svg.addEventListener("pointerleave", (event) => {
    if (dragging && event.buttons === 0) endDrag();
  });
  svg.style.touchAction = "pan-y";

  s.on(draw);
  s.el.querySelector("input")?.addEventListener("pointerdown", stopPlay);
  draw(0);
}


/* ---------- q26: second pass through the equilibrium position ---------- */
const Q26 = {
  view: { x: 310, y: 406, w: 268, h: 78 },
  axis: 451.17, // pt
  yAxis: 354.17, // pt, x = 0
  left: 321.0, // pt, printed x-axis ink start
  right: 556.82, // pt, printed x-axis arrow tip
  top: 409.99, // pt, y-axis arrow tip
  bottom: 480.66, // pt, y-axis bottom
  scale: 5.07, // pt per cm (three crossings 60.83 pt apart = 12 cm)
  amp: 19.67, // pt
  lambda: 24, // cm
  period: 2, // s
  speed: 12, // cm/s
  tMax: 1.5, // s
};

function q26(root) {
  const svg = scene(Q26.view.w, Q26.view.h);
  svg.setAttribute("viewBox", `${Q26.view.x} ${Q26.view.y} ${Q26.view.w} ${Q26.view.h}`);
  const s = slider({ label: "Time t", min: 0, max: Q26.tMax, step: 0.01, value: 0, fmt: (v) => `${Number(v).toFixed(2)} s`, play: false });
  const r = readout();
  const X = (cm) => Q26.yAxis + cm * Q26.scale;
  const waveY = (cm, t) => Q26.axis - Q26.amp * Math.cos((2 * Math.PI * (cm / Q26.lambda - t / Q26.period)));
  const pY = (t) => Q26.axis - Q26.amp * Math.cos((2 * Math.PI * t) / Q26.period);

  root.append(
    question("26. The figure is a snapshot at t = 0. At t = 1.5 s the particle P passes the equilibrium position for a second time. Find the wave speed.", [
      "P sits on the crest at x = 0 and moves up and down only; the wave travels to the right.",
      "The crest that leaves P at t = 0 has travelled v·t when P is at the equilibrium position again.",
    ]),
    svg,
    s.el,
    r.el,
  );

  const draw = (tRaw) => {
    const t = Number(tRaw);
    clear(svg);

    // axes
    S("line", { x1: Q26.left, y1: Q26.axis, x2: Q26.right - 5, y2: Q26.axis, stroke: "#2b2b2b", "stroke-width": 1.1 }, svg);
    S("path", { d: `M${Q26.right},${Q26.axis} L${Q26.right - 8},${Q26.axis - 3.4} L${Q26.right - 8},${Q26.axis + 3.4} Z`, fill: "#2b2b2b" }, svg);
    S("line", { x1: Q26.yAxis, y1: Q26.bottom, x2: Q26.yAxis, y2: Q26.top + 6, stroke: "#2b2b2b", "stroke-width": 1.1 }, svg);
    S("path", { d: `M${Q26.yAxis},${Q26.top} L${Q26.yAxis - 3.4},${Q26.top + 8} L${Q26.yAxis + 3.4},${Q26.top + 8} Z`, fill: "#2b2b2b" }, svg);
    T(svg, Q26.yAxis - 4, Q26.top + 6, "displacement", { "text-anchor": "end", "font-size": 6.4, fill: "#1f2a3d" });
    T(svg, Q26.right + 1.5, Q26.axis + 10, "x / cm", { "text-anchor": "start", "font-size": 6.8, fill: "#1f2a3d" });

    // printed ticks 0 / 6 / 18 / 30
    for (const cm of [0, 6, 18, 30]) {
      const x = X(cm);
      S("line", { x1: x, y1: Q26.axis - 2.2, x2: x, y2: Q26.axis + 2.2, stroke: "#2b2b2b", "stroke-width": 0.8 }, svg);
      T(svg, x, Q26.axis + 9.5, String(cm), { "text-anchor": "middle", "font-size": 7.4, fill: "#1f2a3d" });
    }

    // t = 0 ghost, then the wave at time t
    const ghost = [];
    for (let cm = -6.5; cm <= 40; cm += 0.2) ghost.push(`${X(cm).toFixed(2)},${waveY(cm, 0).toFixed(2)}`);
    S("polyline", { points: ghost.join(" "), fill: "none", stroke: C.grey, "stroke-width": 1.1, "stroke-dasharray": "3 2.4" }, svg);
    const now = [];
    for (let cm = -6.5; cm <= 40; cm += 0.2) now.push(`${X(cm).toFixed(2)},${waveY(cm, t).toFixed(2)}`);
    S("polyline", { points: now.join(" "), fill: "none", stroke: C.ink, "stroke-width": 1.7 }, svg);

    // the crest that left P at t = 0
    const crestCm = Q26.speed * t;
    S("line", { x1: X(crestCm), y1: Q26.axis - Q26.amp + 1, x2: X(crestCm), y2: Q26.axis - 5, stroke: C.amber, "stroke-width": 1.2, "stroke-dasharray": "2.4 2" }, svg);
    S("circle", { cx: X(crestCm), cy: Q26.axis - Q26.amp, r: 3.4, fill: "none", stroke: C.amber, "stroke-width": 1.5 }, svg);

    // P: fixed at x = 0, only its height changes
    const y = pY(t);
    S("line", { x1: Q26.yAxis, y1: Q26.axis, x2: Q26.yAxis, y2: y, stroke: C.red, "stroke-width": 1, "stroke-dasharray": "2.2 2" }, svg);
    S("circle", { cx: Q26.yAxis, cy: y, r: 2.7, fill: C.red, stroke: "#fff", "stroke-width": 0.8 }, svg);
    T(svg, Q26.yAxis - 6.5, y - 4, "P", { "text-anchor": "middle", "font-size": 8, "font-weight": 700, fill: C.red });

    const fracT = t / Q26.period;
    const disp = Q26.amp === 0 ? 0 : (Q26.axis - y) / Q26.amp; // +1 at a crest in cm units
    const dispCm = disp * (Q26.amp / Q26.scale); // pt -> cm
    const sn = Math.sin((2 * Math.PI * t) / Q26.period);
    const moving = Math.abs(sn) < 0.02 ? "at rest" : (sn < 0 ? "moving up" : "moving down");
    const latex = `t = ${t.toFixed(2)}\\ \\text{s} = ${fracT.toFixed(2)}T \\quad y_P = ${Math.abs(dispCm) < 0.05 ? "0.0" : dispCm.toFixed(1)}\\ \\text{cm} \\quad vt = ${(Q26.speed * t).toFixed(1)}\\ \\text{cm}`;
    const near = (a, b) => Math.abs(t - a) < 0.005;
    if (near(0.5)) {
      r.set(latex, true, "First pass: t = T/4 = 0.5 s, P crosses the equilibrium position moving down.", { yes: "T/4: first pass" });
    } else if (near(1.5)) {
      r.set(latex, true, `Second pass: t = 3T/4 = 1.5 s, P crosses the equilibrium position moving up. The crest from P has moved ${(Q26.speed * t).toFixed(0)} cm, so v = 18/1.5 = 12 cm/s.`, { yes: "3T/4: second pass" });
    } else {
      r.set(latex, null, `P is at x = 0, ${moving}; the wave has travelled ${(Q26.speed * t).toFixed(1)} cm.`);
    }
  };

  let raf = 0;
  let playStart = 0;
  let t0 = 0;
  const playBtn = H("button", { type: "button" }, ["▶ Play 0 → 1.5 s"]);
  const stopPlay = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    playBtn.textContent = "▶ Play 0 → 1.5 s";
  };
  playBtn.addEventListener("click", () => {
    if (raf) {
      stopPlay();
      return;
    }
    t0 = performance.now();
    playBtn.textContent = "❚❚ Pause";
    const tick = (now) => {
      const f = Math.min(1, (now - t0) / 3000);
      s.set(Number((Q26.tMax * f).toFixed(2)));
      if (f >= 1) {
        stopPlay();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });

  const b1 = H("button", { type: "button", onclick: () => { stopPlay(); s.set(0.5); } }, ["t = 0.5 s (T/4)"]);
  const b2 = H("button", { type: "button", onclick: () => { stopPlay(); s.set(1.5); } }, ["t = 1.5 s (3T/4)"]);
  root.append(H("div", { class: "g-btns" }, [b1, b2, playBtn]));
  s.el.querySelector("input")?.addEventListener("pointerdown", stopPlay);
  s.on(draw);
  draw(0);
}

const REGISTRY = { q22, q26 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
