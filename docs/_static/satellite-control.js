import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Practical example (Control > Practical Example): a real-time quaternion
// attitude controller. A rigid satellite (unit inertia) is driven by a PID
// law on the attitude error to point either its +Z axis at the Sun or its
// -Z axis at the Earth. The quaternion kinematics / dynamics run on the
// backend; the reader only tunes Kp, Ki, Kd and picks a target.

// Overall on-screen size of the satellite. Hand-tune this one number:
// smaller = smaller satellite in the view (the pointing rays keep their
// length, so they still reach out toward the Sun / Earth).
const SAT_SCALE = 0.55;

const BUS_HEIGHT = 30;
const BUS_SIDE = 10;
const PANEL_LENGTH = 30;
const PANEL_WIDTH = 10;
const PANEL_THICKNESS = 0.6;

// Rolling pointing-error plot.
const PLOT_WINDOW = 18; // seconds shown on the time axis
const PLOT_ERR_COL = "#d7263d";

function cssVar(name, fallback) {
  const v = getComputedStyle(document.body).getPropertyValue(name);
  return v ? v.trim() : fallback;
}

// Scene placement of the two celestial targets (world frame, Z up).
const SUN_POS = new THREE.Vector3(1, 0.15, 0.5).normalize().multiplyScalar(42);
const EARTH_POS = new THREE.Vector3(-0.35, -1, -0.3).normalize().multiplyScalar(38);
const SUN_DIR = SUN_POS.clone().normalize();
const EARTH_DIR = EARTH_POS.clone().normalize();

// Small constant body-frame disturbance torque, so that pure PD leaves a
// small steady-state pointing error that integral action can remove.
const DIST = new THREE.Vector3(0.06, 0.04, 0.02);
const I_MAX = 0.6; // integral clamp (anti-windup)

function makeSolarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#12213a";
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "#3a5a8c";
  ctx.lineWidth = 3;
  for (let i = 0; i <= 128; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  return tex;
}

function makeEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1c4f86";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#3a8f5b";
  for (let i = 0; i < 22; i++) {
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * 128,
      Math.random() * 128,
      6 + Math.random() * 12,
      5 + Math.random() * 9,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function makeAxisTriad(length) {
  const group = new THREE.Group();
  const specs = [
    { dir: new THREE.Vector3(1, 0, 0), color: 0xd7263d },
    { dir: new THREE.Vector3(0, 1, 0), color: 0x2ea043 },
    { dir: new THREE.Vector3(0, 0, 1), color: 0x2f6fed },
  ];
  for (const { dir, color } of specs) {
    const end = dir.clone().multiplyScalar(length);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), end]),
      new THREE.LineBasicMaterial({ color, depthTest: false })
    );
    line.renderOrder = 10;
    group.add(line);
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 2.4, 12),
      new THREE.MeshBasicMaterial({ color, depthTest: false })
    );
    cone.position.copy(end);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    cone.renderOrder = 10;
    group.add(cone);
  }
  return group;
}

