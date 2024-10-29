export interface IControllers {
  controllers: {
    callsign: string;
    frequency: string;
    facility: number;
    rating: number;
    visual_range: number;
    text_atis: string;
    last_updated: string;
    logon_time: string;
  }[];
}

export interface IControllersSubset {
  controllers: {
    callsign: string;
    frequency: string;
  }[];
}
