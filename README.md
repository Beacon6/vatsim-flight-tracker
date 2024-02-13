# VATSIM Flight Tracker

## Overview

VATSIM, or Virtual Air Traffic Simulation network is a free online platform that allows virtual aviation enthusiasts using various flight simulation software to connect their simulator of choice to one shared virtual world.

The main focus of VATSIM is providing a convincing and immersive simulation of controlled airspace. You can read more about VATSIM in the [official documentation](https://vatsim.net/docs/about/about-vatsim).

VATSIM Flight Tracker allows for displaying currently logged-in pilots, air traffic controllers and their sectors, as well as some general statistics about the network.

_NOTE: This is a personal project which is being continously developed and expanded._

## Used Technologies

The frontend code of the application is written in TypeScript and uses the React framework. It is hosted on Firebase Hosting.

The backend code, responsible for fetching data from VATSIM, is also written in TypeScript and uses Express to handle request routing. It is hosted as a serverless API with Docker and Google Cloud Run.
