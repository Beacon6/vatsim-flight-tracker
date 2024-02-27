import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { Server } from 'socket.io';
import { VatsimData } from '../src/typings/VatsimData';

const app = express();
const webSocket = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const vatsimDataUrl = 'https://data.vatsim.net/v3/vatsim-data.json';

app.get('/vatsim_data', async (_, res) => {
  try {
    const response = await axios.get(vatsimDataUrl);
    res.json(response.data);
  } catch (err) {
    console.error('Encountered an error when fetching VATSIM data:', err);
  }
});

app.listen(process.env.PORT || 5000);

const webSocketServer = webSocket.listen(3000);
const io = new Server(webSocketServer, { cors: { origin: '*' } });
let interval: NodeJS.Timeout;
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
    }
  });
});

const PORT = process.env.PORT || 5000;
console.log(`Server listening on http://localhost:${PORT}`);
