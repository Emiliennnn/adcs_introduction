# Feedback Control

## Open vs Closed Loop
Suppose the operator wants the elevator to go from floor A to floor B. They know they have to accelerate it downwards; however, it should then be slowed down to avoid crashing into the ground. By acting without taking into account where the elevator is currently, the operator is operating in **open-loop**. They can change the input signal $u(t)$ to try to find the correct acceleration profile, but guessing without knowing what is really going on is most likely to fail.

```{figure} figures/control_graph2.drawio.svg
:alt: Closed-loop elevator graph
:width: 60%
:align: center
:name: control_graph2

Closed-loop relationship between the operator (controller) and the elevator (plant).
```

Therefore, the operator decides to watch the elevator as they maneuver it, noticing when it is going too fast or too close to the ground, and acting accordingly. This is **closed-loop** control, also called **feedback** control, shown in {numref}`control_graph2`. It is essential, because the information obtained from the system lets the controller act and react based on the error to the desired state. 

## Reference Signal
If this architecture was implemented, the controller would systematically get the elevator to floor A, meaning going from floor A to floor B would require another controller. To avoid having a different controller per task, a **reference signal** $\mathbf y_{ref}$ is typically implemented. 

This signal is compared to the current plant output $\mathbf y$ to construct the **error signal** $\mathbf e$, which serves as entry for the controller rather than the plant output directly, as shown in {numref}`control_graph3`. 

\begin{align}
    \mathbf e = \mathbf y - \mathbf y_{ref}
\end{align}

If the reference signal is $0$ for floor A, then the controller input becomes $\mathbf y$; if the reference signal is $h_B$, the controller input becomes $\mathbf y - h_B$, which approaches $0$ as the elevator gets to $h_B$. 

```{figure} figures/control_graph3.drawio.svg
:alt: Closed-loop elevator graph
:width: 60%
:align: center
:name: control_graph3

Closed-loop relationship including a reference signal.
```

:::{note}
The reference signal acts exactly as $N$ in the previous state-space representation. That is, it introduces a bias that shifts the convergence point.
:::

Try varying the reference $y_{ref}$ and the initial height $x_0$ in the interactive plot below. Whatever the starting point, the elevator settles at the reference. This allows the operator to only change the reference signal and keep a unique controller architecture (which we will see next).
```{raw} html
<div id="reference-widget">
  <div id="reference-plot-wrap">
    <canvas id="reference-plot-canvas"></canvas>
  </div>
  <div id="reference-elevator-wrap">
    <canvas id="reference-elevator-canvas"></canvas>
  </div>
  <div class="reference-controls">
    <label><span>y<sub>ref</sub></span><input type="range" id="reference-yref" min="0.2" max="2" step="0.1" value="1"><output id="reference-yref-val">1.0</output></label>
    <label><span>x&#8320;</span><input type="range" id="reference-x0" min="0" max="2" step="0.1" value="0"><output id="reference-x0-val">0.0</output></label>
    <div class="reference-buttons">
      <button type="button" id="reference-ab">Floor A &rarr; Floor B</button>
      <button type="button" id="reference-ba">Floor B &rarr; Floor A</button>
    </div>
  </div>
</div>
<script type="module" src="../_static/reference-plot.js"></script>
```

A very important and convenient property of this error signal is that it preserves the same dynamics as the output state $\mathbf y$:
\begin{align}
    \frac{d}{dt} \mathbf e &= \frac{d}{dt} (\mathbf y - \mathbf y_{ref}) \\
    &= \frac{d}{dt} (C \mathbf x - \mathbf y_{ref}) \\
    &= C \dot{\mathbf x} \\
    &= C (A \mathbf x + B u)
\end{align}
Since $C$ has the role of selecting certain parts of the true dynamics (if $C = I$, $\mathbf y = \mathbf x$), we know the evolution of the error can be modelled exactly like the associated states of the system. This is handy as we can model the plant and then use the same dynamics/state-space matrices to control the error signal instead. The only difference with the true state $\mathbf x$ is that the error signal embeds only the output $\mathbf y$, which can be part of, or equal to, $\mathbf x$.

In other words, in our elevator example, we know that the error to the targeted floor will evolve like the actual position of the elevator, which makes sense since the reference signal is nothing other than a static offset of the convergence point.