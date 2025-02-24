import { WebSocket } from 'ws';
import { IVatsimData } from '../types/IVatsimData';
import logger from './utils/logger';

export default class VatsimDataSource {
  // @ts-ignore
  static #apiURL = 'https://data.vatsim.net/v3/vatsim-data.json';

  // @ts-ignore
  async #getData(): Promise<IVatsimData | undefined> {
    try {
      logger.info('calling the VATSIM API');
      const response: Response = await fetch(VatsimDataSource.#apiURL);

      return await response.json();
    } catch (err: any) {
      logger.error(`caught in #getData: ${err.message}`);
    }
  }

  // @ts-ignore
  async #transformData(): Promise<IVatsimData | undefined> {
    const data: any = await this.#getData();

    if (!data) {
      return undefined;
    }

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
  }

  async sendData(socket: WebSocket, data: IVatsimData): Promise<void> {
    try {
      logger.info('sending VATSIM data');
      socket.send(JSON.stringify(data));
    } catch (err: any) {
      logger.error(`caught in sendData: ${err.message}`);
    }
  }

  async refreshData(socket: WebSocket): Promise<IVatsimData | undefined> {
    try {
      logger.info('fetching and sending VATSIM data');
      const data = await this.#transformData();
      socket.send(JSON.stringify(data));

      return data;
    } catch (err: any) {
      logger.error(`caught in refreshData: ${err.message}`);
    }
  }
}
