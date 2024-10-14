import Database from "better-sqlite3";
import "dotenv/config";

export default class NavigraphDatabase {
    db: any;

    constructor() {
        this.db = new Database(`db/${process.env.DB_FILENAME}`);
    }

    getAirports() {
        const query = this.db.prepare("SELECT * FROM tbl_airports");
        return query.all();
    }

    close() {
        this.db.close();
    }
}
