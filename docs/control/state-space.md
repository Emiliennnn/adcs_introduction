# State-Space representation

Currently, the operator knows how the elevator will react to the input, but has no information about the current **state** of the elevator. The state of a system is the smallest set of variables that, together with the input, fully determines its future evolution. In our case, the state of the elevator is composed of its position $x(t)$ and velocity $v(t)$. In general, the number of state variables equals the order of the system's dynamics (here a second-order differential equation, hence two states). Typically, a **state-space** form is used to define the relationship between the state and its derivatives (**continuous domain**).

The derived matrices are called $A$, $B$ and $N$, and the state vector is usually written $\mathbf{x}$ for simplicity, giving:

\begin{align}
      \dot{\mathbf{x}} &= A \mathbf{x} + B u + N = f(\mathbf x, u)
\end{align}

This relates to the true, physical dynamics of the system. However, most plants have a certain set of sensors that allows to identify only part of the state variables. For example, the elevator may only have a sensor for distance to the floor, giving information about its position $x$ but not its velocity $v$. This is embedded into a second line of state-space equation, where $\mathbf y$ is the **output** of the system:
\begin{align}
      \mathbf{y} &= C \mathbf{x} + D u = g(\mathbf x, u).
\end{align}

This compact formulation has many advantages, including easy stability analysis and controller design. It is important to understand that $\mathbf y$ is the accessible part of the total state $\mathbf x$, meaning that while the whole dynamics play with $\mathbf x$, what can be seen as output of the plant is only $\mathbf y$.

:::{example}
In our case, considering only the position of the elevator can be sensed:
\begin{align}
      \dot{x} &= v \\
      \dot{v} &= -g + u, \\
      y &= x
\end{align}
$$ \downarrow \\$$
$$
\frac{d}{dt} \begin{bmatrix} x \\ v \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ v \end{bmatrix} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} u + \begin{bmatrix} 0 \\ -g \end{bmatrix},
$$ (eq:elevator_ss)
\begin{align}
      \dot{\mathbf{x}} &= \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \mathbf{x} + \begin{bmatrix} 0 \\ 1 \end{bmatrix} u + \begin{bmatrix} 0 \\ -g \end{bmatrix}, \\
      \mathbf{y} &= \begin{bmatrix} 1 & 0 \end{bmatrix} \mathbf{x} + \mathbf 0 u.
\end{align}
:::