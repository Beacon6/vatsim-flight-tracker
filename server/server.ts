import cors from "cors";
import "dotenv/config";
import express from "express";

import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { Server } from "socket.io";

import NavigraphDatabase from "./database.ts";
import parseRoute from "./helpers/routeParser.ts";

import { IPilots } from "../types/IPilots.ts";
import { IControllers } from "../types/IControllers.ts";

const app = express();
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, { cors: { origin: "*" } });
const PORT = process.env.VITE_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

let interval: NodeJS.Timeout | undefined;
let vatsimData: { pilots: IPilots; controllers: IControllers } | undefined;
const dbFilename = process.env.DB_FILENAME!;

if (!existsSync("dist")) {
    throw Error("Build files not found");
}
if (!existsSync(`db/${dbFilename}`) || !process.env.DB_FILENAME) {
    throw Error("Database not found");
}

async function getVatsimData() {
    const response = await fetch(process.env.VATSIM_API!);
    const data = await response.json();

    if (response.ok) {
        vatsimData = {
            pilots: data["pilots"],
            controllers: data["controllers"],
        };
        return vatsimData;
    } else {
        throw Error(`Bad response when fetching Vatsim data: ${response.status}`);
    }
}

async function sendVatsimData() {
    try {
        const vatsimData = await getVatsimData();
        if (vatsimData) {
            io.emit("vatsimData", vatsimData);
        }
    } catch (err) {
        console.error(err);
    }
}

app.get("/airports", async (req, res) => {
    const database = new NavigraphDatabase();
    try {
        const { dep, arr, altn } = req.query;

        if (!dep || !arr || !altn) {
            return res.status(400).json({ Error: "Required query parameters missing" });
        }

        const departure = await database.getAirport(dep as string);
        const arrival = await database.getAirport(arr as string);
        const alternate = await database.getAirport(altn as string);

        res.json({ departure: departure, arrival: arrival, alternate: alternate });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ Error: err.message });
    } finally {
        database.close();
    }
});

app.get("/route", async (req, res) => {
    const database = new NavigraphDatabase();
    try {
        const callsign = req.query.callsign;

        if (!callsign) {
            return res.status(400).json({ Error: "Required query parameter missing" });
        } else if (!vatsimData) {
            return res.status(500).json({ Error: "No clients active - Vatsim data missing" });
        }

        const pilots = vatsimData.pilots as any;
        const flightPlanRoute = pilots.find((e: IPilots["pilots"][number]) => {
            return e.callsign === callsign;
        })?.flight_plan?.route;

        const waypoints = parseRoute(flightPlanRoute);

        res.json({ Route: waypoints });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ Error: err.message });
    } finally {
        database.close();
    }
});

io.on("connection", async (socket) => {
    console.log("New client connected");
    console.log(`Clients connected: ${io.engine.clientsCount}`);

    try {
        if (vatsimData) {
            io.emit("vatsimData", vatsimData);
        }

        if (!interval) {
            console.log("Creating new fetch interval");
            interval = setInterval(sendVatsimData, 15000);
            await sendVatsimData();
        }
    } catch (err) {
        console.error(err);
    }

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        console.log(`Clients connected: ${io.engine.clientsCount}`);

        if (io.engine.clientsCount === 0) {
            console.log("Clearing fetch interval");
            try {
                clearInterval(interval);
                interval = undefined;
                vatsimData = undefined;
            } catch (err) {
                console.error(err);
            }
        }
    });
});

webSocketServer.listen(PORT);
console.log(`Server listening on http://127.0.0.1:${PORT}`);
