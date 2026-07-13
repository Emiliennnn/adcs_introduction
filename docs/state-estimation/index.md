# State Estimation

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

Recovering the spacecraft's state (attitude, rate, position, velocity) from
noisy, incomplete sensor measurements. Covers deterministic attitude
determination and recursive stochastic filtering.

## Planned subtopics

- Least-squares & the Wahba problem (TRIAD, QUEST, SVD)
- The Kalman Filter (KF)
- Extended and Unscented Kalman Filters (EKF, UKF)
- Multiplicative EKF (MEKF) for attitude
- Sensor fusion and observability
- Filter tuning and consistency checks (NEES/NIS)

## Example

The Kalman filter measurement update:

$$
\hat{\mathbf{x}}_k^{+} = \hat{\mathbf{x}}_k^{-}
  + K_k \left( \mathbf{z}_k - H_k \hat{\mathbf{x}}_k^{-} \right),
\qquad
K_k = P_k^{-} H_k^\top \left( H_k P_k^{-} H_k^\top + R_k \right)^{-1}
$$ (eq:kf-update)

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

wahba
kalman-filter
ekf-ukf
mekf
```
-->
