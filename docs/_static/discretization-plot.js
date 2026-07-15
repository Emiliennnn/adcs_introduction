// Interactive discretization demo (Control > Discretization).
//
// Shows how Forward Euler (FE), classical RK4 and Zero-Order Hold (ZOH)
// approximate the continuous solution of the nonlinear logistic ODE
//     y'(t) = r * y * (1 - y),
// whose exact solution is known and used as the smooth reference. A single
// slider sets the sampling time t_s.
//
//   - FE / RK4 integrate the ODE with step t_s (polyline through the samples).
//   - ZOH samples the exact solution at t_s and holds it (staircase) — the
//     classic sample-and-hold reconstruction of the continuous signal.
//
// Pure Canvas 2D, no external dependency.

const R = 1.5;
const Y0 = 0.1;
const T_MAX = 10;
const Y_MIN = -0.4;
const Y_MAX = 1.8;

const COL_FE = "#d7263d";
const COL_RK4 = "#2ea043";
const COL_ZOH = "#2f6fed";

function fLogistic(y) {
  return R * y * (1 - y);
}

function yExact(t) {
  const e = Math.exp(R * t);
  return (Y0 * e) / (1 + Y0 * (e - 1));
}

function cssVar(name, fallback) {
  const v = getComputedStyle(document.body).getPropertyValue(name);
  return v ? v.trim() : fallback;
}

function init() {
  const canvas = document.getElementById("discretization-canvas");
  if (!canvas) return;
  const wrap = document.getElementById("discretization-canvas-wrap");
  const ctx = canvas.getContext("2d");
  const tsEl = document.getElementById("discretization-ts");
  const tsVal = document.getElementById("discretization-ts-val");

  let width = 300;
  let height = 220;
  let dpr = 1;

  function stepFE(ts) {
    const pts = [];
    let y = Y0;
    for (let t = 0; t <= T_MAX + 1e-9; t += ts) {
      pts.push([t, y]);
      y = y + ts * fLogistic(y);
    }
    return pts;
  }

  function stepRK4(ts) {
    const pts = [];
    let y = Y0;
    for (let t = 0; t <= T_MAX + 1e-9; t += ts) {
      pts.push([t, y]);
      const k1 = fLogistic(y);
      const k2 = fLogistic(y + 0.5 * ts * k1);
      const k3 = fLogistic(y + 0.5 * ts * k2);
      const k4 = fLogistic(y + ts * k3);
      y = y + (ts / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    }
    return pts;
  }

  function sampleZOH(ts) {
    const pts = [];
    for (let t = 0; t <= T_MAX + 1e-9; t += ts) {
      pts.push([t, yExact(t)]);
    }
    return pts;
  }

  function draw() {
    const ts = parseFloat(tsEl.value);
    tsVal.textContent = ts.toFixed(2);

    const fg = cssVar("--color-foreground-secondary", "#5a5c63");
    const grid = cssVar("--color-background-border", "#e3e3e3");
    const colTrue = cssVar("--color-foreground-muted", "#8a8f98");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const padL = 40;
    const padR = 12;
    const padT = 14;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const tx = (t) => padL + (t / T_MAX) * plotW;
    const yy = (y) => padT + (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;
    const clampY = (v) => Math.max(padT - 6, Math.min(padT + plotH + 6, v));

    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.lineWidth = 1;
    ctx.strokeStyle = grid;
    ctx.fillStyle = fg;

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 4; i++) {
      const yv = Y_MIN + (i / 4) * (Y_MAX - Y_MIN);
      const py = yy(yv);
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(padL + plotW, py);
      ctx.stroke();
      ctx.fillText(yv.toFixed(1), padL - 6, py);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i <= 5; i++) {
      const tv = (i / 5) * T_MAX;
      const px = tx(tv);
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, padT + plotH);
      ctx.stroke();
      ctx.fillText(tv.toFixed(0), px, padT + plotH + 6);
    }
    ctx.fillText("t (s)", padL + plotW / 2, padT + plotH + 16);
    ctx.textAlign = "left";
    ctx.fillText("y(t)", padL - 36, 2);

    // Exact continuous solution (smooth reference).
    ctx.strokeStyle = colTrue;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const t = (i / 300) * T_MAX;
      const py = clampY(yy(yExact(t)));
      if (i === 0) ctx.moveTo(tx(t), py);
      else ctx.lineTo(tx(t), py);
    }
    ctx.stroke();

    function drawSeq(pts, color, mode) {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const px = tx(pts[i][0]);
        const py = clampY(yy(pts[i][1]));
        if (i === 0) {
          ctx.moveTo(px, py);
        } else if (mode === "stair") {
          const prevPy = clampY(yy(pts[i - 1][1]));
          ctx.lineTo(px, prevPy); // hold at previous value
          ctx.lineTo(px, py); // step to new value
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      for (const [t, y] of pts) {
        const px = tx(t);
        const py = yy(y);
        if (py < padT - 2 || py > padT + plotH + 2) continue;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawSeq(sampleZOH(ts), COL_ZOH, "stair");
    drawSeq(stepFE(ts), COL_FE, "line");
    drawSeq(stepRK4(ts), COL_RK4, "line");

    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.strokeRect(padL, padT, plotW, plotH);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = wrap.getBoundingClientRect().width;
    height = Math.max(220, Math.round(width * 0.6));
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    draw();
  }

  tsEl.addEventListener("input", draw);
  new ResizeObserver(resize).observe(wrap);
  resize();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
