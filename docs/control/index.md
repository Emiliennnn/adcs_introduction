# Control

This section presents the very basics of Control Theory but should not be considered as a rigorous lecture on the latter. A nice youtube course on discrete control is provided [here](https://www.youtube.com/watch?v=14cMhrp5wlk&list=PLUMWjy5jgHK0MLv6Ksf-NHi7Ur8NRNU4Z) (less than 2h total, 6 videos). As the goal is to provide an overall idea of the topic, the frequency domain as well as stability guarantees will at most be cited, but may be found in the ???. 

## Contents

1) Motivation
2) Feedback Control (open vs closed loop)
3) Continuous and Discrete Systems
4) State-Space representation
5) PID Controller
6) Interactive Example


This section is built around the simple example of an elevator, shown in {numref}`elevator1`. At first, a human operator is in charge of choosing the input current of the motor to move the elevator to the desired floor. The relationship between the operator and the elevator is shown in {numref}`control_graph1`.

```{figure} figures/initial_elevator_graph.drawio.svg
:alt: Initial elevator drawing
:width: 25%
:align: center
:name: elevator1

2-storey elevator controlled by a single pulley, actuated by an electric motor.
```

```{figure} figures/control_graph1.drawio.svg
:alt: Open-loop elevator graph
:width: 60%
:align: center
:name: control_graph1

Relationship between the operator (controller) and the elevator (plant).
```

Usually, the system of interest (here the elevator) is called the **plant**, while the controlling unit (here the operator) is called the **controller**. The controller provides an **input signal ($u$)** that can change the state of the plant to approach a desired behavior. 

This input signal can be, among others, mechanical, electronic, or digital; in our case, the input signal $u$ is the translational acceleration transferred to the elevator by the motor (added to the constant gravity acceleration). This is therefore **acceleration control**, since only the acceleration of the system can be acted on directly. That is the case for most systems, since moving an object implies using a force and/or a torque.

### Plant Modelling
In order to know what effect the input will have on the plant, i.e. to know its **dynamics**, engineers tend to model the real system. This can range from mechanical physics when the system is simple enough, up to state-of-the-art machine learning models in the case of complex systems. 

:::{example}
Our case is simple enough to derive its dynamics analytically:
\begin{align}
      \ddot{x}(t) = a(t) = -g + u(t).
\end{align}
*Note that since the elevator is unidimensional, no vector form is needed.*
It follows naturally that its speed and position can be found through integration, assuming the initial conditions are known exactly:
\begin{align}
      \dot{x}(t) = v(t) = v_0 + \int_0^t a(\tau) d\tau, \\
      x(t) = x_0 + \int_0^t v(\tau) d\tau.
\end{align}
Using these, the operator can know what input to apply in order to change the acceleration and move the elevator towards the desired floor.
:::

### State-Space representation

Currently, the operator knows how the elevator will react to the input, but has no information about the current **state** of the elevator. The state of a system is the smallest set of variables that, together with the input, fully determines its future evolution. In our case, the state of the elevator is composed of its position $x(t)$ and velocity $v(t)$. In general, the number of state variables equals the order of the system's dynamics (here a second-order differential equation, hence two states). Typically, a **state-space** form is used to define the relationship between the state and its derivatives (**continuous domain**).

:::{example}
In our case:
\begin{align}
      \dot{x} &= v \\
      \dot{v} &= -g + u
\end{align}
$$ \downarrow \\$$
$$
\frac{d}{dt} \begin{bmatrix} x \\ v \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} u + \begin{bmatrix} 0 \\ -g \end{bmatrix}.
$$ (eq:elevator_ss)
:::

The derived matrices are called $A$, $B$ and $N$, and the state vector is usually written $\mathbf{x}$ for simplicity, giving:

\begin{align}
      \dot{\mathbf{x}} &= A \mathbf{x} + B u + N = f(\mathbf x, u)
\end{align}
This compact formulation has many advantages, including easy stability analysis and controller design. 

### Stability

