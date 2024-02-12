import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

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
    console.log(`Request status: ${atcCount}`);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}/vatsim_data`)
);