function buildSatellite() {
  // Centered on the origin so it rotates in place.
  const g = new THREE.Group();

  // The physical satellite (bus + panels + body axes) sits in an inner group
  // scaled by SAT_SCALE; the boresight rays live on the outer group so they
  // keep their length regardless of the satellite's on-screen size.
  const body = new THREE.Group();

  const busGeom = new THREE.BoxGeometry(BUS_SIDE, BUS_SIDE, BUS_HEIGHT);
  const busMesh = new THREE.Mesh(
    busGeom,
    new THREE.MeshStandardMaterial({ color: 0xb0b4bb, metalness: 0.5, roughness: 0.45 })
  );
  body.add(busMesh);
  body.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(busGeom),
      new THREE.LineBasicMaterial({ color: 0x2b2f36 })
    )
  );

  const panelGeom = new THREE.BoxGeometry(PANEL_LENGTH, PANEL_WIDTH, PANEL_THICKNESS);
  panelGeom.translate(PANEL_LENGTH / 2, 0, 0);
  const panelMat = new THREE.MeshStandardMaterial({
    map: makeSolarTexture(),
    metalness: 0.2,
    roughness: 0.35,
  });
  const pivot = new THREE.Group();
  pivot.position.set(0, 0, BUS_HEIGHT / 2); // top face
  body.add(pivot);
  for (let i = 0; i < 4; i++) {
    const panel = new THREE.Mesh(panelGeom, panelMat);
    panel.rotation.z = (i * Math.PI) / 2;
    pivot.add(panel);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(panelGeom),
      new THREE.LineBasicMaterial({ color: 0x0a1830 })
    );
    edges.rotation.z = panel.rotation.z;
    pivot.add(edges);
  }

  body.add(makeAxisTriad(24));
  body.scale.setScalar(SAT_SCALE);
  g.add(body);

  // +Z boresight ray (solid) and -Z (dashed), to read the pointing direction.
  const zRay = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 46),
    ]),
    new THREE.LineBasicMaterial({ color: 0x2f6fed, transparent: true, opacity: 0.6 })
  );
  g.add(zRay);
  const zRayNeg = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -46),
    ]),
    new THREE.LineDashedMaterial({
      color: 0x2f6fed,
      dashSize: 2,
      gapSize: 1.4,
      transparent: true,
      opacity: 0.5,
    })
  );
  zRayNeg.computeLineDistances();
  g.add(zRayNeg);

  return g;
}

function buildSun() {
  const g = new THREE.Group();
  g.position.copy(SUN_POS);
  g.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(5, 24, 18),
      new THREE.MeshBasicMaterial({ color: 0xffcf3f })
    )
  );
  g.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(7, 24, 18),
      new THREE.MeshBasicMaterial({ color: 0xffe58a, transparent: true, opacity: 0.25 })
    )
  );
  return g;
}

function buildEarth() {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(8, 32, 24),
    new THREE.MeshStandardMaterial({ map: makeEarthTexture(), metalness: 0.1, roughness: 0.85 })
  );
  mesh.position.copy(EARTH_POS);
  return mesh;
}

function targetLine(dir, color) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      dir.clone().multiplyScalar(46),
    ]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })
  );
}

