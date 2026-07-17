# Stability

Say $B=0$; then the derivative of the state is entirely defined by $A$, $\mathbf{x}$ and a constant term in $N$:
\begin{align}
      \dot{\mathbf{x}} &= A \mathbf{x} + N
\end{align}

In the 1D case, the solution of such ODE is:
\begin{align}
      \mathbf x(t) &= Ce^{At} - \frac{B}{A}.
\end{align}
We say that the system is **asymptotically stable** if $A<0$ in 1D, or more generally if every real-part of the eigenvalues of $A$ is negative. Using the interactive plot below, you can change the constants $A$ and $N$ to see how $\mathbf{x}(t)$ evolves over time. It is clear that when $A > 0$, the system diverges, while $N$ sets the value it converges to.

```{raw} html
<div id="stability-widget">
  <div id="stability-canvas-wrap">
    <canvas id="stability-canvas"></canvas>
  </div>
  <div class="stability-controls">
    <p class="stability-eq" id="stability-eq"></p>
    <label>A<input type="range" id="stability-a" min="-2" max="2" step="0.1" value="-0.5"><output id="stability-a-val">-0.50</output></label>
    <label>N<input type="range" id="stability-n" min="-4" max="4" step="0.5" value="2"><output id="stability-n-val">2.0</output></label>
    <label>X&#8320;<input type="range" id="stability-x0" min="-8" max="8" step="1" value="-4"><output id="stability-x0-val">-4.0</output></label>
    <button id="stability-reset" type="button">Reset</button>
  </div>
</div>
<script type="module" src="../_static/stability-plot.js"></script>
```

This is important as it defines when our plant will follow directions or try to escape the desired state.

:::{note}
In the discrete case, the criterion for the system to be stable becomes having every eigenvalues of A in the unit circle, as the system becomes a sequence.
:::