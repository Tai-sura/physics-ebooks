/**
 * Worked solutions for SPEM05 Magnetic force on current-carrying wires (S5).
 * Method follows the teacher's red working in the ANS key
 * (reference/ans/, reference/ans_pages/). Field reference: docs/02-book-format.md.
 * House style: docs/03-authoring-style.md.
 *
 * The answer regions in this book are narrow, so every answer is written as one
 * short line per printed part: a step that runs onto a second line wraps inside
 * the region and the reader gets a scrolling box instead of a whole answer.
 */

import { m, t, h, note, nl, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  // ---------------------------------------------------------------- q1
  // Four printed answer boxes (a)-(d), one word each. The key writes the word in
  // each box and adds no working (red text: up / up / out / into, see
  // reference/ans/p01_01, _02, _04, _03), so each part is one line here.
  {
    id: "q1",
    boxes: [{
      steps: [
        t("(a) $\\underline{\\text{upwards}}$"),
        t("(b) $\\underline{\\text{no force}}$"),
        t("(c) $\\underline{\\text{out of the paper}}$"),
        t("(d) $\\underline{\\text{into the paper}}$"),
      ],
    }],
  },

  // ---------------------------------------------------------------- q2
  {
    id: "q2",
    boxes: [{
      steps: [
        // The reason goes on a line of its own: beside the sentence it ran the
        // line past the box, which pushed the step strip right off the page edge.
        t("(a) The electron moves downwards, so the conventional current is $\\underline{\\text{upwards}}$."),
        t("(opposite to electron flow)"),
        t("(b) $I$ upwards, $B$ to the right: $F$ is $\\underline{\\text{into the paper}}$.", "Fleming's left hand rule"),
      ],
    }],
  },

  // ---------------------------------------------------------------- q3
  // Three steps, one line each: the region is 216 pt wide.
  {
    id: "q3",
    boxes: [{
      steps: [
        t("Electron right: $B$ into paper."),
        t("P positive: $\\underline{\\text{to the top}}$."),
        m("\\therefore \\text{The answer is A.}"),
      ],
    }],
  },

  // ---------------------------------------------------------------- q4
  // Twelve printed cases; the key draws only a red arrow in each and writes no
  // words, so the answer here is the direction of that arrow: same-direction
  // currents attract, opposite-direction currents repel. Three parts to a line,
  // as the cases are printed three to a row; one line per printed row keeps the
  // step-by-step reveal working.
  {
    id: "q4",
    boxes: [{
      steps: [
        t("(a) $\\underline{\\text{right}}$, (b) $\\underline{\\text{left}}$, (c) $\\underline{\\text{left}}$"),
        t("(d) $\\underline{\\text{right}}$, (e) $\\underline{\\text{left}}$, (f) $\\underline{\\text{right}}$"),
        t("(g) $\\underline{\\text{downwards}}$, (h) $\\underline{\\text{upwards}}$, (i) $\\underline{\\text{upwards}}$"),
        t("(j) $\\underline{\\text{right}}$, (k) $\\underline{\\text{left}}$, (l) $\\underline{\\text{up-left}}$"),
      ],
    }],
  },

  // ---------------------------------------------------------------- q5
  // The key writes only the letter A; the working below is the standard argument
  // that reaches it. The region is 214 pt wide and 56 pt tall and a line holds
  // about 24 characters, so three short lines, one per step.
  {
    id: "q5",
    boxes: [{
      steps: [
        t("E: toward the − plate."),
        t("B: left-hand rule."),
        t("So: region I; answer A."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q6
  // The key writes one line per part (reference/ans/p03_01.png):
  // "The rod moves to the right / As the current in the rod experiences a force
  // in the magnetic field", then faster / slower, then the two reversals.
  {
    id: "q6",
    boxes: [{
      steps: [
        t("(a) The rod moves to the right: the current in the rod feels a force."),
        t("(b) (i) It moves faster. (ii) It moves slower."),
        t("(c) Reverse the current, or reverse the magnetic field."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q7
  // The key marks the poles on the figure (S above, N below, p03_02.png), draws
  // the free body diagram (p03_03.png) and writes "The rod will move to the left".
  {
    id: "q7",
    boxes: [{
      steps: [
        t("(a) Upper pole is S; lower pole is N."),
        t("(b) Four forces: supporting force by the rails (up), weight (down), magnetic force (right), friction (left)."),
        t("(c) The rod will move to the left."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q8
  // The key writes "F = BIl sin θ = 0.8 × 5 × 1 × sin (90° − 30°) = 3.46 N" for (a)
  // with "Out of paper", and "F = BIl = 0.8 × 5 × 1 = 4 N" for (b) (ans_04.png).
  {
    id: "q8",
    boxes: [{
      steps: [
        // Two lines: the whole substitution plus its reason overflowed the box and
        // put the step strip entirely outside the page.
        t("(a) $F = BIl\\sin\\theta = 0.8 \\times 5 \\times 1 \\times \\sin(90^\\circ - 30^\\circ)$"),
        m("= \\underline{3.46\\ \\text{N}}, out of the paper.", "B and I are 60° apart"),
        t("(b) $F = BIl = 0.8 \\times 5 \\times 1 = \\underline{4\\ \\text{N}}$, up to the left.", "B is perpendicular to I"),
      ],
    }],
  },

  // ---------------------------------------------------------------- q9
  // Three boxes in the key: the description, then I = 9/6 and F = IlB = 0.0036 N,
  // then a = F/m = 0.18 m s^-2 (p04_01, p04_02, p04_03).
  {
    id: "q9",
    boxes: [{
      steps: [
        // Split so the strip stays inside the 382 pt region: one long sentence
        // pushed it 6 pt out, and under it lay the printed "12 cm" dimension line.
        t("(a) The rod moves towards the right with acceleration,"),
        t("because the current in the rod experiences a force in the magnetic field."),
        t("(b) $I = \\frac{9}{6} = 1.5$ A"),
        m("F = BIl = 0.03 \\times 1.5 \\times 0.08 = \\underline{0.0036\\ \\text{N}}"),
        t("(c) $a = \\frac{F}{m} = \\frac{0.0036}{0.02} = \\underline{0.18\\ \\text{m s}^{-2}}$."),
        t("(Newton's second law)"),
      ],
    }],
  },

  // ---------------------------------------------------------------- q10
  // Seven marked steps in one box (p05_01.png): the rule, the force, the weight,
  // the jump, then the repeat cycle.
  {
    id: "q10",
    boxes: [{
      steps: [
        t("By Fleming's left-hand rule, the magnetic force on $XY$ points out of the paper."),
        t("$F = BIl\\sin\\theta = 0.05 \\times 0.25 \\times 0.16 \\times \\sin 90^\\circ = \\underline{2 \\times 10^{-3}\\ \\text{N}}$"),
        t("Weight $= 0.2 \\times 10^{-3} \\times 9.81 = 1.96 \\times 10^{-3}$ N $< F$, so $XY$ jumps upwards."),
        t("Once $XY$ leaves the rails no current flows, so no magnetic force acts on it."),
        t("Then $XY$ falls back under gravity and the cycle repeats."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q11
  // The key draws N (normal to the rails), mg (down) and BIL (horizontal right),
  // writes "From Y to X", then resolves vertically and horizontally and divides
  // to get I = 9.91 A (p05_03, p05_04).
  {
    id: "q11",
    boxes: [{
      steps: [
        t("(a) $N$, $mg$, $BIL$; (b) $Y$ to $X$."),
        t("$N\\cos 30^\\circ = mg$; $N\\sin 30^\\circ = BIL$"),
        t("$\\tan 30^\\circ = BIL/mg$"),
        t("$I = mg\\tan 30^\\circ/(BL) = \\underline{9.91\\ \\text{A}}$"),
      ],
    }],
  },

  // ---------------------------------------------------------------- q12
  // The key writes "Upward", then F = BIl = 0.5 × 3 × 0.07 = 0.105 N, then the
  // action-reaction argument and 158 − 0.105/0.01 = 147.5 g (p05_02.png).  The
  // key divides by 0.01, i.e. g = 10; this book keeps g = 9.81, which gives
  // 147.3 g, and the note says where the key's 147.5 g comes from.
  {
    id: "q12",
    boxes: [{
      steps: [
        t("(a) Downward."),
        t("(b) (i) $F = BIl = 0.5 \\times 3 \\times 0.07 = \\underline{0.105\\ \\text{N}}$"),
        t("(b) (ii) The reaction on the magnet is upward: the reading is less."),
        m("158.0 + \\frac{0.105}{9.81} \\times 1000 = \\underline{168.7\\ \\text{g}}", "after switching off"),
        note("Key 147.5 g: current out of paper, g = 10."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q13
  // The key (p06_01, p06_02) writes: attractive, action-and-reaction pair, then
  // F/l = mu0 I1 I2 / (2 pi r) with the numbers, 3.75e-5 N, then repulsive with the
  // same magnitude when the current in Y is reversed.
  {
    id: "q13",
    boxes: [{
      steps: [
        // The caption rides on its own line: beside the lead line it runs 40 px past
        // the box, and nothing in this layout path gives way, so the step strip ends
        // up outside the region and over the printed wires.
        t("(a) The magnetic forces acting on the wires are attractive."),
        t("(Currents in the same direction.)"),
        t("They are an action-and-reaction pair, so the two forces have the same magnitude."),
        // Two lines: the whole substitution on one line is wider than the region,
        // and an over-wide line silently pushes the step strip out of the box.
        m("\\frac{F}{l} = \\frac{\\mu_0 I_1 I_2}{2\\pi r}"),
        m("= \\frac{(4\\pi \\times 10^{-7})(5)(0.3)}{(2\\pi)(8 \\times 10^{-3})} = \\underline{3.75 \\times 10^{-5}\\ \\text{N m}^{-1}}"),
        t("(b) The forces become repulsive, and their magnitude does not change."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q14
  // The turning effect on a coil (p09_01). The key answers all five parts in full;
  // (c) and (e) are the explanations that must not be shortened.
  {
    id: "q14",
    boxes: [{
      steps: [
        t("(a) Side $AB$: upward; side $BC$: no magnetic force acting on it."),
        t("Side $CD$: downward; side $AD$: no magnetic force acting on it."),
        t("(b) Clockwise."),
        t("(c) When the coil is vertical, the magnetic forces act along the same line and cancel out each other, and the turning effect becomes zero."),
        t("(d) Connect the two ends of the coil to the power supply via a commutator and two carbon brushes."),
        t("(e) When the coil passes through the vertical position, the commutator changes contact with the carbon brushes; this reverses the direction of current in the coil, and hence reverses the direction of the force on the coil, so the coil keeps rotating in the same direction."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q15
  // The d.c. motor (p09_02, one crop for all four parts): the commutator action,
  // the two forces and the anticlockwise turn, the two reversals, three methods.
  {
    id: "q15",
    boxes: [{
      steps: [
        t("(a) The commutator reverses the current when the coil rotates through 180°."),
        t("(b) A downward force on $AD$ and an upward force on $BC$, so the coil rotates anticlockwise."),
        t("(c) (i) The direction of rotation is reversed."),
        t("(c) (ii) The direction of rotation is reversed."),
        t("(d) A stronger magnet, a coil with more turns, or a larger current."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q16
  // Moving-coil set-up with springs (p10_02, p10_04, p10_03): forces on AD and BC,
  // clockwise seen from P, no force on AB and CD, then the spring argument.
  {
    id: "q16",
    boxes: [{
      steps: [
        t("(a) Force on $AD$: into the paper; on $BC$: out of it. The coil turns clockwise viewed from $P$."),
        t("(b) No magnetic force acts on $AB$ and $CD$: they are parallel to the field."),
        t("(c) A larger current turns the coil further before the springs stop it, so the angle of deflection gives the current."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q17
  // Galvanometer (p10_01): the whole five-part answer is in one crop.
  {
    id: "q17",
    boxes: [{
      steps: [
        t("(a) The coil turns and moves the pointer across the scale; it stops when the magnetic turning effect balances the restoring effect of the hair springs, so the angle turned shows the current."),
        t("(b) Field lines are parallel inside the soft-iron core and radial between the core and the magnets, pointing from N to S."),
        t("(c) Cylindrical magnets give a radial field, so the angle of deflection varies linearly with the current."),
        t("(d) Use stronger magnets, more turns on the coil, or weaker hair springs."),
        t("(e) The pointer cannot follow 100 reversals per second, so it stays at the zero mark."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q18
  // Simple motor with solenoids (ans_11, red text): B South, C North; clockwise
  // seen from Y, the commutator end - XY is a horizontal axis, so "from above"
  // would name the wrong end; PQ up and RS down; no current at the vertical; reversal keeps
  // the sense; three ways to increase the turning effect.
  {
    id: "q18",
    boxes: [{
      steps: [
        t("(a) $B$: South; $C$: North."),
        t("(b) The coil rotates clockwise as viewed from $Y$ (the commutator end); the force on $PQ$ is upward and the force on $RS$ is downward."),
        t("(c) No: in the vertical position the contacts between the commutator and the brushes are broken, so no current flows."),
        t("(d) The current and the magnetic field both reverse, so the sense of rotation is unchanged."),
        t("(e) Increase the current, put soft-iron cores inside the solenoids, or increase the number of turns of $PQRS$."),
      ],
    }],
  },

  // ---------------------------------------------------------------- q19
  // Front view of a motor (p12_01, p12_02, p12_03): clockwise, then F = torque/d
  // and B from the maximum-torque formula.
  {
    id: "q19",
    boxes: [{
      steps: [
        t("(a) Clockwise."),
        t("(b) (i) Torque $= F \\times d$ with $d = 0.025$ m, so $F = 1.26/0.025 = \\underline{50.4\\ \\text{N}}$."),
        t("(b) (ii) Maximum torque $= NIBA$: $1.26 = 2400 \\times 0.8 \\times B \\times 0.025^2$, so $B = \\underline{1.05\\ \\text{T}}$."),
      ],
    }],
  },
];
