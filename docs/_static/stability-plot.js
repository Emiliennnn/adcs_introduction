// Interactive 1D stability plot for the Control section.
//
// Plots the solution of the scalar linear ODE  x'(t) = a*x + n :
//   x(t) = C*e^{a t} - n/a,   with C = x0 + n/a     (a != 0)
//   x(t) = x0 + n*t                                 (a == 0, special-cased
//                                                    to avoid division by a)
// The user changes a, n and x0 with sliders and watches the response
// converge to the equilibrium -n/a (when a < 0) or diverge (when a > 0).
//
// Pure Canvas 2D so there is no external dependency to load.

const T_MAX = 10; // seconds shown on the time axis
const N_SAMPLES = 400;
// Fixed vertical range so curves can be compared directly across parameter
// changes; only the trajectory moves, never the axis. Diverging (unstable)
// solutions simply run off the top/bottom and are clipped to the plot box.
const Y_MIN = -10;
const Y_MAX = 10;

function cssVar(name, fallback) {
  const v = getComputedStyle(document.body).getPropertyValue(name);
  return v ? v.trim() : fallback;
}

function solve(a, n, x0, t) {
  if (Math.abs(a) < 1e-9) return x0 + n * t;
  const C = x0 + n / a;
  return C * Math.exp(a * t) - n / a;
}

function init() {
  const canvas = document.getElementById("stability-canvas");
  if (!canvas) return;
  const wrap = document.getElementById("stability-canvas-wrap");
  const ctx = canvas.getContext("2d");

  const aEl = document.getElementById("stability-a");
  const nEl = document.getElementById("stability-n");
  const x0El = document.getElementById("stability-x0");
  const aVal = document.getElementById("stability-a-val");
  const nVal = document.getElementById("stability-n-val");
  const x0Val = document.getElementById("stability-x0-val");
  const eqEl = document.getElementById("stability-eq");
  const resetBtn = document.getElementById("stability-reset");

  let width = 300;
  let height = 200;
  let dpr = 1;

  function draw() {
    const a = parseFloat(aEl.value);
    const n = parseFloat(nEl.value);
    const x0 = parseFloat(x0El.value);

    aVal.textContent = a.toFixed(2);
    nVal.textContent = n.toFixed(1);
    x0Val.textContent = x0.toFixed(1);

    if (Math.abs(a) < 1e-9) {
      eqEl.innerHTML = "x(t) = X&#8320; + N·t";
    } else {
      eqEl.innerHTML =
        "x(t) = C·e<sup>A·t</sup> − N/A," +
        (a < 0 ? " stable" : " unstable");
    }

    // Sample the solution over the time window. The vertical range is fixed
    // (Y_MIN..Y_MAX); the curve is clipped to the plot box below.
    const xs = [];
    for (let i = 0; i <= N_SAMPLES; i++) {
      const t = (i / N_SAMPLES) * T_MAX;
      xs.push(solve(a, n, x0, t));
    }
    const lo = Y_MIN;
    const hi = Y_MAX;

    const fg = cssVar("--color-foreground-secondary", "#5a5c63");
    const grid = cssVar("--color-background-border", "#e3e3e3");
    const brand = cssVar("--color-brand-primary", "#0a4bff");
    const eqColor = cssVar("--color-foreground-muted", "#888");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const padL = 46;
    const padR = 14;
    const padT = 18;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const tx = (t) => padL + (t / T_MAX) * plotW;
    const xy = (x) => padT + (1 - (x - lo) / (hi - lo)) * plotH;

    ctx.lineWidth = 1;
    ctx.font = "11px system-ui, -apple-system, sans-serif";

    // Horizontal grid + y tick labels.
    ctx.strokeStyle = grid;
    ctx.fillStyle = fg;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const yTicks = 4; // -10, -5, 0, 5, 10 on the fixed range
    for (let i = 0; i <= yTicks; i++) {
      const xv = lo + (i / yTicks) * (hi - lo);
      const yy = xy(xv);
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(padL + plotW, yy);
      ctx.stroke();
      ctx.fillText(xv.toFixed(0), padL - 6, yy);
    }

    // Vertical grid + t tick labels.
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const tTicks = 5;
    for (let i = 0; i <= tTicks; i++) {
      const tv = (i / tTicks) * T_MAX;
      const xx = tx(tv);
      ctx.beginPath();
      ctx.moveTo(xx, padT);
      ctx.lineTo(xx, padT + plotH);
      ctx.stroke();
      ctx.fillText(tv.toFixed(0), xx, padT + plotH + 6);
    }

    // Axis labels.
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("t (s)", padL + plotW / 2, padT + plotH + 16);
    ctx.textAlign = "left";
    ctx.fillText("x(t)", padL - 40, 2);

    // Zero line, if 0 is within range.
    if (lo < 0 && hi > 0) {
      ctx.strokeStyle = fg;
      ctx.lineWidth = 1;
      const y0 = xy(0);
      ctx.beginPath();
      ctx.moveTo(padL, y0);
      ctx.lineTo(padL + plotW, y0);
      ctx.stroke();
    }

    // Equilibrium (dashed), if defined and in range.
    if (Math.abs(a) > 1e-9) {
      const eq = -n / a;
      if (eq >= lo && eq <= hi) {
        ctx.save();
        ctx.strokeStyle = eqColor;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        const ye = xy(eq);
        ctx.beginPath();
        ctx.moveTo(padL, ye);
        ctx.lineTo(padL + plotW, ye);
        ctx.stroke();
        ctx.restore();
      }
    }

    // The response curve, clipped vertically to the plot box so a runaway
    // (unstable) solution doesn't draw absurd coordinates.
    ctx.strokeStyle = brand;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= N_SAMPLES; i++) {
      const t = (i / N_SAMPLES) * T_MAX;
      const yy = xy(xs[i]);
      if (!isFinite(yy)) {
        started = false;
        continue;
      }
      const yC = Math.max(padT - 6, Math.min(padT + plotH + 6, yy));
      if (!started) {
        ctx.moveTo(tx(t), yC);
        started = true;
      } else {
        ctx.lineTo(tx(t), yC);
      }
    }
    ctx.stroke();

    // Plot border.
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.strokeRect(padL, padT, plotW, plotH);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = wrap.getBoundingClientRect().width;
    height = Math.max(200, Math.round(width * 0.62));
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    draw();
  }

  for (const el of [aEl, nEl, x0El]) {
    el.addEventListener("input", draw);
  }
  resetBtn?.addEventListener("click", () => {
    aEl.value = "-0.5";
    nEl.value = "2";
    x0El.value = "-4";
    draw();
  });

  new ResizeObserver(resize).observe(wrap);
  resize();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
