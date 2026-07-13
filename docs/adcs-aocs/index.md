# ADCS / AOCS

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

The **Attitude Determination and Control System** (ADCS) — and its orbit-inclusive
cousin, the **Attitude and Orbit Control System** (AOCS) — tie together sensors,
actuators, estimation, and control into a working subsystem. This section covers
system-level design: modes, budgets, and architecture.

## Planned subtopics

- ADCS vs. AOCS: scope and terminology
- Pointing requirements and error budgets
- Operational modes (detumble, safe, nominal, science, slew)
- Momentum management & wheel desaturation
- Control/estimation architecture and mode transitions
- Sizing and trade studies

## Attitude representations

Kinematics of the attitude quaternion $\mathbf{q}$ given body rate
$\boldsymbol{\omega}$:

$$
\dot{\mathbf{q}} = \tfrac{1}{2}\, \mathbf{q} \otimes
   \begin{bmatrix} 0 \\ \boldsymbol{\omega} \end{bmatrix}
$$ (eq:quat-kin)

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

terminology
requirements-budgets
modes
momentum-management
architecture
```
-->
