export interface ControllersInterface {
  controllers: {
    cid: number;
    callsign: string;
    frequency: string;
    facility: number;
    text_atis: string[];
    sector?: [number, number][];
  }[];
}
