# Disturbances in Space

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

The environmental forces and torques that continuously perturb a spacecraft.
Understanding and modelling these is essential for actuator sizing, momentum
budgeting, and control design.

## Planned subtopics

- Gravity-gradient torque
- Aerodynamic (atmospheric drag) torque
- Solar radiation pressure (SRP) torque
- Residual magnetic dipole torque
- Micrometeoroids and outgassing
- Relative magnitudes vs. altitude

## Example

The gravity-gradient torque on a rigid body with inertia $\mathbf{J}$ and nadir
unit vector $\hat{\mathbf{n}}$ at orbital rate $n$:

$$
\mathbf{T}_{gg} = 3 n^{2}\, \hat{\mathbf{n}} \times \mathbf{J}\hat{\mathbf{n}}
$$ (eq:grav-grad)

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

gravity-gradient
aerodynamic
solar-radiation-pressure
magnetic
comparison
```
-->
