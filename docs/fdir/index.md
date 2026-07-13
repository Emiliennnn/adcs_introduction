# FDIR

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

**Fault Detection, Isolation and Recovery** — the on-board logic that keeps a
spacecraft safe when something goes wrong. Covers fault modelling, detection
mechanisms, and recovery strategies across subsystem and system levels.

## Planned subtopics

- FDIR concepts and terminology
- Failure modes & effects analysis (FMEA/FMECA)
- Detection: limit checks, consistency checks, model-based residuals
- Isolation: locating the faulty component
- Recovery: reconfiguration, redundancy, safe mode
- FDIR hierarchy (unit → subsystem → system)
- Testing FDIR (fault injection campaigns)

## Detection example

A simple residual-based detector flags a fault when the residual $r$ exceeds a
threshold $\tau$:

$$
\text{fault} \iff |r| > \tau
$$ (eq:fdir-residual)

Choosing $\tau$ trades false alarms against missed detections.

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

concepts
fmea
detection
isolation
recovery
testing
```
-->
