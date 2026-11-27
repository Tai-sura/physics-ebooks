// jpwm01 p01 — Transverse vs longitudinal waves (3D)
// Model: s(x,t) = A sin(2*pi*(x/lambda - t/T))  — the phase form signed for the
// p01 panel-5 film (physics-lead commit f638933), so BOTH pictures are one field.
// Values: A = 4 cm, lambda = 40 cm, T = 0.20 s (f = 5 Hz, v = 2.0 m/s) from q35.
import * as THREE from './vendor/three.module.js';

const LAM = 0.40, AMP = 0.04, PER = 0.20;
const K = 2 * Math.PI / LAM, W = 2 * Math.PI / PER;
const HALF_LAM = LAM / 2, QUARTER = LAM / 4;
const TAU = Math.PI * 2;

const sAt = (x, t) => AMP * Math.sin(K * x - W * t);
const vAt = (x, t) => -AMP * W * Math.cos(K * x - W * t);
const frac = (a) => a - Math.floor(a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const params = new URLSearchParams(location.search);
const startT = params.has('t') ? clamp(parseFloat(params.get('t')) || 0, 0, 2) * PER : 0;
const startYaw = (params.has('yaw') ? parseFloat(params.get('yaw')) : -16) * Math.PI / 180;
const startPitch = (params.has('pitch') ? parseFloat(params.get('pitch')) : 8) * Math.PI / 180;
const startPlaying = params.has('play') ? true : false;
const startSpeed = params.has('play') ? clamp(parseFloat(params.get('play')) || 1, 0.05, 4) : 1;

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0xfaf8f2, 1);
renderer.autoClear = false;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfaf8f2);

scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.9));
const sun = new THREE.DirectionalLight(0xffffff, 2.1);
sun.position.set(1.1, 2.0, 1.7);
scene.add(sun);
const fill = new THREE.DirectionalLight(0xffffff, 0.55);
fill.position.set(-1.4, 0.6, -1.1);
scene.add(fill);

const COL = {
  ink: 0x22303f,
  blue: 0x1f5fd0,
  red: 0xc8372a,
  grey: 0xb5ae9e,
  dim: 0xcfc8b8,
  spring: 0x8d97a6,
  paper: 0xfaf8f2,
};

const matInk = new THREE.MeshStandardMaterial({ color: COL.ink, roughness: 0.45, metalness: 0.05 });
const matRed = new THREE.MeshStandardMaterial({ color: COL.red, roughness: 0.42, metalness: 0.05 });
const matSpring = new THREE.MeshStandardMaterial({ color: COL.spring, roughness: 0.5, metalness: 0.15 });
const matBead = new THREE.MeshStandardMaterial({ color: 0x3d4b5c, roughness: 0.5, metalness: 0.05 });
const matGrey = new THREE.MeshStandardMaterial({ color: COL.grey, roughness: 0.7, metalness: 0 });
const matBlue = new THREE.MeshStandardMaterial({ color: COL.blue, roughness: 0.45, metalness: 0.05 });

