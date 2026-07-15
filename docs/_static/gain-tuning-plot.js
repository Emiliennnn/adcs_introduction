// Proportional-gain tuning demo (Control > Proportional Control).
//
// Closed-loop elevator with position-only proportional feedback. To make the
// tuning meaningful, the plant is simulated in continuous time with a small
// fixed friction c and gravity compensation, so the closed loop is a damped
// second-order system:
//     x'' = k1 (x_des - x) - c x'
// Low k1 -> sluggish; k1 around c^2/4 -> ~critically damped; high k1 ->
// underdamped with overshoot/oscillation.
//
// Left: position vs time with a sweeping time cursor.
// Right: an elevator cabin animated along the same trajectory.

const XDES = 1; // target position (normalised floors)
const C_DAMP = 2; // friction; critical damping near k1 = (c/2)^2 = 1
const T_END = 20;
const DT = 0.02;
const X_MIN = -0.4;
const X_MAX = 2.1;
const COL_TRAJ = "#2f6fed";
const COL_CABIN = "#b0b4bb";

function cssVar(name, fallback) {
  const v = getComputedStyle(document.body).getPropertyValue(name);
  return v ? v.trim() : fallback;
}

function simulate(k1) {
  // RK4 on the state [x, v].
  const f = (x, v) => [v, k1 * (XDES - x) - C_DAMP * v];
  const xs = [];
  let x = 0;
  let v = 0;
  const n = Math.round(T_END / DT);
  for (let i = 0; i <= n; i++) {
    xs.push(x);
    const [a1x, a1v] = f(x, v);
    const [a2x, a2v] = f(x + 0.5 * DT * a1x, v + 0.5 * DT * a1v);
    const [a3x, a3v] = f(x + 0.5 * DT * a2x, v + 0.5 * DT * a2v);
    const [a4x, a4v] = f(x + DT * a3x, v + DT * a3v);
    x += (DT / 6) * (a1x + 2 * a2x + 2 * a3x + a4x);
    v += (DT / 6) * (a1v + 2 * a2v + 2 * a3v + a4v);
  }
  return xs;
}

