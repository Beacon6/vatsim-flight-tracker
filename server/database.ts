import Database from "better-sqlite3";
import "dotenv/config";

export default class NavigraphDatabase {
    db: any;

    constructor() {
        this.db = new Database(`db/${process.env.DB_FILENAME}`);
    }

    close() {
        this.db.close();
    }

    getAirport(ident: string) {
        const query = this.db.prepare("SELECT * FROM tbl_airports WHERE airport_identifier=?");
        return query.get(ident);
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
