from flask import Flask, request
from opensky_api import OpenSkyApi  # type: ignore
from requests.exceptions import ReadTimeout

app = Flask(__name__)
key = "FE01D81011737B8704E1256D24F2C2C16B3083BC2F1C5A90106C80BE24F40E20"
api = OpenSkyApi("Beacon6", key)

debug = True
dummy_data = [
    {'icao24': '4b1816', 'callsign': 'SWR8WA', 'longitude': 14.9186, 'latitude': 45.6102, 'velocity': 237.93, 'true_track': 130.44, 'baro_altitude': 11277.6, 'category': 0},
    {'icao24': '440da4', 'callsign': 'JPV137', 'longitude': 9.5135, 'latitude': 47.6696, 'velocity': 0, 'true_track': 140.62, 'baro_altitude': None, 'category': 0},
    {'icao24': '4b1804', 'callsign': 'SWR1ZH', 'longitude': 14.4882, 'latitude': 46.208, 'velocity': 69.86, 'true_track': 306.62, 'baro_altitude': 510.54, 'category': 0},
    {'icao24': '4b1806', 'callsign': 'SWR6LH', 'longitude': 6.3414, 'latitude': 46.396, 'velocity': 86.94, 'true_track': 225.24, 'baro_altitude': 1783.08, 'category': 0},
    {'icao24': '4b1807', 'callsign': 'SWR6FL', 'longitude': 6.7643, 'latitude': 51.2833, 'velocity': 10.29, 'true_track': 53.44, 'baro_altitude': None, 'category': 0}]


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
                    "velocity": s.velocity,
                    "true_track": s.true_track,
                    "baro_altitude": s.baro_altitude,
                    "category": s.category
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
