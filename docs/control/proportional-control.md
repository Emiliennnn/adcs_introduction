# Proportional Control

The easiest way to control a system such as our elevator is to use a proportional feedback input signal $u$ to the error signal $\mathbf e$ (see {numref}`p_graph`). That is, we set:
\begin{align}
      u &= K \mathbf e
\end{align}

```{figure} figures/p_graph.drawio.svg
:alt: Closed-loop elevator graph
:width: 60%
:align: center
:name: p_graph

Closed-loop Proportional controller.
```

In other words, the input is automatically computed as a linear combination of the current error, making sure the plant reaches the desired state. The state-space representation of the error becomes:
\begin{align}
      \mathbf e^+ &= C_d (A_d \mathbf e + B_d u) \\
      \mathbf e^+ &= C_d (A_d \mathbf e + B_d (K \mathbf e)), \\
      \mathbf e^+ &= C_d(A_d + B_d K) \mathbf e
\end{align}
which relates to an **autonomous system** (no explicit input). As discussed in the stability section, the stability of this system can be guaranteed confirming that each eigenvalue of $C_d(A_d + B_d K)$ lies in the unit circle.

This matrix $K$ is called the **feedback gain matrix**, and can be either hand tuned, found analytically or using Machine Learning methods. Each entry $k_{ij}$ of $K$ gives the relationship between a state of the plant and its response in terms of input.

:::{example}
Take our elevator example and derive the input $u$ based on the current state $\mathbf x$ and a fixed feedback gain matrix $K$:
\begin{align}
      \begin{bmatrix} e_x \\ e_v \end{bmatrix}^+ &= \left( \begin{bmatrix} 1 & t_s \\ 0 & 1 \end{bmatrix} + \begin{bmatrix} 0 \\ t_s \end{bmatrix} K \right) \begin{bmatrix} e_x \\ e_v \end{bmatrix} + \begin{bmatrix} 0 \\ -g \end{bmatrix}.
\end{align}
In this case, $K = [k_1\ k_2]$ (by construction) where $k_1$ is the proportional gain to the error in position of the elevator and $k_2$ is the proportional gain to the error in speed of the elevator. 

Suppose we only want the elevator to move based on its position error with the desired position. We therefore have $k_2 = 0$ (no effect of the speed on the input computation). You can try and tune this unique gain entry $k_1$ in the interactive plot below. You will see that with high gains, the elevator gets faster to its reference point, but overshoots it. On the contrary, a too small gain makes the convergence much slower.
```{raw} html
<div id="gain-widget">
  <div id="gain-plot-wrap">
    <canvas id="gain-plot-canvas"></canvas>
  </div>
  <div id="gain-elevator-wrap">
    <canvas id="gain-elevator-canvas"></canvas>
  </div>
  <div class="gain-controls">
    <label>k&#8321;<input type="range" id="gain-k1" min="0.1" max="8" step="0.1" value="1"><output id="gain-k1-val">1.0</output></label>
  </div>
</div>
<script type="module" src="../_static/gain-tuning-plot.js"></script>
```
:::