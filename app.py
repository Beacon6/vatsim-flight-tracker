from os import getenv
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from requests.exceptions import ReadTimeout
from requests import get
from typing import Dict, List, Union

load_dotenv()
api_key: str | None = getenv('API_KEY')

app = Flask(__name__)
CORS(app)
api_url: str = 'https://aviation-edge.com/v2/public/flights'


@app.route('/aircraft_data', methods=['POST'])
def get_aircraft_data():
    viewport_bounds: Union[Dict[str, List[float]], None] = request.json
    print(viewport_bounds)

    try:
        request_successful: bool = True
        response = get(api_url, {'key': api_key}).json()

        tracked_aircraft = []
        icao24_set = set()

        if response and viewport_bounds:
            for element in response:
                if element['aircraft']['icao24'] not in 'XXC' and element['aircraft']['icao24'] not in icao24_set:
                    icao24_set.add(element['aircraft']['icao24'])
                    tracked_aircraft.append({
                        'type': 'Feature',
                        'properties': {
                            'icao24': element['aircraft']['icao24'],
                            'aircraft_type': element['aircraft']['icaoCode'],
                            'reg_number': element['aircraft']['regNumber'],
                            'airline': element['airline']['icaoCode'],
                            'arrival': element['arrival']['icaoCode'],
                            'departure': element['departure']['icaoCode'],
                            'flight_number': element['flight']['iataNumber'],
                            'callsign': element['flight']['icaoNumber'],
                            'baro_altitude': element['geography']['altitude'],
                            'true_heading': element['geography']['direction'],
                            'ground_speed': element['speed']['horizontal'],
                            'vertical_speed': element['speed']['vspeed'],
                            'on_ground': element['speed']['isGround'],
                            'squawk': element['system']['squawk'],
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [element['geography']['longitude'],
                                            element['geography']['latitude']],
                        }
                    })

            displayed_aircraft = []

            for element in tracked_aircraft:
                lat: float = element['geometry']['coordinates'][1]
                lng: float = element['geometry']['coordinates'][0]
                if (viewport_bounds['sw'][0] < lat
                        and lat < viewport_bounds['ne'][0]
                        and viewport_bounds['sw'][1] < lng
                        and lng < viewport_bounds['ne'][1]):
                    displayed_aircraft.append(element)

            aircraft_data = {
                'type': 'FeatureCollection',
                'features': displayed_aircraft
            }

        else:
            print('Something went wrong')
            request_successful: bool = False
            aircraft_data = {}

        tracked_aircraft_count: int = len(tracked_aircraft)
        print(f'Request status: {request_successful}')
        print(f'Tracking: {tracked_aircraft_count} aircraft')
        return {
            'request_successful': request_successful,
            'aircraft_data': aircraft_data,
            'tracked_aircraft_count': tracked_aircraft_count,
        }

    except ReadTimeout:
        request_successful: bool = False
        print('Something went wrong')
        return {
            'request_successful': request_successful,
            'aircraft_data': None,
            'aircraft_count': None
        }


@app.route('/aircraft_photo', methods=['POST'])
def get_aircraft_photo():
    hex_code: str = str(request.json)
    print(hex_code)

    base_url: str = 'https://api.planespotters.net/pub/photos/hex/'
    response = get(base_url + hex_code).json()

    aircraft_photo = {}

    try:
        aircraft_photo_exists = True

        aircraft_photo['img'] = response['photos'][0]['thumbnail_large']['src']
        aircraft_photo['link'] = response['photos'][0]['link']
        aircraft_photo['author'] = response['photos'][0]['photographer']

        return {
            'aircraft_photo_exists': aircraft_photo_exists,
            'aircraft_photo': aircraft_photo
        }

    except IndexError:
        aircraft_photo_exists = False
        print('Could not find any photo for this aircraft')
        return {
            'aircraft_photo_exists': aircraft_photo_exists,
            'aircraft_photo': None
        }

if __name__ == '__main__':
    app.run()
