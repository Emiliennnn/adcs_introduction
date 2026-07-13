# Orbit Dynamics

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

The motion of a spacecraft under gravity and perturbing forces: the two-body
problem, orbital elements, and how real orbits deviate from the ideal Keplerian
case.

## Planned subtopics

- The two-body problem and Keplerian elements
- Coordinate frames and time systems (ECI, ECEF, RTN)
- Orbit perturbations (J2, drag, SRP, third-body)
- Orbit propagation (analytical, SGP4, numerical)
- Ground tracks and eclipses
- Orbital maneuvers (Hohmann, phasing, station-keeping)

## Example

The two-body equation of motion:

$$
\ddot{\mathbf{r}} = -\frac{\mu}{\lVert \mathbf{r} \rVert^{3}} \, \mathbf{r}
$$ (eq:two-body)

where $\mu = GM$ is the gravitational parameter of the central body.

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

two-body
frames
perturbations
propagation
maneuvers
```
-->
