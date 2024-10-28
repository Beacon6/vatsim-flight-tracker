import "dotenv/config";
import cors from "cors";
import express, { Express } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import assertPathExists from "./helpers/assertPathExists.ts";
import NavigationDatabase from "./database.ts";
import { IPilotDetails, IPilots, IPilotsSubset } from "../types/IPilots.ts";
import { IVatsimData } from "../types/IVatsimData.ts";
import { IAirportSubset } from "../types/IAirports.ts";

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
let vatsimDataSubset: IPilotsSubset | undefined;

async function fetchVatsimData(): Promise<IVatsimData> {
  console.log("VATSIM API called");
  const response: Response = await fetch("https://data.vatsim.net/v3/vatsim-data.json");
  const data: any = await response.json();
  for (const p of data.pilots) {
    delete p.cid;
    delete p.name;
    delete p.server;
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
    vatsimDataSubset = { pilots: [] };

    for (const pilot of vatsimData.pilots) {
      vatsimDataSubset.pilots.push({
        callsign: pilot.callsign,
        latitude: pilot.latitude,
        longitude: pilot.longitude,
        heading: pilot.heading,
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

    const pilot: IPilots["pilots"][number] = vatsimData.pilots.find((p: IPilots["pilots"][number]): boolean => {
      return p.callsign === callsign;
    })!;

    const dep: IAirportSubset | undefined = db.getAirport(pilot?.flight_plan?.departure as string);
    const arr: IAirportSubset | undefined = db.getAirport(pilot?.flight_plan?.arrival as string);
    const alt: IAirportSubset | undefined = db.getAirport(pilot?.flight_plan?.alternate as string);

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
  } finally {
    db.close();
  }
});
