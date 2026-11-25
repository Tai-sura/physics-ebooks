/**
 * Interactive graphics for spem05 (magnetic force on current-carrying wires).
 *
 * q3  p02: an electron entering the dashed field region is deflected; a positive
 *          particle P entering from the left is deflected the other way (key: A, to
 *          the top). The print shows B into paper, so v right gives F = qv x B up for
 *          a positive charge and down for an electron.
 * q11 p05: copper rod XY on smooth rails at 30 deg to the horizontal, 20 cm apart,
 *          B = 100 mT vertically up, rod stationary. End view with N, mg and BIL, and
 *          a slider on I; the key's answer is I = mg tan30 / (BL) = 9.91 A.
 * q18 p11: AB (left) and CD (right) solenoids, coil PQRS turning about the axis XY,
 *          commutator and brushes, battery E. Plan of the answers: B South, C North;
 *          PQ up and RS down, clockwise from above; no force at the vertical because
 *          the brushes lose contact; reversing E reverses current and field together,
 *          so the sense of rotation stays.
 *
 * Only the shared kit is used; nothing here touches engine/.
 */

import {
  C, T, S, H, tex, fmt, marker, scene, clear, slider, readout, question,
  buttonRow, tabs, dashed, sector,
} from "../../engine/widgets/kit.js";

const DEG = Math.PI / 180;

/** A line with an arrowhead at its far end. */
function arrow(svg, x1, y1, x2, y2, colour = C.line, width = 2, head = "arr") {
  return S("line", {
    x1, y1, x2, y2, stroke: colour, "stroke-width": width, "marker-end": marker(svg, head),
  }, svg);
}

/** A field symbol: a circled cross (into the paper) or a circled dot (out of it). */
function fieldMark(svg, x, y, r, into, colour = C.grey) {
  S("circle", { cx: x, cy: y, r, fill: "#fff", stroke: colour, "stroke-width": 1.3 }, svg);
  if (into) {
    const d = r * 0.7;
    S("line", { x1: x - d, y1: y - d, x2: x + d, y2: y + d, stroke: colour, "stroke-width": 1.4 }, svg);
    S("line", { x1: x - d, y1: y + d, x2: x + d, y2: y - d, stroke: colour, "stroke-width": 1.4 }, svg);
  } else {
    S("circle", { cx: x, cy: y, r: r * 0.28, fill: colour }, svg);
  }
}

/* ------------------------------------------------------------------ *
 * q3 — the same field, the two charges.                               *
 * ------------------------------------------------------------------ */

function q3Graphic(root) {
  root.append(question(
    "電子由磁場下方進入，偏向右（印刷圖）。帶正電的 P 由左邊進入，會被偏去哪裏？",
    ["B into paper（⊗）", "F = qv×B：同一方向飛入，正負電荷受力相反"],
  ));

  const svg = scene(470, 300);
  const out = readout();
  let positive = false;

  const tabsEl = tabs(["Electron（印刷個案）", "Positive charge P"], (i) => {
    positive = i === 1;
    again();
  });

  function again() {
    clear(svg);
    const boxL = 140, boxR = 400, boxT = 60, boxB = 240;   // the dashed field region
    const y0 = 150;
    const yEnd = positive ? 92 : 208;
    const cx = boxL + 150;

    // the path, as a quadratic, sampled so the field symbols can keep clear of it
    const quad = (t) => [
      (1 - t) ** 2 * boxL + 2 * t * (1 - t) * cx + t * t * boxR,
      (1 - t) ** 2 * y0 + 2 * t * (1 - t) * y0 + t * t * yEnd,
    ];
    const track = Array.from({ length: 41 }, (_, i) => quad(i / 40));
    const px = boxL + 22, py = y0;                         // the particle
    const near = (x, y) => {
      if (Math.hypot(x - px, y - py) < 34) return true;
      return track.some(([tx, ty]) => Math.hypot(tx - x, ty - y) < 19);
    };

    S("rect", {
      x: boxL, y: boxT, width: boxR - boxL, height: boxB - boxT,
      fill: "none", stroke: C.grey, "stroke-width": 1.8, "stroke-dasharray": "7 5",
    }, svg);
    for (let i = 0; i < 5; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const mx = boxL + 34 + i * 56, my = boxT + 26 + j * 48;
        if (!near(mx, my)) fieldMark(svg, mx, my, 7, true);
      }
    }
    T(svg, boxL + 4, boxT - 8, "B into paper", { "font-size": 13, "font-weight": 700, fill: C.grey });
    T(svg, boxL, boxB + 22, "magnetic field region", { "font-size": 12, fill: C.grey });

    // the printed electron runs upward and is pushed to the right; in the widget the charge
    // runs to the right, so "up" on the page is the positive charge's side.
    S("path", {
      d: `M30,${y0} L${boxL},${y0} Q${cx},${y0} ${boxR - 30},${yEnd}`,
      fill: "none", stroke: C.ink, "stroke-width": 2.2,
    }, svg);
    arrow(svg, boxR - 42, yEnd + (positive ? 12 : -12), boxR - 14, yEnd + (positive ? 24 : -24), C.ink, 2.2, "arrInk");

    S("circle", { cx: px, cy: py, r: 11, fill: "#fff", stroke: C.ink, "stroke-width": 2 }, svg);
    T(svg, px, py + 5, positive ? "+" : "−", { "text-anchor": "middle", "font-size": 17, "font-weight": 700, fill: C.ink });
    T(svg, px - 13, py - 15, positive ? "P" : "e⁻", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });

    arrow(svg, px + 14, py, px + 66, py, C.ink, 2.2, "arrInk");
    T(svg, px + 40, py + 20, "v", { "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: C.ink });

    const fy = positive ? -58 : 58;
    arrow(svg, px, py, px, py + fy, C.red, 2.6, "arrRed");
    T(svg, px + 10, py + fy / 2 + 4, "F", { "font-size": 14, "font-weight": 700, fill: C.red });

    T(svg, boxR - 6, positive ? 40 : 282, positive ? "deflected to the top (A)" : "deflected downward",
      { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: positive ? C.green : C.red });

    if (positive) {
      out.set(
        "q=+e:\\ F=qv\\times B\\ \\text{upward}\\ \\Rightarrow\\ \\text{to the top (A)}",
        true,
        "同一個磁場（B into paper）、同一個飛行方向：正電荷受力向上，電子受力向下。老師答案 A。",
        { yes: "answer A" },
      );
    } else {
      out.set(
        "q=-e:\\ F=qv\\times B\\ \\text{downward}",
        null,
        "印刷的個案：電子受力向下（圖中電子由下向上飛，所以看起來偏向右）。切去 Positive charge P 對比。",
      );
    }
  }

  root.append(svg, tabsEl, out.el);
  again();
}

