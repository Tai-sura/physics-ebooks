/**
 * Worked solutions for this book, following the teacher's ANS method.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, note, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    boxes: [{
      steps: [
        t("The particles of the string vibrate at right angles to the direction in which the wave travels."),
        m("\\therefore \\text{the wave is } \\underline{\\text{transverse}}"),
      ],
    }],
  },
  {
    id: "q2",
    boxes: [{
      steps: [
        m("2\\ \\text{squares} = 4\\ \\text{cm}", "printed bar"),
        m("\\text{so } 1\\ \\text{square} = 2\\ \\text{cm}"),
        m("A = 1\\ \\text{square} = \\underline{2\\ \\text{cm}}", "1 square up"),
      ],
    }],
  },
  {
    id: "q3",
    boxes: [{
      steps: [
        t("Every particle of the same wave has the same amplitude, whatever its position."),
        t("$P$ is at a crest, $Q$ and $R$ on the equilibrium line, $S$ at a trough — all four have the same amplitude."),
        m("\\underline{D}\\ \\ (Q, R \\text{ and } S)"),
      ],
    }],
  },
  {
    id: "q4",
    boxes: [{
      steps: [
        m("\\lambda = 4\\ \\text{squares}", "crest 3 to crest 11 on the printed grid"),
        m("\\text{1 square} = 2\\ \\text{cm}", "the printed 4 cm bar is two squares long"),
        m("\\lambda = 4 \\times 2 = \\underline{8\\ \\text{cm}}"),
      ],
    }],
  },
  {
    id: "q5",
    boxes: [{
      steps: [
        t("One wavelength is the distance between two successive crests, or between two particles with the same displacement and direction of motion."),
        t("$A$ and $D$ are successive crests, so $AD$ is one wavelength."),
        m("\\underline{D}\\ \\ (AD)"),
      ],
    }],
  },
  {
    id: "q6",
    boxes: [{
      steps: [
        t("$C$ and $G$ have the same displacement and the same direction of motion, so the wave repeats between them."),
        m("\\underline{D}\\ \\ (C \\text{ to } G)"),
      ],
    }],
  },
  {
    id: "q7",
    boxes: [{
      steps: [
        t("The wavelength is marked on the figure: one complete wave is $\\lambda = 6$ cm."),
        m("\\underline{D}\\ \\ (6\\ \\text{cm})"),
      ],
    }],
  },
  {
    id: "q8",
    boxes: [{
      steps: [
        t("Amplitude is the maximum displacement of a particle from its equilibrium position."),
        m("A = 1.5\\ \\text{cm} \\Rightarrow \\underline{B}"),
      ],
    }],
  },
  {
    id: "q9",
    boxes: [{
      steps: [
        t("The wave advances $1$ cm in $0.1$ s: with the key's $0.8$ s and $\\lambda = 8$ cm, the distance must be $\\frac{8 \\times 0.1}{0.8} = 1$ cm."),
        m("v = \\frac{1\\ \\text{cm}}{0.1\\ \\text{s}} = 10\\ \\text{cm s}^{-1}"),
        m("\\lambda = 8\\ \\text{cm}"),
        m("T = \\frac{\\lambda}{v} = \\frac{8}{10} = \\underline{0.8\\ \\text{s}}"),
        note("The printed curves are hand-drawn, so the shift is not measured off the figure; the key's 0.8 s means the wave advances 1 cm in 0.1 s."),
      ],
    }],
  },
  {
    id: "q10",
    boxes: [{
      steps: [
        t("From the $s$–$t$ graph, one complete oscillation takes $0.5$ s."),
        m("T = \\underline{0.5\\ \\text{s}}"),
        m("f = \\frac{1}{T} = \\frac{1}{0.5} = \\underline{2\\ \\text{Hz}}"),
      ],
    }],
  },
  {
    id: "q11",
    boxes: [{
      steps: [
        m("v = f\\lambda = 5 \\times 0.2 = \\underline{1\\ \\text{m s}^{-1}}"),
        m("\\underline{C}"),
      ],
    }],
  },
  {
    id: "q12",
    boxes: [{
      steps: [
        m("f = \\frac{12}{4\\ \\text{s}} = 3\\ \\text{Hz}"),
        m("\\lambda = 0.12\\ \\text{m}", "two successive troughs"),
        m("v = f\\lambda = 3 \\times 0.12 = \\underline{0.36\\ \\text{m s}^{-1}} \\Rightarrow \\underline{B}"),
      ],
    }],
  },
  {
    id: "q13",
    boxes: [{
      steps: [
        t("Figure (a) marks $x$ from a zero crossing to the one $1.5$ wavelengths further on, so $x = 1.5\\lambda$."),
        t("Figure (b) marks $z$ over one and a half cycles, so $z = 1.5T$."),
        m("v = \\frac{\\lambda}{T} = \\frac{1.5\\lambda}{1.5T} = \\frac{x}{z} \\Rightarrow \\underline{B}"),
      ],
    }],
  },
  {
    id: "q14",
    boxes: [{
      steps: [
        t("(1) The wavelength is the minimum distance in which the wave repeats itself: $\\lambda = 20$ cm. Correct."),
        m("(2)\\ v = f\\lambda:\\ 1.2 = f(0.2) \\Rightarrow f = 6\\ \\text{Hz}", "the wavelength must be in metres"),
        t("(3) The amplitude is the maximum displacement from equilibrium: $A = 3$ cm, not $6$ cm. Wrong."),
        m("\\underline{A}\\ \\ ((1) \\text{ and } (2))"),
      ],
    }],
  },
  {
    id: "q15",
    boxes: [{
      steps: [
        t("(1) A displacement–time graph of one particle cannot show the direction of travel. Wrong."),
        m("(2)\\ f = \\frac{1}{0.8\\ \\text{s}} = 1.25\\ \\text{Hz}", "period read from the graph"),
        m("(3)\\ A = 2\\ \\text{cm}", "peak value on the graph"),
        m("\\underline{B}\\ \\ ((2) \\text{ only})"),
      ],
    }],
  },
  {
    id: "q16",
    boxes: [{
      steps: [
        m("\\lambda = 0.6\\ \\text{m}", "particles 0.6 m apart are in phase"),
        m("T = 2 \\times 10^{-3}\\ \\text{s}", "one cycle takes 2 ms"),
        m("f = \\frac{1}{T} = \\frac{1}{2 \\times 10^{-3}} = 500\\ \\text{Hz}"),
        m("v = f\\lambda = 500 \\times 0.6 = \\underline{300\\ \\text{m s}^{-1}}"),
      ],
    }],
  },
  {
    id: "q17",
    boxes: [{
      steps: [
        m("\\lambda = \\frac{0.45\\ \\text{m}}{3} = 0.15\\ \\text{m}"),
        t("The cork is at the highest position for the second time when a crest has travelled $0.30\\ \\text{m} + 1.75\\lambda$."),
        m("s = 0.30 + 1.75(0.15) = 0.5625\\ \\text{m}"),
        m("t = \\frac{s}{v} = \\frac{0.5625}{0.5} = \\underline{1.125\\ \\text{s}}"),
      ],
    }],
  },
  {
    id: "q18",
    boxes: [{
      steps: [
        m("\\frac{T}{2} = 2\\ \\text{s} \\Rightarrow T = 4\\ \\text{s}", "crest to trough is half an oscillation"),
        m("v = \\frac{\\lambda}{T} = \\frac{20}{4} = \\underline{5\\ \\text{m s}^{-1}} \\Rightarrow \\underline{C}"),
      ],
    }],
  },
  {
    id: "q19",
    boxes: [{
      steps: [
        t("In $1.0$ s the wave has moved at least $0.5\\lambda$, so at least half a cycle passes in one second."),
        m("f_{\\min} = \\underline{0.5\\ \\text{Hz}}"),
      ],
    }],
  },
  {
    id: "q20",
    boxes: [{
      steps: [
        t("$A$ to $B$ spans $2\\lambda = 10$ cm, so $\\lambda = 5$ cm."),
        m("v = \\frac{10\\ \\text{cm}}{3\\ \\text{s}} = 3.33\\ \\text{cm s}^{-1} = \\underline{0.0333\\ \\text{m s}^{-1}}"),
        m("T = \\frac{3\\ \\text{s}}{2} = 1.5\\ \\text{s}"),
        m("f = \\frac{1}{T} = \\underline{0.667\\ \\text{Hz}} \\Rightarrow \\underline{C}"),
      ],
    }],
  },
  {
    id: "q21",
    boxes: [{
      steps: [
        m("\\lambda = 8 \\times 2\\ \\text{cm} = 16\\ \\text{cm} = 0.16\\ \\text{m}", "one wavelength repeats itself"),
        m("v = \\frac{0.02\\ \\text{m}}{0.05\\ \\text{s}} = 0.4\\ \\text{m s}^{-1}", "the wave moves 2 cm in 0.05 s"),
        m("f = \\frac{v}{\\lambda} = \\frac{0.4}{0.16} = \\underline{2.5\\ \\text{Hz}} \\Rightarrow \\underline{C}"),
      ],
    }],
  },
  {
    id: "q22",
    boxes: [{
      steps: [
        t("The wave travels to the left, so each particle moves the way the crest on its right will carry it."),
        m("\\text{(i) moving upwards: } \\underline{A,\\ E}"),
        m("\\text{(ii) moving downwards: } \\underline{C,\\ G}"),
        m("\\text{(iii) momentarily at rest: } \\underline{B,\\ D,\\ F}"),
      ],
    }],
  },
  {
    id: "q23",
    boxes: [{
      steps: [
        t("In phase: separated by a whole number of wavelengths. Out of phase: not separated by a whole number. Antiphase: separated by $(n + \\tfrac{1}{2})\\lambda$."),
        m("\\text{(i) in phase: } \\underline{A\\&E,\\ B\\&F,\\ C\\&G}"),
        t("(ii) out of phase — every pair except the in-phase, antiphase and same-point pairs:"),
        m("\\underline{A\\&B,\\ A\\&D,\\ A\\&F,\\ B\\&C,\\ B\\&E,\\ B\\&G,\\ C\\&D,\\ C\\&F,\\ D\\&E,\\ D\\&G,\\ E\\&F,\\ F\\&G}"),
        m("\\text{(iii) antiphase: } \\underline{A\\&C,\\ A\\&G,\\ B\\&D,\\ C\\&E,\\ D\\&F,\\ E\\&G}"),
      ],
    }],
  },
  {
    id: "q24",
    boxes: [{
      steps: [
        t("Only $R$ is moving towards its equilibrium position, so $R$ takes the shortest time."),
        t("$Q$ is almost at the trough, so it reaches the equilibrium position after about $\\frac{T}{4}$, sooner than $P$, which is high up and still moving away from equilibrium."),
        m("\\underline{D}\\ \\ (R, Q, P)"),
        note("The key calls Q 'almost at its peak'; the figure puts Q at the trough. The order (Q before P) is unchanged."),
      ],
    }],
  },
  {
    id: "q25",
    boxes: [{
      steps: [
        t("$P$ is momentarily at rest and the displacement of $Q$ is zero, so neither can have displacement and velocity in opposite directions."),
        t("The displacement of $R$ is downwards but its velocity is upwards."),
        t("The displacement and the velocity of $S$ are both upwards."),
        m("\\underline{C}\\ \\ (R)"),
      ],
    }],
  },
  {
    id: "q26",
    boxes: [{
      steps: [
        t("$P$ passes the equilibrium position for the second time after $1.5$ s, and in that time the wave has travelled $18$ cm."),
        m("v = \\frac{18\\ \\text{cm}}{1.5\\ \\text{s}} = \\underline{12\\ \\text{cm s}^{-1}} \\Rightarrow \\underline{B}"),
      ],
    }],
  },
  {
    id: "q27",
    boxes: [{
      steps: [
        t("$P$ is moving downwards, so the wave travels to the right and $Q$ moves upwards."),
        t("$R$ is on the next crest's slope, so $R$ moves downwards, in antiphase with $P$."),
        m("\\pi < \\theta_{PR} < 2\\pi", "phase difference between P and R"),
        m("\\underline{D}"),
      ],
    }],
  },
  {
    id: "q28",
    boxes: [{
      steps: [
        t("After a while the wave shifts to the left, as the dotted curve shows."),
        t("(1) $P$ is moving upwards. Correct."),
        t("(2) $Q$ and $S$ move in the same direction. Wrong."),
        t("(3) $R$ is moving downwards, not momentarily at rest. Wrong."),
        m("\\underline{A}"),
      ],
    }],
  },
  {
    id: "q29",
    boxes: [{
      steps: [
        h("(a)"),
        m("T = 0.25\\ \\text{s}"),
        m("f = \\frac{1}{0.25} = \\underline{4\\ \\text{Hz}}"),
        m("v = f\\lambda = 4 \\times 0.8 = \\underline{3.2\\ \\text{m s}^{-1}}"),
        h("(b)"),
        t("$0.125\\ \\text{s} = T/2$, so every particle is at the opposite displacement: $A$ at a trough, $C$ at a crest, $B$ and $D$ on the equilibrium line."),
        h("(c)"),
        t("$0.375\\ \\text{s} = 1.5T$, so the $t = 0$ waveform is turned over: $A$ at a trough, $C$ at a crest, $B$ and $D$ on the axis."),
        h("(d)"),
        t("$A$ starts at a crest, so its $s$–$t$ graph is a cosine: crest at $t = 0$, trough at $0.125\\ \\text{s}$, crest again at $0.25\\ \\text{s}$."),
        note("The key's graph (d) starts from zero; the figure prints A at a crest, so the graph starts at +A."),
      ],
    }],
  },
  {
    id: "q30",
    boxes: [{
      steps: [
        h("(a)"),
        m("\\lambda = \\frac{9\\ \\text{cm}}{2.25} = \\underline{4\\ \\text{cm}}", "P to T covers 2.25 wavelengths"),
        m("T = \\frac{7 - 3}{5} = 0.8\\ \\text{s}", "figure 13: five oscillations between 3 s and 7 s"),
        m("f = \\frac{1}{T} = \\underline{1.25\\ \\text{Hz}}"),
        m("v = f\\lambda = 1.25 \\times 4 = 5\\ \\text{cm s}^{-1}"),
        m("s = vt = 5 \\times 3 = \\underline{15\\ \\text{cm}}", "wave takes 3 s to reach S"),
        h("(b)"),
        m("\\text{(i) } \\underline{Q}"),
        m("\\text{(ii) } \\underline{S}"),
        h("(c)"),
        t("After a quarter of a period every particle is at its maximum displacement, so the crest that was at $P$ is now $4$ cm to the right; mark $S$ where the new waveform cuts the bead's position."),
      ],
    }],
  },
  {
    id: "q31",
    boxes: [{
      steps: [
        h("(a)"),
        m("1\\tfrac{1}{4}\\lambda = 12\\ \\text{cm} \\Rightarrow \\lambda = \\frac{4 \\times 12}{5} = \\underline{9.6\\ \\text{cm}}"),
        m("\\text{in } 0.3\\ \\text{s the wave travels } 1.5\\lambda = 1.5 \\times 0.096 = 0.144\\ \\text{m}"),
        m("v = \\frac{0.144}{0.3} = \\underline{0.48\\ \\text{m s}^{-1}}"),
        h("(b)"),
        m("\\text{moving upwards: } \\underline{c}"),
        m("\\text{moving downwards: } \\underline{a,\\ b,\\ e}"),
        m("\\text{momentarily at rest: } \\underline{d}"),
        h("(c)"),
        t("In $0.3$ s, $1.5$ complete waves are generated, so $T = \\frac{0.3}{1.5} = 0.2\\ \\text{s}$."),
        t("Measure time from $t = 0$: $0.4\\ \\text{s} = 2T$, so in $0.4$ s the waveform has moved forward $2\\lambda$."),
        t("The key's red figure compares $t = 0.3\\ \\text{s}$ with $t = 0.4\\ \\text{s}$, a gap of $T/2$, so on that figure the waveform moves only $\\lambda/2 = 4.8\\ \\text{cm}$."),
        h("(d)"),
        t("$d$ is at rest at $t = 0.3\\ \\text{s}$ and starts moving when the next disturbance arrives: its $s$–$t$ graph is zero until the wave reaches it, then a full oscillation of period $0.2\\ \\text{s}$."),
      ],
    }],
  },
  {
    id: "q32",
    boxes: [{
      steps: [
        h("(a)"),
        m("T = 2 \\times 2 = \\underline{4\\ \\text{s}}", "B repeats what A does"),
        h("(b)"),
        m("\\text{(i) } f = \\frac{1}{4} = \\underline{0.25\\ \\text{Hz}}"),
        m("\\text{(ii) } v = \\frac{0.45}{3} = \\underline{0.15\\ \\text{m s}^{-1}}"),
        m("\\text{(iii) } A = \\frac{8}{2} = \\underline{4\\ \\text{cm}}", "lowest to highest is twice the amplitude"),
        m("\\text{(iv) } \\lambda = \\frac{v}{f} = \\frac{0.15}{0.25} = \\underline{0.6\\ \\text{m}}"),
        h("(c)"),
        m("\\frac{0.45}{0.6} = \\underline{0.75\\lambda}"),
        h("(d)"),
        m("A \\text{ to } B = 0.75\\lambda", "three quarters of a wavelength"),
        m("\\text{displacement of } B = \\underline{0}", "0.75 wavelength from a crest is on the equilibrium line"),
        h("(e)"),
        t("Both corks have period $4$ s and amplitude $4$ cm."),
        t("$B$ repeats $A$'s motion half a period later."),
        t("Draw $B$'s curve $2$ s to the right of $A$'s."),
      ],
    }],
  },
  {
    id: "q33",
    boxes: [{
      steps: [
        h("(a)"),
        m("\\lambda = \\frac{0.9}{1.5} = 0.6\\ \\text{m}", "0.9 m covers 1.5 wavelengths"),
        m("v = \\frac{0.9}{0.6} = 1.5\\ \\text{m s}^{-1}"),
        m("\\text{distance travelled in } 2.2\\ \\text{s} = 1.5 \\times 2.2 = 3.3\\ \\text{m} = 5.5\\lambda"),
        m("\\text{distance of } P = 2.4\\ \\text{m} = 4\\lambda"),
        t("So the wavefront is $1.5\\lambda$ beyond $P$: draw $5.5$ wavelengths from the vibrator end and mark $P$ four wavelengths from it."),
        h("(b)"),
        m("\\text{time for the wave to reach } P = \\frac{2.4}{1.5} = 1.6\\ \\text{s}"),
        t("From $t = 1.6$ s to $2.2$ s is $0.6\\ \\text{s} = 1.5T$, so $P$ makes one and a half oscillations, starting upwards: crest, then trough."),
      ],
    }],
  },
  {
    id: "q34",
    boxes: [{
      steps: [
        h("(a)"),
        m("v = \\frac{0.24}{6} = \\underline{0.04\\ \\text{m s}^{-1}}", "wave reaches X in 6 s"),
        h("(b)"),
        m("T = \\frac{12 - 6}{1.5} = 4\\ \\text{s}", "1.5 oscillations in 6 s"),
        m("f = \\frac{1}{4} = \\underline{0.25\\ \\text{Hz}}"),
        m("v = f\\lambda:\\ 0.04 = 0.25\\lambda \\Rightarrow \\lambda = \\underline{0.16\\ \\text{m}}"),
        h("(c)"),
        t("At $t = 9\\ \\text{s}$ ($1.5T$ after the wave arrived) $X$ is momentarily at rest at its lowest position."),
        h("(d)"),
        t("$Y$ is $8$ cm further on, so the wave reaches it $\\frac{0.08}{0.04} = 2$ s later: draw $Y$'s graph as $X$'s curve shifted $2$ s to the right."),
        h("(e)"),
        t("At $t = 8$ s the wave has spread $0.04 \\times 8 = 0.32\\ \\text{m}$ from the vibrator, so the waveform runs from the vibrator to $Y$ with crests at $8$, $24$ and $32$ cm."),
      ],
    }],
  },
  {
    id: "q35",
    boxes: [{
      steps: [
        h("(a)"),
        m("\\underline{\\text{longitudinal}}", "the particles are displaced along the direction of travel"),
        h("(b)"),
        m("\\text{(i) centre of a compression: } \\underline{E}"),
        m("\\text{(ii) centre of a rarefaction: } \\underline{A \\text{ and } I}"),
        m("\\text{(iii) at rest momentarily: } \\underline{C,\\ G \\text{ and } K}"),
        note("The printed marking scheme lists C and K only; G is at the maximum displacement as well (-4.10 cm = -A), so it is momentarily at rest too."),
        h("(c)"),
        m("\\lambda = 2 \\times 20\\ \\text{cm} = \\underline{40\\ \\text{cm}}", "E to I is half a wavelength"),
        h("(d)"),
        m("\\text{(i) } f = \\frac{1}{0.2} = \\underline{5\\ \\text{Hz}}"),
        m("\\text{(ii) } v = f\\lambda = 5 \\times 0.4 = \\underline{2\\ \\text{m s}^{-1}}"),
        m("\\text{(iii) } A = \\underline{4\\ \\text{cm}}", "read from the grid"),
        h("(e)"),
        t("After a quarter of a period, $C$ is back at its equilibrium position."),
        t("At $t = 0$, $E$ is at the centre of a compression, where the particles have their maximum speed in the direction of travel — so in a quarter of a period $E$ moves a full amplitude ($4$ cm) to the right."),
      ],
    }],
  },
  {
    id: "q36",
    boxes: [{
      steps: [
        h("(a)"),
        m("\\text{(i) } A = \\underline{4\\ \\text{cm}}"),
        m("\\text{(ii) } \\lambda = \\underline{40\\ \\text{cm}}", "compression to compression is 8 squares of 5 cm"),
        h("(b)"),
        m("c: \\underline{\\text{right}},\\quad e: \\underline{\\text{at rest}},\\quad f: \\underline{\\text{left}}"),
        h("(c)"),
        m("f = \\frac{v}{\\lambda} = \\frac{5}{0.4} = \\underline{12.5\\ \\text{Hz}}"),
        h("(d)"),
        m("T = \\frac{1}{12.5} = 0.08\\ \\text{s}"),
        m("\\text{shortest time} = \\frac{T}{4} = \\underline{0.02\\ \\text{s}}", "e moves from a compression centre to equilibrium"),
        h("(e)"),
        t("$0.04\\ \\text{s} = T/2$, so every particle is at the opposite displacement: the compressions and rarefactions swap places, each moving $20$ cm."),
        h("(f)"),
        t("$g$ is at equilibrium at $t = 0$ and moves to the left (negative), so its graph starts at zero and goes down: trough at $0.02$ s, crest at $0.06$ s, then repeats to $0.16$ s."),
      ],
    }],
  },
];
