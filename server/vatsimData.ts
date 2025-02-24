import { IVatsimData } from '../types/IVatsimData';
import logger from './utils/logger';

export async function fetchVatsimData(): Promise<IVatsimData | undefined> {
  try {
    const response: Response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
    const data: any = await response.json();

    for (const p of data.pilots) {
      ['cid', 'name', 'server'].forEach((e) => delete p[e]);
    }
    for (const c of data.controllers) {
      ['cid', 'name', 'server'].forEach((e) => delete c[e]);
    }

    return {
      general: data['general'],
      pilots: data['pilots'],
      controllers: data['controllers'],
    };
  } catch (err: any) {
    logger.error(err.message);
  }
}
