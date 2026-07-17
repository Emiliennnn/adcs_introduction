# Practical Example

To close the section, below is a real ADCS task that ties everything together: making a satellite point where we want, using a PID controller. The satellite has to rotate its body so that either its **+Z axis looks at the Sun** (to charge its solar panels) or its **−Z axis looks at Earth** (to communicate with the ground station).

Pick a target and tune the three PID gains to see how the satellite acts.

```{raw} html
<div id="sat-widget">
  <div id="sat-canvas-wrap">
    <canvas id="sat-canvas"></canvas>
  </div>
  <div class="sat-controls">
    <div class="sat-targets">
      <button type="button" id="sat-sun" class="active">&#9728; +Z &rarr; Sun</button>
      <button type="button" id="sat-earth">&#127757; &minus;Z &rarr; Earth</button>
    </div>
    <label><span>K<sub>p</sub></span><input type="range" id="sat-kp" min="0" max="6" step="0.1" value="2"><output id="sat-kp-val">2.0</output></label>
    <label><span>K<sub>i</sub></span><input type="range" id="sat-ki" min="0" max="2" step="0.05" value="0"><output id="sat-ki-val">0.00</output></label>
    <label><span>K<sub>d</sub></span><input type="range" id="sat-kd" min="0" max="6" step="0.1" value="2"><output id="sat-kd-val">2.0</output></label>
    <p class="sat-readout">Pointing error: <span id="sat-error">&ndash;</span></p>
  </div>
  <div id="sat-plot-wrap">
    <canvas id="sat-plot-canvas"></canvas>
  </div>
</div>
<script type="module" src="../_static/satellite-control.js"></script>
```