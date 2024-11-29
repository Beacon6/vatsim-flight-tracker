import "dotenv/config";
import cors from "cors";
import express, { Express } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import assertPathExists from "./helpers/assertPathExists.ts";
import NavigationDatabase from "./database.ts";
import { IPilotDetails, IPilots } from "../types/IPilots.ts";
import { IVatsimData, IVatsimDataSubset } from "../types/IVatsimData.ts";
import { IAirportSubset } from "../types/IAirports.ts";
import { IRoute } from "../types/IRoute.ts";

const DATABASE_PATH: string = process.env.DATABASE_PATH!;
const PORT: string = process.env.PORT!;

const app: Express = express();
const server: any = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

assertPathExists(DATABASE_PATH, "Database missing");
assertPathExists("dist", "Build files missing");

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);

let refreshInterval: NodeJS.Timeout | undefined;
let vatsimData: IVatsimData | undefined;
let vatsimDataSubset: IVatsimDataSubset | undefined;

async function fetchVatsimData(): Promise<IVatsimData> {
  const response: Response = await fetch("https://data.vatsim.net/v3/vatsim-data.json");
  const data: any = await response.json();
  for (const p of data.pilots) {
    ["cid", "name", "server"].forEach((e: string): boolean => delete p[e]);
  }
  for (const c of data.controllers) {
    ["cid", "name", "server"].forEach((e: string): boolean => delete c[e]);
  }

  if (response.ok) {
    return {
      general: data["general"],
      pilots: data["pilots"],
      controllers: data["controllers"],
      atis: data["atis"],
      facilities: data["facilities"],
    };
  } else {
    throw new Error(`Bad response when fetching Vatsim data: ${response.status}`);
  }
}

export async function sendVatsimData(): Promise<void> {
  try {
    vatsimData = await fetchVatsimData();
    vatsimDataSubset = { general: { update_timestamp: "" }, pilots: [], controllers: [] };

    vatsimDataSubset.general.update_timestamp = vatsimData.general.update_timestamp;
    for (const pilot of vatsimData.pilots) {
      vatsimDataSubset.pilots.push({
        callsign: pilot.callsign,
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        heading: pilot.heading,
      });
    }
    for (const controller of vatsimData.controllers) {
      vatsimDataSubset.controllers.push({
        callsign: controller.callsign,
        frequency: controller.frequency,
      });
    }

    io.emit("vatsimDataSubset", vatsimDataSubset);
  } catch (err: any) {
    console.error(err.message);
  }
}

io.on("connection", async (socket: any): Promise<void> => {
  try {
    console.log(`New client connected on port ${PORT}`);
    console.log(`Clients connected: ${io.engine.clientsCount}`);

    if (vatsimDataSubset) {
      io.emit("vatsimDataSubset", vatsimDataSubset);
    }

    if (!refreshInterval) {
      refreshInterval = setInterval(sendVatsimData, 15000);
      await sendVatsimData();
    }
  } catch (err: any) {
    console.error(err.message);
  }

  socket.on("disconnect", (): void => {
    console.log(`Client disconnected from port ${PORT}`);
    console.log(`Clients connected: ${io.engine.clientsCount}`);
    if (!io.engine.clientsCount) {
      clearInterval(refreshInterval);
      refreshInterval = undefined;
      vatsimDataSubset = undefined;
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
    let route: IRoute | undefined;

    if (pilot.flight_plan) {
      dep = db.getAirport(pilot?.flight_plan?.departure as string);
      arr = db.getAirport(pilot?.flight_plan?.arrival as string);
      alt = db.getAirport(pilot?.flight_plan?.alternate as string);
      route = db.getRoute(pilot?.flight_plan?.route as string);
    }

    const pilotDetails: IPilotDetails = {
      pilot: pilot,
      departure: dep,
      arrival: arr,
      alternate: alt,
      route: route,
    };

    res.json(pilotDetails);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  db.close();
});
