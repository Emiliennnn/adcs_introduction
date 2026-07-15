import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Fixed 3D illustration (Control > Linearization).
//
// A nonlinear surface z = f(x, y) = sin(x) cos(y) with its tangent planes at
// three points. Each tangent plane is the first-order Taylor expansion of f
// there -- i.e. the local linearisation. Drag to orbit and see how each plane
// hugs the surface near its point but drifts away from it elsewhere.
//
// Plotted with x -> world X, y -> world Z, f -> world Y (height), Y-up.

const DOMAIN = 3; // x, y each span [-DOMAIN, DOMAIN]
const SEG = 48; // surface resolution
const PATCH = 0.9; // half-width of each tangent-plane patch
const POINTS = [
  { x: 0.6, y: 0.5, color: 0xd7263d },
  { x: -1.7, y: 1.3, color: 0x2ea043 },
  { x: 1.9, y: -1.4, color: 0xe8a33d },
];

const f = (x, y) => Math.sin(x) * Math.cos(y);
const fx = (x, y) => Math.cos(x) * Math.cos(y);
const fy = (x, y) => -Math.sin(x) * Math.sin(y);

function heightColor(h, out) {
  // h in [-1, 1] -> deep blue (low) to light green (high).
  const t = (h + 1) / 2;
  const lo = { r: 0.11, g: 0.29, b: 0.48 };
  const hi = { r: 0.66, g: 0.85, b: 0.42 };
  out.setRGB(
    lo.r + (hi.r - lo.r) * t,
    lo.g + (hi.g - lo.g) * t,
    lo.b + (hi.b - lo.b) * t
  );
  return out;
}

function buildSurface() {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const indices = [];
  const c = new THREE.Color();
  for (let i = 0; i <= SEG; i++) {
    for (let j = 0; j <= SEG; j++) {
      const x = -DOMAIN + (2 * DOMAIN * i) / SEG;
      const y = -DOMAIN + (2 * DOMAIN * j) / SEG;
      const h = f(x, y);
      positions.push(x, h, y);
      heightColor(h, c);
      colors.push(c.r, c.g, c.b);
    }
  }
  const row = SEG + 1;
  for (let i = 0; i < SEG; i++) {
    for (let j = 0; j < SEG; j++) {
      const a = i * row + j;
      const b = a + 1;
      const d = a + row;
      const e = d + 1;
      indices.push(a, d, b, b, d, e);
    }
  }
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.1,
    roughness: 0.75,
    side: THREE.DoubleSide,
    flatShading: false,
  });
  return new THREE.Mesh(geom, mat);
}

function buildTangentPatch(x0, y0, color) {
  const h0 = f(x0, y0);
  const gx = fx(x0, y0);
  const gy = fy(x0, y0);
  const plane = (x, y) => h0 + gx * (x - x0) + gy * (y - y0);

  const group = new THREE.Group();

  const corners = [
    [x0 - PATCH, y0 - PATCH],
    [x0 + PATCH, y0 - PATCH],
    [x0 + PATCH, y0 + PATCH],
    [x0 - PATCH, y0 + PATCH],
  ];
  const pos = [];
  for (const [x, y] of corners) pos.push(x, plane(x, y), y);
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geom.setIndex([0, 1, 2, 0, 2, 3]);
  geom.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.0,
    roughness: 0.5,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    emissive: color,
    emissiveIntensity: 0.15,
  });
  group.add(new THREE.Mesh(geom, mat));

  // Outline of the patch.
  const outline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      corners.map(([x, y]) => new THREE.Vector3(x, plane(x, y), y))
    ),
    new THREE.LineBasicMaterial({ color })
  );
  group.add(outline);

  // Marker sphere at the linearisation point.
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 12),
    new THREE.MeshBasicMaterial({ color })
  );
  dot.position.set(x0, h0, y0);
  group.add(dot);

  return group;
}

function buildAxes() {
  const group = new THREE.Group();
  const L = DOMAIN + 0.6;
  const specs = [
    { dir: [1, 0, 0], color: 0xc0392b },
    { dir: [0, 1, 0], color: 0x2f6fed },
    { dir: [0, 0, 1], color: 0x27ae60 },
  ];
  for (const { dir, color } of specs) {
    const end = new THREE.Vector3(...dir).multiplyScalar(L);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), end]),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
    );
    group.add(line);
  }
  return group;
}

function init() {
  const container = document.getElementById("linearization-canvas-wrap");
  if (!container) return;
  const canvas = document.getElementById("linearization-canvas");

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 5, 9);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(6, 10, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.3);
  fill.position.set(-6, 4, -8);
  scene.add(fill);

  // Everything rotatable sits in one group (turntable orbit).
  const plot = new THREE.Group();
  plot.add(buildAxes());
  plot.add(buildSurface());
  for (const p of POINTS) plot.add(buildTangentPatch(p.x, p.y, p.color));
  plot.rotation.order = "YXZ";
  let azimuth = -0.6;
  let elevation = 0.5;
  plot.rotation.set(elevation, azimuth, 0);
  scene.add(plot);

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(300, Math.round(width * 0.7));
    canvas.style.height = height + "px";
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

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
    const dx = ev.clientX - px;
    const dy = ev.clientY - py;
    px = ev.clientX;
    py = ev.clientY;
    azimuth += dx * 0.008;
    elevation = THREE.MathUtils.clamp(elevation + dy * 0.008, -1.4, 1.4);
    plot.rotation.set(elevation, azimuth, 0);
  });
  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}