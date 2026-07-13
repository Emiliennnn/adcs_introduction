# Control

This section presents the very basics of Control Theory but should not be considered as a rigorous lecture on the latter. A nice youtube course on discrete control is provided [here](https://www.youtube.com/watch?v=14cMhrp5wlk&list=PLUMWjy5jgHK0MLv6Ksf-NHi7Ur8NRNU4Z) (less than 2h total, 6 videos). As the goal is to provide an overall idea of the topic, the frequency domain as well as stability guarantees will at most be cited, but may be found in the ???. 

## Contents

1) Motivation
2) Feedback Control (open vs closed loop)
3) Continuous and Discrete Systems
4) State-Space representation
5) PID Controller
6) Interactive Example


### Motivation

Control has been in the core of engineering for centuries. From decreasing the stove heat to avoid burning your food to automatically computing the optimal flap rotation in an aircraft for take-off, its applications are numerous. In the case of autonomous spacecrafts, the operator has hardly contact with it, meaning all or part of its functions must be automated, accross low- and high-level commands. 

For example, let a satellite be arbitrarily oriented and in orbit. For communication, it needs to turn its antennas towards the ground antenna, and therefore needs to initiate a set of manoeuvers through a command tree:

```{figure} figures/control_motivation.drawio.svg
:alt: Command tree for pointing the satellite's antenna at the ground station
:width: 60%
:align: center

Simplified command tree for orienting the satellite's antenna towards the ground station.
```

To find the best current to apply to our motors, many methods have been introduced in the past century, providing stability guarantees and optimality in some sense. In this section, the typical abstraction concepts used by engineers are presented.

### Feedback Control (open vs closed loop)

Through an input signal (mechanical, electronic, digital), a controller can change the state of a targetted system to approach a desired behavior. 

input relation

### Continuous and Discrete Systems

*Discretization is an important step in controller design, allowing numeric computations.*

Real systems are continuous. The relationship between their state variable typically imply Ordinary Differential Equations (ODE), like between acceleration, speed and position:

$$ a(t) = \dot{v}(t) = \ddot{x}(t). $$

Computing units work however in the discrete domain, and the translation from continuous to discrete time can be done in several manners. This includes Forward Euler (FE), arguably the most intuitive but for various reasons not the best in terms of generalization (some systems cannot be discretized using this method, or it will break):

$$ v^+ = v + a \cdot t_s, $$
where $ t_s $ is the sampling time.

Other methods like the Runge-Kutta (RK) discretization offer a stable option but are not described further. The main point here is that to let a computing unit do its job as a controller, it needs a discrete representation. A good discrete model is able to precisely mimic the real-world dynamics, providing a clear picture to the controller of what is really going on outside.

### State-Space representation

The state-space represenation allows a system to be depicted in the time domain using linear algebra. This is simply the matrix form several equations:

\begin{align}
      x^+ &= x + v \cdot t_s \\
      v^+ &= v + a \cdot t_s \\
      a^+ &= a + u \\
\end{align}

$$ \downarrow \\$$

\begin{align}
      \begin{bmatrix} x \\ v \\ a \end{bmatrix} ^+ &= \begin{bmatrix} 1 & t_s & 0 \\ 0 & 1 & t_s\\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ v \\ a \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} u.
\end{align}

The derived matrices are called $A$ and $B$, and the state vector usually written $\mathbf{x}$ for simplicity, giving:

\begin{align}
      \mathbf{x}^+ &= A \mathbf{x} + B u
\end{align}

This compact formulation has many advantages, including simple stability analysis and controller design.

### PID Controller



### Interactive Example

A linear time-invariant plant in state-space form:

$$
\dot{\mathbf{x}} = A\mathbf{x} + B\mathbf{u}, \qquad
\mathbf{y} = C\mathbf{x} + D\mathbf{u}
$$ (eq:ss)

with the LQR cost functional {eq}`eq:lqr`:

$$
J = \int_0^{\infty} \left( \mathbf{x}^\top Q \mathbf{x}
      + \mathbf{u}^\top R \mathbf{u} \right)\, dt
$$ (eq:lqr)

