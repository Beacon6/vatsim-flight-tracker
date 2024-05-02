export interface AirportsInterface {
  airports: {
    icao: string;
    airport_name: string;
    latitude: number;
    longitude: number;
  }[];
}

export interface AirportInterface {
  icao: string;
  airport_name: string;
  latitude: number;
  longitude: number;
}
