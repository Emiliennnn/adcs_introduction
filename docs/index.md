# Introduction to ADCS

This is a practical guide to onboard **Attitude Determination and Control Subsystem (ADCS)** design. From control theory and state estimation to orbit dynamics,
sensors & actuators, and fault management. 

This page aims to provide anyone with the very basic tools for ADCS, rather than going into details. For a comprehensive lookout, accessible resources are added at the end of each topic.

:::{note}
This handbook is a work in progress, made by students for students. Content is being added topic by topic.
Contributions and corrections are welcome via the
[GitHub repository](https://github.com/Emiliennnn/adcs_introduction).
:::

## What is ADCS?

The **Attitude Determination and Control Subsystem (ADCS)** in a spacecraft is responsible for aligning its body towards points of interest and thrust towards them. 

Using specific sensors, a precise estimation of the current spacecraft's position and orientation is derived, even in the event of failing hardware and limited communication with ground control.

ADCS is similarly called **Attitude and Orbit Control System (AOCS)** when orbit is controllable, and falls more generally into the **Guiding and Navigation Control (GNC)** domain. From aircrafts to rockets and satellites, **ADCS** is an essential system offering precise and autonomous control and planning, in instance for synchronized turns in planes or attitude regulation for satellites' communication.

The **EPFL Spacecraft Team**'s satellites are no exceptions, through their needs in targeted charging, precise S-/X-band communication and scientific measurements. This handbook proposes an accessible introduction for anyone interested in **ADCS**, through intuitive explanations rather than a math- and theory-heavy approach.

### Try it yourself

Drag the spacecraft below to rotate it, or type Euler angles directly, and see
how its attitude relative to the fixed reference frame changes in real time.

```{raw} html
<div id="adcs-viewer">
  <div id="adcs-canvas-wrap">
    <canvas id="adcs-canvas"></canvas>
  </div>
  <div class="adcs-readout">
    <h4>Euler angles</h4>
    <dl>
      <dt>Yaw&nbsp;(Z)</dt>
      <dd><input type="number" id="adcs-yaw" value="0" step="0.1" min="-180" max="180">°</dd>
      <dt>Pitch&nbsp;(Y)</dt>
      <dd><input type="number" id="adcs-pitch" value="0" step="0.1" min="-90" max="90">°</dd>
      <dt>Roll&nbsp;(X)</dt>
      <dd><input type="number" id="adcs-roll" value="0" step="0.1" min="-180" max="180">°</dd>
    </dl>
    <p class="adcs-legend">
      <span class="solid" style="color:#d7263d">X</span> ·
      <span class="solid" style="color:#2ea043">Y</span> ·
      <span class="solid" style="color:#2f6fed">Z</span><br>
      <span class="dashed">Dashed axes = fixed reference frame</span>
    </p>
    <button id="adcs-reset" type="button">Reset attitude</button>
  </div>
</div>
```

<!-- ### Seen from orbit

The same attitude, viewed from the outside: the spacecraft is shown as a point
in orbit, with its own +Z axis (blue) and the opposite -Z direction (dotted).
Rotating or editing the model above updates this view too. -->

```{raw} html
<div id="adcs-orbit-viewer">
  <div id="adcs-orbit-canvas-wrap">
    <canvas id="adcs-orbit-canvas"></canvas>
  </div>
  <p class="adcs-legend">
    <span class="solid" style="color:#2f6fed">+Z (body)</span> ·
    <span class="dashed" style="color:#2f6fed">&minus;Z (body)</span>
  </p>
</div>
<script type="module" src="_static/adcs-model.js"></script>
```

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
