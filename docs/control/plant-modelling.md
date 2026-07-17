# Plant Modelling

In order to know what effect the input will have on the plant, i.e. to know its **dynamics**, engineers tend to model the real system. This can range from mechanical physics when the system is simple enough, up to state-of-the-art machine learning models in the case of complex systems. 

:::{example}
Our case is simple enough to derive its dynamics analytically:
\begin{align}
      \ddot{x}(t) = a(t) = -g + u(t).
\end{align}
*Note that since the elevator is unidimensional, no vector form is needed.*
It follows naturally that its speed and position can be found through integration, assuming the initial conditions are known exactly:
\begin{align}
      \dot{x}(t) = v(t) = v_0 + \int_0^t a(\tau) d\tau, \\
      x(t) = x_0 + \int_0^t v(\tau) d\tau.
\end{align}
Using these, the operator can know what input to apply in order to change the acceleration and move the elevator towards the desired floor.
:::