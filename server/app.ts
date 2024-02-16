import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import * as fs from 'node:fs';

const app = express();
app.use(cors());
app.use(express.json());

const vatsimDataUrl = 'https://data.vatsim.net/v3/vatsim-data.json';

app.get('/vatsim_data', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(vatsimDataUrl);
    const responseData = response.data;

    let vatsimData = { general: {}, pilots: [{}], controllers: [{}] };
    let pilotsCount = 0;
    let atcCount = 0;
    let requestStatus = true;

    if (responseData) {
      vatsimData = {
        general: responseData.general,
        pilots: responseData.pilots,
        controllers: responseData.controllers,
      };
      pilotsCount = vatsimData.pilots.length;
      atcCount = vatsimData.controllers.length;
    } else {
      console.log('Something went wrong');
      requestStatus = false;
    }

    console.log(`Request status: ${requestStatus}`);
    console.log(`Pilots online: ${pilotsCount}`);
    console.log(`ATC online: ${atcCount}`);

    res.json({
      requestSuccessful: requestStatus,
      vatsimData: vatsimData,
      pilotsCount: pilotsCount,
      atcCount: atcCount,
    });
  } catch (error) {
    console.error('Something went wrong', error);
    res.status(500).json({
      requestSuccessful: false,
      vatsimData: {},
      pilotsCount: 0,
      atcCount: 0,
    });
  }
});

app.get('/fir_boundaries', async (req: Request, res: Response) => {
  try {
    fs.readFile('fir_boundaries.json', 'utf-8', (err, data) => {
      if (err) {
        console.log('Something went wrong when reading the file');
        res.status(500).json({ fir_boundaries: {} });
        return;
      }

      const jsonData = JSON.parse(data);
      res.json({ fir_boundaries: { jsonData } });
    });
  } catch (error) {
    console.log('Something went wrong', error);
    res.status(500).json({ fir_boundaries: {} });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}/`)
);
