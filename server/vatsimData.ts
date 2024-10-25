import { IVatsimData } from "../types/IVatsimData.ts";
import { IPilotsSubset } from "../types/IPilots.ts";

export async function fetchVatsimData(): Promise<IVatsimData> {
  const response: Response = await fetch("https://data.vatsim.net/v3/vatsim-data.json");
  const data: any = await response.json();

  if (response.ok) {
    return {
      general: data["general"],
      pilots: data["pilots"],
      controllers: data["controllers"],
      atis: data["atis"],
      facilities: data["facilities"],
    };
  } else {
    throw new Error(`Bad response when fetching Vatsim data: ${response.status}`);
  }
}

export async function sendVatsimDataSubset(handler: any): Promise<void> {
  try {
    const vatsimData: IVatsimData = await fetchVatsimData();
    const vatsimDataSubset: IPilotsSubset = { pilots: [] };

    for (const pilot of vatsimData.pilots) {
      vatsimDataSubset.pilots.push({ callsign: pilot.callsign, heading: pilot.heading });
    }

    handler.emit("vatsimData", vatsimData);
  } catch (err: any) {
    console.error(err.message);
  }
}
