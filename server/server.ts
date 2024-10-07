import axios from "axios";
import cors from "cors";
import express from "express";

import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { Server } from "socket.io";

import { VatsimDataInterface } from "../types/VatsimDataInterface.ts";

const app = express();
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

let interval: NodeJS.Timeout | undefined;
let vatsimData: VatsimDataInterface | undefined;

if (!existsSync("dist")) {
    throw Error("Build files not found");
}

async function getVatsimData() {
    const response = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");

    if (response.status === 200) {
        vatsimData = {
            pilots: response["data"]["pilots"],
            atcCount: response["data"]["controllers"].length,
        };
        return vatsimData;
    } else {
        throw Error("Bad response when fetching Vatsim data");
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
            } catch (err) {
                console.error(err);
            }
        }
    });
});

webSocketServer.listen(5000);
console.log(`Server listening on http://127.0.0.1:5000`);
