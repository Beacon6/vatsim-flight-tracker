import Database from "better-sqlite3";
import "dotenv/config";

import { IAirportSubset } from "../types/IAirports.ts";

export default class NavigationDatabase {
  db: any;

  constructor() {
    this.db = new Database(process.env.DATABASE_PATH);
  }

  close(): void {
    this.db.close();
  }

  getAirport(ident: string): IAirportSubset | undefined {
    try {
      if (!ident) {
        return;
      }

      const query: any = this.db.prepare("SELECT * FROM tbl_airports WHERE airport_identifier=?");
      const result: any = query.get(ident);

      if (!result) {
        return;
      }

      return {
        airport_identifier: result.airport_identifier,
        airport_name: result.airport_name,
        airport_ref_latitude: result.airport_ref_latitude,
        airport_ref_longitude: result.airport_ref_longitude,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  }

  // TODO: full route display

  // getRoute(route: string): IRoute | undefined {
  //   if (!route) {
  //     return;
  //   }

  //   const waypoints: string[] = route.split(" ");
  //   const enroute_waypoints: string[] = waypoints.filter((w: string): boolean => w.length === 5);
  //   console.log(enroute_waypoints);

  //   return;
  // }
}
