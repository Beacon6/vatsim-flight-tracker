# VATSIM Flight Tracker

## Overview

VATSIM, or Virtual Air Traffic Simulation network is a free online platform that allows virtual aviation enthusiasts using various flight simulation software to connect their simulator of choice to one shared virtual world.

The main focus of VATSIM is providing a convincing and immersive simulation of controlled airspace. You can read more about VATSIM in the [official documentation](https://vatsim.net/docs/about/about-vatsim).

VATSIM Flight Tracker allows for displaying currently logged-in pilots, air traffic controllers and their sectors, as well as some general statistics about the network.

_NOTE: This is a personal project which is being continously developed and expanded._

## Used Technologies

The frontend code of the application is written in TypeScript and uses the React framework. It is served directly from the backend server.

The backend code, responsible for fetching data from VATSIM and serving the frontend, is also written in TypeScript and uses Express together with Socket.IO to handle backend <-> frontend communication with WebSockets. It is hosted as a Docker container on Google Cloud Run and linked to Firebase Hosting.

## Credits

Flight plan route mapping: [SkyVector](https://skyvector.com)

Airport and FIR Data: [VAT-Spy Data Project](https://github.com/vatsimnetwork/vatspy-data-project)
