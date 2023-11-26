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
            response = get(api_url, {"key": api_key})

            aircraft_data = []

            if response is not None:
                for s in response.json():
                    if s["aircraft"]["icao24"] != "XXC":
                        aircraft_data.append({
                            "icao24": s["aircraft"]["icao24"],
                            "aircraft_type": s["aircraft"]["icaoCode"],
                            "reg_number": s["aircraft"]["regNumber"],
                            "airline": s["airline"]["icaoCode"],
                            "arrival": s["arrival"]["icaoCode"],
                            "departure": s["departure"]["icaoCode"],
                            "flight_number": s["flight"]["iataNumber"],
                            "callsign": s["flight"]["icaoNumber"],
                            "baro_altitude": s["geography"]["altitude"],  # m
                            "true_heading": s["geography"]["direction"],
                            "latitude": s["geography"]["latitude"],
                            "longitude": s["geography"]["longitude"],
                            "ground_speed": s["speed"]["horizontal"],  # km/h
                            "vertical_speed": s["speed"]["vspeed"],  # m/s
                            "on_ground": s["speed"]["isGround"],
                            "squawk": s["system"]["squawk"]
                            })

                displayed_aircraft = []

                for x in aircraft_data:
                    if (viewport_bounds["sw"][0] < x["latitude"]
                            and x["latitude"] < viewport_bounds["ne"][0]
                            and viewport_bounds["sw"][1] < x["longitude"]
                            and x["longitude"] < viewport_bounds["ne"][1]):
                        displayed_aircraft.append(x)

            else:
                raise TypeError

        tracking_count = len(aircraft_data)
        displayed_count = len(displayed_aircraft)
        print(f"Request status: {request_successful}")
        print(f"Tracking: {tracking_count} aircraft")
        print(f"Displaying: {displayed_count} aircraft")
        return {
            "request_successful": request_successful,
            "aircraft_data": displayed_aircraft,
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
