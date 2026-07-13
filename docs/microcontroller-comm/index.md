# Microcontroller Communication

:::{admonition} Status
:class: seealso
🚧 Content in progress — this page will grow as material is added.
:::

The buses and protocols that let on-board microcontrollers, sensors, and
actuators talk to each other. Covers electrical interfaces, protocol mechanics,
and practical debugging for embedded GNC hardware.

## Planned subtopics

- Serial fundamentals (UART/USART)
- I²C (addressing, clock stretching, multi-master)
- SPI (modes, chip select, daisy-chaining)
- CAN / CAN-FD bus
- Spacecraft buses (SpaceWire, MIL-STD-1553, RS-422/485)
- Framing, checksums & error handling
- Timing, interrupts, and DMA
- Debugging tools (logic analyzers, oscilloscopes)

## Reference

Common bus trade-offs (speed vs. wiring vs. robustness) will be tabulated per
protocol, with links to typical flight use cases.

<!-- Uncomment and add pages as subtopics are written:
```{toctree}
:maxdepth: 1

uart
i2c
spi
can
spacecraft-buses
error-handling
```
-->
