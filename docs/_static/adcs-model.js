import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Body-axis convention used throughout this widget (Z-up, matching the
// reference figure):
//   X (red)   = roll axis  = one of the two 10 cm cross-section axes
//   Y (green) = pitch axis = the other 10 cm cross-section axis
//   Z (blue)  = yaw axis   = the long (30 cm) axis of the bus, pointing up.
// The bus spans z in [0, BUS_HEIGHT]; the solar-panel flower is centered
// on the top face (z = BUS_HEIGHT), coplanar with it.
// Euler angles are extracted with the intrinsic Z-Y-X (yaw-pitch-roll)
// aerospace convention.

const BUS_HEIGHT = 30; // cm, along Z
const BUS_SIDE = 10; // cm, X and Y cross-section
const PANEL_LENGTH = 30; // cm
const PANEL_WIDTH = 10; // cm
const PANEL_THICKNESS = 0.6; // cm

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
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

function makeAxisTriad(length, dashed) {
  const group = new THREE.Group();
  const specs = [
    { dir: new THREE.Vector3(1, 0, 0), color: 0xd7263d },
    { dir: new THREE.Vector3(0, 1, 0), color: 0x2ea043 },
    { dir: new THREE.Vector3(0, 0, 1), color: 0x2f6fed },
  ];
  for (const { dir, color } of specs) {
    const end = dir.clone().multiplyScalar(length);
    const lineGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      end,
    ]);
    const lineMat = dashed
      ? new THREE.LineDashedMaterial({
          color,
          dashSize: 1.5,
          gapSize: 1,
          transparent: true,
          opacity: 0.55,
          depthTest: false,
        })
      : new THREE.LineBasicMaterial({ color, linewidth: 2, depthTest: false });
    const line = new THREE.Line(lineGeom, lineMat);
    if (dashed) line.computeLineDistances();
    line.renderOrder = 10;
    group.add(line);

    if (!dashed) {
      const coneGeom = new THREE.ConeGeometry(0.9, 2.4, 12);
      const coneMat = new THREE.MeshBasicMaterial({ color, depthTest: false });
      const cone = new THREE.Mesh(coneGeom, coneMat);
      cone.position.copy(end);
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      cone.renderOrder = 10;
      group.add(cone);
    }
  }
  return group;
}

function buildSpacecraft() {
  const bodyGroup = new THREE.Group();

  const busGeom = new THREE.BoxGeometry(BUS_SIDE, BUS_SIDE, BUS_HEIGHT);
  const busMat = new THREE.MeshStandardMaterial({
    color: 0xb0b4bb,
    metalness: 0.5,
    roughness: 0.45,
  });
  const busMesh = new THREE.Mesh(busGeom, busMat);
  busMesh.position.set(0, 0, BUS_HEIGHT / 2);
  bodyGroup.add(busMesh);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(busGeom),
    new THREE.LineBasicMaterial({ color: 0x2b2f36 })
  );
  edges.position.copy(busMesh.position);
  bodyGroup.add(edges);

  // Solar-panel "flower": 4 petals coplanar with the top face (z =
  // BUS_HEIGHT), radiating outward from its center.
  const solarTexture = makeSolarTexture();
  const panelGeom = new THREE.BoxGeometry(
    PANEL_LENGTH,
    PANEL_WIDTH,
    PANEL_THICKNESS
  );
  panelGeom.translate(PANEL_LENGTH / 2, 0, 0);
  const panelMat = new THREE.MeshStandardMaterial({
    map: solarTexture,
    metalness: 0.2,
    roughness: 0.35,
  });

  const pivot = new THREE.Group();
  pivot.position.set(0, 0, BUS_HEIGHT);
  bodyGroup.add(pivot);

  for (let i = 0; i < 4; i++) {
    const panel = new THREE.Mesh(panelGeom, panelMat);
    // Petals point along +/-X and +/-Y.
    panel.rotation.z = (i * Math.PI) / 2;
    pivot.add(panel);

    const panelEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(panelGeom),
      new THREE.LineBasicMaterial({ color: 0x0a1830 })
    );
    panelEdges.rotation.z = panel.rotation.z;
    pivot.add(panelEdges);
  }

  bodyGroup.add(makeAxisTriad(22, false));

  return bodyGroup;
}

