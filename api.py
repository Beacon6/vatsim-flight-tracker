from flask import Flask, request
from opensky_api import OpenSkyApi  # type: ignore
from requests.exceptions import ReadTimeout
from requests import get
import dummy_data

app = Flask(__name__)
key = "FE01D81011737B8704E1256D24F2C2C16B3083BC2F1C5A90106C80BE24F40E20"
api = OpenSkyApi("Beacon6", key)

debug = True
dummy_data = dummy_data.dummy_data


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
        print(f"Request status: {request_successful}")
        print(f"Tracking: {aircraft_count} aircraft")
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


@app.route("/aircraft_photo", methods=["POST"])
def get_aircraft_photo():
    hex_code = request.json
    print(hex_code)

    base_url = "https://api.planespotters.net/pub/photos/hex/"
    response = get(base_url + hex_code).json()

    aircraft_photo = {}

    aircraft_photo["img"] = response["photos"][0]["thumbnail_large"]["src"]
    aircraft_photo["link"] = response["photos"][0]["link"]
    aircraft_photo["author"] = response["photos"][0]["photographer"]

    return aircraft_photo