/* ---------- deformable tube ---------- */
class Tube {
  constructor(nP, nR, radius, material) {
    this.nP = nP; this.nR = nR; this.r = radius;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(nP * nR * 3);
    this.nor = new Float32Array(nP * nR * 3);
    const idx = [];
    for (let i = 0; i < nP - 1; i++) {
      for (let j = 0; j < nR; j++) {
        const a = i * nR + j, b = i * nR + (j + 1) % nR;
        const c = (i + 1) * nR + j, d = (i + 1) * nR + (j + 1) % nR;
        idx.push(a, c, b, b, c, d);
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(this.nor, 3));
    g.setIndex(idx);
    this.geo = g;
    this.mesh = new THREE.Mesh(g, material);
    this.mesh.frustumCulled = false;
    this._t = new THREE.Vector3(); this._b = new THREE.Vector3(); this._n = new THREE.Vector3();
    this._d = new THREE.Vector3();
  }
  update(path, radial) {
    const { nP, nR, r } = this;
    const pos = this.pos, nor = this.nor;
    for (let i = 0; i < nP; i++) {
      const p0 = path[Math.max(0, i - 1)], p1 = path[Math.min(nP - 1, i + 1)];
      const T = this._t.copy(p1).sub(p0).normalize();
      const R = radial[i];
      const B = this._b.crossVectors(T, R);
      if (B.lengthSq() < 1e-10) B.set(0, 0, 1);
      B.normalize();
      const N = this._n.crossVectors(B, T).normalize();
      const p = path[i];
      for (let j = 0; j < nR; j++) {
        const th = TAU * j / nR;
        const cx = Math.cos(th), sx = Math.sin(th);
        const nx = N.x * cx + B.x * sx, ny = N.y * cx + B.y * sx, nz = N.z * cx + B.z * sx;
        const k = (i * nR + j) * 3;
        pos[k] = p.x + r * nx; pos[k + 1] = p.y + r * ny; pos[k + 2] = p.z + r * nz;
        nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
      }
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.normal.needsUpdate = true;
  }
}

/* ---------- arrow (shaft + head, points +y at rest) ---------- */
function makeArrow(color, shaftR, headR, headL) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(shaftR, shaftR, 1, 10), mat);
  shaft.name = 'shaft';
  const head = new THREE.Mesh(new THREE.ConeGeometry(headR, headL, 14), mat);
  head.name = 'head';
  g.add(shaft, head);
  g.userData = { shaft, head, headL, minL: headL + 0.006 };
  return g;
}
const _up = new THREE.Vector3(0, 1, 0);
function setArrow(g, from, dir, length) {
  const d = dir.clone().normalize();
  g.quaternion.setFromUnitVectors(_up, d);
  g.position.copy(from);
  const { shaft, head, headL, minL } = g.userData;
  const L = Math.max(length, minL);
  shaft.scale.set(1, Math.max(1e-4, L - headL), 1);
  shaft.position.set(0, (L - headL) * 0.5, 0);
  head.position.set(0, L - headL * 0.5, 0);
  g.visible = length > 1e-4;
}

/* ---------- dashed line helper ---------- */
function dashedLine(points, color, dash = 0.008, gap = 0.006) {
  const g = new THREE.BufferGeometry().setFromPoints(points);
  const m = new THREE.LineDashedMaterial({ color, dashSize: dash, gapSize: gap, transparent: true, opacity: 0.85 });
  const l = new THREE.Line(g, m);
  l.computeLineDistances();
  return l;
}

/* ---------- labels ---------- */
function makeLabel(view, text, cls = '') {
  const el = document.createElement('div');
  el.className = 'lbl ' + cls;
  el.textContent = text;
  view.appendChild(el);
  return { el, text };
}

