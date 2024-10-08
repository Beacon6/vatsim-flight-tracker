import Database from "better-sqlite3";

export default class Data {
    db: any;

    constructor(filename: string) {
        this.db = new Database(`db/${filename}`);
    }

    getAirports() {
        const query = this.db.prepare("SELECT * FROM tbl_airports");
        return query.all();
    }

    close() {
        this.db.close();
    }
}
