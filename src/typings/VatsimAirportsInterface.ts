export interface VatsimAirportsInterface {
  airports: {
    icao: string;
    airport_name: string;
    latitude: number;
    longitude: number;
  }[];
}
