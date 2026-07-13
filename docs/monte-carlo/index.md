# Monte Carlo Simulation

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

Statistical verification of GNC performance by running many randomized
simulations. Covers dispersion setup, run management, and interpreting the
resulting distributions against requirements.

## Planned subtopics

- Why Monte Carlo? Coverage vs. worst-case analysis
- Defining dispersions (initial conditions, parameters, sensor/actuator errors)
- Sampling strategies (random, Latin Hypercube, quasi-random)
- Run management and reproducibility (seeds)
- Post-processing: percentiles, CDFs, requirement verification
- Convergence and how many runs are enough

## Example

Estimating a performance metric $\mu$ from $N$ independent runs, with standard
error shrinking as:

$$
\text{SE} = \frac{\sigma}{\sqrt{N}}
$$ (eq:mc-se)

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

motivation
dispersions
sampling
reproducibility
post-processing
```
-->