Say $B=0$; then the derivative of the state is entirely defined by $A$, $\mathbf{x}$ and a constant term in $N$. In the 1D case, the solution of such ODE is:
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

### Feedback Control (open vs closed loop)

Suppose the operator wants the elevator to go from floor A to floor B. They know they have to accelerate it downwards; however, it should then be slowed down to avoid crashing into the ground (inconvenient). By acting this way, the operator is operating in **open-loop**. They can change the input signal $u(t)$ to try to find the correct acceleration profile, but an agent computing it based on the current state of the system may be more appropriate.

```{figure} figures/control_graph2.drawio.svg
:alt: Closed-loop elevator graph
:width: 60%
:align: center
:name: control_graph2

Closed-loop relationship between the operator (controller) and the elevator (plant).
```

The operator decides to watch the elevator as they maneuver it, noticing when it is going too fast or too close to the ground, and acting accordingly. This is **closed-loop** control, also called **feedback** control, shown in {numref}`control_graph2`.

This is an essential part of control theory, because the information obtained from the system lets the controller act and react based on the error to the desired state.

### Control System Design

The operator now decides that an automatic computing unit may be more convenient, offering better precision, accuracy and 24/7 utility. This is where control system design steps in. Typically, when designing controllers, two main steps must be carried out first.

#### Linearization

Most real systems (plants) are not linear, like our elevator example. Take a simple actuated pendulum and nonlinearities already appear:
\begin{align}
      \ddot{\theta}(t) + \frac{g}{l} \sin(\theta) + u = 0.
\end{align}
In this case, there is no way of expressing $\ddot{\theta}$, $\dot \theta$ and $\theta$ as a linear combination of themselves (thus, no matrix form).

Most of control theory sits on the assumption that a system is linear. Fortunately, this assumption is not so bad locally, when taking the first-order Taylor expansion of a system. That is, for any nonlinear system, its linearized approximation is close enough in a neighborhood of the linearization point. Matrices $A$ and $B$ can be found as follows:
\begin{align}
      \dot{\mathbf x} &= f(\mathbf x, u), \\
      \tilde A &= \frac{\partial f(\mathbf x, u)}{\partial \mathbf x}, \\
      \tilde B &= \frac{\partial f(\mathbf x, u)}{\partial u}.
\end{align}

```{raw} html
<div id="linearization-widget">
  <div id="linearization-canvas-wrap">
    <canvas id="linearization-canvas"></canvas>
  </div>
</div>
<script type="module" src="../_static/linearization-plot.js"></script>
```

*Drag to orbit. The coloured squares are the tangent-plane linearisations of the
surface $z = f(x,y) = \sin x \cos y$ at three points: each one matches the
surface at its point (dot) but drifts away from it elsewhere — a linearisation
is only valid locally, near its point.*

:::{example}
Take back our pendulum example and consider its state being $\mathbf x = \begin{bmatrix} \theta \\ \omega \end{bmatrix}$, where $\omega = \dot \theta$. Its matrix form reads:
\begin{align}
      \frac{d}{dt} \begin{bmatrix} \theta \\ \omega \end{bmatrix} &= \begin{bmatrix} \omega \\ -\frac{g}{l} \sin(\theta) \end{bmatrix} \\
      \dot{\mathbf x} &= f(\mathbf x, u)
\end{align}
By using the linearization method presented above, $\tilde A$ and $\tilde B$ are:
\begin{align}
      \tilde A &= \begin{bmatrix} 0 & 1 \\ -\frac{g}{l} \cos(\theta) & 0 \end{bmatrix}, \quad
      \tilde B = \begin{bmatrix} 0 \\ 1 \end{bmatrix}.
\end{align}
Now a controller can be designed assuming this system is linear, where $\tilde A$ and $\tilde B$ are evaluated with the current $\theta$ over time.
:::

#### Discretization

The second step before actual design of the controller is the **discretization** part. While real systems are **continuous** as described up until now, computing units work in a **discrete** environment. As a consequence, for the controller to be able to compute its input signal, the system should be expressed in a discrete form.

