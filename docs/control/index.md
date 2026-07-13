# Control

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

Methods for commanding a spacecraft to a desired state and keeping it there:
feedback control design, stability analysis, and the practical realities of
implementing controllers on flight hardware.

## Planned subtopics

- Fundamentals of feedback control (open vs. closed loop, stability)
- PID control and tuning
- State-space control (LQR, pole placement)
- Attitude control laws (quaternion feedback, sliding mode)
- Discretization and digital control
- Actuator saturation and anti-windup

## Example

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

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

fundamentals
pid
state-space
attitude-control
```
-->