// Projects a screen-space point onto a virtual trackball sphere, then
// expresses that point in world space using the camera's own basis
// vectors (rather than assuming the camera looks down world -Z). This
// matters here because the camera is tilted with a Z-up basis, not
// three.js's default; using world axes directly made drags feel
// inverted/skewed relative to what's on screen.
const camRight = new THREE.Vector3();
const camUp = new THREE.Vector3();
const camOut = new THREE.Vector3();

function getArcballVector(x, y, rect, camera) {
  const nx = (2 * x - rect.width) / rect.width;
  const ny = (rect.height - 2 * y) / rect.height;
  const d2 = nx * nx + ny * ny;
  const nz = d2 <= 1 ? Math.sqrt(1 - d2) : 0;

  camera.matrixWorld.extractBasis(camRight, camUp, camOut);
  const v = new THREE.Vector3()
    .addScaledVector(camRight, nx)
    .addScaledVector(camUp, ny)
    .addScaledVector(camOut, nz);
  return v.normalize();
}

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

// Shared attitude: the orbit view (below) mirrors whatever orientation is
// set in the main widget, whether from a drag or from the Euler inputs.
const sharedAttitude = new THREE.Quaternion();
const attitudeSubscribers = [];

function setSharedAttitude(q) {
  sharedAttitude.copy(q);
  for (const fn of attitudeSubscribers) fn(sharedAttitude);
}

function subscribeAttitude(fn) {
  attitudeSubscribers.push(fn);
  fn(sharedAttitude);
}

function initMainWidget() {
  const container = document.getElementById("adcs-viewer");
  if (!container) return;
  const canvas = document.getElementById("adcs-canvas");
  const yawEl = document.getElementById("adcs-yaw");
  const pitchEl = document.getElementById("adcs-pitch");
  const rollEl = document.getElementById("adcs-roll");
  const resetBtn = document.getElementById("adcs-reset");

  const scene = new THREE.Scene();
  scene.background = null;

  // Z-up, matching the reference figure: the bus stands with its long
  // axis vertical, so the camera's up vector must be Z instead of
  // three.js's default Y.
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
  camera.up.set(0, 0, 1);
  const target = new THREE.Vector3(0, 0, BUS_HEIGHT * 0.6);
  camera.position.set(55, 70, 60);
  camera.lookAt(target);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(40, 60, 50);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-50, -20, -30);
  scene.add(fill);

  scene.add(makeAxisTriad(28, true));

  const bodyGroup = buildSpacecraft();
  scene.add(bodyGroup);

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(280, Math.round(width * 0.65));
    canvas.style.height = height + "px";
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  // Programmatic value changes (from a drag or Reset) must not re-fire the
  // inputs' own "input" listener, which would try to re-derive the
  // quaternion from angles and fight rounding error; this flag suppresses
  // that while updateReadout() writes the fields.
  let syncingInputs = false;

  function updateReadout() {
    const euler = new THREE.Euler().setFromQuaternion(
      bodyGroup.quaternion,
      "ZYX"
    );
    syncingInputs = true;
    yawEl.value = radToDeg(euler.z).toFixed(1);
    pitchEl.value = radToDeg(euler.y).toFixed(1);
    rollEl.value = radToDeg(euler.x).toFixed(1);
    syncingInputs = false;
    setSharedAttitude(bodyGroup.quaternion);
  }
  updateReadout();

  function applyEulerInputs() {
    const yaw = THREE.MathUtils.degToRad(parseFloat(yawEl.value) || 0);
    const pitch = THREE.MathUtils.degToRad(parseFloat(pitchEl.value) || 0);
    const roll = THREE.MathUtils.degToRad(parseFloat(rollEl.value) || 0);
    const euler = new THREE.Euler(roll, pitch, yaw, "ZYX");
    bodyGroup.quaternion.setFromEuler(euler);
    updateReadout();
  }
  for (const el of [yawEl, pitchEl, rollEl]) {
    el.addEventListener("input", () => {
      if (syncingInputs) return;
      applyEulerInputs();
    });
  }

  let dragging = false;
  let prevVec = null;

  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", (ev) => {
    dragging = true;
    canvas.setPointerCapture(ev.pointerId);
    const rect = canvas.getBoundingClientRect();
    prevVec = getArcballVector(ev.clientX - rect.left, ev.clientY - rect.top, rect, camera);
  });
  canvas.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const curVec = getArcballVector(ev.clientX - rect.left, ev.clientY - rect.top, rect, camera);
    const axis = new THREE.Vector3().crossVectors(prevVec, curVec);
    const dot = THREE.MathUtils.clamp(prevVec.dot(curVec), -1, 1);
    const angle = Math.acos(dot) * 2.2;
    if (axis.lengthSq() > 1e-8 && angle > 1e-6) {
      axis.normalize();
      const dq = new THREE.Quaternion().setFromAxisAngle(axis, angle);
      bodyGroup.quaternion.premultiply(dq);
      updateReadout();
    }
    prevVec = curVec;
  });
  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  resetBtn?.addEventListener("click", () => {
    bodyGroup.quaternion.identity();
    updateReadout();
  });

  renderer.render(scene, camera);
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

