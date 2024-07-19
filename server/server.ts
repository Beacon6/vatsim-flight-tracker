import axios from 'axios';
import cors from 'cors';
import express from 'express';

import { createServer } from 'node:http';
import { open } from 'node:fs/promises';
import { Server } from 'socket.io';

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

  app.get('/airports', async (_, res) => {
    try {
      const airports = { airports: [] };
      const file = await open('./public/data/VATSpyAirports.dat');

      for await (const line of file.readLines()) {
        const airportDetails = line.split('|');
        const airportObject: any = {
          icao: airportDetails[0],
          airport_name: airportDetails[1],
          latitude: Number(airportDetails[2]),
          longitude: Number(airportDetails[3]),
        };

        airports.airports.push(airportObject);
      }

      res.status(200).send(airports);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
});

webSocketServer.listen(5000);
console.log(`Server listening on http://127.0.0.1:5000`);
