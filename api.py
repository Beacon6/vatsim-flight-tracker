from flask import Flask
from flask_cors import CORS
from requests.exceptions import ReadTimeout
from requests import get

app = Flask(__name__)
CORS(app)
vatsim_data_url = 'https://data.vatsim.net/v3/vatsim-data.json'


@app.route('/vatsim_data')
def get_vatsim_data():
    try:
        request_status = True
        response = get(vatsim_data_url).json()

        vatsim_data = {}

        if response:
            vatsim_data['general'] = response['general']
            vatsim_data['pilots'] = response['pilots']
            vatsim_data['controllers'] = response['controllers']
            pilots_count = len(vatsim_data['pilots'])
            atc_count = len(vatsim_data['controllers'])
        else:
            print('Something went wrong')
            request_status = False
            vatsim_data = {}
            pilots_count = 0
            atc_count = 0

        print(f'Request status: {request_status}')
        print(f'Pilots online: {pilots_count}')
        print(f'ATC online: {atc_count}')
        return {
            'request_successful': request_status,
            'vatsim_data': vatsim_data,
            'pilots_count': pilots_count,
            'atc_count': atc_count
        }

    except ReadTimeout:
        print('Something went wrong')
        return {
            'request_successful': False,
            'vatsim_data': {},
            'pilots_count': 0,
            'atc_count': 0
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
