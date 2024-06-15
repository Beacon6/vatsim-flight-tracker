import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { open } from 'node:fs/promises';
import cors from 'cors';
import axios from 'axios';
import { VatsimDataInterface } from '../src/typings/VatsimDataInterface';
import { VatsimAirportsInterface } from '../src/typings/VatsimAirportsInterface';

const app = express();
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, { cors: { origin: '*' } });
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

let interval: NodeJS.Timeout | undefined;
let vatsimData: VatsimDataInterface;

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
    const airports: VatsimAirportsInterface = { airports: [] };
    const file = await open('./public/data/VATSpyAirports.dat');

    for await (const line of file.readLines()) {
      const airportDetails = line.split('|');
      const airportObject = {
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

webSocketServer.listen(5000);
console.log(`Server listening on http://localhost:5000`);
