import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());
const server = app.listen(process.env.PORT || 5000);
const io = new Server(server, { cors: { origin: '*' } });

const vatsimDataUrl = 'https://data.vatsim.net/v3/vatsim-data.json';

const getVatsimData = async () => {
  try {
    const response = await axios.get(vatsimDataUrl);
    io.emit('vatsimData', response.data);
  } catch (err) {
    console.error('Encountered an error when fetching VATSIM data:', err);
  }
};

io.on('connection', (socket) => {
  console.log('New client connected');
  getVatsimData();
  const interval = setInterval(getVatsimData, 15000);
  console.log(`Clients connected: ${io.engine.clientsCount}`);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
    console.log(`Clients connected: ${io.engine.clientsCount}`);
  });
});

const PORT = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${PORT}`);
