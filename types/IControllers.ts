export interface IControllers {
  controllers: {
    cid: number;
    name: string;
    callsign: string;
    frequency: string;
    facility: number;
    rating: number;
    server: string;
    visual_range: number;
    text_atis: string;
    last_updated: string;
    logon_time: string;
  }[];
}
