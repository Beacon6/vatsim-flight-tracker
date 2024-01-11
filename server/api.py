from flask import Flask
from flask_cors import CORS
from requests.exceptions import ReadTimeout
from requests import get

app = Flask(__name__)
CORS(app)
vatsim_data = 'https://data.vatsim.net/v3/vatsim-data.json'


@app.route('/aircraft_data')
def get_aircraft_data():
    try:
        request_status = True
        response = get(vatsim_data).json()

        aircraft_data = {}

        if response:
            aircraft_data['general'] = response['general']
            aircraft_data['pilots'] = response['pilots']
            tracked_aircraft_count = len(aircraft_data['pilots'])
        else:
            print('Something went wrong')
            request_status = False
            aircraft_data = {}
            tracked_aircraft_count = 0

        print(f'Request status: {request_status}')
        print(f'Tracking: {tracked_aircraft_count} aircraft')
        return {
            'request_successful': request_status,
            'aircraft_data': aircraft_data,
            'tracked_aircraft_count': tracked_aircraft_count
        }

    except ReadTimeout:
        print('Something went wrong')
        return {
            'request_successful': False,
            'aircraft_data': {},
            'tracked_aircraft_count': 0
        }


# @app.route('/aircraft_photo', methods=['POST'])
# def get_aircraft_photo():
#     hex_code = str(request.json)
#     print(hex_code)

#     base_url = 'https://api.planespotters.net/pub/photos/hex/'
#     response = get(base_url + hex_code).json()

#     aircraft_photo = {}

#     try:
#         aircraft_photo_exists = True

#         aircraft_photo['img'] = response['photos'][0]['thumbnail_large']['src']
#         aircraft_photo['link'] = response['photos'][0]['link']
#         aircraft_photo['author'] = response['photos'][0]['photographer']

#         return {
#             'aircraft_photo_exists': aircraft_photo_exists,
#             'aircraft_photo': aircraft_photo
#         }

#     except IndexError:
#         aircraft_photo_exists = False
#         print('Could not find any photo for this aircraft')
#         return {
#             'aircraft_photo_exists': aircraft_photo_exists,
#             'aircraft_photo': None
#         }

if __name__ == '__main__':
    app.run()