/* ---------- strip A: transverse ---------- */
function buildTransverse() {
  const g = new THREE.Group();
  g.position.set(0, 1.35, 0);

  // equilibrium axis
  const axis = dashedLine([new THREE.Vector3(-0.02, 0, 0), new THREE.Vector3(0.82, 0, 0)], COL.grey, 0.006, 0.006);
  g.add(axis);

  // string
  const NH = 241;
  const tube = new Tube(NH, 8, 0.0042, matInk);
  g.add(tube.mesh);
  const capGeoA = new THREE.SphereGeometry(0.0042, 10, 8);
  const cap0 = new THREE.Mesh(capGeoA, matInk), cap1 = new THREE.Mesh(capGeoA, matInk);
  g.add(cap0, cap1);
  const path = Array.from({ length: NH }, () => new THREE.Vector3());
  const radial = Array.from({ length: NH }, () => new THREE.Vector3(0, 0, 1));

  // beads
  const NBEAD = 17;
  const beadGeo = new THREE.SphereGeometry(0.0072, 14, 10);
  const beads = new THREE.InstancedMesh(beadGeo, matBead, NBEAD);
  beads.frustumCulled = false;
  g.add(beads);
  const beadX = Array.from({ length: NBEAD }, (_, i) => i * LAM / 8);

  // P (highlighted particle at x = lambda/2)
  const pX = HALF_LAM;
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.0115, 20, 14), matRed);
  g.add(p);
  // small equilibrium tick under the axis for P
  const pTick = dashedLine([
    new THREE.Vector3(pX, -0.012, 0), new THREE.Vector3(pX, -0.030, 0),
  ], COL.red, 0.004, 0.004);
  g.add(pTick);

  // markers for labels
  const crest = new THREE.Object3D(); const trough = new THREE.Object3D();
  g.add(crest, trough);

  // lambda bracket (rides two successive crests)
  const brGeo = new THREE.BufferGeometry();
  brGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
  const brMat = new THREE.LineBasicMaterial({ color: COL.grey, transparent: true, opacity: 0.95 });
  const bracket = new THREE.LineSegments(brGeo, brMat);
  bracket.frustumCulled = false;
  g.add(bracket);
  const bracketMid = new THREE.Object3D(); g.add(bracketMid);
  setBracket(bracket, 0.10, 0.50, 0.075, 0.095);      // lambda = crest-to-crest
  bracketMid.position.set(0.30, 0.108, 0);

  // propagation arrow (fixed, +x)
  const waveArrow = makeArrow(COL.blue, 0.0034, 0.0092, 0.02);
  setArrow(waveArrow, new THREE.Vector3(0.03, -0.112, 0), new THREE.Vector3(1, 0, 0), 0.20);
  g.add(waveArrow);

  // particle-motion arrow (rides P)
  const pArrow = makeArrow(COL.red, 0.0032, 0.0088, 0.019);
  g.add(pArrow);

  scene.add(g);

  return {
    group: g, tube, path, radial, beads, beadX,
    p, pX, crest, trough, bracket, bracketMid, waveArrow, pArrow,
    cap0, cap1,
    pArrowTip: new THREE.Object3D(),
  };
}

/* ---------- strip B: longitudinal ---------- */
function buildLongitudinal() {
  const g = new THREE.Group();
  g.position.set(0, -1.35, 0);

  const axis = dashedLine([new THREE.Vector3(-0.02, 0, 0), new THREE.Vector3(0.82, 0, 0)], COL.grey, 0.006, 0.006);
  g.add(axis);

  // spring: material coordinate u in turns, 25 turns over 0.8 m
  const TURNS = 16, PER_TURN = 16;
  const NP = TURNS * PER_TURN + 1;
  const state = { coilR: 0.026 };
  const tube = new Tube(NP, 6, 0.0019, matSpring);
  g.add(tube.mesh);
  const capGeoB = new THREE.SphereGeometry(0.0019, 8, 6);
  const capB0 = new THREE.Mesh(capGeoB, matSpring), capB1 = new THREE.Mesh(capGeoB, matSpring);
  g.add(capB0, capB1);
  const path = Array.from({ length: NP }, () => new THREE.Vector3());
  const radial = Array.from({ length: NP }, () => new THREE.Vector3());
  const pathX = new Float32Array(NP);

  // particles (beads) + equilibrium ticks
  const NB = 25;
  const beadGeo = new THREE.SphereGeometry(0.0076, 14, 10);
  const beads = new THREE.InstancedMesh(beadGeo, matBead, NB);
  beads.frustumCulled = false;
  beads.material = matBead.clone();
  beads.material.depthTest = false;
  beads.renderOrder = 3;
  g.add(beads);
  const beadEq = Array.from({ length: NB }, (_, i) => i * LAM * 2 / (NB - 1));

  const tickPts = [];
  for (let i = 0; i < NB; i++) {
    tickPts.push(new THREE.Vector3(beadEq[i], -0.048, 0), new THREE.Vector3(beadEq[i], -0.068, 0));
  }
  const ticks = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(tickPts),
    new THREE.LineBasicMaterial({ color: COL.grey, transparent: true, opacity: 0.9 })
  );
  g.add(ticks);

  const pX = HALF_LAM;
  const pTickPts = [new THREE.Vector3(pX, -0.044, 0), new THREE.Vector3(pX, -0.074, 0)];
  const pTick = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pTickPts),
    new THREE.LineBasicMaterial({ color: COL.red })
  );
  g.add(pTick);

  const p = new THREE.Mesh(new THREE.SphereGeometry(0.0115, 20, 14), matRed.clone());
  p.material.depthTest = false;
  p.renderOrder = 4;
  g.add(p);

  const comp = new THREE.Object3D(); const rare = new THREE.Object3D();
  g.add(comp, rare);

  const brGeo = new THREE.BufferGeometry();
  brGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
  const bracket = new THREE.LineSegments(brGeo, new THREE.LineBasicMaterial({ color: COL.grey, transparent: true, opacity: 0.95 }));
  bracket.frustumCulled = false;
  g.add(bracket);
  const bracketMid = new THREE.Object3D(); g.add(bracketMid);
  setBracket(bracket, 0.20, 0.60, 0.075, 0.095);      // lambda = compression-to-compression
  bracketMid.position.set(0.40, 0.108, 0);

  const waveArrow = makeArrow(COL.blue, 0.0034, 0.0092, 0.02);
  setArrow(waveArrow, new THREE.Vector3(0.03, -0.132, 0), new THREE.Vector3(1, 0, 0), 0.20);
  g.add(waveArrow);

  const pArrow = makeArrow(COL.red, 0.0032, 0.0088, 0.019);
  g.add(pArrow);

  scene.add(g);

  return {
    group: g, tube, path, radial, pathX, TURNS, PER_TURN, state,
    beads, beadEq, p, pX, comp, rare, bracket, bracketMid, waveArrow, pArrow, ticks, pTick,
    cap0: capB0, cap1: capB1,
  };
}

