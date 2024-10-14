import Database from "better-sqlite3";
import "dotenv/config";

export default class NavigraphDatabase {
    db: any;

    constructor() {
        this.db = new Database(`db/${process.env.DB_FILENAME}`);
    }

    getAirportsCollection() {
        const query = this.db.prepare("SELECT * FROM tbl_airports");
        return query.all();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAirports(dep: any, arr: any, altn: any) {
        const query = this.db.prepare(
            "SELECT * FROM tbl_airports WHERE airport_identifier=? OR airport_identifier=? OR airport_identifier=?",
        );
        return query.all(dep, arr, altn);
    }

    close() {
        this.db.close();
    }
}
