export interface VatsimDataInterface {
  pilots: {
    altitude: number;
    callsign: string;
    cid: number;
    flight_plan?: {
      aircraft: string;
      aircraft_faa: string;
      aircraft_short: string;
      alternate: string;
      altitude: number;
      arrival: string;
      assigned_transponder: number;
      cruise_tas: number;
      departure: string;
      deptime: number;
      enroute_time: number;
      flight_rules: string;
      fuel_time: number;
      remarks: string;
      revision_id: number;
      route: string;
    };
    groundspeed: number;
    heading: number;
    latitude: number;
    longitude: number;
    name: string;
    qnh_i_hq: number;
    qnh_mb: number;
    server: string;
    transponder: number;
  }[];
  controllers: {
    cid: number;
    callsign: string;
    frequency: string;
    facility: number;
    text_atis: string[];
    sector?: [number, number][];
  }[];
}