const A = buildTransverse();
const B = buildLongitudinal();

/* ---------- views & cameras ---------- */
const viewAEl = document.getElementById('viewA');
const viewBEl = document.getElementById('viewB');
const FOV = 14;
const state = {
  t: startT, playing: startPlaying, speed: startSpeed,
  yaw: startYaw, pitch: startPitch, dirty: true,
};
const views = [
  {
    el: viewAEl, group: A.group, targetY: -0.012, cam: new THREE.OrthographicCamera(-0.5, 0.5, 0.15, -0.15, 0.01, 20), labels: [], strip: A,
  },
  {
    el: viewBEl, group: B.group, targetY: -0.012, cam: new THREE.OrthographicCamera(-0.5, 0.5, 0.15, -0.15, 0.01, 20), labels: [], strip: B,
  },
];

views[0].labels = {
  crest: makeLabel(viewAEl, 'crest'), trough: makeLabel(viewAEl, 'trough'),
  p: makeLabel(viewAEl, 'P', 'red'), wave: makeLabel(viewAEl, 'wave travel', 'blue'),
  motion: makeLabel(viewAEl, 'particle motion', 'red'), lam: makeLabel(viewAEl, 'λ', 'grey'),
  axis: makeLabel(viewAEl, 'equilibrium position', 'grey'),
};
views[1].labels = {
  comp: makeLabel(viewBEl, 'compression'), rare: makeLabel(viewBEl, 'rarefaction'),
  p: makeLabel(viewBEl, 'P', 'red'), wave: makeLabel(viewBEl, 'wave travel', 'blue'),
  motion: makeLabel(viewBEl, 'particle motion', 'red'), lam: makeLabel(viewBEl, 'λ', 'grey'),
  axis: makeLabel(viewBEl, 'equilibrium positions', 'grey'),
};

function frameCamera(v, aspect) {
  const xHalf = aspect >= 2.4 ? 0.50 : aspect >= 1.8 ? 0.42 : 0.30;
  let halfH = Math.max(0.145, xHalf / aspect);
  const target = new THREE.Vector3(0.40, v.group.position.y + v.targetY, 0);
  const dir = new THREE.Vector3(
    Math.sin(state.yaw) * Math.cos(state.pitch),
    Math.sin(state.pitch),
    Math.cos(state.yaw) * Math.cos(state.pitch)
  );
  v.cam.left = -halfH * aspect;
  v.cam.right = halfH * aspect;
  v.cam.top = halfH;
  v.cam.bottom = -halfH;
  v.cam.position.copy(target).addScaledVector(dir, 3);
  v.cam.lookAt(target);
  v.cam.updateProjectionMatrix();
  v.halfH = halfH;
  v.halfW = halfH * aspect;
}

