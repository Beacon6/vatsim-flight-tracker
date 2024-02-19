export interface VatsimData {
  requestSuccessful: boolean;
  vatsimData: {
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
        arrival: number;
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
  };
  pilotsCount: number;
  atcCount: number;
}

export interface VatsimPilot {
  vatsimPilot: VatsimData['vatsimData']['pilots'][number];
}

export interface CenterBoundaries {
  [centerId: string]: [number, number][];
}
