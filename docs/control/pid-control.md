# PID Control

As discussed previously, the feedback gain matrix $K$ can be obtained by various processes, notably with analytical methods which offer certain types of guarantees in terms of optimality (LQR, MPC) and robustness. You probably remarked that when using proportional control to the position only, the elevator tends to **overshoot** its reference point when the gain is too high. To tackle overshooting issues and **steady-state error** (error to the reference at convergence), the controller can be designed to take into account 2 other variables: the derivative and the integral of the error; this is **Proportional Integral Derivative (PID)** control, shown in {numref}`pid_graph`.

```{figure} figures/pid_graph.drawio.svg
:alt: Closed-loop elevator graph
:width: 80%
:align: center
:name: pid_graph

Closed-loop PID controller.
```

In our case, it means taking into account the velocity of the elevator in addition to its position, making sure the elevator gets to the reference fast and with no velocity to avoid overshooting. In the case where the constant term is badly identified during plant modelling, the system may have a steady-state error, which can be removed using the sum of errors over time, that is the integral term.

Overall, each gain (proportional, integral and derivative) provides a different effect, as described in the table below.

| Gain | P | I | D |
|------|---|---|---|
| + Benefit | Increases Convergence Rate | Reduces steady-state error | Reduces Overshoot |
| - Downside | Increases Overshoot | Increases Overshoot | Increases sensitivity to noise |

:::{example}
Below, the elevant carries a small unmodelled bias, so pure proportional control settles slightly off the reference. Try tuning the three gains $K_p$, $K_i$ and $K_d$ to reach the reference quickly, without overshoot, and with no remaining steady-state error.
```{raw} html
<div id="pid-widget">
  <div id="pid-plot-wrap">
    <canvas id="pid-plot-canvas"></canvas>
  </div>
  <div id="pid-elevator-wrap">
    <canvas id="pid-elevator-canvas"></canvas>
  </div>
  <div class="pid-controls">
    <label><span>K<sub>p</sub></span><input type="range" id="pid-kp" min="0.5" max="6" step="0.1" value="2"><output id="pid-kp-val">2.0</output></label>
    <label><span>K<sub>i</sub></span><input type="range" id="pid-ki" min="0" max="3" step="0.05" value="0"><output id="pid-ki-val">0.00</output></label>
    <label><span>K<sub>d</sub></span><input type="range" id="pid-kd" min="0" max="5" step="0.1" value="2"><output id="pid-kd-val">2.0</output></label>
  </div>
</div>
<script type="module" src="../_static/pid-plot.js"></script>
```
:::