/* ---------- geometry updates ---------- */
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpS = new THREE.Vector3(1, 1, 1);
const tmpP = new THREE.Vector3();

function updateTransverse(t) {
  const { path, radial, tube, beads, beadX, p, crest, trough, pArrow, cap0, cap1 } = A;
  for (let i = 0; i < path.length; i++) {
    const x = (i / (path.length - 1)) * 0.80;
    path[i].set(x, sAt(x, t), 0);
  }
  tube.update(path, radial);
  cap0.position.copy(path[0]);
  cap1.position.copy(path[path.length - 1]);

  for (let i = 0; i < beadX.length; i++) {
    tmpP.set(beadX[i], sAt(beadX[i], t), 0);
    tmpM.compose(tmpP, tmpQ.identity(), tmpS);
    beads.setMatrixAt(i, tmpM);
  }
  beads.instanceMatrix.needsUpdate = true;

  // P
  const sP = sAt(A.pX, t), vP = vAt(A.pX, t);
  p.position.set(A.pX, sP, 0);

  // crest / trough in view (crest to crest = lambda)
  const phase = frac(t / PER);
  const cX = QUARTER + phase * LAM;          // 0.10 .. 0.50
  crest.position.set(cX, AMP, 0);
  trough.position.set(cX + HALF_LAM, -AMP, 0);
  const bx0 = pickBracket(cX), bx1 = bx0 + LAM;
  setBracket(A.bracket, bx0, bx1, 0.075, 0.095);
  A.bracketMid.position.set((bx0 + bx1) / 2, 0.108, 0);

  // particle-motion arrow: length proportional to |v|, hidden at rest
  const vmax = AMP * W;
  const L = 0.055 * Math.abs(vP) / vmax;
  const dir = new THREE.Vector3(0, Math.sign(vP) || 1, 0);
  setArrow(pArrow, new THREE.Vector3(A.pX, sP, 0), dir, L);

  return { sP, vP, crestX: cX, crestX0: bx0, crestX1: bx1 };
}

function updateLongitudinal(t) {
  const { path, radial, pathX, tube, beads, beadEq, p, comp, rare, pArrow, TURNS, PER_TURN, state: st, cap0, cap1 } = B;
  const NP = path.length;
  for (let k = 0; k < NP; k++) {
    const u = k / PER_TURN;                       // turns
    const xEq = (k / (NP - 1)) * 0.80;
    const x = xEq + sAt(xEq, t);
    const phi = TAU * u;
    path[k].set(x, st.coilR * Math.cos(phi), st.coilR * Math.sin(phi));
    radial[k].set(0, Math.cos(phi), Math.sin(phi));
    pathX[k] = xEq;
  }
  tube.update(path, radial);
  cap0.position.copy(path[0]);
  cap1.position.copy(path[path.length - 1]);

  for (let i = 0; i < beadEq.length; i++) {
    const x = beadEq[i] + sAt(beadEq[i], t);
    tmpP.set(x, 0, 0);
    tmpM.compose(tmpP, tmpQ.identity(), tmpS);
    beads.setMatrixAt(i, tmpM);
  }
  beads.instanceMatrix.needsUpdate = true;

  const sP = sAt(B.pX, t), vP = vAt(B.pX, t);
  p.position.set(B.pX + sP, 0, 0);

  // compression / rarefaction centres (the printed p01 panel-5 labels ride the wave)
  const phase = frac(t / PER);
  const cX = HALF_LAM + phase * LAM;          // 0.20 .. 0.60
  comp.position.set(cX, 0, 0);
  rare.position.set(cX - HALF_LAM, 0, 0);
  const bx0 = pickBracket(cX), bx1 = bx0 + LAM;
  setBracket(B.bracket, bx0, bx1, 0.075, 0.095);
  B.bracketMid.position.set((bx0 + bx1) / 2, 0.108, 0);

  const vmax = AMP * W;
  const L = 0.055 * Math.abs(vP) / vmax;
  const dir = new THREE.Vector3(Math.sign(vP) || 1, 0, 0);
  setArrow(pArrow, new THREE.Vector3(B.pX + sP, 0, 0), dir, L);

  return { sP, vP, compX: cX, compX0: bx0, compX1: bx1 };
}

