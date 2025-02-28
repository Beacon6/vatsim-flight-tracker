import "dotenv/config";
import cors from "cors";
import express from "express";
import { existsSync } from "fs";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import logger from "./utils/logger.ts";
import VatsimDataSource from "./vatsim-data.ts";

import NavigationDatabase from "./database.ts";
import { IPilotDetails, IPilots } from "../types/IPilots.ts";
import { IVatsimData } from "../types/IVatsimData.ts";
import { IAirportSubset } from "../types/IAirports.ts";
import assert from "assert";

const DATABASE_PATH: string = process.env.DATABASE_PATH!;
const PORT: string = process.env.PORT!;

assert(
    DATABASE_PATH && PORT && process.env.VITE_SERVER,
    "missing required env variables",
);
assert(existsSync(DATABASE_PATH), "database file not found");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const server = createServer(app);
const wss = new WebSocketServer({ server });
const vatsimDataSource = new VatsimDataSource();

server.listen(PORT);
logger.info(`server listening on port ${PORT}`);

let refreshInterval: NodeJS.Timeout | undefined;
let vatsimData: IVatsimData | undefined;

wss.on("connection", async (socket, req) => {
    socket.on("error", logger.error);

    logger.info(
        `new client connected on port ${PORT} (${req.socket.remoteAddress}) - ` +
            `Clients connected: ${wss.clients.size}`,
    );

    try {
        if (refreshInterval) {
            await vatsimDataSource.sendData(socket, vatsimData!);
        } else {
            logger.info("creating new refresh interval");
            refreshInterval = setInterval(async () => {
                vatsimData = await vatsimDataSource.refreshData(socket);
            }, 15000);

            vatsimData = await vatsimDataSource.refreshData(socket);
        }
    } catch (err: any) {
        logger.error(err.message);
    }

    socket.on("close", () => {
        logger.info(
            `client disconnected from port ${PORT} - clients connected: ${wss.clients.size}`,
        );

        if (!wss.clients.size) {
            logger.info("clearing the refresh interval");
            clearInterval(refreshInterval);
            refreshInterval = undefined;
        }
    });
});

app.get("/flight", (req: any, res: any): void => {
    const db = new NavigationDatabase();
    try {
        const callsign: string = req.query.callsign;

        if (!vatsimData) {
            res.status(500).json({ error: "VatsimData missing" });
            return;
        }

        const pilot: IPilots["pilots"][number] = vatsimData.pilots.find(
            (p: IPilots["pilots"][number]): boolean => p.callsign === callsign,
        )!;

        let dep: IAirportSubset | undefined;
        let arr: IAirportSubset | undefined;
        let alt: IAirportSubset | undefined;

        if (pilot.flight_plan) {
            dep = db.getAirport(pilot?.flight_plan?.departure as string);
            arr = db.getAirport(pilot?.flight_plan?.arrival as string);
            alt = db.getAirport(pilot?.flight_plan?.alternate as string);
        }

        const pilotDetails: IPilotDetails = {
            pilot: pilot,
            departure: dep,
            arrival: arr,
            alternate: alt,
        };

        res.json(pilotDetails);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
    db.close();
});
