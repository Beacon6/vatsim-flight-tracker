# VATSIM Flight Tracker

## Overview

VATSIM, or Virtual Air Traffic Simulation network is a free online platform that allows virtual aviation enthusiasts using various flight simulation software to connect their simulator of choice to one shared virtual world.

The main focus of VATSIM is providing a convincing and immersive simulation of controlled airspace. You can read more about VATSIM in the [official documentation](https://vatsim.net/docs/about/about-vatsim).

VATSIM Flight Tracker allows for displaying currently logged-in pilots, air traffic controllers and their sectors, as well as some general statistics about the network.

The easiest way to checkout this project in action is through Docker. There are Makefile targets provided for building and running the container.

```
make build
make run
```

_NOTE: This is a personal project which is being continously developed and expanded._

## Credits

Flight plan route mapping: [SkyVector](https://skyvector.com)

Airport and FIR Data: [VAT-Spy Data Project](https://github.com/vatsimnetwork/vatspy-data-project)
