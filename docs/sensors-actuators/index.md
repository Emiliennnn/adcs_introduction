# Space Sensors & Actuators

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

The hardware that lets a spacecraft *sense* its state and *act* on it. Covers
operating principles, error models, and selection trade-offs for flight-grade
sensors and actuators.

## Planned subtopics

### Sensors
- Sun sensors (coarse & fine)
- Star trackers
- Magnetometers
- Gyroscopes / IMUs
- GNSS receivers
- Earth / horizon sensors

### Actuators
- Reaction wheels
- Magnetorquers (magnetic torque rods)
- Thrusters (cold gas, electric, chemical)
- Control moment gyroscopes (CMGs)

## Error modelling

Each sensor page will document a noise/error model, e.g. a gyro measurement with
bias $\mathbf{b}$ and white noise $\boldsymbol{\eta}$:

$$
\boldsymbol{\omega}_{\text{meas}} = \boldsymbol{\omega}_{\text{true}}
   + \mathbf{b} + \boldsymbol{\eta}
$$ (eq:gyro)

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

sun-sensors
star-trackers
magnetometers
gyroscopes
reaction-wheels
magnetorquers
thrusters
```
-->
