import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import logger from './utils/logger.ts'

import assertPathExists from './utils/assertPathExists.ts';
import NavigationDatabase from './database.ts';
import { IPilotDetails, IPilots } from '../types/IPilots.ts';
import { IVatsimData, IVatsimDataSubset } from '../types/IVatsimData.ts';
import { IAirportSubset } from '../types/IAirports.ts';

const DATABASE_PATH: string = process.env.DATABASE_PATH!;
const PORT: string = process.env.PORT!;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const server = createServer(app);
const wss = new WebSocketServer({ server });

assertPathExists(DATABASE_PATH, 'Database missing');
assertPathExists('dist', 'Build files missing');

server.listen(PORT);
logger.info(`Server listening on port ${PORT}`);

let refreshInterval: NodeJS.Timeout | undefined;
let vatsimData: IVatsimData | undefined;
let vatsimDataSubset: IVatsimDataSubset | undefined;

async function fetchVatsimData(): Promise<IVatsimData> {
  const response: Response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
  const data: any = await response.json();
  for (const p of data.pilots) {
    ['cid', 'name', 'server'].forEach((e: string): boolean => delete p[e]);
  }
  for (const c of data.controllers) {
    ['cid', 'name', 'server'].forEach((e: string): boolean => delete c[e]);
  }

  if (response.ok) {
    return {
      general: data['general'],
      pilots: data['pilots'],
      controllers: data['controllers'],
      atis: data['atis'],
      facilities: data['facilities'],
    };
  } else {
    throw new Error(`Bad response when fetching Vatsim data: ${response.status}`);
  }
}

export async function sendVatsimData(): Promise<void> {
  try {
    vatsimData = await fetchVatsimData();
    vatsimDataSubset = { general: { update_timestamp: '' }, pilots: [], controllers: [] };

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

    wss.emit('vatsimDataSubset', vatsimDataSubset);
  } catch (err: any) {
    console.error(err.message);
  }
}

wss.on('connection', async (socket, req) => {
  socket.on('error', console.error);

  console.log(
    `New client connected on port ${PORT} (${req.socket.remoteAddress})\n` +
      `Clients connected: ${wss.clients.size}`,
  );

  try {
    if (vatsimDataSubset) {
      wss.emit('vatsimDataSubset', vatsimDataSubset);
    }

    if (!refreshInterval) {
      refreshInterval = setInterval(sendVatsimData, 15000);
      await sendVatsimData();
    }
  } catch (err: any) {
    console.error(err.message);
  }

  socket.on('close', () => {
    console.log(
      `Client disconnected from port ${PORT}\n` + `Clients connected: ${wss.clients.size}`,
    );

    if (!wss.clients.size) {
      clearInterval(refreshInterval);
      refreshInterval = undefined;
      vatsimDataSubset = undefined;
    }
  });
});

app.get('/flight', (req: any, res: any): void => {
  const db = new NavigationDatabase();
  try {
    const callsign: string = req.query.callsign;

    if (!vatsimData) {
      res.status(500).json({ error: 'VatsimData missing' });
      return;
    }

    const pilot: IPilots['pilots'][number] = vatsimData.pilots.find(
      (p: IPilots['pilots'][number]): boolean => p.callsign === callsign,
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