/* ------------------------------------------------------------------ *
 * q11 — rod on the 30 deg rails: the current that holds it still.    *
 * ------------------------------------------------------------------ */

function q11Graphic(root) {
  const M = 0.035;              // 35 g
  const G = 9.81;
  const B = 0.100;              // 100 mT
  const L = 0.20;               // rails 20 cm apart
  const MG = M * G;             // 0.34335 N
  const TAN30 = Math.tan(30 * DEG);
  const I_EQ = (MG * TAN30) / (B * L);   // 9.91 A
  const PXN = 240;              // px per newton, the same for the rod and the triangle

  root.append(question(
    "銅棒 XY 擱在與水平成 30° 的兩條光滑軌上，軌距 20 cm，B = 100 mT 向上，棒靜止。求電流 I。",
    ["m = 35 g，L = 20 cm，B = 100 mT", "N 垂直軌面、mg 垂直向下、BIL 水平"],
  ));

  const svg = scene(470, 350);
  const out = readout();
  let I = Math.round(I_EQ * 100) / 100;

  const SX = 50, SY = 280, DX = 290;                 // the 30 deg rail line
  const DY = DX * TAN30;
  const ROD_R = 15;
  const rodX = 130;
  const rodSurfY = SY - (rodX - SX) * TAN30;
  const rodC = [rodX - ROD_R * Math.sin(30 * DEG), rodSurfY - ROD_R * Math.cos(30 * DEG)];

  function again() {
    clear(svg);
    const bil = B * I * L;
    const nForce = Math.hypot(MG, bil);

    // the rail, seen end-on
    S("line", { x1: SX, y1: SY, x2: SX + DX, y2: SY - DY, stroke: C.line, "stroke-width": 2.6 }, svg);
    S("line", { x1: SX - 10, y1: SY, x2: SX + 58, y2: SY, stroke: C.grey, "stroke-width": 1.4, "stroke-dasharray": "6 4" }, svg);
    S("path", {
      d: `M${SX + 44},${SY} A44,44 0 0 0 ${SX + 44 * Math.cos(30 * DEG)},${SY - 44 * Math.sin(30 * DEG)}`,
      fill: "none", stroke: C.ink, "stroke-width": 1.6,
    }, svg);
    T(svg, SX + 52, SY - 12, "30°", { "font-size": 13, "font-weight": 700, fill: C.ink });

    // B: vertical dashed arrows above the rail, clear of the force arrows
    for (const bx of [200, 270]) {
      const base = SY - (bx - SX) * TAN30 - 10;
      S("line", { x1: bx, y1: base, x2: bx, y2: base - 60, stroke: C.green, "stroke-width": 1.6, "stroke-dasharray": "6 5" }, svg);
      arrow(svg, bx, base - 60, bx, base - 86, C.green, 1.6, "arrGreen");
    }
    T(svg, 240, 56, "B = 100 mT", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.green });

    // the rod, resting on the surface
    S("circle", { cx: rodC[0], cy: rodC[1], r: ROD_R, fill: "#dfe3ea", stroke: C.line, "stroke-width": 2 }, svg);
    T(svg, rodC[0] - ROD_R - 6, rodC[1] + 5, "XY", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });

    // N (normal to the surface), mg (down), BIL (horizontal)
    const nx = -Math.sin(30 * DEG), ny = -Math.cos(30 * DEG);
    arrow(svg, rodC[0], rodC[1], rodC[0] + nx * nForce * PXN, rodC[1] + ny * nForce * PXN, C.blue, 2.6, "arrInk");
    T(svg, rodC[0] + nx * nForce * PXN - 8, rodC[1] + ny * nForce * PXN - 6, "N",
      { "text-anchor": "end", "font-size": 14, "font-weight": 700, fill: C.blue });
    arrow(svg, rodC[0], rodC[1], rodC[0], rodC[1] + MG * PXN, C.red, 2.6, "arrRed");
    T(svg, rodC[0] - 8, rodC[1] + MG * PXN, "mg", { "text-anchor": "end", "font-size": 14, "font-weight": 700, fill: C.red });
    arrow(svg, rodC[0], rodC[1], rodC[0] + bil * PXN, rodC[1], C.amber, 2.6, "arrAmber");
    T(svg, rodC[0] + 32, rodC[1] - 15, "BIL", { "font-size": 14, "font-weight": 700, fill: C.amber });

    // the force triangle, same scale, in the clear space below the rail
    const tx = 330, ty = 180;
    S("line", { x1: tx, y1: ty, x2: tx, y2: ty + MG * PXN, stroke: C.red, "stroke-width": 2.2, "marker-end": marker(svg, "arrRed") }, svg);
    S("line", { x1: tx, y1: ty + MG * PXN, x2: tx + bil * PXN, y2: ty + MG * PXN, stroke: C.amber, "stroke-width": 2.2, "marker-end": marker(svg, "arrAmber") }, svg);
    S("line", { x1: tx + bil * PXN, y1: ty + MG * PXN, x2: tx, y2: ty, stroke: C.blue, "stroke-width": 2.2, "marker-end": marker(svg, "arrInk") }, svg);
    T(svg, tx - 6, ty + MG * PXN / 2, "mg", { "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.red });
    T(svg, tx + bil * PXN / 2, ty + MG * PXN + 16, "BIL", { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.amber });
    T(svg, tx + bil * PXN / 2 + 16, ty + MG * PXN / 2 - 4, "N", { "font-size": 12, "font-weight": 700, fill: C.blue });
    T(svg, tx + 8, ty + 14, "30°", { "font-size": 12, "font-weight": 700, fill: C.ink });

    // state
    const ok = Math.abs(I - I_EQ) <= 0.05;
    const dir = I < I_EQ - 0.05 ? "down" : I > I_EQ + 0.05 ? "up" : "still";
    const caption = ok
      ? "(b) 電流由 Y 流向 X，BIL 才向右（觀察者在圖右側望）；(a) N、mg、BIL 三力平衡。"
      : dir === "down"
        ? `BIL = ${fmt(bil, 3)} N 太小，沿軌的淨力向下 → 棒會沿軌滑下。`
        : `BIL = ${fmt(bil, 3)} N 太大，沿軌的淨力向上 → 棒會沿軌滑上。`;
    out.set(
      `N\\cos 30^\\circ = mg,\\quad N\\sin 30^\\circ = BIL,\\quad I = \\frac{mg\\tan 30^\\circ}{BL} = ${fmt(I_EQ)}`,
      ok,
      `I = ${fmt(I, 2)} A；BIL = ${fmt(bil, 3)} N。${caption}`,
      { yes: "equilibrium", no: "not balanced" },
    );
  }

  const iSlider = slider({ label: "電流 I（A）", min: 0, max: 15, step: 0.01, value: I, fmt: (v) => `${fmt(v, 2)} A`, play: false });
  iSlider.on((v) => { I = v; again(); });
  root.append(svg, iSlider.el, buttonRow([["重設 I = 9.91 A", () => iSlider.set(Math.round(I_EQ * 100) / 100)]]), out.el);
  again();
}

