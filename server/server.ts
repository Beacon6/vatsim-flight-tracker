import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import assertPathExists from "./helpers/assertPathExists.ts";
import NavigationDatabase from "./database.ts";
import { IPilots, IPilotsSubset } from "../types/IPilots.ts";
import { IControllers } from "../types/IControllers.ts";
import { sendVatsimDataSubset } from "./vatsimData.ts";

const DATABASE_PATH = process.env.DATABASE_PATH!;
const PORT = process.env.PORT!;

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

assertPathExists(DATABASE_PATH, "Database missing");
assertPathExists("dist", "Build files missing");

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);

let refreshInterval: NodeJS.Timeout | undefined;
let vatsimDataSubset: IPilotsSubset | undefined;

io.on("connection", async (socket) => {
  await sendVatsimDataSubset(io);
  console.log(`New client connected on port ${PORT}`);
  console.log(`Clients connected: ${io.engine.clientsCount}`);
  try {
    if (vatsimDataSubset) {
      io.emit("vatsimDataSubset", vatsimDataSubset);
    }
    if (!refreshInterval) {
      refreshInterval = setInterval(sendVatsimDataSubset, 15000);
    }
  } catch (err: any) {
    console.error(err.message);
  }

  socket.on("disconnect", () => {
    console.log(`Client disconnected from port ${PORT}`);
    if (!io.engine.clientsCount) {
      clearInterval(refreshInterval);
      vatsimData = undefined;
    }
  });
});

app.get("/flight", async (req, res) => {
  const db = new NavigationDatabase();
  try {
    const callsign = req.query.callsign;

    if (!vatsimData) {
      res.status(500).json({ error: "VatsimData missing" });
      return;
    }

    const pilot = vatsimData.pilots.find((p) => {
      return p.callsign === callsign;
    });

    const airports = { dep: undefined, arr: undefined, altn: undefined };
    airports.dep = await db.getAirport(pilot?.flight_plan?.departure as string);
    airports.arr = await db.getAirport(pilot?.flight_plan?.arrival as string);
    airports.altn = await db.getAirport(pilot?.flight_plan?.alternate as string);

    res.json({ pilot: pilot, airports: airports });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    db.close();
  }
});
