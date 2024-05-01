import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { open } from 'node:fs/promises';
import cors from 'cors';
import axios from 'axios';
import { VatsimData, VatsimAirports } from '../src/typings/VatsimData';

const app = express();
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, { cors: { origin: '*' } });
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

let interval: NodeJS.Timeout | undefined;
let vatsimData: VatsimData;

const getVatsimData = async () => {
  try {
    const response = await axios.get(
      'https://data.vatsim.net/v3/vatsim-data.json',
    );
    io.emit('vatsimData', response.data);
    vatsimData = response.data;
  } catch (err) {
    console.error('Error: ', err.message);
  }
};

app.get('/vatsim_airports', async (_, res) => {
  try {
    const vatsimAirports: VatsimAirports = { airports: [] };
    const file = await open('./public/data/VATSpyAirports.dat');

    for await (const line of file.readLines()) {
      const airportDetails = line.split('|');
      const airportObject = {
        airport_name: airportDetails[0],
        icao: airportDetails[1],
        latitude: Number(airportDetails[2]),
        longitude: Number(airportDetails[3]),
      };

      vatsimAirports.airports.push(airportObject);
    }

    res.status(200).send(vatsimAirports);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

io.on('connection', async (socket) => {
  console.log('New client connected');
  console.log(`Clients connected: ${io.engine.clientsCount}`);

  if (vatsimData) {
    io.emit('vatsimData', vatsimData);
  }

  if (!interval) {
    console.log('Creating new fetch interval');
    interval = setInterval(getVatsimData, 15000);
    await getVatsimData();
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