/* ------------------------------------------------------------------ *
 * q18 — the simple motor: two solenoids, the coil, the commutator.   *
 * ------------------------------------------------------------------ */

function q18Graphic(root) {
  root.append(question(
    "AB 與 CD 是兩個螺線管，矩形線圈 PQRS 可繞水平軸 XY 轉動，換向器與碳刷接電池 E。",
    ["（a）B、C 的極性　（b）PQ、RS 的受力與轉向", "（c）垂直位置有力嗎　（d）反接電池會怎樣"],
  ));

  const svg = scene(520, 370);
  const out = readout();
  let theta = 30;
  let rev = false;

  const O = [260, 148];                      // coil centre, on the axis
  const AX = [0.30, -0.954];                 // unit along the axis, toward X
  const AC = [0.954, 0.30];                  // unit across the axis, horizontal at theta 0
  const A_HALF = 48, B_HALF = 52;            // half length along the axis / half width across
  const RING = [260, 292], RING_R = 16;      // commutator
  const NL = [68, 292], NR = [452, 292];     // junctions on the brush line
  const WIRE_Y = 348;                        // bottom wire, through the battery
  const SOL_Y = 46, SOL_H = 60;              // solenoids: left 16..116, right 404..504
  const INS = [392, 186];                    // the "seen from above" sketch

  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

  /** A short arrow at fraction t along p->q: the current in that piece of the circuit. */
  function currentArrow(svgEl, p, q, t, head = "arrAmber") {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
    if (L < 26) return;
    const ux = dx / L, uy = dy / L, h = Math.min(9, L * 0.16);
    const cx = p[0] + dx * t, cy = p[1] + dy * t;
    arrow(svgEl, cx - ux * h, cy - uy * h, cx + ux * h, cy + uy * h, C.amber, 2, head);
  }

  function again() {
    clear(svg);
    const a = theta * DEG;
    const w = [AC[0] * Math.cos(a), AC[1] * Math.cos(a)];
    const pt = (su, sw) => [
      O[0] + su * A_HALF * AX[0] + sw * B_HALF * w[0],
      O[1] + su * A_HALF * AX[1] + sw * B_HALF * w[1],
    ];
    const P = pt(-1, -1), Q = pt(1, -1), R = pt(1, 1), Sx = pt(-1, 1);
    const dir = rev ? -1 : 1;            // +1: coil current P -> Q -> R -> S, field C -> B
    const broken = Math.abs(((theta % 180) + 180) % 180 - 90) < 4;
    const live = !broken;
    const plusLeft = !rev;               // the battery's + terminal is on the left unless reversed
    // past 90 deg the coil has flipped over, so its corner labels swap sides
    const flip = Math.cos(a) < 0 ? -1 : 1;

    /* ---- the external circuit: E drives the solenoids and, through the brushes, the coil */
    const wire = (x1, y1, x2, y2) =>
      S("line", { x1, y1, x2, y2, stroke: C.line, "stroke-width": 1.5 }, svg);
    wire(20, 106, NL[0], NL[1]);                     // A leg down to the left junction
    wire(500, 106, NR[0], NR[1]);                    // D leg down to the right junction
    wire(NL[0], NL[1], NL[0], WIRE_Y);               // left junction down to the battery wire
    wire(NL[0], WIRE_Y, 253, WIRE_Y);
    wire(267, WIRE_Y, NR[0], WIRE_Y);
    wire(NR[0], WIRE_Y, NR[0], NR[1]);               // right junction up from the battery wire
    wire(NL[0], NL[1], 244, NL[1]);                  // left brush lead
    wire(NR[0], NR[1], 276, NL[1]);                  // right brush lead
    wire(116, 76, 116, 18); wire(116, 18, 404, 18); wire(404, 18, 404, 76);   // B to C

    /* ---- the two solenoids ------------------------------------------------------------ */
    for (const x0 of [16, 404]) {
      S("rect", {
        x: x0, y: SOL_Y, width: 100, height: SOL_H, rx: 26,
        fill: "#e6f2ef", stroke: C.line, "stroke-width": 1.6,
      }, svg);
      for (let i = 0; i < 6; i += 1) {
        S("line", {
          x1: x0 + 14 + i * 14, y1: SOL_Y + 4, x2: x0 + 22 + i * 14, y2: SOL_Y + SOL_H - 4,
          stroke: C.line, "stroke-width": 1.1,
        }, svg);
      }
    }

    /* ---- the field between the poles: N to S, behind the coil ------------------------- */
    const fx1 = dir > 0 ? 392 : 132, fx2 = dir > 0 ? 132 : 392;
    for (const fy of [150, 182]) {
      S("line", {
        x1: fx1, y1: fy, x2: fx2, y2: fy,
        stroke: C.green, "stroke-width": 1.7, "stroke-dasharray": "8 6",
      }, svg);
      // The head sits at the far end and points away from the dashes: B flows from the North
      // pole to the South one, so with B South and C North (the answer's polarity) the field
      // runs C -> B, i.e. leftwards. The tail is inside the dashes, never outside them.
      arrow(svg, fx2 + (dir > 0 ? 20 : -20), fy, fx2, fy, C.green, 1.7, "arrGreen");
    }

    /* ---- the coil and its leads to the commutator ------------------------------------ */
    const poly = `${P[0]},${P[1]} ${Q[0]},${Q[1]} ${R[0]},${R[1]} ${Sx[0]},${Sx[1]}`;
    S("polygon", {
      points: poly, fill: C.blueSoft, "fill-opacity": 0.5,
      stroke: C.ink, "stroke-width": 2.2, "stroke-linejoin": "round",
    }, svg);
    S("line", { x1: P[0], y1: P[1], x2: RING[0] - 7, y2: RING[1] - RING_R, stroke: C.ink, "stroke-width": 1.5 }, svg);
    S("line", { x1: Sx[0], y1: Sx[1], x2: RING[0] + 7, y2: RING[1] - RING_R, stroke: C.ink, "stroke-width": 1.5 }, svg);

    /* ---- the axis XY, dashed over the coil -------------------------------------------- */
    const axEnd = (k) => [O[0] + k * AX[0], O[1] + k * AX[1]];
    const A1 = axEnd(112), A2 = axEnd(-112);
    S("line", {
      x1: A2[0], y1: A2[1], x2: A1[0], y2: A1[1],
      stroke: C.grey, "stroke-width": 1.3, "stroke-dasharray": "7 5",
    }, svg);

    /* ---- the coil current (P -> Q -> R -> S unless reversed) -------------------------- */
    if (live) {
      for (const [p, q] of [[P, Q], [Q, R], [R, Sx], [Sx, P]]) {
        if (dir > 0) currentArrow(svg, p, q, 0.62);
        else currentArrow(svg, q, p, 0.62);
      }
    }

    /* ---- the current in the external circuit, on the same loop ------------------------ */
    // +1: A leg up, B->C, D leg down, battery wire both sides towards the + plate
    const loop = dir > 0
      ? [[NL, [20, 106]], [[116, 18], [404, 18]], [[500, 106], NR],
        [[253, WIRE_Y], [NL[0], WIRE_Y]], [[NR[0], WIRE_Y], [267, WIRE_Y]]]
      : [[[20, 106], NL], [[404, 18], [116, 18]], [NR, [500, 106]],
        [[NL[0], WIRE_Y], [253, WIRE_Y]], [[267, WIRE_Y], [NR[0], WIRE_Y]]];
    for (const [p, q] of loop) currentArrow(svg, p, q, 0.5);
    for (const x0 of [16, 404]) {                     // inside each solenoid: A->B, C->D
      if (dir > 0) currentArrow(svg, [x0 + 26, SOL_Y - 9], [x0 + 74, SOL_Y - 9], 0.5);
      else currentArrow(svg, [x0 + 74, SOL_Y - 9], [x0 + 26, SOL_Y - 9], 0.5);
    }

    /* ---- the forces: always vertical, the reversal does not change them --------------- */
    if (live) {
      const mpq = mid(P, Q), mrs = mid(R, Sx);
      arrow(svg, mpq[0] - 12, mpq[1], mpq[0] - 12, mpq[1] - 40, C.red, 2.4, "arrRed");
      arrow(svg, mrs[0] + 12, mrs[1], mrs[0] + 12, mrs[1] + 40, C.red, 2.4, "arrRed");
    }

    /* ---- the commutator, its gaps meeting the brushes at the vertical ---------------- */
    S("circle", {
      cx: RING[0], cy: RING[1], r: RING_R, fill: "#fff", stroke: C.line, "stroke-width": 1.5,
    }, svg);
    const gap = 16 * DEG;
    for (const side of [-1, 1]) {
      const a0 = theta * DEG + (side > 0 ? gap : Math.PI) - Math.PI / 2;
      sector(svg, RING[0], RING[1], RING_R - 1, a0, a0 + Math.PI - 2 * gap,
        side > 0 ? "#b9b3a6" : "#ded8cc", "none");
    }
    for (const bx of [-1, 1]) {
      S("rect", {
        x: RING[0] + bx * (RING_R + 8) - 4, y: RING[1] - 5, width: 8, height: 10, rx: 2,
        fill: broken ? C.red : C.ink,
      }, svg);
    }

    /* ---- the battery ----------------------------------------------------------------- */
    const xLong = plusLeft ? 253 : 267, xShort = plusLeft ? 267 : 253;
    S("line", { x1: xLong, y1: WIRE_Y - 13, x2: xLong, y2: WIRE_Y + 13, stroke: C.ink, "stroke-width": 2.6 }, svg);
    S("line", { x1: xShort, y1: WIRE_Y - 6, x2: xShort, y2: WIRE_Y + 6, stroke: C.ink, "stroke-width": 2.6 }, svg);

    /* ---- the "seen from above" sketch: the sense never changes ------------------------ */
    S("ellipse", {
      cx: INS[0], cy: INS[1], rx: 30, ry: 17, fill: "none",
      stroke: C.grey, "stroke-width": 1.1, "stroke-dasharray": "5 4",
    }, svg);
    S("path", {
      d: `M${INS[0] - 30},${INS[1]} A30,17 0 1 1 ${INS[0] + 15},${INS[1] - 15}`,
      fill: "none", stroke: C.ink, "stroke-width": 1.8, "marker-end": marker(svg, "arrInk"),
    }, svg);

    /* ---- labels ---------------------------------------------------------------------- */
    const lab = (x, y, text, attrs = {}) => T(svg, x, y, text, {
      "font-size": 13, "font-weight": 700, fill: C.ink, ...attrs,
    });
    lab(10, 84, "A", { "font-size": 14 });
    lab(126, 84, "B", { "font-size": 14 });
    lab(392, 84, "C", { "font-size": 14, "text-anchor": "end" });
    lab(516, 84, "D", { "font-size": 14, "text-anchor": "end" });
    lab(114, 124, rev ? "North" : "South", { "font-size": 11, fill: C.grey, "text-anchor": "end" });
    lab(406, 124, rev ? "South" : "North", { "font-size": 11, fill: C.grey });
    lab(150, 118, "B", { fill: C.green });
    lab(A1[0] + 8, A1[1] + 2, "X", { fill: C.grey });
    lab(A2[0] - 6, A2[1] + 13, "Y", { fill: C.grey, "text-anchor": "end" });
    lab(P[0] - 11 * flip, P[1] + 13, "P", { "text-anchor": flip > 0 ? "end" : "start" });
    lab(Q[0] - 9 * flip, Q[1] - 7, "Q", { "text-anchor": flip > 0 ? "end" : "start" });
    lab(R[0] + 9 * flip, R[1] - 5, "R", { "text-anchor": flip > 0 ? "start" : "end" });
    lab(Sx[0] + 11 * flip, Sx[1] + 13, "S", { "text-anchor": flip > 0 ? "start" : "end" });
    lab(plusLeft ? 247 : 273, WIRE_Y - 6, "+", { "font-size": 12, "text-anchor": "middle" });
    lab(plusLeft ? 273 : 247, WIRE_Y - 6, "−", { "font-size": 12, "text-anchor": "middle" });
    lab(298, WIRE_Y - 6, "E", { "font-size": 12 });
    lab(260, RING[1] + 31, broken ? "換向器與碳刷斷開 → 無電流" : "換向器接觸中",
      { "font-size": 12, "text-anchor": "middle", fill: broken ? C.red : C.green });
    lab(INS[0], INS[1] + 34, "由上望：順時針", { "font-size": 11, "text-anchor": "middle" });

    /* ---- reading --------------------------------------------------------------------- */
    out.set(
      live
        ? "\\text{PQ}:\\ F\\uparrow,\\quad \\text{RS}:\\ F\\downarrow \\Rightarrow \\text{clockwise from above}"
        : "\\text{vertical position}:\\ I = 0 \\Rightarrow F = 0",
      live ? true : null,
      `θ = ${fmt(theta, 0)}°：B ${rev ? "北" : "南"}極、C ${rev ? "南" : "北"}極；`
        + (live
          ? `（b）PQ 受力向上、RS 向下 → 由上望順時針。（d）${rev ? "已反接電池：電流與磁場同時反轉，轉向不變，仍順時針。" : "反接電池 E，電流與磁場會同時反轉，轉向不變。"}`
          : "（c）線圈在垂直位置，換向器與碳刷斷開 → 沒有電流，所以連 QR 在內每一邊都沒有力。"),
      { yes: "clockwise" },
    );
  }

  const tSlider = slider({
    label: "線圈角度 θ", min: 0, max: 360, step: 1, value: theta, fmt: (v) => `${v}°`, play: false,
  });
  tSlider.on((v) => { theta = v; again(); });
  root.append(
    svg,
    // PQ and RS run along the axis, so their current leaves and re-enters the paper: the
    // sentence stops a student reading a plane right-hand rule off the 3D sketch.
    H("p", {
      style: "margin:0 0 8px;font-size:12px;line-height:1.4;color:#5f6c72",
    }, ["PQ、RS 的電流沿軸線出入紙面（3D 圖慣例）"]),
    tSlider.el,
    buttonRow([["reverse battery E", () => { rev = !rev; again(); }]]),
    out.el,
  );
  again();
}

