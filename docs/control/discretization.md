# Discretization

The second step before actual design of the controller is the **discretization** part. While real systems are **continuous** as described up until now, computing units work in a **discrete** environment. As a consequence, for the controller to be able to compute its input signal, the system should be expressed in a discrete form.

Discretization can be done using different methods. The **Forward Euler (FE)** approach is arguably the easiest and most intuitive one, though it may break for some nonlinear systems, or when the sampling time is too large. For a continous system $\dot{\mathbf x} = f(\mathbf x, u)$, it is:
\begin{align}
      \mathbf x^+ &= \mathbf x + t_s \cdot f(\mathbf x, u), \\
      \mathbf y &= g(\mathbf x, u),
\end{align}
which reduces to the following in the *linear case*:
\begin{align}
      \mathbf x^+ &= \mathbf x + t_s \cdot (A \mathbf{x} + B u), \\
      \mathbf x^+ &= (I + A t_s) \mathbf x + (B t_s) u, \\
      \mathbf x^+ &= A_d \mathbf x + B_d u, \\
      &\text{and:} \\
      \mathbf y &= C \mathbf x + D u.
\end{align}
if the constant term $N$ is null, and where $t_s$ is the *sampling time*.
:::{note}
The state-space representation preserves its form in the discrete domain. The subscript $\cdot_d$ indicates the matrix is in the discrete domain, and the relationships between continous and discrete state-space matrices fall back to:
\begin{align}
      A_d &= I + A t_s, 
      &B_d = B t_s, \\
      C_d &= C,
      & D_d = D.
\end{align}
:::

Other wildly used methods include the **Runge-Kutta (RK)** approach, which you can learn about [here](https://www.youtube.com/watch?v=t48a2M27kjM) (10min youtube video) or the **Zero-Order Hold (ZOH)** approach which you can learn about [here](https://www.youtube.com/watch?v=vnhAG5NiYqM) (14min youtube video).

In the following interactive plot, you can see how different methods discretize a continous signal depending on the given sampling time. For $t_s > 1.5s$, the FE method breaks while others remain usable.
```{raw} html
<div id="discretization-widget">
  <div id="discretization-canvas-wrap">
    <canvas id="discretization-canvas"></canvas>
  </div>
  <div class="discretization-controls">
    <p class="plot-legend">
      <span style="color:#8a8f98">Reference</span><br>
      <span style="color:#d7263d">Forward Euler</span><br>
      <span style="color:#2ea043">RK4</span><br>
      <span style="color:#2f6fed">ZOH</span>
    </p>
    <label>t&#8347;<input type="range" id="discretization-ts" min="0.1" max="2" step="0.05" value="0.5"><output id="discretization-ts-val">0.50</output></label>
  </div>
</div>
<script type="module" src="../_static/discretization-plot.js"></script>
```

:::{example}
Take the state-space form of our elevator system in {eq}`eq:elevator_ss`. It is indeed already linear, however it needs to be discretized. Using FE:
\begin{align}
      \frac{d}{dt} \begin{bmatrix} x \\ v \end{bmatrix} &= \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} u + \begin{bmatrix} 0 \\ -g \end{bmatrix}, \\
      \mathbf y &= \begin{bmatrix} 1 & 0 \end{bmatrix} x + \mathbf 0 u.
\end{align}
$$\downarrow$$
\begin{align}
      \begin{bmatrix} x \\ v \end{bmatrix}^+ &= \begin{bmatrix} 1 & t_s \\ 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ t_s \end{bmatrix} u + \begin{bmatrix} 0 \\ -g \end{bmatrix}, \\
      \mathbf y &= \begin{bmatrix} 1 & 0 \end{bmatrix} x + \mathbf 0 u.
\end{align}
:::