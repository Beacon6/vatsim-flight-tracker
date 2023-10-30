from flask import Flask, request
from opensky_api import OpenSkyApi  # type: ignore
from requests.exceptions import ReadTimeout

app = Flask(__name__)
key = "FE01D81011737B8704E1256D24F2C2C16B3083BC2F1C5A90106C80BE24F40E20"
api = OpenSkyApi("Beacon6", key)

debug = True
dummy_data = [
    {'icao24': '4b1814', 'callsign': 'SWR3YZ  ', 'longitude': 3.7492, 'latitude': 48.5161},
    {'icao24': '4b1815', 'callsign': 'SWR85Q  ', 'longitude': -0.3495, 'latitude': 51.3015},
    {'icao24': '4b1803', 'callsign': 'SWR6PC  ', 'longitude': 17.3085, 'latitude': 47.5221},
    {'icao24': '4b1806', 'callsign': 'SWR797  ', 'longitude': 5.974, 'latitude': 49.8146},
    {'icao24': '4b1807', 'callsign': 'SWR81AT ', 'longitude': 16.5687, 'latitude': 48.1186}]


@app.route("/aircraft_data", methods=["POST"])
def get_aircraft_data():
    viewport_bounds = request.json
    print(viewport_bounds)

    try:
        request_successful = True
        # bbox = (min latitude, max latitude, min longitude, max longitude)
        if debug:
            aircraft_data = dummy_data
        else:
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
