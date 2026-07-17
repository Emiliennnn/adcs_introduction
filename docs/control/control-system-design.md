# Control System Design

The operator now decides that an automatic computing unit may be more convenient, offering better precision, accuracy and 24/7 utility. This is where control system design steps in. Typically, when designing controllers, two main steps must be carried out first: **linearization** and **discretization**. We will see next how to proceed with them and why they are needed.

# Linearization

Most real systems (plants) are nonlinear, unlike our elevator example which is linear. Take a simple actuated pendulum and nonlinearities already appear:
\begin{align}
      \ddot{\theta}(t) + \frac{g}{l} \sin(\theta) + u = 0.
\end{align}
In this case, there is no way of expressing $\ddot{\theta}$, $\dot \theta$ and $\theta$ as a linear combination of themselves (thus, no matrix form).

Most of control theory sits on the assumption that a system is linear. Fortunately, this assumption is not so bad locally, when taking the first-order Taylor expansion of a system. That is, for any nonlinear system, its linearized approximation is close enough in a neighborhood of the linearization point (see interactive plot). Considering a nonlinear system, matrices $A$, $B$, $C$ and $D$ can be found as follows:

$$\dot{\mathbf x} = f(\mathbf x, u) \\ \mathbf y = g(\mathbf x, u)$$
\begin{align}
      \tilde A &= \frac{\partial f(\mathbf x, u)}{\partial \mathbf x}, \quad
      \tilde B = \frac{\partial f(\mathbf x, u)}{\partial u}, \\
      \tilde C &= \frac{\partial g(\mathbf x, u)}{\partial \mathbf x}, \quad
      \tilde D = \frac{\partial g(\mathbf x, u)}{\partial u}.
\end{align}

The interactive plot below shows the tangent planes (first-order Taylor approximation) for 3 different points on a nonlinear surface. When close to the point, the plane and the exact nonlinear function are almost the same.
```{raw} html
<div id="linearization-widget">
  <div id="linearization-canvas-wrap">
    <canvas id="linearization-canvas"></canvas>
  </div>
</div>
<script type="module" src="../_static/linearization-plot.js"></script>
```

:::{example}
Take back our pendulum example and consider its state being $\mathbf x = \begin{bmatrix} \theta \\ \omega \end{bmatrix}$, where $\omega = \dot \theta$. Suppose its output is only its angular speed $\omega$. Its matrix form reads:
\begin{align}
      \dot{\mathbf x} = \frac{d}{dt} \begin{bmatrix} \theta \\ \omega \end{bmatrix} &= \begin{bmatrix} \omega \\ -\frac{g}{l} \sin(\theta) \end{bmatrix} = f(\mathbf x, u)\\
      \mathbf y &= \omega = g(\mathbf x, u)
\end{align}
By using the linearization method presented above, $\tilde A$, $\tilde B$, $\tilde C$ and $\tilde D$ are:
\begin{align}
      \tilde A &= \begin{bmatrix} 0 & 1 \\ -\frac{g}{l} \cos(\theta) & 0 \end{bmatrix},
      &\tilde B = \begin{bmatrix} 0 \\ 1 \end{bmatrix}, \\
      \tilde C &= \begin{bmatrix} 0 & 1 \end{bmatrix},
      &\tilde D = \mathbf 0.
\end{align}
Now a controller can be designed assuming this system is linear, where $\tilde A$, $\tilde B$, $\tilde C$ and $\tilde D$ are evaluated with the current $\theta$ over time.
:::