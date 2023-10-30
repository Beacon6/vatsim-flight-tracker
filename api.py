from flask import Flask, request
from opensky_api import OpenSkyApi  # type: ignore
from requests.exceptions import ReadTimeout

app = Flask(__name__)
key = "FE01D81011737B8704E1256D24F2C2C16B3083BC2F1C5A90106C80BE24F40E20"
api = OpenSkyApi("Beacon6", key)


@app.route("/aircraft_data", methods=["POST"])
def get_aircraft_data():
    viewport_bounds = request.json
    print(viewport_bounds)

    try:
        request_successful = True
        # bbox = (min latitude, max latitude, min longitude, max longitude)
        aircraft_states = api.get_states(bbox=(viewport_bounds["sw"][0],
                                            viewport_bounds["ne"][0],
                                            viewport_bounds["sw"][1],
                                            viewport_bounds["ne"][1]))

        aircraft_data = []

        for s in aircraft_states.states:
            aircraft_data.append({
                "icao24": s.icao24,
                "callsign": s.callsign,
                "longitude": s.longitude,
                "latitude": s.latitude,
                })

        aircraft_count = len(aircraft_data)
        print(f"Request status is {request_successful} for {aircraft_count} aircraft")
        return {
            "request_successful": request_successful,
            "aircraft_data": aircraft_data,
            "aircraft_count": aircraft_count
        }

    except ReadTimeout:
        request_successful = False
        print(f"Request status is {request_successful}")
        return {
            "request_successful": request_successful,
            "aircraft_data": None,
            "aircraft_count": None
        }
