import { IAirportSubset } from "./IAirports.ts";
import { IRoute } from "./IRoute.ts";

export interface IPilots {
  pilots: {
    callsign: string;
    pilot_rating: number;
    military_rating: number;
    latitude: number;
    longitude: number;
    altitude: number;
    groundspeed: number;
    transponder: number;
    heading: number;
    qnh_i_hq: number;
    qnh_mb: number;
    flight_plan?: {
      flight_rules: string;
      aircraft: string;
      aircraft_faa: string;
      aircraft_short: string;
      departure: string;
      arrival: string;
      alternate: string;
      cruise_tas: number;
      altitude: number;
      deptime: number;
      enroute_time: number;
      fuel_time: number;
      remarks: string;
      route: string;
      revision_id: number;
      assigned_transponder: number;
    };
    logon_time: string;
    last_updated: string;
  }[];
}

export interface IPilotDetails {
  pilot: IPilots["pilots"][number];
  departure: IAirportSubset | undefined;
  arrival: IAirportSubset | undefined;
  alternate: IAirportSubset | undefined;
  route: IRoute | undefined;
}

export interface IPilotsSubset {
  pilots: {
    callsign: string;
    latitude: number;
    longitude: number;
    heading: number;
  }[];
}