const EARTH_RADIUS = 20;
const ORBIT_RADIUS = 45;
const SAT_POINT_RADIUS = 1.4;
const AXIS_INDICATOR_LEN = 9;

function makeEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1b4a7a";
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
  }
  for (let j = 0; j <= 128; j += 16) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(256, j);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

function buildEarth() {
  const geom = new THREE.SphereGeometry(EARTH_RADIUS, 32, 24);
  const mat = new THREE.MeshStandardMaterial({
    map: makeEarthTexture(),
    metalness: 0.1,
    roughness: 0.8,
  });
  return new THREE.Mesh(geom, mat);
}

function buildOrbitPath() {
  const points = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(
      new THREE.Vector3(ORBIT_RADIUS * Math.cos(a), ORBIT_RADIUS * Math.sin(a), 0)
    );
  }
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x8a97a8 });
  return new THREE.Line(geom, mat);
}

// The satellite point plus its body +Z / -Z indicators. The indicator
// sub-group's quaternion is driven by the shared attitude, so it rotates
// exactly like the main widget's body frame; the dot itself is a sphere
// and has no visible orientation, so it doesn't need to rotate.
function buildSatelliteIndicator() {
  const root = new THREE.Group();

  const dotGeom = new THREE.SphereGeometry(SAT_POINT_RADIUS, 16, 12);
  const dotMat = new THREE.MeshStandardMaterial({
    color: 0xd7263d,
    metalness: 0.3,
    roughness: 0.5,
  });
  root.add(new THREE.Mesh(dotGeom, dotMat));

  const indicatorGroup = new THREE.Group();
  root.add(indicatorGroup);

  const zColor = 0x2f6fed;
  const plusEnd = new THREE.Vector3(0, 0, AXIS_INDICATOR_LEN);
  const plusLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), plusEnd]),
    new THREE.LineBasicMaterial({ color: zColor, linewidth: 2, depthTest: false })
  );
  plusLine.renderOrder = 10;
  indicatorGroup.add(plusLine);

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 2.2, 12),
    new THREE.MeshBasicMaterial({ color: zColor, depthTest: false })
  );
  cone.position.copy(plusEnd);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
  cone.renderOrder = 10;
  indicatorGroup.add(cone);

  const minusEnd = new THREE.Vector3(0, 0, -AXIS_INDICATOR_LEN);
  const minusLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), minusEnd]),
    new THREE.LineDashedMaterial({
      color: zColor,
      dashSize: 1.2,
      gapSize: 0.8,
      depthTest: false,
    })
  );
  minusLine.computeLineDistances();
  minusLine.renderOrder = 10;
  indicatorGroup.add(minusLine);

  return { root, indicatorGroup };
}

function initOrbitView() {
  const container = document.getElementById("adcs-orbit-viewer");
  if (!container) return;
  const canvas = document.getElementById("adcs-orbit-canvas");

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
  camera.up.set(0, 0, 1);
  camera.position.set(90, 115, 95);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(120, 80, 100);
  scene.add(key);

  scene.add(buildEarth());
  scene.add(buildOrbitPath());

  const satAngle = Math.PI / 4.5;
  const { root: satRoot, indicatorGroup } = buildSatelliteIndicator();
  satRoot.position.set(
    ORBIT_RADIUS * Math.cos(satAngle),
    ORBIT_RADIUS * Math.sin(satAngle),
    0
  );
  scene.add(satRoot);

  subscribeAttitude((q) => {
    indicatorGroup.quaternion.copy(q);
  });

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(280, Math.round(width * 0.6));
    canvas.style.height = height + "px";
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

function initAll() {
  initMainWidget();
  initOrbitView();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
