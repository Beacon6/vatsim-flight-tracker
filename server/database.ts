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
    if (!ident) {
      return;
    }

    const query: any = this.db.prepare("SELECT * FROM tbl_airports WHERE airport_identifier=?");
    const result: any = query.get(ident);

    return {
      airport_identifier: result.airport_identifier,
      aiport_name: result.aiport_name,
      airport_ref_latitude: result.airport_ref_latitude,
      airport_ref_longitude: result.airport_ref_longitude,
    };
  }

  getWaypoints(waypoints: string[]) {
    const enrouteWaypoints = [];

    for (const element of waypoints) {
      if (/\d/.test(element)) {
        continue;
      }

      const coords = this.db
        .prepare(
          "SELECT waypoint_identifier, waypoint_latitude, waypoint_longitude FROM tbl_enroute_waypoints WHERE waypoint_identifier=?",
        )
        .get(element);

      enrouteWaypoints.push(coords);
    }

    return enrouteWaypoints;
  }
}
