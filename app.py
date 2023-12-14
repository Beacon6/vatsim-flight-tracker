from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from requests.exceptions import ReadTimeout
from requests import get
import dummy_data

load_dotenv()
api_key = os.getenv("API_KEY")

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
            response = get(api_url, {"key": api_key})

            aircraft_features = []
            icao24_set = set()

            if response is not None:
                for s in response.json():
                    if (s["aircraft"]["icao24"] != "XXC"
                            and s["aircraft"]["icao24"] not in icao24_set):
                        icao24_set.add(s["aircraft"]["icao24"])
                        aircraft_features.append({
                            "type": "Feature",
                            "properties": {
                                "icao24": s["aircraft"]["icao24"],
                                "aircraft_type": s["aircraft"]["icaoCode"],
                                "reg_number": s["aircraft"]["regNumber"],
                                "airline": s["airline"]["icaoCode"],
                                "arrival": s["arrival"]["icaoCode"],
                                "departure": s["departure"]["icaoCode"],
                                "flight_number": s["flight"]["iataNumber"],
                                "callsign": s["flight"]["icaoNumber"],
                                "baro_altitude": s["geography"]["altitude"],
                                "true_heading": s["geography"]["direction"],
                                "ground_speed": s["speed"]["horizontal"],
                                "vertical_speed": s["speed"]["vspeed"],
                                "on_ground": s["speed"]["isGround"],
                                "squawk": s["system"]["squawk"],
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [s["geography"]["longitude"],
                                                s["geography"]["latitude"]],
                            }
                        })

                displayed_aircraft = []

                for x in aircraft_features:
                    lat = x["geometry"]["coordinates"][1]
                    lng = x["geometry"]["coordinates"][0]
                    if (viewport_bounds["sw"][0] < lat
                            and lat < viewport_bounds["ne"][0]
                            and viewport_bounds["sw"][1] < lng
                            and lng < viewport_bounds["ne"][1]):
                        displayed_aircraft.append(x)

                aircraft_data = {
                    "type": "FeatureCollection",
                    "features": displayed_aircraft
                }
            else:
                raise TypeError

        tracking_count = len(aircraft_features)
        displayed_count = len(displayed_aircraft)
        print(f"Request status: {request_successful}")
        print(f"Tracking: {tracking_count} aircraft")
        print(f"Displaying: {displayed_count} aircraft")
        return {
            "request_successful": request_successful,
            "aircraft_data": aircraft_data,
            "aircraft_count_total": tracking_count,
            "aircraft_count_displayed": displayed_count
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