Discretization can be done using different methods. The **Forward Euler (FE)** approach is arguably the easiest and most intuitive one, though it may break for very nonlinear systems. For a continous system $\dot{\mathbf x} = f(\mathbf x, u)$, it is:
\begin{align}
      \mathbf x^+ &= \mathbf x + t_s \cdot f(\mathbf x, u),
\end{align}
which reduces to the following in the *linear case*:
\begin{align}
      \mathbf x^+ &= \mathbf x + t_s \cdot (A \mathbf{x} + B u), \\
      \mathbf x^+ &= (I + A t_s) \mathbf x + (B t_s) u, \\
      \mathbf x^+ &= A_d \mathbf x + B_d u,
\end{align}
if the constant term $N$ is null, and where $t_s$ is the *sampling time*.
:::{note}
The state-space representation has the same form in both discrete and continuous domains when using FE. The subscript $\cdot_d$ indicates the matrix is in the discrete domain.
:::

Other wildly used methods include the **Runge-Kutta (RK)** approach, which you can learn about [here](https://www.youtube.com/watch?v=t48a2M27kjM) (10min youtube video) or the **Zero-Order Hold (ZOH)** approach which you can learn about [here](https://www.youtube.com/watch?v=vnhAG5NiYqM) (14min youtube video).

In the following interactive plot, you can see how different methods discretize a continous signal depending on the given sampling time. For $t_s > 1.5s$, the FE methods breaks while others remain usable.
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
      \frac{d}{dt} \begin{bmatrix} x \\ v \end{bmatrix} &= \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} u + \begin{bmatrix} 0 \\ -g \end{bmatrix}.
\end{align}
$$\downarrow$$
\begin{align}
      \begin{bmatrix} x \\ v \end{bmatrix}^+ &= \begin{bmatrix} 1 & t_s \\ 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ t_s \end{bmatrix} u + \begin{bmatrix} 0 \\ -g \end{bmatrix}.
\end{align}
:::

#### Proportional Control

The easiest way to control a system such as our elevator is to use a proportional feedback input signal to the state:
\begin{align}
      u &= K \mathbf x.
\end{align}
In other words, the input is automatically computed as a linear combination of the current state, making sure the plant reaches the desired state. The state-space representation becomes:
\begin{align}
      \mathbf x^+ &= A_d \mathbf x + B_d u \\
      \mathbf x^+ &= A_d \mathbf x + B_d (K \mathbf x), \\
      \mathbf x^+ &= (A_d + B_d K) \mathbf x,
\end{align}
which relates to an **autonomous system** (no explicit input). As discussed in the stability section, the stability of this system can be guaranteed confirming that the real part of each eigenvalue of $(A_d + B_d K)$ is negative. 

This matrix $K$ is called the **feedback gain matrix**, and can be either hand tuned, found analytically or using Machine Learning methods. Each entry $k_{ii}$ of $K$ gives the relationship between a state of the plant and its response in terms of input.

:::{example}
Take our elevator example and derive the input $u$ based on the current state $\mathbf x$ and a fixed feedback gain matrix $K$:
\begin{align}
      \begin{bmatrix} x \\ v \end{bmatrix}^+ &= \left( \begin{bmatrix} 1 & t_s \\ 0 & 1 \end{bmatrix} + \begin{bmatrix} 0 \\ t_s \end{bmatrix} K \right) \begin{bmatrix} x \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ -g \end{bmatrix}.
\end{align}
In this case, $K = [k_1 k_2]$ (by construction) where $k_1$ is the proportional gain to the position of the elevator and $k_2$ is the proportional gain to the speed of the elevator. 

Suppose we only want the elevator to move based on its position error with the desired position. We therefore have $k_2 = 0$ (no effect of the speed on the input computation). You can try and tune this unique gain entry $k_1$ in the interactive plot below.
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

#### PID Control

While many control strategies exsit (pole-placement, [LQR], [MPC], ...), one of the most used for its easy implementation and low cost in terms of computation remains **Proportional Integral Derivative (PID)** control. It is based on 