/* ------------------------------------------------------------------ *
 * q19 — the torque on a coil: the end view, the couple, and b sin phi. *
 * ------------------------------------------------------------------ */

function q19Graphic(root) {
  root.append(question(
    "端視圖：φ 由線圈法線量到 B，力臂就是 b sin φ。",
  ));

  const svg = scene(520, 204);
  const out = readout();

  const SIDE = 0.025;                    // 2.5 cm: b (between the sides) and l (along each side)
  const AREA = SIDE * SIDE;              // 6.25e-4 m^2
  const HALF = 40;                       // b/2 in px
  const C0 = [250, 96];                  // the coil centre, seen end-on
  const ARM_Y = 182;                     // the b sin φ dimension
  const MAXF = 34;                       // longest force arrow, px

  let N = 2400, B = 1.05, I = 0.8, phi = 30;

  /** Two kit sliders per row: shorter label, range and readout so nothing wraps onto a second line. */
  const compact = (sl) => {
    sl.el.style.margin = "2px 0";
    const lab = sl.el.querySelector(".g-lab");
    if (lab) { lab.style.minWidth = "0"; lab.style.flex = "0 0 auto"; lab.style.fontSize = "11.5px"; }
    const range = sl.el.querySelector('input[type="range"]');
    if (range) range.style.minWidth = "70px";
    const val = sl.el.querySelector("output");
    if (val) val.style.minWidth = "38px";
    return sl.el;
  };

  function again() {
    clear(svg);
    const f = phi * DEG;
    // plane unit vector, from the ⊙ side to the ⊗ side; normal is 90 deg from it, measured from B
    const dx = Math.sin(f), dy = Math.cos(f);
    const nx = Math.cos(f), ny = -Math.sin(f);
    const cOut = [C0[0] - HALF * dx, C0[1] - HALF * dy];   // current out of the paper: F up
    const cIn = [C0[0] + HALF * dx, C0[1] + HALF * dy];    // current into the paper: F down

    const Fside = N * B * I * SIDE;                        // force on one side, N
    const tau = N * B * AREA * I * Math.sin(f);            // signed; + is clockwise in this view
    const armPx = Math.abs(cIn[0] - cOut[0]);              // = b sin phi, in px
    const lf = Math.max(0, Math.min(MAXF, Fside * 0.92));  // arrow length follows the force

    /* --- the field, left to right, behind everything ---------------------------------- */
    for (const y of [20, C0[1], 176]) {
      S("line", { x1: 24, y1: y, x2: 480, y2: y, stroke: C.blue, "stroke-width": 1.5 }, svg);
      arrow(svg, 480, y, 496, y, C.blue, 1.5, "arrInk");
    }
    T(svg, 502, 15, "B", { "font-size": 13, "font-weight": 700, fill: C.blue });
    T(svg, 6, 15, `每邊 F = NBIl = ${fmt(Fside, 1)} N`, { "font-size": 11, "font-weight": 700, fill: C.green });

    /* --- the coil, edge-on: a line through the two sides ------------------------------ */
    const k = 1.22;
    S("line", {
      x1: C0[0] - k * HALF * dx, y1: C0[1] - k * HALF * dy,
      x2: C0[0] + k * HALF * dx, y2: C0[1] + k * HALF * dy,
      stroke: C.line, "stroke-width": 2.2,
    }, svg);
    for (const [c, out2] of [[cOut, true], [cIn, false]]) {
      S("circle", { cx: c[0], cy: c[1], r: 10, fill: "#fff6e4", stroke: C.amber, "stroke-width": 2.2 }, svg);
      if (out2) {
        S("circle", { cx: c[0], cy: c[1], r: 3.2, fill: C.amber }, svg);
      } else {
        S("line", { x1: c[0] - 5, y1: c[1] - 5, x2: c[0] + 5, y2: c[1] + 5, stroke: C.amber, "stroke-width": 2.1 }, svg);
        S("line", { x1: c[0] - 5, y1: c[1] + 5, x2: c[0] + 5, y2: c[1] - 5, stroke: C.amber, "stroke-width": 2.1 }, svg);
      }
    }

    /* --- the couple: F up on the ⊙ side, F down on the ⊗ side ------------------------- */
    // The size is named once, in the legend at the top left: a label on each arrow collides
    // with the field lines and with the arm dimension when the coil stands vertical.
    if (lf > 5) {
      arrow(svg, cOut[0], cOut[1], cOut[0], cOut[1] - lf, C.green, 2.6, "arrGreen");
      arrow(svg, cIn[0], cIn[1], cIn[0], cIn[1] + lf, C.green, 2.6, "arrGreen");
    }

    /* --- the normal and the angle phi, measured from B -------------------------------- */
    const NL = 56;
    const nTip = [C0[0] + NL * nx, C0[1] + NL * ny];
    S("line", { x1: C0[0], y1: C0[1], x2: nTip[0], y2: nTip[1], stroke: C.grey, "stroke-width": 1.6, "stroke-dasharray": "7 5" }, svg);
    T(svg, nTip[0] + 4, nTip[1] - 6, "normal 法線", { "font-size": 11, fill: C.grey });

    if (phi > 0.5) {
      const rA = 28;
      const big = phi > 180 ? 1 : 0;
      S("path", {
        d: `M${C0[0] + rA},${C0[1]} A${rA},${rA} 0 ${big} 0 ${C0[0] + rA * nx},${C0[1] + rA * ny}`,
        fill: "none", stroke: C.grey, "stroke-width": 1.4,
      }, svg);
      const mid = -phi / 2 * DEG;
      T(svg, C0[0] + (rA + 13) * Math.cos(mid), C0[1] + (rA + 13) * Math.sin(mid) + 4, `φ = ${fmt(phi, 0)}°`,
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.ink });
    }

    /* --- the arm: the perpendicular distance between the two forces ------------------- */
    if (armPx > 5) {
      const x1 = Math.min(cOut[0], cIn[0]), x2 = Math.max(cOut[0], cIn[0]);
      S("line", {
        x1, y1: ARM_Y, x2, y2: ARM_Y, stroke: C.ink, "stroke-width": 1.5,
        "marker-start": marker(svg, "arrInk"), "marker-end": marker(svg, "arrInk"),
      }, svg);
      for (const x of [x1, x2]) {
        S("line", { x1: x, y1: ARM_Y - 5, x2: x, y2: ARM_Y + 5, stroke: C.ink, "stroke-width": 1.5 }, svg);
      }
      T(svg, (x1 + x2) / 2, ARM_Y + 13, `b sin φ = ${fmt(Math.abs(armPx) / (HALF * 2) * SIDE * 100, 2)} cm`,
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.ink });
    } else {
      T(svg, C0[0], ARM_Y + 13, "b sin φ = 0（力臂為零）",
        { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.ink });
    }

    /* --- the turning sense: flips as soon as tau goes negative ------------------------ */
    if (Math.abs(tau) > 1e-6) {
      const cw = tau > 0;
      const rT = 13;
      const a0 = cw ? -150 * DEG : -30 * DEG;
      const a1 = cw ? 30 * DEG : 150 * DEG;
      const p0 = [C0[0] + rT * Math.cos(a0), C0[1] + rT * Math.sin(a0)];
      const p1 = [C0[0] + rT * Math.cos(a1), C0[1] + rT * Math.sin(a1)];
      S("path", {
        d: `M${p0[0]},${p0[1]} A${rT},${rT} 0 1 ${cw ? 1 : 0} ${p1[0]},${p1[1]}`,
        fill: "none", stroke: C.ink, "stroke-width": 2, "marker-end": marker(svg, "arrInk"),
      }, svg);
    }

    /* --- reading ---------------------------------------------------------------------- */
    const sense = Math.abs(tau) < 1e-9
      ? "力矩 = 0（法線與 B 平行，力臂為 0）"
      : tau > 0 ? "由此望：順時針" : "由此望：逆時針（過 90° 後力偶反了）";
    out.set(
      `\\tau=NBAI\\sin\\phi=${fmt(N, 0)}\\times${fmt(B, 2)}\\times6.25\\times10^{-4}\\times${fmt(I, 2)}`
      + `\\times\\sin ${fmt(phi, 0)}^\\circ=${fmt(tau, 3)}\\ \\mathrm{N\\,m}`,
      null,
      `φ = ${fmt(phi, 0)}°；b sin φ = ${fmt(SIDE * Math.abs(Math.sin(f)) * 100, 2)} cm；每邊 F = NBIl = ${fmt(Fside, 1)} N；${sense}。`
      + `　解答位：(a) 順時針；(b)(i) F = τ ÷ b = 1.26 ÷ 0.025 = 50.4 N；(b)(ii) B = τ ÷ (NIA) = 1.05 T。`,
    );
  }

  const nS = slider({ label: "N（匝）", min: 0, max: 3000, step: 50, value: N, fmt: (v) => `${fmt(v, 0)}`, play: false });
  const bS = slider({ label: "B（T）", min: 0, max: 2, step: 0.05, value: B, fmt: (v) => `${fmt(v, 2)} T`, play: false });
  const iS = slider({ label: "電流 I（A）", min: 0, max: 2, step: 0.05, value: I, fmt: (v) => `${fmt(v, 2)} A`, play: false });
  const pS = slider({ label: "φ（°）", min: 0, max: 360, step: 1, value: phi, fmt: (v) => `${fmt(v, 0)}°`, play: false });
  nS.on((v) => { N = v; again(); });
  bS.on((v) => { B = v; again(); });
  iS.on((v) => { I = v; again(); });
  pS.on((v) => { phi = v; again(); });

  root.append(
    svg,
    H("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:0 10px" }, [compact(nS), compact(bS), compact(iS), compact(pS)]),
    buttonRow([["q19：N = 2400、A = 6.25×10⁻⁴、I = 0.8、φ = 90° → B = 1.05 T", () => {
      nS.set(2400); bS.set(1.05); iS.set(0.8); pS.set(90);
    }]]),
    out.el,
  );
  again();
}

