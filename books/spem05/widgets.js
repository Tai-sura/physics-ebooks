/**
 * Interactive graphics for spem05 (magnetic force on current-carrying wires).
 *
 * q3  p02: the printed electron enters the dashed field region from below (v up) and
 *          is pushed to the right, so its track bulges left and leaves at the top
 *          right; a positive particle P entering from the left is pushed to the top
 *          (key: A). B is into the paper, so v up gives F = qv x B rightward for an
 *          electron, and v right gives F upward for P.
 * q11 p05: copper rod XY on smooth rails at 30 deg to the horizontal, 20 cm apart,
 *          B = 100 mT vertically up, rod stationary. End view with N, mg and BIL, and
 *          a slider on I; the key's answer is I = mg tan30 / (BL) = 9.91 A.
 * q18 p11: AB (left) and CD (right) solenoids, coil PQRS turning about the axis XY,
 *          commutator and brushes, battery E. Plan of the answers: B South, C North;
 *          PQ up and RS down, clockwise seen from Y (the commutator end); no force at the vertical because
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
    ["B into paper（⊗）", "F = qv×B：同一個 B，v 的方向決定 F；正負電荷受力相反"],
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
    const y0 = 150;                                        // P enters here, from the left
    const yEnd = 92;                                       // ... and leaves at the top
    const cx = boxL + 150;

    // The path, as a quadratic, sampled so the field symbols can keep clear of it.
    const quad = (t) => [
      (1 - t) ** 2 * boxL + 2 * t * (1 - t) * cx + t * t * boxR,
      (1 - t) ** 2 * y0 + 2 * t * (1 - t) * y0 + t * t * yEnd,
    ];
    // The printed electron enters from below (374) and leaves at the top right (452, 36):
    // its track bulges left, so the force on it is to the right.
    const eQuad = (t) => [
      (1 - t) ** 2 * 374 + 2 * t * (1 - t) * 374 + t * t * 452,
      (1 - t) ** 2 * 270 + 2 * t * (1 - t) * 110 + t * t * 36,
    ];
    const track = Array.from({ length: 41 }, (_, i) => (positive ? quad(i / 40) : eQuad(i / 40)));
    const px = positive ? boxL + 22 : 374;
    const py = positive ? y0 : 270;
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

    if (positive) {
      // in from the left, pushed up: the key's answer A
      S("path", {
        d: `M30,${y0} L${boxL},${y0} Q${cx},${y0} ${boxR - 30},${yEnd}`,
        fill: "none", stroke: C.ink, "stroke-width": 2.2,
      }, svg);
      arrow(svg, boxR - 42, yEnd + 12, boxR - 14, yEnd + 24, C.ink, 2.2, "arrInk");
    } else {
      // the printed track: up from below, bending right, out at the top right
      S("path", {
        d: "M374,270 Q374,110 452,36",
        fill: "none", stroke: C.ink, "stroke-width": 2.2, "marker-end": marker(svg, "arrInk"),
      }, svg);
    }

    S("circle", { cx: px, cy: py, r: 11, fill: "#fff", stroke: C.ink, "stroke-width": 2 }, svg);
    T(svg, px, py + 5, positive ? "+" : "−", { "text-anchor": "middle", "font-size": 17, "font-weight": 700, fill: C.ink });
    if (positive) {
      T(svg, px - 13, py - 15, "P", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });
    } else {
      T(svg, px - 16, py + 5, "e⁻", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });
      T(svg, px + 12, py + 22, "electron", { "font-size": 12, fill: C.ink });
    }

    if (positive) {
      // v along the printed entry, then F up
      arrow(svg, px + 14, py, px + 66, py, C.ink, 2.2, "arrInk");
      T(svg, px + 40, py + 20, "v", { "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: C.ink });
      arrow(svg, px, py, px, py - 58, C.red, 2.6, "arrRed");
      T(svg, px + 10, py - 25, "F", { "font-size": 14, "font-weight": 700, fill: C.red });
      T(svg, boxR - 6, 40, "deflected to the top (A)",
        { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.green });
    } else {
      // v straight up (the printed entry), F to the right — v blue so it reads off the track
      arrow(svg, px, py, px, py - 56, C.blue, 2.4, "arrInk");
      T(svg, px - 8, py - 34, "v", { "text-anchor": "end", "font-size": 14, "font-weight": 700, fill: C.blue });
      arrow(svg, px, py, px + 58, py, C.red, 2.6, "arrRed");
      T(svg, px + 26, py - 8, "F", { "font-size": 14, "font-weight": 700, fill: C.red });
      T(svg, 466, 26, "deflected to the right",
        { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.red });
    }

    if (positive) {
      out.set(
        "q=+e:\\ F=qv\\times B\\ \\text{upward}\\ \\Rightarrow\\ \\text{to the top (A)}",
        true,
        "B 入紙：P 由左入、v 向右 → F 向上（A）；電子由下入、v 向上 → F 向右。",
        { yes: "answer A" },
      );
    } else {
      out.set(
        "q=-e:\\ F=qv\\times B\\ \\text{to the right}",
        null,
        "印刷的個案：電子由下方入（v 向上），B 入紙 → F = qv×B 指向右，軌跡向右彎。",
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
  const ROD_R = 17;
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

    // the rod, resting on the surface: seen end-on, so the current runs into the paper
    // from the near end Y to the far end X — that sense is what puts BIL to the right.
    S("circle", { cx: rodC[0], cy: rodC[1], r: ROD_R, fill: "#dfe3ea", stroke: C.line, "stroke-width": 2 }, svg);
    fieldMark(svg, rodC[0], rodC[1], 8, true, C.ink);
    T(svg, rodC[0] - ROD_R - 6, rodC[1] - 3, "X（遠端）", { "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.ink });
    T(svg, rodC[0] - ROD_R - 6, rodC[1] + 13, "Y（近端）", { "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.ink });

    // N (normal to the surface), mg (down), BIL (horizontal).  The three tails leave the
    // middle of the rod but start outside the ⊗ glyph, so the current symbol stays readable.
    const R0 = 12;
    const nx = -Math.sin(30 * DEG), ny = -Math.cos(30 * DEG);
    arrow(svg, rodC[0] + nx * R0, rodC[1] + ny * R0, rodC[0] + nx * nForce * PXN, rodC[1] + ny * nForce * PXN, C.blue, 2.6, "arrInk");
    T(svg, rodC[0] + nx * nForce * PXN - 8, rodC[1] + ny * nForce * PXN - 6, "N",
      { "text-anchor": "end", "font-size": 14, "font-weight": 700, fill: C.blue });
    arrow(svg, rodC[0], rodC[1] + R0, rodC[0], rodC[1] + MG * PXN, C.red, 2.6, "arrRed");
    T(svg, rodC[0] - 8, rodC[1] + MG * PXN, "mg", { "text-anchor": "end", "font-size": 14, "font-weight": 700, fill: C.red });
    arrow(svg, rodC[0] + R0, rodC[1], rodC[0] + bil * PXN, rodC[1], C.amber, 2.6, "arrAmber");
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
      ? "(b) 電流入紙（Y→X），BIL 才向右（觀察者在圖右側望）；(a) N、mg、BIL 三力平衡。"
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
    // The commutator swaps the coil's current each time the coil passes the vertical
    // (θ = 90° and 270°). That reversal is what keeps the couple turning one way: the side
    // that has crossed to the other side of the axis then carries the current the other way,
    // so its force turns round with it. `coilDir` is the coil current; `dir` stays the
    // external circuit and the solenoids.
    const u360 = ((theta % 360) + 360) % 360;
    const coilDir = ((u360 - 90 + 360) % 360) < 180 ? -dir : dir;

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

    /* ---- the coil current (P -> Q -> R -> S, swapped by the commutator) --------------- */
    if (live) {
      for (const [p, q] of [[P, Q], [Q, R], [R, Sx], [Sx, P]]) {
        if (coilDir > 0) currentArrow(svg, p, q, 0.62);
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

    /* ---- the forces: vertical, and the commutator keeps the couple turning one way ---- */
    // The forces follow the coil current. Drawing them fixed (PQ always up) made the couple
    // reverse once the coil passed the vertical, against the printed "clockwise" answer, so
    // PQ's arrow now turns with the current the commutator has just reversed.
    let pqUp = true;
    if (live) {
      const mpq = mid(P, Q), mrs = mid(R, Sx);
      // Reversing the battery reverses the coil current and the field together, so the
      // forces must not turn round: compare the coil current with the battery's own sign
      // instead of taking coilDir alone, which flipped the arrows on "reverse battery E".
      pqUp = coilDir === dir;
      const dy = pqUp ? -40 : 40;
      const ox = (m) => (m[0] < O[0] ? -12 : 12);
      arrow(svg, mpq[0] + ox(mpq), mpq[1], mpq[0] + ox(mpq), mpq[1] + dy, C.red, 2.4, "arrRed");
      arrow(svg, mrs[0] + ox(mrs), mrs[1], mrs[0] + ox(mrs), mrs[1] - dy, C.red, 2.4, "arrRed");
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
    // The rotation about the axis XY reads opposite from its two ends, so name the end.
    lab(INS[0], INS[1] + 32, "由 Y（換向器端）望：順時針", { "font-size": 11, "text-anchor": "middle" });
    lab(INS[0], INS[1] + 45, "由 X 望：逆時針", { "font-size": 11, "text-anchor": "middle", fill: C.grey });

    /* ---- reading --------------------------------------------------------------------- */
    out.set(
      live
        ? (pqUp
          ? "\\text{PQ}:\\ F\\uparrow,\\quad \\text{RS}:\\ F\\downarrow \\Rightarrow \\text{clockwise (seen from Y)}"
          : "\\text{PQ}:\\ F\\downarrow,\\quad \\text{RS}:\\ F\\uparrow \\Rightarrow \\text{clockwise (seen from Y)}")
        : "\\text{vertical position}:\\ I = 0 \\Rightarrow F = 0",
      live ? true : null,
      `θ = ${fmt(theta, 0)}°：B ${rev ? "北" : "南"}極、C ${rev ? "南" : "北"}極；`
        + (live
          ? `（b）PQ 受力${pqUp ? "向上" : "向下"}、RS ${pqUp ? "向下" : "向上"} → 由 Y（換向器端）望是順時針（換向器已把線圈電流反接，所以過垂直位後 PQ 的受力跟着反）。`
            + `（d）${rev ? "已反接電池：電流與磁場同時反轉，轉向不變，仍順時針。" : "反接電池 E，電流與磁場會同時反轉，轉向不變。"}`
          : "（c）線圈在垂直位置，換向器與碳刷斷開 → 沒有電流，所以連 QR 在內每一邊都沒有力；線圈靠慣性越過垂直位，之後電流反向再加速轉下去。"),
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

  // The printed case is the instant of maximum torque (τ = 1.26 N m, B = 1.05 T), so the
  // panel opens at that instant: phi = 90 deg.  30 deg showed 0.63 against a 1.26 maximum.
  let N = 2400, B = 1.05, I = 0.8, phi = 90;

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
    // tau = NBAI sin(phi): positive over 0..180 deg, zero at 0 and 180, negative past 180.
    const sense = Math.abs(tau) < 1e-9
      ? "力矩 = 0"
      : tau > 0 ? "由此望：順時針" : "由此望：逆時針";
    out.set(
      `\\tau=NBAI\\sin\\phi=${fmt(N, 0)}\\times${fmt(B, 2)}\\times6.25\\times10^{-4}\\times${fmt(I, 2)}`
      + `\\times\\sin ${fmt(phi, 0)}^\\circ=${fmt(tau, 3)}\\ \\mathrm{N\\,m}`,
      null,
      `φ = ${fmt(phi, 0)}°；b sin φ = ${fmt(SIDE * Math.abs(Math.sin(f)) * 100, 2)} cm；每邊 F = NBIl = ${fmt(Fside, 1)} N；${sense}。`
      + `　φ = 0°／180° 時法線與 B 平行或反平行，力臂為 0、力矩為零；φ 過 180°（法線越過 B）後力偶反向。`
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
    // The distances are read off the printed page, not physical lengths: they only rank
    // the contributions, so say so rather than dressing them up as measurements.
    const line = m.terms.map((t, i) =>
      `${many ? "①②"[i] + " " : ""}圖上距離 ${fmt(t.r, 1)} pt（示意，只比較相對大小）、${t.same ? "同向 → 相吸" : "反向 → 相斥"}`).join("；");
    let note = "";
    if (m.terms.length > 1) {
      if (Math.abs(m.sy) < 0.12 * Math.abs(m.sx)) note = "，兩項的縱向分量幾乎互相抵消";
      else if (Math.abs(m.sx) < 0.12 * Math.abs(m.sy)) note = "，兩項的橫向分量幾乎互相抵消";
    }
    const cap = many
      ? `兩項貢獻：${line}。按圖上比例作 1/r 加權，合成後合力${cn}${note}。`
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
 * q13 — two parallel wires: F/l = mu0 I1 I2 / (2 pi r).               *
 * ------------------------------------------------------------------ */

const MU0 = 4 * Math.PI * 1e-7;

/** A value as m x 10^e, for the working line. */
function sci(v, dp = 2) {
  if (!Number.isFinite(v) || v === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(v)));
  return `${fmt(v / 10 ** e, dp)}\\times10^{${e}}`;
}

const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };

/** The same value as plain text with a real superscript: 3.75 × 10⁻⁵. */
function sciText(v, dp = 2) {
  if (!Number.isFinite(v) || v === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(v)));
  const digits = String(e).split("").map((ch) => SUP[ch] ?? ch).join("");
  return `${fmt(v / 10 ** e, dp)} × 10${digits}`;
}

function q13Graphic(root) {
  root.append(question(
    "兩條長直平行導線 X、Y 相距 8 mm，電流 5 A 與 0.3 A 同向。求每單位長度所受的磁力；Y 的電流反向時又怎樣？",
    ["F/l = μ0 I₁ I₂ ÷ (2πr)", "同向相吸、反向相斥；兩線所受的力大小相等（作用力與反作用力）"],
  ));

  const svg = scene(470, 330);
  const out = readout();
  /* Printed geometry, pages/p06.jpg (3 px/pt): the wire centres are at
   * x = 469.17 pt (X) and 557.83 pt (Y) for the printed 8 mm, so 1 mm = 11.08 pt
   * on the page and both wires run y 545.3-685.7 pt.
   * The gap is drawn 56 + 7 r px: half the printed 14 px per mm, anchored so the
   * printed 8 mm still comes out at its 112 px.  The floor exists so two fixed 28 px
   * force arrows cannot meet at r = 2 mm; only r moves the wires. */
  let I1 = 5, I2 = 0.3, rmm = 8, same = true;

  const force = () => (MU0 * I1 * I2) / (2 * Math.PI * (rmm / 1000));

  function again() {
    clear(svg);
    const gap = 56 + 7 * rmm;
    const cx = 235;
    const xL = cx - gap / 2, xR = cx + gap / 2;
    const yTop = 92, yBot = 258;

    const wire = (x, label, amps, up, tag) => {
      S("rect", { x: x - 4, y: yTop, width: 8, height: yBot - yTop, rx: 3,
        fill: "#e6e6e6", stroke: C.line, "stroke-width": 1.4 }, svg);
      if (up) arrow(svg, x, yBot - 22, x, yTop + 26, C.ink, 2.4, "arrInk");
      else arrow(svg, x, yTop + 22, x, yBot - 26, C.ink, 2.4, "arrInk");
      T(svg, x, yTop - 10, label, { "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: C.ink });
      T(svg, x + (tag > 0 ? 12 : -12), (yTop + yBot) / 2 + 40, `${fmt(amps, amps < 1 ? 1 : 0)} A`,
        { "text-anchor": tag > 0 ? "start" : "end", "font-size": 12, "font-weight": 700, fill: C.ink });
    };
    wire(xL, "X", I1, true, -1);
    wire(xR, "Y", I2, same, 1);

    // the printed 8 mm is a horizontal dimension between the two centres
    const dy = yBot + 26;
    S("line", { x1: xL, y1: dy - 6, x2: xL, y2: dy + 6, stroke: C.grey, "stroke-width": 1.4 }, svg);
    S("line", { x1: xR, y1: dy - 6, x2: xR, y2: dy + 6, stroke: C.grey, "stroke-width": 1.4 }, svg);
    S("line", { x1: xL, y1: dy, x2: xR, y2: dy, stroke: C.grey, "stroke-width": 1.5,
      "marker-start": marker(svg, "arr"), "marker-end": marker(svg, "arr") }, svg);
    T(svg, cx, dy - 8, `r = ${fmt(rmm, 0)} mm`, { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.grey });

    // The force on each wire: towards the other wire when the currents are parallel.
    // The length is fixed.  F spans four decades on these sliders (3.75e-5 N/m in the
    // printed case, 1.0e-2 N/m at 10 A and 2 mm), so an arrow proportional to F would be
    // invisible at one end and off the page at the other; the old "gap/2 - 6" made the
    // arrow grow with r, i.e. exactly against F.  Nothing about the length is a magnitude.
    const yF = 172;
    const dir = same ? 1 : -1;             // +1: X is pulled to the right
    const REACH = 28;
    const F = force();
    const micro = F * 1e6;
    if (F > 0) {
      arrow(svg, xL + 4 * dir, yF, xL + (4 + REACH) * dir, yF, C.red, 3, "arrRed");
      arrow(svg, xR - 4 * dir, yF, xR - (4 + REACH) * dir, yF, C.red, 3, "arrRed");
      T(svg, xL - 8 * dir, yF - 9, "F/l", { "text-anchor": dir > 0 ? "end" : "start", "font-size": 12, "font-weight": 700, fill: C.red });
      T(svg, xR + 8 * dir, yF - 9, "F/l", { "text-anchor": dir > 0 ? "start" : "end", "font-size": 12, "font-weight": 700, fill: C.red });
    } else {
      // either current is zero, so F = 0: draw no arrow rather than an arrow with no force
      // (the note goes below the wires, where it does not run across them)
      T(svg, cx, 302, "F = 0：其中一條導線沒有電流，所以沒有力",
        { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.red });
    }
    T(svg, 16, 322, "紅箭長度固定，只表示方向；F 的大小見上面公式",
      { "font-size": 10, fill: C.grey });

    out.set(
      `\\frac{F}{l}=\\frac{\\mu_0 I_1 I_2}{2\\pi r}`
      + `=\\frac{(4\\pi\\times10^{-7})(${fmt(I1, 1)})(${fmt(I2, 2)})}{2\\pi\\times${fmt(rmm, 0)}\\times10^{-3}}`
      + `=${sci(F)}\\ \\text{N m}^{-1}`,
      true,
      F === 0
        ? "其中一條導線沒有電流（I₁I₂ = 0）→ F/l = 0 N/m：兩線之間沒有磁力，也談不上相吸或相斥。"
        : same
          ? `兩線電流同向 → 相吸，F/l = ${sciText(F)} N/m（${fmt(micro, 1)} μN/m）。`
            + `兩條線上的力大小相等、方向相反，是一對作用力與反作用力。`
          : `Y 的電流反向 → 相斥，大小仍是 ${sciText(F)} N/m（${fmt(micro, 1)} μN/m）：`
            + `公式只看兩個電流的乘積，反向只改方向。`,
      { yes: F === 0 ? "F = 0" : same ? "同向 → 相吸" : "反向 → 相斥" },
    );
  }

  const s1 = slider({ label: "I₁（A）", min: 0, max: 10, step: 0.1, value: I1, fmt: (v) => `${fmt(v, 1)} A` });
  const s2 = slider({ label: "I₂（A）", min: 0, max: 10, step: 0.05, value: I2, fmt: (v) => `${fmt(v, 2)} A` });
  const s3 = slider({ label: "距離 r（mm）", min: 2, max: 20, step: 0.5, value: rmm, fmt: (v) => `${fmt(v, 1)} mm` });
  s1.on((v) => { I1 = v; again(); });
  s2.on((v) => { I2 = v; again(); });
  s3.on((v) => { rmm = v; again(); });

  const dirTabs = tabs(["同向（印刷個案）", "Y 反向"], (i) => { same = i === 0; again(); });
  root.append(svg, dirTabs, s1.el, s2.el, s3.el,
    buttonRow([["重設：5 A／0.3 A／8 mm", () => {
      dirTabs.children[0].click();       // back to the printed case: currents in the same sense
      s1.set(5); s2.set(0.3); s3.set(8);
    }]]), out.el);
  again();
}

/* ------------------------------------------------------------------ *
 * q10 — the wire that jumps off the rails.                            *
 * ------------------------------------------------------------------ */

/**
 * Runs `draw(seconds)` every frame until the svg leaves the page.  Time comes
 * from requestAnimationFrame, so nothing here reads the wall clock.
 */
function loop(svg, draw) {
  let t0 = 0;
  const tick = (ts) => {
    if (!svg.isConnected) return;
    if (!t0) t0 = ts;
    draw((ts - t0) / 1000);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function q10Graphic(root) {
  root.append(question(
    "導線 XY（長 20 cm、質量 0.2 g）放在相距 16 cm 的兩條水平導軌上，B = 0.05 T 沿水平面並垂直 XY。通 0.25 A 後會怎樣？",
    ["頂視圖：F 出紙＝向上；l 是兩軌之間 16 cm 的那一段", "F = BIl = 2.0×10⁻³ N > mg = 1.96×10⁻³ N"],
  ));

  const M = 0.2e-3;                  // 0.2 g
  const G = 9.81;
  const MG = M * G;                  // 1.962e-3 N
  const B0 = 0.05, B1 = 0.10;        // the printed field, and the "bigger B" case
  const L = 0.16;                    // rails 16 cm apart: the printed l in F = BIl
  const I0 = 0.25;
  let I = I0, big = false;

  const svg = scene(470, 350);
  const out = readout();

  /* Printed plan, pages/p05.jpg (3 px/pt, re-measured 2026-11-26): the two rails
   * are at y 216.3 and 270.7 pt (54.3 pt apart = 16 cm), the wire XY is a bar at
   * x 424.8 pt, and the only other marks are THREE orange B arrows at
   * y 203.3 / 243.0 / 285.3 pt (x 439.0-546.7) pointing LEFT, one black current
   * arrow up the wire (tip y 248.3) and the two dimension arrows; the whole group
   * is (360.7, 190.0)-(586.7, 319.7).  There is NO F arrow and NO mg arrow on the
   * page - both are drawn here from the physics.  It is a TOP view, so F (+z, out
   * of the paper = up in 3-D) and mg (-z, into the paper) both come straight out
   * of the printed page: neither has a printed tail to start from. */
  const RAIL1 = 118, RAIL2 = 198;    // 16 cm between them
  const WIRE_X = 84, WIRE_TOP = 76, WIRE_BOT = 240;
  const BARROWS = [96, 158, 220];

  let lastState = "";
  const draw = (t) => {
    clear(svg);
    const B = big ? B1 : B0;
    const F = B * I * L;
    const lifts = F > MG + 1e-12;

    /* ---- the printed top view (left) ---- */
    for (const [y, tagA, tagB] of [[RAIL1, "P", "Q"], [RAIL2, "R", "S"]]) {
      S("rect", { x: 30, y: y - 3, width: 210, height: 6, rx: 2, fill: "#e6e6e6", stroke: C.line, "stroke-width": 1.3 }, svg);
      T(svg, 24, y + 4, tagA, { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });
      T(svg, 246, y + 4, tagB, { "font-size": 13, "font-weight": 700, fill: C.ink });
    }
    S("rect", { x: WIRE_X - 4, y: WIRE_TOP, width: 8, height: WIRE_BOT - WIRE_TOP, rx: 3,
      fill: "#e6e6e6", stroke: C.line, "stroke-width": 1.4 }, svg);
    T(svg, WIRE_X, WIRE_TOP - 10, "X", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });
    T(svg, WIRE_X - 10, WIRE_BOT - 6, "Y", { "text-anchor": "end", "font-size": 13, "font-weight": 700, fill: C.ink });
    arrow(svg, WIRE_X, 208, WIRE_X, 118, C.ink, 2.4, "arrInk");
    T(svg, WIRE_X + 10, 170, `I = ${fmt(I, 2)} A`, { "font-size": 12, "font-weight": 700, fill: C.ink });

    for (const y of BARROWS) {
      arrow(svg, 232, y, 118, y, C.amber, 2.2, "arrAmber");
    }
    T(svg, 180, 84, `B = ${fmt(B, 2)} T`, { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.amber });
    T(svg, 150, 236, "頂視圖（top view）", { "text-anchor": "middle", "font-size": 11, fill: C.grey });

    // Both forces are perpendicular to the printed top view, and neither is
    // printed: F is +z (out of the page) and mg is -z (into it).  They are drawn
    // as the two section symbols, side by side under the rails.
    const mark = (x, y, out, colour, name) => {
      S("circle", { cx: x, cy: y, r: 9, fill: "#fff", stroke: colour, "stroke-width": 1.8 }, svg);
      if (out) S("circle", { cx: x, cy: y, r: 2.6, fill: colour }, svg);
      else {
        S("line", { x1: x - 5.4, y1: y - 5.4, x2: x + 5.4, y2: y + 5.4, stroke: colour, "stroke-width": 1.8 }, svg);
        S("line", { x1: x - 5.4, y1: y + 5.4, x2: x + 5.4, y2: y - 5.4, stroke: colour, "stroke-width": 1.8 }, svg);
      }
      T(svg, x + 13, y + 4, name, { "font-size": 11, "font-weight": 700, fill: colour });
    };
    mark(52, 266, true, C.red, "F 出紙（＋z）");
    mark(52, 300, false, C.blue, "mg 入紙（−z）");
    // Under the two symbols, not between them: at y 300 the note ran along the
    // same baseline as the mg label and the two overprinted each other.
    T(svg, 150, 334, "F、mg 都不是印刷的", { "text-anchor": "middle", "font-size": 10, fill: C.grey });

    /* ---- the end view (right): the jump ---- */
    const ex = 372, railY = 268;
    S("line", { x1: 300, y1: railY, x2: 444, y2: railY, stroke: C.line, "stroke-width": 3 }, svg);
    T(svg, 300, railY + 20, "導軌（端視）", { "font-size": 11, fill: C.grey });
    S("line", { x1: 300, y1: railY - 26, x2: 444, y2: railY - 26, stroke: C.grey,
      "stroke-width": 1, "stroke-dasharray": "5 4" }, svg);

    let h = 0, state, current;
    if (!lifts) {
      h = 0; state = "rest"; current = I;
    } else {
      const contact = 0.3;
      const flight = 0.85 * Math.sqrt(MG / F);
      const cycle = contact + flight;
      const u = t % cycle;
      if (u < contact) { h = 0; state = "contact"; current = I; }
      else {
        const tau = (u - contact) / flight;
        const H = 18 + 12 * Math.min(2, (F / MG - 1) * 20);
        h = 4 * H * tau * (1 - tau);
        state = "flight"; current = 0;
      }
    }
    const cy = railY - 12 - h;
    S("circle", { cx: ex, cy, r: 12, fill: "#dfe3ea", stroke: C.line, "stroke-width": 2 }, svg);
    T(svg, ex + 18, cy + 4, "XY", { "font-size": 12, "font-weight": 700, fill: C.ink });
    if (current > 0) {
      const fLen = Math.min(64, 34 * (F / MG));
      arrow(svg, ex, cy, ex, cy - fLen, C.red, 2.6, "arrRed");
      T(svg, ex + 8, cy - fLen + 10, "F", { "font-size": 12, "font-weight": 700, fill: C.red });
    }
    arrow(svg, ex, cy, ex, cy + 34, C.blue, 2.6, "arrInk");
    T(svg, ex + 6, cy + 32, "mg", { "font-size": 12, "font-weight": 700, fill: C.blue });
    if (h > 0) {
      S("line", { x1: ex - 22, y1: railY - 12, x2: ex - 22, y2: railY - 12 - h, stroke: C.grey,
        "stroke-width": 1, "stroke-dasharray": "4 3" }, svg);
      T(svg, ex - 26, railY - 12 - h / 2, "h", { "text-anchor": "end", "font-size": 11, fill: C.grey });
    }

    /* ---- the reading: only re-rendered when the state, I or B changes ---- */
    const key = `${state}|${I}|${big}`;
    if (key !== lastState) {
      lastState = key;
      const note = "印刷圖只畫 B 與 I；F 與 mg 是推導出來的（兩者垂直紙面：F 出紙、mg 入紙）。";
      const cap = !lifts
        ? `${note}F = BIl = ${fmt(B, 2)}×${fmt(I, 2)}×0.16 = ${fmt(F * 1e3, 2)}×10⁻³ N，比 mg = 1.962×10⁻³ N 細 → 導線留在軌上。`
        : state === "contact"
          ? `${note}接觸：F = ${fmt(F * 1e3, 2)}×10⁻³ N > mg = 1.962×10⁻³ N（大 ${fmt((F / MG - 1) * 100, 1)}%）→ 導線離軌。`
          : "離軌後沒有電流 → 沒有磁力，只受重力：導線回落，接觸後再跳，如是者重複。";
      out.set(
        `F=BIl=${fmt(B, 2)}\\times${fmt(I, 2)}\\times0.16=${fmt(F * 1e3, 2)}\\times10^{-3}\\ \\text{N}`
        + `\\quad mg=${fmt(MG * 1e3, 3)}\\times10^{-3}\\ \\text{N}`,
        lifts ? true : null, cap, { yes: "F > mg → 跳起" },
      );
    }
  };

  const iSlider = slider({ label: "電流 I（A）", min: 0, max: 0.5, step: 0.01, value: I0, fmt: (v) => `${fmt(v, 2)} A`, play: false });
  iSlider.on((v) => { I = v; lastState = ""; });
  root.append(svg, iSlider.el,
    buttonRow([
      [`${big ? "回到 B = 0.05 T" : "加大 B → 0.10 T"}`, () => { big = !big; lastState = ""; }],
      ["重設 I = 0.25 A", () => iSlider.set(I0)],
    ]), out.el);
  loop(svg, draw);
}

/* ------------------------------------------------------------------ *
 * q12 — the magnet on the balance: 158.0 g at 3 A, 168.7 g without it.       *
 * The printed sketch (p05, bitmap 302 x 189) draws the wire as a receding    *
 * line running up and to the right at about 26 deg, and that is the depth     *
 * axis: the pole top faces, the S pole's right face and the 7 cm dimension    *
 * all recede the same way, so up-right is away from the reader.  The arrow on *
 * the wire points up-right, i.e. the current goes INTO the paper — a cross,   *
 * not a dot.  (The marking scheme takes the current as out of the paper and   *
 * writes 147.5 g; the user ruled on 2026-11-26 that the printed figure wins.) *
 * Then F = Il x B on the wire is downward, the reaction on the magnet is      *
 * upward, and the balance reads LIGHTER while the current flows: 158.0 g at   *
 * 3 A, 168.7 g at 0 A.  The magnet is a U standing on its base (measured:      *
 * the white gap opens upward and the bridge is at the bottom).                *
 * The printed "7 cm" runs along the pole's depth, i.e. it is the length of    *
 * wire in the field; the N-S pole gap on the page is 100 px = 33.3 pt and is  *
 * never dimensioned.                                                          *
 * ------------------------------------------------------------------ */

function q12Graphic(root) {
  root.append(question(
    "磁石放在電子天平上，導線在兩磁極之間穿過，在磁場中的長度 l = 7 cm。通 3 A 時讀數 158 g。"
    + "求磁力大小；拿走導線（無電流）時讀數是多少？",
    ["B = 0.5 T，l = 7 cm（導線在磁場中的長度）", "印刷圖的電流箭咀沿退後軸指向右上 = 入紙（⊗）；導線受力向下"],
  ));

  const B = 0.5, L = 0.07;
  const G = 9.81;               // the book keeps g = 9.81 throughout
  // The magnet alone is not printed: it follows from the printed 158 g at 3 A.
  const W0 = 158 + (B * 3 * L / G) * 1000;   // 168.70 g
  const g1 = (v) => v.toFixed(1);   // the balance always shows one decimal
  let I = 3;

  const svg = scene(470, 330);
  const out = readout();

  function again() {
    clear(svg);
    const F = B * I * L;                 // N
    const grams = (F / G) * 1000;        // the grams the reaction lifts off the pan
    const read = W0 - grams;

    /* The printed sketch (p05) is a U-magnet standing on its base: two arms up,
     * the pole faces looking at each other across the gap, the wire running
     * through that gap along the depth axis, and the balance under the base.
     * The printed "7 cm" is the pole's depth, i.e. the wire's length in the
     * field, not the 25.7 pt pole gap, which the page never dimensions. */
    const xL = 116, xR = 284, top = 52, bot = 196, arm = 28, baseT = 36;
    const inL = xL + arm, inR = xR - arm, baseTop = bot - baseT;
    S("path", { d: `M${xL},${top} L${inL},${top} L${inL},${baseTop} L${inR},${baseTop} L${inR},${top} L${xR},${top} L${xR},${bot} L${xL},${bot} Z`,
      fill: "#d9dde3", stroke: C.line, "stroke-width": 1.6 }, svg);
    T(svg, xL + arm / 2, top + 26, "N", { "text-anchor": "middle", "font-size": 15, "font-weight": 700, fill: C.ink });
    T(svg, xR - arm / 2, top + 26, "S", { "text-anchor": "middle", "font-size": 15, "font-weight": 700, fill: C.ink });
    T(svg, 8, 40, "l = 7 cm（磁極深度）", { "font-size": 10.5, fill: C.grey });
    T(svg, 200, 40, "導線（入紙）", { "text-anchor": "middle", "font-size": 11, fill: C.ink });

    // field across the gap, N -> S (left to right)
    for (const y of [66, 78]) arrow(svg, inL + 4, y, inR - 4, y, C.amber, 1.8, "arrAmber");
    T(svg, 200, 58, "B", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });

    // the wire between the poles; the printed current arrow recedes, so the
    // current is into the paper and the section symbol is a cross
    S("circle", { cx: 200, cy: 96, r: 10, fill: "#fff", stroke: C.ink, "stroke-width": 2 }, svg);
    const dd = 7;
    S("line", { x1: 200 - dd, y1: 96 - dd, x2: 200 + dd, y2: 96 + dd, stroke: C.ink, "stroke-width": 2 }, svg);
    S("line", { x1: 200 - dd, y1: 96 + dd, x2: 200 + dd, y2: 96 - dd, stroke: C.ink, "stroke-width": 2 }, svg);

    // F down on the wire, the reaction up on the magnet (no current, no force)
    if (I > 0) {
      arrow(svg, 200, 110, 200, 156, C.red, 3, "arrRed");
      T(svg, 208, 140, "F 向下", { "font-size": 11, "font-weight": 700, fill: C.red });
      // inside the left arm, so the note never crosses the base (the printed
      // magnet's bridge) and the label sits outside the limb
      arrow(svg, 130, 186, 130, 120, C.red, 2.4, "arrRed");
      T(svg, 110, 150, "磁石受反作用向上", { "text-anchor": "end", "font-size": 10.5, "font-weight": 700, fill: C.red });
    } else {
      T(svg, 208, 132, "I = 0，無磁力", { "font-size": 11, "font-weight": 700, fill: C.grey });
    }

    // the balance
    S("line", { x1: 60, y1: bot, x2: 340, y2: bot, stroke: C.line, "stroke-width": 3 }, svg);
    S("rect", { x: 60, y: bot, width: 280, height: 46, rx: 6, fill: "#eef1f5", stroke: C.line, "stroke-width": 1.6 }, svg);
    T(svg, 112, bot + 26, "電子天平", { "text-anchor": "end", "font-size": 12, fill: C.grey });
    S("rect", { x: 118, y: bot + 8, width: 164, height: 32, rx: 4, fill: "#ffffff", stroke: C.line, "stroke-width": 1.4 }, svg);
    T(svg, 200, bot + 32, `${g1(read)} g`, { "text-anchor": "middle", "font-size": 20, "font-weight": 700, fill: C.ink });

    // a bar showing how much lighter the magnet now is
    if (I > 0) {
      const frac = grams / (B * 5 * L / G * 1000);   // full bar at 5 A
      S("rect", { x: 60, y: bot + 60, width: 280, height: 12, rx: 6, fill: "#eee" }, svg);
      S("rect", { x: 60, y: bot + 60, width: Math.max(0, 280 * frac), height: 12, rx: 6, fill: C.red }, svg);
      T(svg, 340, bot + 88, `讀數比磁石輕 ${fmt(grams, 1)} g（Δm = F ÷ 9.81）`,
        { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.red });
    } else {
      T(svg, 340, bot + 88, `無電流：讀數 = 磁石本身 ${g1(W0)} g`,
        { "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: C.grey });
    }

    out.set(
      `F=BIl=0.5\\times${fmt(I, 2)}\\times0.07=${fmt(F, 3)}\\ \\text{N},\\quad`
      + `\\Delta m=\\frac{F}{g}=\\frac{${fmt(F, 4)}}{9.81}=${fmt(grams, 1)}\\ \\text{g}`,
      true,
      I > 0
        ? `讀數 ${g1(read)} g（磁石本身 ${g1(W0)} g）。磁力在導線向下，磁石受反作用向上托，`
          + `所以有電流時讀數比磁石本身輕 ${fmt(grams, 1)} g。取 g = 9.81 m s⁻²。`
        : `切斷電流 = 拿走導線：磁力消失，讀數回到磁石本身 ${g1(W0)} g；通回 3 A 會降到 158.0 g。`,
      { yes: `${g1(read)} g` },
    );
  }

  const iSlider = slider({ label: "電流 I（A）", min: 0, max: 5, step: 0.1, value: I, fmt: (v) => `${fmt(v, 1)} A` });
  iSlider.on((v) => { I = v; again(); });
  root.append(svg, iSlider.el,
    buttonRow([
      ["通 3 A（印刷個案）", () => iSlider.set(3)],
      ["拿走導線（讀數 168.7 g）", () => iSlider.set(0)],
    ]), out.el);
  again();
}

/* ------------------------------------------------------------------ *
 * q16 / q17 — the moving-coil galvanometer.                           *
 * ------------------------------------------------------------------ */

function q16q17Graphic(root, start = 0) {
  root.append(question(
    "線圈 ABCD 在 N、S 極之間，彈簧把線圈拉回原位；換成 50 Hz 交流電，指針會怎樣？",
    ["q16：AD 受力入紙、BC 出紙，由 P 望是順時針；AB、CD 與場平行，不受力",
     "q17：圓柱磁極＋軟鐵芯給出徑向場，偏角 ∝ 電流；交流每秒反向 100 次，指針停在零"],
  ));

  const svg = scene(470, 330);
  const out = readout();
  let mode = start;                  // 0 = q16 coil and springs, 1 = q17 radial field
  let hz = 0;                        // q17: supply frequency

  /* Measured on pages/p10.jpg (3 px/pt): the q16 coil front face is about
   * 30 x 49 pt (A 460.8/240, B 490/240, C 490.8/289.2, D 457.5/289.2), in a pole
   * gap with N at the left and S at the right.  The q17 pointer pivots at
   * (460, 563.3) pt and the scale arc runs y 512-521 pt over x 422-502 pt, i.e.
   * a radius near 50 pt with a half-span near 39 deg; the drawing keeps those
   * proportions. */

  function coilAndSpring() {
    // poles
    S("rect", { x: 40, y: 84, width: 78, height: 190, rx: 4, fill: "#dfe3ea", stroke: C.line, "stroke-width": 1.6 }, svg);
    S("rect", { x: 352, y: 84, width: 78, height: 190, rx: 4, fill: "#dfe3ea", stroke: C.line, "stroke-width": 1.6 }, svg);
    T(svg, 79, 186, "N", { "text-anchor": "middle", "font-size": 18, "font-weight": 700, fill: C.ink });
    T(svg, 391, 186, "S", { "text-anchor": "middle", "font-size": 18, "font-weight": 700, fill: C.ink });

    // field N -> S
    for (const y of [116, 154, 192, 230]) arrow(svg, 122, y, 348, y, C.amber, 2, "arrAmber");
    T(svg, 235, 100, "B：N → S", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.amber });

    // the coil
    const x0 = 196, x1 = 274, y0 = 116, y1 = 250;
    S("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: "#f7f7f7", stroke: C.ink, "stroke-width": 2 }, svg);
    T(svg, x0 + 4, y0 + 16, "A", { "font-size": 12, "font-weight": 700, fill: C.ink });
    T(svg, x1 - 4, y0 + 16, "B", { "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.ink });
    T(svg, x1 - 4, y1 - 6, "C", { "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.ink });
    T(svg, x0 + 4, y1 - 6, "D", { "font-size": 12, "font-weight": 700, fill: C.ink });

    // current: down the BC side, up the DA side
    arrow(svg, x1 - 14, y0 + 34, x1 - 14, y0 + 88, C.ink, 2.2, "arrInk");
    arrow(svg, x0 + 14, y1 - 34, x0 + 14, y1 - 88, C.ink, 2.2, "arrInk");
    T(svg, x1 + 8, y0 + 64, "I", { "font-size": 12, "font-weight": 700, fill: C.ink });

    // forces: into the paper on AD, out of it on BC
    const mark = (x, y, into) => {
      S("circle", { cx: x, cy: y, r: 11, fill: "#fff", stroke: C.red, "stroke-width": 2 }, svg);
      if (into) {
        S("line", { x1: x - 6, y1: y - 6, x2: x + 6, y2: y + 6, stroke: C.red, "stroke-width": 2 }, svg);
        S("line", { x1: x - 6, y1: y + 6, x2: x + 6, y2: y - 6, stroke: C.red, "stroke-width": 2 }, svg);
      } else {
        S("circle", { cx: x, cy: y, r: 3.2, fill: C.red }, svg);
      }
    };
    mark(x0 - 20, 184, true);
    mark(x1 + 20, 184, false);
    T(svg, x0 - 20, 214, "AD 入紙", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.red });
    T(svg, x1 + 20, 214, "BC 出紙", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.red });

    // the springs at the top and bottom, and the axis
    S("line", { x1: 235, y1: 60, x2: 235, y2: 306, stroke: C.grey, "stroke-width": 1.2, "stroke-dasharray": "6 4" }, svg);
    for (const yc of [86, 268]) {
      S("path", { d: `M${235 - 26},${yc} q13,-10 26,0 q13,10 26,0 q13,-10 26,0`,
        fill: "none", stroke: C.green, "stroke-width": 2 }, svg);
    }
    T(svg, 296, 92, "彈簧", { "font-size": 11, "font-weight": 700, fill: C.green });
    T(svg, 296, 274, "彈簧", { "font-size": 11, "font-weight": 700, fill: C.green });

    // P: the view from above
    T(svg, 235, 52, "P", { "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: C.ink });
    S("path", { d: "M215,44 a24,10 0 0 0 40,0", fill: "none", stroke: C.blue, "stroke-width": 1.6 }, svg);
    arrow(svg, 249, 41, 256, 43, C.blue, 1.6, "arrInk");
    T(svg, 288, 44, "由 P 望 = 順時針", { "font-size": 11, "font-weight": 700, fill: C.blue });

    out.set(
      "\\text{(a) AD: into the paper; BC: out of it; clockwise from }P",
      true,
      "（a）AD 受力入紙、BC 出紙，由 P 望下去線圈順時針轉；（b）AB、CD 與 B 平行，沒有磁力；"
      + "（c）電流越大，磁力矩越大，彈簧要扭到更大角度才平衡 → 偏角顯示電流。",
      { yes: "AD 入紙、BC 出紙" },
    );
  }

  function radialField(t) {
    clear(svg);                      // the pointer is redrawn every frame: start from a clean sheet
    const cx = 235, cy = 196;
    const R = 96;                    // pole faces, outer radius
    const core = 46;                 // soft-iron core
    // pole faces: two arcs, N left, S right
    S("path", { d: `M${cx - R * 0.72},${cy - R} A${R},${R} 0 0 0 ${cx - R * 0.72},${cy + R}`,
      fill: "none", stroke: C.ink, "stroke-width": 7 }, svg);
    S("path", { d: `M${cx + R * 0.72},${cy - R} A${R},${R} 0 0 1 ${cx + R * 0.72},${cy + R}`,
      fill: "none", stroke: C.ink, "stroke-width": 7 }, svg);
    T(svg, cx - 108, cy + 6, "N", { "text-anchor": "middle", "font-size": 16, "font-weight": 700, fill: C.ink });
    T(svg, cx + 108, cy + 6, "S", { "text-anchor": "middle", "font-size": 16, "font-weight": 700, fill: C.ink });

    // the soft-iron core
    S("circle", { cx, cy, r: core, fill: "#e4e7ec", stroke: C.line, "stroke-width": 2 }, svg);
    T(svg, cx, cy + 4, "軟鐵芯", { "text-anchor": "middle", "font-size": 10, fill: C.grey });

    // radial field: lines leave N, cross the gap into the core, and leave the core for S
    // (solutions (b): "pointing from N to S"), so only the N side points inwards
    for (const a of [-58, -30, 0, 30, 58]) {
      const r1 = core + 4, r2 = 92;
      const dx = Math.cos(a * DEG), dy = Math.sin(a * DEG);
      arrow(svg, cx - r2 * dx, cy - r2 * dy, cx - r1 * dx, cy - r1 * dy, C.amber, 1.6, "arrAmber");
      arrow(svg, cx + r1 * dx, cy + r1 * dy, cx + r2 * dx, cy + r2 * dy, C.amber, 1.6, "arrAmber");
    }

    // The coil must lie in the annular gap (core 46 to pole faces 92), not inside the core:
    // its two current-carrying sides are the vertical ones at +-69, where every radial line
    // crosses the wire square on.  That is what keeps F = BIl constant as the coil turns,
    // and therefore what makes the deflection proportional to the current.
    const coilX = 69, coilY = 52;
    S("path", {
      d: `M${cx - coilX},${cy - coilY} L${cx + coilX},${cy - coilY} `
        + `L${cx + coilX},${cy + coilY} L${cx - coilX},${cy + coilY} Z`,
      fill: "none", stroke: C.ink, "stroke-width": 2.4,
    }, svg);
    T(svg, cx, cy + 72, "線圈", { "text-anchor": "middle", "font-size": 10, fill: C.ink });

    // the scale: the printed arc is 50 pt radius over +-39 deg
    const RA = 118, span = 39;
    S("path", {
      d: `M${cx - RA * Math.sin(span * DEG)},${cy - RA * Math.cos(span * DEG)} `
        + `A${RA},${RA} 0 0 1 ${cx + RA * Math.sin(span * DEG)},${cy - RA * Math.cos(span * DEG)}`,
      fill: "none", stroke: C.line, "stroke-width": 1.6,
    }, svg);
    for (let k = -4; k <= 4; k += 1) {
      const a = (k / 4) * span * DEG;
      const r0 = RA, r1 = RA + (k === 0 ? 12 : 7);
      S("line", {
        x1: cx + r0 * Math.sin(a), y1: cy - r0 * Math.cos(a),
        x2: cx + r1 * Math.sin(a), y2: cy - r1 * Math.cos(a),
        stroke: C.line, "stroke-width": k === 0 ? 2 : 1.2,
      }, svg);
    }
    T(svg, cx, cy - RA - 16, "0", { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.ink });

    // A(f) = A0 / (1 + (f/f0)^2): the movement cannot follow a fast reversal.
    const F0 = 4;                    // Hz, the movement's own response (not printed)
    const A0 = span * 0.9;           // degrees at steady current
    const amp = A0 / (1 + (hz / F0) ** 2);
    // A steady current holds the pointer at the full deflection; an alternating one
    // swings it at a drawn rate of at most 2 Hz, so the wobble stays watchable.
    const ang = hz === 0 ? amp : amp * Math.sin(2 * Math.PI * Math.min(hz, 2) * t);
    const px = cx + RA * Math.sin(ang * DEG), py = cy - RA * Math.cos(ang * DEG);
    S("line", { x1: cx, y1: cy, x2: px, y2: py, stroke: C.red, "stroke-width": 3, "stroke-linecap": "round" }, svg);
    S("circle", { cx, cy, r: 5, fill: C.ink }, svg);
    T(svg, 20, 26, `偏角 ${fmt(Math.abs(ang), 1)}°（振幅 ${fmt(amp, 1)}°）`,
      { "font-size": 11, "font-weight": 700, fill: C.red });

    /* ---- the reading: re-rendered only when f changes, not on every frame ---- */
    if (hz === lastHz) return;
    lastHz = hz;
    const zero = hz >= 20;
    out.set(
      "\\theta \\propto B I A N \\quad\\text{(radial field: } \\theta \\text{ linear in } I)",
      zero ? true : null,
      hz === 0
        ? `直流：線圈受穩定力矩，彈簧扭到 ${fmt(amp, 1)}° 才平衡；偏角與電流成正比。`
        : hz >= 20
          ? `f = ${fmt(hz, 0)} Hz：交流每秒反向 ${fmt(hz * 2, 0)} 次，線圈來不及跟隨，正、反兩半週的力矩互相抵消，`
            + "平均力矩為零 → 指針停在零刻度。"
          : `f = ${fmt(hz, 0)} Hz：電流每秒反向 ${fmt(hz * 2, 0)} 次，指針開始跟不上，偏角縮小到 ${fmt(amp, 1)}°。`,
      { yes: "指針停零" },
    );
  }

  function again() {
    clear(svg);
    if (mode === 0) coilAndSpring();
    else radialField(Q_TIME);
  }

  let Q_TIME = 0;
  let lastHz = null;
  const hzSlider = slider({ label: "交流電頻率 f（Hz）", min: 0, max: 50, step: 1, value: 0, fmt: (v) => (v === 0 ? "0 Hz（直流）" : `${fmt(v, 0)} Hz`), play: false });
  hzSlider.on((v) => { hz = v; });
  hzSlider.el.style.display = "none";

  const modeTabs = tabs(["q16 線圈與彈簧", "q17 徑向場與指針"], (i) => {
    mode = i;
    hzSlider.el.style.display = i === 1 ? "" : "none";
    Q_TIME = 0;
    lastHz = null;
    again();
  });

  root.append(svg, modeTabs, hzSlider.el, out.el);
  // The two questions share one figure: open each on its own side.  Clicking the
  // tab (rather than setting `mode` alone) keeps the tab highlight and the
  // frequency slider in step with the drawing.
  if (start === 1) modeTabs.children[1].click();
  loop(svg, (t) => {
    if (mode !== 1) return;
    Q_TIME = t;
    radialField(t);
  });
  again();
}

/* ------------------------------------------------------------------ *
 * What each question opens.                                          *
 * ------------------------------------------------------------------ */

const REGISTRY = {
  q3: q3Graphic,
  q4: q4Graphic,
  q10: q10Graphic,
  q11: q11Graphic,
  q12: q12Graphic,
  q13: q13Graphic,
  q16: (root) => q16q17Graphic(root, 0),
  q17: (root) => q16q17Graphic(root, 1),
  q18: q18Graphic,
  q19: q19Graphic,
};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
