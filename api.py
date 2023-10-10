from flask import Flask
from opensky_api import OpenSkyApi # type: ignore

api = OpenSkyApi()
s = api.get_states()
print(s)

app = Flask(__name__)

@app.route('/state')
def draw_state():
    return