function pickBracket(base) {
  const cands = [];
  for (let k = -1; k <= 1; k++) {
    const x0 = base + k * LAM;
    if (x0 >= 0.015 && x0 + LAM <= 0.805) cands.push(x0);
  }
  if (!cands.length) return base;
  cands.sort((a, b) => Math.abs(a + 0.2 - 0.40) - Math.abs(b + 0.2 - 0.40));
  return cands[0];
}

function setBracket(line, x0, x1, y0, y1) {
  const arr = line.geometry.attributes.position.array;
  // three segments: left tick, right tick, cross bar
  const pts = [
    x0, y0, 0, x0, y1, 0,
    x1, y0, 0, x1, y1, 0,
    x0, y1, 0, x1, y1, 0,
  ];
  for (let i = 0; i < 18; i++) arr[i] = pts[i];
  line.geometry.attributes.position.needsUpdate = true;
  line.geometry.computeBoundingSphere();
}

/* ---------- labels ---------- */
const _v3 = new THREE.Vector3();
const _w1 = new THREE.Vector3();
const _w2 = new THREE.Vector3();

function placeLabel(v, label, worldPos, dy = 0, dx = 0) {
  if (!label) return;
  const r = v.rect;
  if (!r || r.width < 4) return;
  _v3.copy(worldPos);
  _v3.y += dy;
  _v3.project(v.cam);
  let x = (_v3.x * 0.5 + 0.5) * r.width + dx;
  const y = (-_v3.y * 0.5 + 0.5) * r.height;
  if (!isFinite(x) || !isFinite(y) || x < -70 || x > r.width + 70 || y < -24 || y > r.height + 24) {
    label.el.style.display = 'none';
    return;
  }
  if (!label.w) label.w = label.el.offsetWidth || 60;
  const half = label.w / 2 + 3;
  x = Math.min(r.width - half, Math.max(half, x));
  label.el.style.display = '';
  label.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%,-50%)`;
}

function arrowTipLocal(strip, t) {
  const vmax = AMP * W;
  const L = 0.055 * Math.abs(vAt(strip.pX, t)) / vmax;
  const d = new THREE.Vector3(0, 1, 0).applyQuaternion(strip.pArrow.quaternion).multiplyScalar(Math.max(L, strip.pArrow.userData.minL));
  return d.add(strip.p.position);
}

function updateLabels() {
  const va = views[0], vb = views[1];
  const la = va.labels, lb = vb.labels;
  // A — transverse
  placeLabel(va, la.crest, A.crest.getWorldPosition(_w1), 0.024);
  placeLabel(va, la.trough, A.trough.getWorldPosition(_w1), -0.032);
  placeLabel(va, la.p, A.p.getWorldPosition(_w1), -0.030);
  placeLabel(va, la.wave, A.group.localToWorld(new THREE.Vector3(0.30, -0.126, 0)), 0.0);
  if (A.pArrow.visible) placeLabel(va, la.motion, A.group.localToWorld(arrowTipLocal(A, state.t)), 0.012, 34);
  else la.motion.el.style.display = 'none';
  placeLabel(va, la.lam, A.bracketMid.getWorldPosition(_w1), 0.0);
  placeLabel(va, la.axis, A.group.localToWorld(new THREE.Vector3(-0.02, -0.062, 0)), 0.0);
  // B — longitudinal
  placeLabel(vb, lb.comp, B.comp.getWorldPosition(_w1), 0.042);
  placeLabel(vb, lb.rare, B.rare.getWorldPosition(_w1), -0.040);
  placeLabel(vb, lb.p, B.p.getWorldPosition(_w1).add(new THREE.Vector3(-0.035, -0.034, 0)), 0);
  placeLabel(vb, lb.wave, B.group.localToWorld(new THREE.Vector3(0.30, -0.146, 0)), 0.0);
  if (B.pArrow.visible) placeLabel(vb, lb.motion, B.group.localToWorld(arrowTipLocal(B, state.t)), -0.042, 14);
  else lb.motion.el.style.display = 'none';
  placeLabel(vb, lb.lam, B.bracketMid.getWorldPosition(_w1), 0.0);
  placeLabel(vb, lb.axis, B.group.localToWorld(new THREE.Vector3(0.02, -0.092, 0)), 0.0);
}

/* ---------- render ---------- */
function render() {
  renderer.setScissorTest(false);
  renderer.clear();
  renderer.setScissorTest(true);
  for (const v of views) {
    const r = v.el.getBoundingClientRect();
    v.rect = r;
    if (r.width < 4 || r.height < 4) continue;
    frameCamera(v, r.width / r.height);
    const y = window.innerHeight - r.bottom;
    renderer.setViewport(r.left, y, r.width, r.height);
    renderer.setScissor(r.left, y, r.width, r.height);
    renderer.render(scene, v.cam);
  }
  renderer.setScissorTest(false);
  updateLabels();
  window.__ready = true;
}

/* ---------- UI ---------- */
const btnPlay = document.getElementById('play');
const btnReset = document.getElementById('reset');
const slider = document.getElementById('time');
const tval = document.getElementById('tval');
const stateA = document.getElementById('stateA');
const stateB = document.getElementById('stateB');
const speedBtns = [...document.querySelectorAll('#speed button')];

function pStateA() {
  const v = vAt(A.pX, state.t);
  if (Math.abs(v) < 1e-6) return 'P: at rest';
  return v > 0 ? 'P: moving up' : 'P: moving down';
}
function pStateB() {
  const v = vAt(B.pX, state.t);
  if (Math.abs(v) < 1e-6) return 'P: at rest';
  return v > 0 ? 'P: moving right' : 'P: moving left';
}
function syncUI() {
  tval.textContent = `t / T = ${(state.t / PER).toFixed(3)}`;
  slider.value = (state.t / PER).toFixed(3);
  stateA.textContent = pStateA();
  stateB.textContent = pStateB();
  btnPlay.textContent = state.playing ? 'Pause' : 'Play';
  speedBtns.forEach((b) => b.classList.toggle('on', Math.abs(parseFloat(b.dataset.speed) - state.speed) < 1e-9));
}
function setT(t) {
  state.t = ((t % (2 * PER)) + 2 * PER) % (2 * PER);
  syncUI();
  state.dirty = true;
}
btnPlay.addEventListener('click', () => {
  state.playing = !state.playing;
  syncUI();
  state.dirty = true;
});
btnReset.addEventListener('click', () => {
  state.playing = false;
  state.speed = 1;
  state.yaw = startYaw; state.pitch = startPitch;
  setT(0);
  state.dirty = true;
});
slider.addEventListener('input', () => {
  state.playing = false;
  setT(parseFloat(slider.value) * PER);
});
speedBtns.forEach((b) => b.addEventListener('click', () => {
  state.speed = parseFloat(b.dataset.speed);
  syncUI();
  state.dirty = true;
}));

document.addEventListener('keydown', (e) => {
  if (e.target && /INPUT|BUTTON/.test(e.target.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); btnPlay.click(); }
  else if (e.key === 'r' || e.key === 'R') btnReset.click();
  else if (e.key === 'ArrowLeft') { state.yaw += 0.06; state.dirty = true; }
  else if (e.key === 'ArrowRight') { state.yaw -= 0.06; state.dirty = true; }
});

/* drag to orbit (either panel; both views share the camera angles) */
let drag = null;
for (const v of views) {
  v.el.addEventListener('pointerdown', (e) => {
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    v.el.setPointerCapture(e.pointerId);
    v.el.classList.add('drag');
  });
  v.el.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    state.yaw = clamp(state.yaw - dx * 0.006, -1.2, 1.2);
    state.pitch = clamp(state.pitch + dy * 0.004, -0.12, 0.45);
    state.dirty = true;
  });
  const end = (e) => {
    if (drag && e.pointerId === drag.id) {
      drag = null;
      v.el.classList.remove('drag');
    }
  };
  v.el.addEventListener('pointerup', end);
  v.el.addEventListener('pointercancel', end);
}

/* ---------- probe API (measurements read the drawn objects) ---------- */
window.__app = { renderer, scene, views, state, model: { LAM, AMP, PER, W, sAt, vAt } };
window.__setT = (sec) => { state.playing = false; setT(sec); };
window.__setView = (yawDeg, pitchDeg) => {
  state.yaw = yawDeg * Math.PI / 180;
  state.pitch = pitchDeg * Math.PI / 180;
  state.dirty = true;
};
window.__nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
window.__probe = () => {
  const q = (o) => [o.position.x, o.position.y, o.position.z];
  const arrowDir = (g) => {
    const d = new THREE.Vector3(0, 1, 0).applyQuaternion(g.quaternion);
    return [d.x, d.y, d.z];
  };
  const aTip = new THREE.Vector3(0, 0.055 * Math.abs(vAt(A.pX, state.t)) / (AMP * W), 0).applyQuaternion(A.pArrow.quaternion).add(A.p.position);
  const bTip = new THREE.Vector3(0.055 * Math.abs(vAt(B.pX, state.t)) / (AMP * W), 0, 0).applyQuaternion(B.pArrow.quaternion).add(B.p.position);
  const beadPos = (mesh, n) => {
    const m = new THREE.Matrix4(), out = [];
    for (let i = 0; i < n; i++) {
      mesh.getMatrixAt(i, m);
      out.push([m.elements[12], m.elements[13], m.elements[14]]);
    }
    return out;
  };
  return {
    t: state.t, tOverT: state.t / PER, playing: state.playing, speed: state.speed,
    yaw: state.yaw, pitch: state.pitch,
    lam: LAM, amp: AMP, per: PER,
    A: {
      p: q(A.p), pEqX: A.pX,
      crest: q(A.crest), trough: q(A.trough),
      bracket: [A.crestX0 ?? null, A.crestX1 ?? null],
      bracketMid: q(A.bracketMid),
      arrowDir: arrowDir(A.pArrow), arrowVisible: A.pArrow.visible, arrowTip: [aTip.x, aTip.y, aTip.z],
      beads: beadPos(A.beads, 17),
    },
    B: {
      p: q(B.p), pEqX: B.pX,
      comp: q(B.comp), rare: q(B.rare),
      bracket: [B.compX0 ?? null, B.compX1 ?? null],
      bracketMid: q(B.bracketMid),
      arrowDir: arrowDir(B.pArrow), arrowVisible: B.pArrow.visible, arrowTip: [bTip.x, bTip.y, bTip.z],
      beads: beadPos(B.beads, 25),
      ticksY: [-0.048, -0.068],
    },
    modelValues: {
      sP_A: sAt(A.pX, state.t), vP_A: vAt(A.pX, state.t),
      sP_B: sAt(B.pX, state.t), vP_B: vAt(B.pX, state.t),
      crestX: QUARTER + frac(state.t / PER) * LAM,
      compX: HALF_LAM + frac(state.t / PER) * LAM,
    },
  };
};
// keep bracket ends on the probe
const _uT = updateTransverse, _uL = updateLongitudinal;
function refresh(t) {
  const ra = _uT(t), rb = _uL(t);
  A.crestX0 = ra.crestX0; A.crestX1 = ra.crestX1;
  B.compX0 = rb.compX0; B.compX1 = rb.compX1;
}

/* ---------- loop ---------- */
let last = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (state.playing) {
    state.t = (state.t + dt * state.speed) % (2 * PER);
    state.dirty = true;
    syncUI();
  }
  if (state.dirty) {
    refresh(state.t);
    render();
    state.dirty = false;
  }
  requestAnimationFrame(tick);
}

/* ---------- boot ---------- */
const ro = new ResizeObserver(() => { state.dirty = true; });
ro.observe(viewAEl); ro.observe(viewBEl);

function resize() {
  const w = Math.max(1, window.innerWidth);
  const h = Math.max(1, window.innerHeight);
  renderer.setSize(w, h, false);
  for (const v of views) for (const k in v.labels) v.labels[k].w = 0;
  state.dirty = true;
}
window.addEventListener('resize', resize);
resize();

refresh(state.t);
syncUI();
render();
requestAnimationFrame(tick);
