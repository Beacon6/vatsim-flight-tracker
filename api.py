from flask import Flask, jsonify
from opensky_api import OpenSkyApi # type: ignore
import pandas as pd

app = Flask(__name__)

api = OpenSkyApi("Beacon6", "FE01D81011737B8704E1256D24F2C2C16B3083BC2F1C5A90106C80BE24F40E20")

# bbox = (min latitude, max latitude, min longitude, max longitude)
open_sky_states = api.get_states(bbox=(47.26, 54.92, 5.34, 14.90))

tracked_aircraft = []

for x in open_sky_states.states:
    # fetch: icao24, callsign, longitude, latitude, on_ground, velocity, true_track,
    # vertical_rate, baro_altitude, squawk

    tracked_aircraft.append({
        "callsign" : x.callsign,
        "longitude" : x.longitude,
        "latitude" : x.latitude,
        "velocity" : x.velocity,
        "true_track" : x.true_track,
        "vertical_rate" : x.vertical_rate,
        "baro_altitude" : x.baro_altitude,
        "on_ground" : x.on_ground,
        "squawk": x.squawk
        })

df = pd.DataFrame(tracked_aircraft)
df = df.dropna()

@app.route("/state")
def draw_state():
    return jsonify(df.to_dict(orient='records'))
