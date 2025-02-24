import { IPilots, IPilotsSubset } from './IPilots';
import { IControllers, IControllersSubset } from './IControllers';

export interface IVatsimData extends IPilots, IControllers {
  general: {
    version: number;
    reload: number;
    update: string;
    update_timestamp: string;
    connected_clients: number;
    unique_clients: number;
  };
}

export interface IVatsimDataSubset extends IPilotsSubset, IControllersSubset {
  general: {
    update_timestamp: string;
  };
}