function init() {
  const container = document.getElementById("sat-canvas-wrap");
  if (!container) return;
  const canvas = document.getElementById("sat-canvas");

  const kpEl = document.getElementById("sat-kp");
  const kiEl = document.getElementById("sat-ki");
  const kdEl = document.getElementById("sat-kd");
  const kpVal = document.getElementById("sat-kp-val");
  const kiVal = document.getElementById("sat-ki-val");
  const kdVal = document.getElementById("sat-kd-val");
  const sunBtn = document.getElementById("sat-sun");
  const earthBtn = document.getElementById("sat-earth");
  const errEl = document.getElementById("sat-error");
  const plotWrap = document.getElementById("sat-plot-wrap");
  const plotCanvas = document.getElementById("sat-plot-canvas");
  const pctx = plotCanvas.getContext("2d");

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
  camera.up.set(0, 0, 1);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sunLight = new THREE.DirectionalLight(0xfff2cc, 1.05);
  sunLight.position.copy(SUN_POS);
  scene.add(sunLight);
  const fill = new THREE.DirectionalLight(0xaecbff, 0.3);
  fill.position.copy(EARTH_POS);
  scene.add(fill);

  scene.add(targetLine(SUN_DIR, 0xffcf3f));
  scene.add(targetLine(EARTH_DIR, 0x4d9bff));
  scene.add(buildSun());
  scene.add(buildEarth());

  const sat = buildSatellite();
  scene.add(sat);

  // --- Attitude state (unit inertia rigid body) ---
  const q = new THREE.Quaternion(); // body -> world
  const omega = new THREE.Vector3(); // body-frame angular velocity
  const integ = new THREE.Vector3(); // integral of attitude error
  const qRef = new THREE.Quaternion();
  let target = "sun";

  function setTarget(name) {
    target = name;
    // qRef maps body +Z (0,0,1) to the desired world direction.
    const desiredZ = name === "sun" ? SUN_DIR : EARTH_DIR.clone().negate();
    qRef.setFromUnitVectors(new THREE.Vector3(0, 0, 1), desiredZ);
    integ.set(0, 0, 0); // reset integral to avoid windup carry-over
    sunBtn.classList.toggle("active", name === "sun");
    earthBtn.classList.toggle("active", name === "earth");
  }

  // Camera orbit (turntable), independent of the satellite attitude.
  let az = -0.9;
  let el = 0.35;
  const R = 88;
  function updateCamera() {
    camera.position.set(
      R * Math.cos(el) * Math.cos(az),
      R * Math.cos(el) * Math.sin(az),
      R * Math.sin(el)
    );
    camera.lookAt(0, 0, 0);
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(320, Math.round(width * 0.72));
    canvas.style.height = height + "px";
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    updateCamera();
  }
  new ResizeObserver(resize).observe(container);

  let dragging = false;
  let px = 0;
  let py = 0;
  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", (ev) => {
    dragging = true;
    canvas.setPointerCapture(ev.pointerId);
    px = ev.clientX;
    py = ev.clientY;
  });
  canvas.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    az -= (ev.clientX - px) * 0.006;
    el = THREE.MathUtils.clamp(el + (ev.clientY - py) * 0.006, -1.3, 1.3);
    px = ev.clientX;
    py = ev.clientY;
    updateCamera();
  });
  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  for (const [el2, val, d] of [
    [kpEl, kpVal, 1],
    [kiEl, kiVal, 2],
    [kdEl, kdVal, 1],
  ]) {
    const upd = () => (val.textContent = parseFloat(el2.value).toFixed(d));
    el2.addEventListener("input", upd);
    upd();
  }
  sunBtn.addEventListener("click", () => setTarget("sun"));
  earthBtn.addEventListener("click", () => setTarget("earth"));

  setTarget("sun");
  resize();

  // --- Real-time control loop ---
  const clock = new THREE.Clock();
  const bodyZ = new THREE.Vector3();
  const worldZ = new THREE.Vector3();

  function step(dt) {
    const kp = parseFloat(kpEl.value);
    const ki = parseFloat(kiEl.value);
    const kd = parseFloat(kdEl.value);

    // Body-frame attitude error: qErr = qRef^-1 * q. Its vector part is the
    // small-angle error (sign-corrected for the shortest rotation).
    const qErr = qRef.clone().invert().multiply(q);
    const ev = new THREE.Vector3(qErr.x, qErr.y, qErr.z);
    if (qErr.w < 0) ev.multiplyScalar(-1);

    // Only accumulate the integral while Ki is active, otherwise it winds up
    // in the background and delivers a big kick the moment Ki is switched on.
    if (ki > 1e-9) {
      integ.addScaledVector(ev, dt);
      integ.clampLength(0, I_MAX);
    } else {
      integ.set(0, 0, 0);
    }

    // PID torque + constant disturbance (unit inertia => omega_dot = torque).
    const torque = new THREE.Vector3()
      .addScaledVector(ev, -kp)
      .addScaledVector(integ, -ki)
      .addScaledVector(omega, -kd)
      .add(DIST);

    omega.addScaledVector(torque, dt);

    const wlen = omega.length();
    if (wlen > 1e-9) {
      const dq = new THREE.Quaternion().setFromAxisAngle(
        omega.clone().multiplyScalar(1 / wlen),
        wlen * dt
      );
      q.multiply(dq); // body-frame increment
      q.normalize();
    }
    sat.quaternion.copy(q);
  }

  function updateReadout() {
    // Angle between the pointing axis and its target direction.
    bodyZ.set(0, 0, target === "sun" ? 1 : -1);
    worldZ.copy(bodyZ).applyQuaternion(q);
    const dir = target === "sun" ? SUN_DIR : EARTH_DIR;
    const deg = THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(worldZ.dot(dir), -1, 1)));
    errEl.textContent = deg.toFixed(1) + "°";
    return deg;
  }

  // --- Rolling pointing-error plot ---
  const hist = []; // { t, e } samples over the last PLOT_WINDOW seconds
  let simTime = 0;
  let plotW = 300;
  let plotH = 140;

  function plotResize() {
    const width = plotWrap.getBoundingClientRect().width;
    plotW = width;
    plotH = 150;
    plotCanvas.style.width = width + "px";
    plotCanvas.style.height = plotH + "px";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    plotCanvas.width = Math.round(plotW * dpr);
    plotCanvas.height = Math.round(plotH * dpr);
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  new ResizeObserver(plotResize).observe(plotWrap);
  plotResize();

  function drawPlot() {
    const fg = cssVar("--color-foreground-secondary", "#5a5c63");
    const grid = cssVar("--color-background-border", "#e3e3e3");

    pctx.clearRect(0, 0, plotW, plotH);
    const padL = 40;
    const padR = 12;
    const padT = 12;
    const padB = 26;
    const w = plotW - padL - padR;
    const hgt = plotH - padT - padB;

    // Adaptive y-range with a floor, so both the large slew and the small
    // steady-state error stay readable.
    let emax = 0;
    for (const s of hist) if (s.e > emax) emax = s.e;
    const yMax = Math.min(190, Math.max(10, emax * 1.15));

    const tx = (t) => padL + ((t - (simTime - PLOT_WINDOW)) / PLOT_WINDOW) * w;
    const yy = (e) => padT + (1 - e / yMax) * hgt;

    pctx.font = "11px system-ui, -apple-system, sans-serif";
    pctx.strokeStyle = grid;
    pctx.fillStyle = fg;
    pctx.lineWidth = 1;

    pctx.textAlign = "right";
    pctx.textBaseline = "middle";
    for (let i = 0; i <= 3; i++) {
      const ev = (i / 3) * yMax;
      const py = yy(ev);
      pctx.beginPath();
      pctx.moveTo(padL, py);
      pctx.lineTo(padL + w, py);
      pctx.stroke();
      pctx.fillText(ev.toFixed(0) + "°", padL - 6, py);
    }
    pctx.textAlign = "center";
    pctx.textBaseline = "top";
    for (let i = 0; i <= 3; i++) {
      const rel = -PLOT_WINDOW + (i / 3) * PLOT_WINDOW;
      const px = padL + (i / 3) * w;
      pctx.beginPath();
      pctx.moveTo(px, padT);
      pctx.lineTo(px, padT + hgt);
      pctx.stroke();
      pctx.fillText(rel.toFixed(0) + "s", px, padT + hgt + 6);
    }
    pctx.textAlign = "left";
    pctx.fillText("pointing error", padL + 2, 0);

    // Error trace.
    pctx.strokeStyle = PLOT_ERR_COL;
    pctx.lineWidth = 2;
    pctx.beginPath();
    let started = false;
    for (const s of hist) {
      const px = tx(s.t);
      const py = yy(Math.min(s.e, yMax));
      if (!started) {
        pctx.moveTo(px, py);
        started = true;
      } else {
        pctx.lineTo(px, py);
      }
    }
    pctx.stroke();

    pctx.strokeStyle = grid;
    pctx.lineWidth = 1;
    pctx.strokeRect(padL, padT, w, hgt);
  }

  function animate() {
    requestAnimationFrame(animate);
    // Fixed-size substeps for a stable integrator regardless of frame rate.
    let dt = Math.min(clock.getDelta(), 0.05);
    const frameDt = dt;
    const h = 0.008;
    while (dt > 0) {
      const s = Math.min(h, dt);
      step(s);
      dt -= s;
    }
    const deg = updateReadout();

    simTime += frameDt;
    hist.push({ t: simTime, e: deg });
    while (hist.length && hist[0].t < simTime - PLOT_WINDOW) hist.shift();
    drawPlot();

    renderer.render(scene, camera);
  }
  animate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}