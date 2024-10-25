import { IPilots } from "./IPilots";
import { IControllers } from "./IControllers";

export interface IVatsimData extends IPilots, IControllers {
  general: {
    version: number;
    reload: number;
    update: string;
    update_timestamp: string;
    connected_clients: number;
    unique_clients: number;
  };
  atis: {
    cid: number;
    name: string;
    callsign: string;
    frequency: string;
    facility: number;
    rating: number;
    server: string;
    visual_range: number;
    atis_code: string;
    text_atis: string[];
    last_updated: string;
    logon_time: string;
  }[];
  facilities: {
    id: number;
    short: string;
    long: string;
  }[];
}