/* ------------------------------------------------------------------ *
 * q4 — twelve printed cases, one resultant each.                      *
 * ------------------------------------------------------------------ */

/**
 * The twelve cases of q4, measured on pages/p02.jpg (1 pt = 3 px, page
 * 595.33 x 842 pt).  There is no background field in this question: all 21
 * printed ⊙ / ⊗ symbols are wire cross-sections (the wires run perpendicular
 * to the paper), 14.5 pt across, and in (g)-(i) the two wires lie in the paper
 * as long bars.  Two parallel currents of the same sense attract and of
 * opposite sense repel, the force along the line joining them and falling off
 * as I1 I2 / r; so every resultant below is the vector sum of 1/r terms.
 * `dir` = +1 for a current out of the paper (⊙) and −1 for one into it (⊗);
 * for the bars +1 is a printed arrow head pointing right.
 * The letter P is placed by its own bbox centre, never by the layout: it is
 * the symbol whose centre is nearest it ((b) is the trap — P is the left ⊗,
 * not the ⊙ on the right).  The measured centres are quoted below.
 */
const Q4_CASES = {
  a: { kind: "rods", p: { x: 181.1, y: 340.5, dir: 1 }, wires: [{ x: 107.0, y: 340.6, dir: -1 }], plab: "above" },
  b: { kind: "rods", p: { x: 265.6, y: 340.1, dir: -1 }, wires: [{ x: 344.8, y: 340.1, dir: 1 }], plab: "above" },
  c: { kind: "rods", p: { x: 507.5, y: 343.2, dir: -1 }, wires: [{ x: 426.2, y: 341.8, dir: -1 }], plab: "above" },
  d: { kind: "rods", p: { x: 111.4, y: 414.9, dir: -1 }, wires: [{ x: 180.7, y: 415.3, dir: -1 }], plab: "above" },
  e: { kind: "rods", p: { x: 345.2, y: 418.5, dir: 1 }, wires: [{ x: 270.2, y: 417.5, dir: 1 }], plab: "above" },
  f: { kind: "rods", p: { x: 427.3, y: 418.1, dir: 1 }, wires: [{ x: 505.0, y: 418.0, dir: 1 }], plab: "above" },
  g: { kind: "bars", x0: 94.7, x1: 200.0, p: { y: 470.1, dir: 1 }, wires: [{ y: 509.6, dir: 1 }], plab: "above", plabdx: 11.3 },
  h: { kind: "bars", x0: 251.7, x1: 357.0, p: { y: 470.1, dir: 1 }, wires: [{ y: 508.6, dir: -1 }], plab: "above", plabdx: 16.6 },
  i: { kind: "bars", x0: 407.7, x1: 513.0, p: { y: 470.6, dir: -1 }, wires: [{ y: 509.1, dir: 1 }], plab: "above", plabdx: 17.0 },
  j: { kind: "rods", p: { x: 145.5, y: 543.8, dir: 1 }, wires: [{ x: 107.4, y: 598.2, dir: -1 }, { x: 180.3, y: 599.0, dir: 1 }], plab: "below" },
  k: { kind: "rods", p: { x: 312.8, y: 600.5, dir: -1 }, wires: [{ x: 275.2, y: 545.8, dir: -1 }, { x: 348.2, y: 545.9, dir: 1 }], plab: "above" },
  l: { kind: "rods", p: { x: 503.3, y: 545.6, dir: 1 }, wires: [{ x: 427.8, y: 544.0, dir: 1 }, { x: 504.1, y: 600.8, dir: -1 }], plab: "right" },
};

