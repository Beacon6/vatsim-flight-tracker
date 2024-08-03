import axios from 'axios';
import cors from 'cors';
import express from 'express';

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { open } from 'node:fs/promises';
import { Server } from 'socket.io';

import { AirportsInterface } from '../types/AirportsInterface.ts';
import { PilotsInterface } from '../types/PilotsInterface.ts';
import { ControllersInterface } from '../types/ControllersInterface.ts';

const app = express();
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

let interval: NodeJS.Timeout | undefined;
let vatsimData: (PilotsInterface & ControllersInterface) | undefined;

function checkFiles() {
  if (!existsSync('dist')) {
    throw Error('build files not found');
  }
  if (!existsSync('public/data/airports.txt')) {
    throw Error('airports.txt file not found');
  }
}
checkFiles();

async function readAirports(): Promise<AirportsInterface> {
  const airports: AirportsInterface = { airports: [] };

  const file = await open('./public/data/airports.txt');
  for await (const line of file.readLines()) {
    const a = line.split('|');
    const airport: AirportsInterface['airports'][number] = {
      icao: a[0],
      airport_name: a[1],
      lat: Number(a[2]),
      lng: Number(a[3]),
      iata: a[4],
      fir: a[5],
      is_pseudo: Boolean(Number(a[6])),
    };

    airports.airports.push(airport);
  }

  return airports;
}

async function sendAirports() {
  try {
    const airports = await readAirports();
    if (airports) {
      io.emit('airportsData', airports);
    }
  } catch (err) {
    console.error(err);
  }
}

async function getVatsimData() {
  const response = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');

  if (response.status === 200) {
    vatsimData = response.data;
    return vatsimData;
  } else {
    throw Error('Bad response when fetching Vatsim data');
  }
}

async function sendVatsimData() {
  try {
    const vatsimData = await getVatsimData();
    if (vatsimData) {
      io.emit('vatsimData', vatsimData);
    }
  } catch (err) {
    console.error(err);
  }
}

io.on('connection', async (socket) => {
  console.log('New client connected');
  console.log(`Clients connected: ${io.engine.clientsCount}`);

  try {
    sendAirports();
    if (vatsimData) {
      io.emit('vatsimData', vatsimData);
    }

    if (!interval) {
      console.log('Creating new fetch interval');
      interval = setInterval(sendVatsimData, 15000);
      await sendVatsimData();
    }
  } catch (err) {
    console.error(err);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    console.log(`Clients connected: ${io.engine.clientsCount}`);

    if (io.engine.clientsCount === 0) {
      console.log('Clearing fetch interval');
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
