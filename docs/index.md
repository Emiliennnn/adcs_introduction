# Introduction to ADCS

This is a practical guide to onboard **Attitude Determination and Control Subsystem (ADCS)** design. From control theory and state estimation to orbit dynamics,
sensors & actuators, and fault management. 

This page aims to provide anyone with the very basic tools for ADCS, and voluntarily leaves proofs/details aside. For a comprehensive lookout, accessible resources are added at the end of each topic.

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

## Try it yourself

```{raw} html
<div id="adcs-viewer">
  <div id="adcs-canvas-wrap">
    <canvas id="adcs-canvas"></canvas>
  </div>
  <div id="adcs-orbit-canvas-wrap">
    <canvas id="adcs-orbit-canvas"></canvas>
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
<script type="module" src="_static/adcs-model.js"></script>
```

## Topics
Here below are the topics covered currently in this handbook. While each topic has its own content independently to others, it is preferred to tackled them in order. 

::::{grid} 1 2 2 3
:gutter: 3

:::{grid-item-card} 🎛️ I - Control
:link: control/index
:link-type: doc
Feedback control, controller design, and stability for spacecraft.
:::

:::{grid-item-card} 📡 II - State Estimation
:link: state-estimation/index
:link-type: doc
Filtering and estimation: Kalman filters, attitude determination.
:::

:::{grid-item-card} 🛰️ III - Orbit Dynamics
:link: orbit-dynamics/index
:link-type: doc
Two-body problem, perturbations, and orbital mechanics.
:::

:::{grid-item-card} 🔧 IV - Sensors & Actuators
:link: sensors-actuators/index
:link-type: doc
Space-grade sensors and actuators for attitude and orbit.
:::

:::{grid-item-card} 🧭 V - ADCS / AOCS
:link: adcs-aocs/index
:link-type: doc
Attitude (and Orbit) Determination and Control Systems.
:::

:::{grid-item-card} 🌌 VI - Disturbances in Space
:link: disturbances/index
:link-type: doc
Environmental torques and forces acting on a spacecraft.
:::

:::{grid-item-card} 💾 VII - Microcontroller Comm.
:link: microcontroller-comm/index
:link-type: doc
On-board communication buses and protocols.
:::

:::{grid-item-card} 🎲 VIII - Monte Carlo Simulation
:link: monte-carlo/index
:link-type: doc
Statistical verification of GNC performance.
:::

:::{grid-item-card} 🛡️ IX - FDIR
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