/** The eight compass words of the key, clockwise from "right" (page y points down). */
const Q4_WORDS = ["right", "down-right", "downwards", "down-left", "left", "up-left", "upwards", "up-right"];
const Q4_CN = ["向右", "向右下", "向下", "向左下", "向左", "向左上", "向上", "向右上"];

/**
 * Force on P from every other wire.  Same-sense currents attract (the force on
 * P points towards the other wire), opposite currents repel (away from it), and
 * both scale as I1 I2 / r — the currents are all equal here, so 1 / r.
 */
function q4Solve(kase) {
  const mid = kase.kind === "bars" ? (kase.x0 + kase.x1) / 2 : 0;
  const p = kase.kind === "bars"
    ? { x: mid, y: kase.p.y, dir: kase.p.dir }
    : kase.p;
  const terms = kase.wires.map((w) => {
    const wx = kase.kind === "bars" ? mid : w.x;
    const dx = p.x - wx;
    const dy = p.y - w.y;
    const r = Math.hypot(dx, dy);
    const same = w.dir === p.dir;
    const s = same ? -1 : 1;            // -1: towards the other wire, +1: away from it
    return { r, same, ux: (s * dx) / r, uy: (s * dy) / r, mag: 1 / r };
  });
  const sx = terms.reduce((a, t) => a + t.ux * t.mag, 0);
  const sy = terms.reduce((a, t) => a + t.uy * t.mag, 0);
  const deg = ((Math.atan2(sy, sx) * 180) / Math.PI + 360) % 360;
  return { p, terms, sx, sy, deg, i: Math.round(deg / 45) % 8 };
}

