import express from 'express';
import { createServer } from 'node:http';
import { open } from 'node:fs/promises';
import cors from 'cors';
import axios from 'axios';
import { Server } from 'socket.io';
import { VatsimData, VatsimAirports } from '../src/typings/VatsimData';

const app = express();
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, { cors: { origin: '*' } });
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const vatsimDataUrl = 'https://data.vatsim.net/v3/vatsim-data.json';

let interval: NodeJS.Timeout | undefined;
let vatsimData: VatsimData;

const getVatsimData = async () => {
  try {
    const response = await axios.get(vatsimDataUrl);
    io.emit('vatsimData', response.data);
    vatsimData = response.data;
  } catch (err) {
    console.error('Encountered an error when fetching VATSIM data:', err);
  }
};

const airportsDataUrl = './public/data/VATSpyAirports.dat';
const airportsData: VatsimAirports = { airports: [] };

const getAirportData = async () => {
  try {
    const file = await open(airportsDataUrl);
    for await (const line of file.readLines()) {
      const airportDetails = line.split('|');
      const airportData = {
        icao: airportDetails[0],
        airport_name: airportDetails[1],
        latitude: Number(airportDetails[2]),
        longitude: Number(airportDetails[3]),
      };
      airportsData.airports.push(airportData);
    }
  } catch (err) {
    console.error('Encountered an error when fetching airport data:', err);
  }
};

io.on('connection', async (socket) => {
  console.log('New client connected');
  console.log(`Clients connected: ${io.engine.clientsCount}`);

  if (vatsimData) {
    io.emit('vatsimData', vatsimData);
    io.emit('airportsData', airportsData);
  }

  console.log(interval);
  if (!interval) {
    console.log('Creating new fetch interval');
    interval = setInterval(getVatsimData, 15000);
    await getVatsimData();
    await getAirportData();
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    console.log(`Clients connected: ${io.engine.clientsCount}`);

    if (io.engine.clientsCount === 0) {
      console.log('Clearing fetch interval');
      clearInterval(interval);
      interval = undefined;
    }
  });
});

const PORT = process.env.PORT || 5000;
webSocketServer.listen(PORT);
console.log(`Server listening on http://127.0.0.1:${PORT}`);
