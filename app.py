from flask import Flask, request
from flask_cors import CORS
from api_key import api_key
from requests.exceptions import ReadTimeout
from requests import get
import dummy_data

app = Flask(__name__)
CORS(app)
api_url = "https://aviation-edge.com/v2/public/flights"

debug = False
dummy_data = dummy_data.dummy_data


@app.route("/aircraft_data", methods=["POST"])
def get_aircraft_data():
    viewport_bounds = request.json
    print(viewport_bounds)

    try:
        request_successful = True

        if debug:
            aircraft_data = dummy_data
        else:
            payload = {
                "lat": viewport_bounds[0],
                "lng": viewport_bounds[1],
                "distance": 1000,
                "key": api_key
                }
            response = get(api_url, payload)

            aircraft_data = []

            if response is not None:
                for s in response.json():
                    aircraft_data.append({
                        "icao24": s["aircraft"]["icao24"],
                        "callsign": s["flight"]["icaoNumber"],
                        "longitude": s["geography"]["longitude"],
                        "latitude": s["geography"]["latitude"],
                        "velocity": s["speed"]["horizontal"],
                        "true_track": s["geography"]["direction"],
                        "baro_altitude": s["geography"]["altitude"],
                        "squawk": s["system"]["squawk"]
                        })
            else:
                raise TypeError

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

    except TypeError:
        request_successful = False
        print("Received data is invalid")
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

    try:
        aircraft_photo_exists = True

        aircraft_photo["img"] = response["photos"][0]["thumbnail_large"]["src"]
        aircraft_photo["link"] = response["photos"][0]["link"]
        aircraft_photo["author"] = response["photos"][0]["photographer"]

        return {
            "aircraft_photo_exists": aircraft_photo_exists,
            "aircraft_photo": aircraft_photo
        }

    except IndexError:
        aircraft_photo_exists = False
        print("Could not find any photo for this aircraft")
        return {
            "aircraft_photo_exists": aircraft_photo_exists,
            "aircraft_photo": None
        }
