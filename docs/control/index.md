# Control

This section presents the very basics of Control Theory but should not be considered as a rigorous lecture on the latter. A nice youtube course on discrete control is provided [here](https://www.youtube.com/watch?v=14cMhrp5wlk&list=PLUMWjy5jgHK0MLv6Ksf-NHi7Ur8NRNU4Z) (less than 2h total, 6 videos). As the goal is to provide an overall idea of the topic, the frequency domain as well as stability guarantees will at most be cited, but may be found in the ???. 

This section is built around the simple example of an elevator, shown in {numref}`elevator1`. At first, a human operator is in charge of choosing the input current of the motor to move the elevator to the desired floor. The relationship between the operator and the elevator is shown in {numref}`control_graph1`.

```{figure} figures/initial_elevator_graph.drawio.svg
:alt: Initial elevator drawing
:width: 25%
:align: center
:name: elevator1

2-storey elevator controlled by a single pulley, actuated by an electric motor.
```

```{figure} figures/control_graph1.drawio.svg
:alt: Open-loop elevator graph
:width: 60%
:align: center
:name: control_graph1

Relationship between the operator (controller) and the elevator (plant).
```

Usually, the system of interest (here the elevator) is called the **plant**, while the controlling unit (here the operator) is called the **controller**. The controller provides an **input signal ($u$)** that can change the state of the plant to approach a desired behavior. 

This input signal can be, among others, mechanical, electronic, or digital; in our case, the input signal $u$ is the translational acceleration transferred to the elevator by the motor (added to the constant gravity acceleration). This is therefore **acceleration control**, since only the acceleration of the system can be acted on directly. That is the case for most systems, since moving an object implies using a force and/or a torque.

The topic is broken down into the following subtopics:

```{toctree}
:maxdepth: 2

plant-modelling
state-space
stability
feedback-control
control-system-design
discretization
proportional-control
pid-control
practical-example
```