/** A vector arrow with a filled head of a fixed size, so the length carries the magnitude. */
function q4Arrow(svg, x1, y1, x2, y2, colour, width, head = 8.5) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const bx = x2 - head * Math.cos(a);
  const by = y2 - head * Math.sin(a);
  const w = head * 0.58;
  S("line", { x1, y1, x2: bx, y2: by, stroke: colour, "stroke-width": width, "stroke-linecap": "round" }, svg);
  S("path", {
    d: `M${x2},${y2} L${bx + w * Math.sin(a)},${by - w * Math.cos(a)} L${bx - w * Math.sin(a)},${by + w * Math.cos(a)} Z`,
    fill: colour,
  }, svg);
}

function q4Graphic(root) {
  root.append(question(
    "揀一個印刷個案（a–l）：導線 P 所受的合力指向哪一邊？",
    [
      "⊙ = 電流流出紙面、⊗ = 電流流入紙面；同向相吸、反向相斥，大小 ∝ I₁I₂ ÷ r",
      "旁邊有兩條導線的個案（j、k、l），合力是兩項貢獻的向量和",
    ],
  ));

  const svg = scene(470, 205);
  const out = readout();
  const K = 2.2;                       // px per printed pt, the same in every case
  const ARROW = 58;                    // longest force arrow, px (the strongest contributor)
  const TERM_COLOUR = [C.amber, C.pink];
  let cur = "a";
  let split = false;

  function again() {
    clear(svg);
    const kase = Q4_CASES[cur];
    const m = q4Solve(kase);
    const mag = Math.hypot(m.sx, m.sy);
    const top = Math.max(...m.terms.map((t) => t.mag));
    const cn = Q4_CN[m.i];

    /* --- the printed layout: same scale for all twelve, only panned --------------- */
    const bb = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    const put = (x, y) => {
      bb.x0 = Math.min(bb.x0, x); bb.y0 = Math.min(bb.y0, y);
      bb.x1 = Math.max(bb.x1, x); bb.y1 = Math.max(bb.y1, y);
    };
    const pPt = m.p;
    const labPt = (() => {
      const x = kase.kind === "bars" ? kase.x0 + (kase.plabdx ?? 16) : pPt.x;
      if (kase.plab === "below") return [x, pPt.y + 17];
      if (kase.plab === "right") return [x + 16, pPt.y + 5];
      return [x, pPt.y - 17];
    })();
    if (kase.kind === "bars") {
      for (const y of [kase.p.y, ...kase.wires.map((w) => w.y)]) {
        put(kase.x0 - 2, y - 5.4); put(kase.x1 + 12, y + 5.4);
      }
      put(labPt[0] - 5, labPt[1] - 8); put(labPt[0] + 5, labPt[1] + 4);
    } else {
      for (const w of [kase.p, ...kase.wires]) { put(w.x - 7.5, w.y - 7.5); put(w.x + 7.5, w.y + 7.5); }
      put(labPt[0] - 5, labPt[1] - 8); put(labPt[0] + 5, labPt[1] + 4);
    }
    for (const t of m.terms) put(pPt.x + t.ux * 26, pPt.y + t.uy * 26);
    put(pPt.x + (m.sx / mag) * 26, pPt.y + (m.sy / mag) * 26);
    bb.x0 -= 3; bb.y0 -= 3; bb.x1 += 3; bb.y1 += 3;
    const ox = (470 - (bb.x1 - bb.x0) * K) / 2 - bb.x0 * K;
    const oy = (205 - (bb.y1 - bb.y0) * K) / 2 - bb.y0 * K;
    const X = (x) => ox + x * K;
    const Y = (y) => oy + y * K;

    /* --- the wires ----------------------------------------------------------------- */
    const rod = (w, isP) => {
      const cx = X(w.x), cy = Y(w.y), r = 7 * K;
      const col = isP ? C.ink : C.line;
      S("circle", { cx, cy, r, fill: "#fbf8f2", stroke: col, "stroke-width": isP ? 3 : 2.3 }, svg);
      if (w.dir > 0) {
        S("circle", { cx, cy, r: r * 0.26, fill: col }, svg);
      } else {
        const d = r * 0.6;
        S("line", { x1: cx - d, y1: cy - d, x2: cx + d, y2: cy + d, stroke: col, "stroke-width": 2.2 }, svg);
        S("line", { x1: cx - d, y1: cy + d, x2: cx + d, y2: cy - d, stroke: col, "stroke-width": 2.2 }, svg);
      }
    };
    const bar = (w, isP) => {
      const y = Y(w.y), h = 10.7 * K;
      const x0 = X(kase.x0), x1 = X(kase.x1);
      const col = isP ? C.ink : C.line;
      S("rect", {
        x: x0, y: y - h / 2, width: x1 - x0, height: h, fill: "#fbf8f2",
        stroke: col, "stroke-width": isP ? 2.8 : 2.2,
      }, svg);
      S("line", { x1: x0 - 4 * K, y1: y, x2: x1 + 4 * K, y2: y, stroke: col, "stroke-width": 1.5 }, svg);
      // the printed arrow head sits on the wire's axis, in the middle of the bar
      const mx = (x0 + x1) / 2, s = w.dir, hl = 8.5;
      S("path", {
        d: `M${mx - s * hl},${y - hl * 0.9} L${mx + s * hl},${y} L${mx - s * hl},${y + hl * 0.9}`,
        fill: "none", stroke: col, "stroke-width": 2.5, "stroke-linecap": "round", "stroke-linejoin": "round",
      }, svg);
      T(svg, x1 + 13, y + 5, "I", { "font-size": 13, "font-style": "italic", fill: C.line });
    };

    if (kase.kind === "bars") {
      for (const w of kase.wires) bar(w, false);
      bar(kase.p, true);
    } else {
      for (const w of kase.wires) rod(w, false);
      rod(kase.p, true);
    }

    /* --- the force: one arrow per contribution, then the resultant ---------------- */
    const px = X(pPt.x), py = Y(pPt.y);
    const many = m.terms.length > 1;                 // one term is the resultant itself
    if (split && many) {
      m.terms.forEach((t, i) => {
        const len = ARROW * (t.mag / top);
        q4Arrow(svg, px, py, px + t.ux * len, py + t.uy * len, TERM_COLOUR[i % 2], 2.6, 7.5);
        const nx = -t.uy, ny = t.ux;                     // perpendicular, for the number
        T(svg, px + t.ux * len * 0.55 + nx * 11, py + t.uy * len * 0.55 + ny * 11 + 4,
          "①②"[i], { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: TERM_COLOUR[i % 2] });
      });
    }
    const rl = ARROW * (mag / top);
    q4Arrow(svg, px, py, px + (m.sx / mag) * rl, py + (m.sy / mag) * rl, C.red, split && many ? 2.8 : 3.4);

    T(svg, X(labPt[0]), Y(labPt[1]), "P",
      { "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: C.ink });

    /* --- reading ------------------------------------------------------------------- */
    const line = m.terms.map((t, i) =>
      `${many ? "①②"[i] + " " : ""}距 ${fmt(t.r, 1)} pt、${t.same ? "同向 → 相吸" : "反向 → 相斥"}`).join("；");
    let note = "";
    if (m.terms.length > 1) {
      if (Math.abs(m.sy) < 0.12 * Math.abs(m.sx)) note = "，兩項的縱向分量幾乎互相抵消";
      else if (Math.abs(m.sx) < 0.12 * Math.abs(m.sy)) note = "，兩項的橫向分量幾乎互相抵消";
    }
    const cap = many
      ? `兩項貢獻：${line}。合成後合力${cn}${note}。`
      : `只有一條其他導線：${line}，所以 P 被${cn}推。`;
    out.set(
      many
        ? "\\vec F_P=\\dfrac{\\mu_0I^2}{2\\pi}\\left(\\dfrac{\\hat r_1}{r_1}+\\dfrac{\\hat r_2}{r_2}\\right)"
        : "F_P=\\dfrac{\\mu_0I^2}{2\\pi r}",
      true, cap, { yes: Q4_WORDS[m.i] },
    );
  }

  const row = H("div", { class: "g-strip", style: "grid-template-columns:repeat(12,1fr);gap:5px;margin:8px 0 4px" });
  Object.keys(Q4_CASES).forEach((id) => {
    const b = H("button", {
      type: "button",
      class: `g-cell${id === cur ? " on" : ""}`,
      style: "min-height:38px;padding:2px;font-size:13px;font-weight:700",
    }, [id]);
    b.addEventListener("click", () => {
      cur = id;
      [...row.children].forEach((c) => c.classList.toggle("on", c === b));
      again();
    });
    row.append(b);
  });

  root.append(
    svg,
    row,
    tabs(["合力", "逐項分解"], (i) => { split = i === 1; again(); }),
    out.el,
  );
  again();
}

/* ------------------------------------------------------------------ *
 * What each question opens.                                          *
 * ------------------------------------------------------------------ */

const REGISTRY = {
  q3: q3Graphic,
  q4: q4Graphic,
  q11: q11Graphic,
  q18: q18Graphic,
  q19: q19Graphic,
};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
