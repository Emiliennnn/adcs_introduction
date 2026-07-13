# Space GNC Handbook

A practical, open reference on **Guidance, Navigation & Control** and the surrounding
subsystems for spacecraft — from control theory and state estimation to orbit dynamics,
sensors & actuators, and fault management.

:::{note}
This handbook is a work in progress. Content is being added topic by topic.
Contributions and corrections are welcome via the
[GitHub repository](https://github.com/Emiliennnn/adcs_introduction).
:::

## Topics

::::{grid} 1 2 2 3
:gutter: 3

:::{grid-item-card} 🎛️ Control
:link: control/index
:link-type: doc
Feedback control, controller design, and stability for spacecraft.
:::

:::{grid-item-card} 📡 State Estimation
:link: state-estimation/index
:link-type: doc
Filtering and estimation: Kalman filters, attitude determination.
:::

:::{grid-item-card} 🛰️ Orbit Dynamics
:link: orbit-dynamics/index
:link-type: doc
Two-body problem, perturbations, and orbital mechanics.
:::

:::{grid-item-card} 🔧 Sensors & Actuators
:link: sensors-actuators/index
:link-type: doc
Space-grade sensors and actuators for attitude and orbit.
:::

:::{grid-item-card} 🧭 ADCS / AOCS
:link: adcs-aocs/index
:link-type: doc
Attitude (and Orbit) Determination and Control Systems.
:::

:::{grid-item-card} 🌌 Disturbances in Space
:link: disturbances/index
:link-type: doc
Environmental torques and forces acting on a spacecraft.
:::

:::{grid-item-card} 💾 Microcontroller Comm.
:link: microcontroller-comm/index
:link-type: doc
On-board communication buses and protocols.
:::

:::{grid-item-card} 🎲 Monte Carlo Simulation
:link: monte-carlo/index
:link-type: doc
Statistical verification of GNC performance.
:::

:::{grid-item-card} 🛡️ FDIR
:link: fdir/index
:link-type: doc
Fault Detection, Isolation and Recovery.
:::

::::

```{toctree}
:hidden:
:maxdepth: 2
:caption: Contents

control/index
state-estimation/index
orbit-dynamics/index
sensors-actuators/index
adcs-aocs/index
disturbances/index
microcontroller-comm/index
monte-carlo/index
fdir/index
```

```{toctree}
:hidden:
:caption: Appendix

references
```
