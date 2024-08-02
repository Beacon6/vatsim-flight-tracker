export interface AirportsInterface {
  airports: {
    icao: string;
    airport_name: string;
    lat: number;
    lng: number;
    iata?: string;
    fir: string;
    is_pseudo: boolean;
  }[];
}
