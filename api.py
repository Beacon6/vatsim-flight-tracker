from flask import Flask
from opensky_api import OpenSkyApi # type: ignore

app = Flask(__name__)
api = OpenSkyApi("Beacon6", "FE01D81011737B8704E1256D24F2C2C16B3083BC2F1C5A90106C80BE24F40E20")

aircraft_data = []

def get_aircraft_data():
    # bbox = (min latitude, max latitude, min longitude, max longitude)
    aircraft_states = api.get_states(bbox=(47.26, 54.92, 5.34, 14.90))

    for s in aircraft_states.states:
        aircraft_data.append({
            "icao24" : s.icao24,
            "callsign" : s.callsign,
            "longitude" : s.longitude,
            "latitude" : s.latitude,
            })

    return aircraft_data

aircraft_data = get_aircraft_data()

@app.route("/aircraft_data")
def send_aircraft_data():
    return aircraft_data