function init() {
  const plotCanvas = document.getElementById("gain-plot-canvas");
  if (!plotCanvas) return;
  const plotWrap = document.getElementById("gain-plot-wrap");
  const elevCanvas = document.getElementById("gain-elevator-canvas");
  const elevWrap = document.getElementById("gain-elevator-wrap");
  const pctx = plotCanvas.getContext("2d");
  const ectx = elevCanvas.getContext("2d");
  const kEl = document.getElementById("gain-k1");
  const kVal = document.getElementById("gain-k1-val");

  let traj = simulate(parseFloat(kEl.value));
  let cursor = 0; // index into traj, advanced by the animation loop
  let pW = 300;
  let pH = 220;
  let eW = 110;
  let eH = 220;
  let dpr = 1;

  function xToPlotY(x, padT, plotH) {
    return padT + (1 - (x - X_MIN) / (X_MAX - X_MIN)) * plotH;
  }

  function drawPlot() {
    const fg = cssVar("--color-foreground-secondary", "#5a5c63");
    const grid = cssVar("--color-background-border", "#e3e3e3");
    const muted = cssVar("--color-foreground-muted", "#8a8f98");

    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pctx.clearRect(0, 0, pW, pH);

    const padL = 40;
    const padR = 12;
    const padT = 14;
    const padB = 30;
    const plotW = pW - padL - padR;
    const plotH = pH - padT - padB;
    const tx = (t) => padL + (t / T_END) * plotW;
    const yy = (x) => xToPlotY(x, padT, plotH);

    pctx.font = "11px system-ui, -apple-system, sans-serif";
    pctx.lineWidth = 1;
    pctx.strokeStyle = grid;
    pctx.fillStyle = fg;
    pctx.textAlign = "right";
    pctx.textBaseline = "middle";
    for (let i = 0; i <= 5; i++) {
      const xv = X_MIN + (i / 5) * (X_MAX - X_MIN);
      const py = yy(xv);
      pctx.beginPath();
      pctx.moveTo(padL, py);
      pctx.lineTo(padL + plotW, py);
      pctx.stroke();
      pctx.fillText(xv.toFixed(1), padL - 6, py);
    }
    pctx.textAlign = "center";
    pctx.textBaseline = "top";
    for (let i = 0; i <= 5; i++) {
      const tv = (i / 5) * T_END;
      const px = tx(tv);
      pctx.beginPath();
      pctx.moveTo(px, padT);
      pctx.lineTo(px, padT + plotH);
      pctx.stroke();
      pctx.fillText(tv.toFixed(0), px, padT + plotH + 6);
    }
    pctx.fillText("t (s)", padL + plotW / 2, padT + plotH + 16);
    pctx.textAlign = "left";
    pctx.fillText("x(t)", padL - 36, 2);

    // Target line.
    pctx.strokeStyle = muted;
    pctx.setLineDash([5, 4]);
    pctx.lineWidth = 1.5;
    const yd = yy(XDES);
    pctx.beginPath();
    pctx.moveTo(padL, yd);
    pctx.lineTo(padL + plotW, yd);
    pctx.stroke();
    pctx.setLineDash([]);
    pctx.fillStyle = muted;
    pctx.textAlign = "left";
    pctx.textBaseline = "bottom";
    pctx.fillText("target", padL + 4, yd - 2);

    // Trajectory.
    pctx.strokeStyle = COL_TRAJ;
    pctx.lineWidth = 2;
    pctx.beginPath();
    for (let i = 0; i < traj.length; i++) {
      const t = i * DT;
      const py = yy(traj[i]);
      if (i === 0) pctx.moveTo(tx(t), py);
      else pctx.lineTo(tx(t), py);
    }
    pctx.stroke();

    // Time cursor + moving dot.
    const ct = cursor * DT;
    pctx.strokeStyle = fg;
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(tx(ct), padT);
    pctx.lineTo(tx(ct), padT + plotH);
    pctx.stroke();
    pctx.fillStyle = COL_TRAJ;
    pctx.beginPath();
    pctx.arc(tx(ct), yy(traj[cursor]), 3.5, 0, Math.PI * 2);
    pctx.fill();

    pctx.strokeStyle = grid;
    pctx.lineWidth = 1;
    pctx.strokeRect(padL, padT, plotW, plotH);
  }

  function drawElevator() {
    const fg = cssVar("--color-foreground-secondary", "#5a5c63");
    const grid = cssVar("--color-background-border", "#e3e3e3");
    const muted = cssVar("--color-foreground-muted", "#8a8f98");

    ectx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ectx.clearRect(0, 0, eW, eH);

    const padT = 14;
    const padB = 30;
    const shaftH = eH - padT - padB;
    const shaftW = Math.min(46, eW - 40);
    const shaftX = (eW - shaftW) / 2;
    const map = (x) => padT + (1 - (x - X_MIN) / (X_MAX - X_MIN)) * shaftH;

    // Shaft.
    ectx.strokeStyle = grid;
    ectx.lineWidth = 1.5;
    ectx.strokeRect(shaftX, padT, shaftW, shaftH);

    // Target marker.
    ectx.strokeStyle = muted;
    ectx.setLineDash([4, 3]);
    ectx.lineWidth = 1.5;
    const yd = map(XDES);
    ectx.beginPath();
    ectx.moveTo(shaftX - 6, yd);
    ectx.lineTo(shaftX + shaftW + 6, yd);
    ectx.stroke();
    ectx.setLineDash([]);

    // Cabin.
    const cabH = 26;
    const cx = map(traj[cursor]);
    const cy = Math.max(padT, Math.min(padT + shaftH - cabH, cx - cabH / 2));
    ectx.fillStyle = COL_CABIN;
    ectx.strokeStyle = fg;
    ectx.lineWidth = 1.5;
    ectx.fillRect(shaftX + 4, cy, shaftW - 8, cabH);
    ectx.strokeRect(shaftX + 4, cy, shaftW - 8, cabH);

    ectx.fillStyle = fg;
    ectx.font = "11px system-ui, -apple-system, sans-serif";
    ectx.textAlign = "center";
    ectx.textBaseline = "top";
    ectx.fillText("cabin", eW / 2, padT + shaftH + 8);
  }

  function draw() {
    drawPlot();
    drawElevator();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    pW = plotWrap.getBoundingClientRect().width;
    pH = Math.max(200, Math.round(pW * 0.6));
    plotCanvas.style.width = pW + "px";
    plotCanvas.style.height = pH + "px";
    plotCanvas.width = Math.round(pW * dpr);
    plotCanvas.height = Math.round(pH * dpr);

    eW = elevWrap.getBoundingClientRect().width;
    eH = pH; // match plot height
    elevCanvas.style.width = eW + "px";
    elevCanvas.style.height = eH + "px";
    elevCanvas.width = Math.round(eW * dpr);
    elevCanvas.height = Math.round(eH * dpr);

    draw();
  }

  kEl.addEventListener("input", () => {
    kVal.textContent = parseFloat(kEl.value).toFixed(1);
    traj = simulate(parseFloat(kEl.value));
    cursor = 0;
    draw();
  });
  kVal.textContent = parseFloat(kEl.value).toFixed(1);

  new ResizeObserver(resize).observe(plotWrap);
  resize();

  // Animation loop: sweep the cursor across the trajectory, then loop.
  let last = performance.now();
  function tick(now) {
    const dtReal = (now - last) / 1000;
    last = now;
    // Advance ~1x real-time (DT seconds of sim per DT seconds real).
    cursor += Math.max(1, Math.round(dtReal / DT));
    if (cursor >= traj.length) cursor = 0;
    draw();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}