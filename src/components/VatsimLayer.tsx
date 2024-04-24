import { LatLngBounds, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import { VatsimAirports, VatsimData } from "../typings/VatsimData";
import Aircraft from "./Aircraft";
import Airports from "./Airports";
import { shuffleArray } from "../helpers/shuffleArray";

const VatsimLayer: React.FC<{
  vatsimPilots?: VatsimData['pilots'];
  vatsimAirports?: VatsimAirports['airports'];
  onClick: (client: string | number) => void;
  selectedClient?: string | number;
}> = (props) => {
  const { vatsimPilots, vatsimAirports, onClick, selectedClient } = props;

  const map = useMap();

  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
  }

  const mapEventHandler = useMapEvent('moveend', () => {
    setViewportBounds(mapEventHandler.getBounds());
  });

  const [displayedAircraft, setDisplayedAircraft] =
    useState<VatsimData['pilots']>();
  const [displayedAirports, setDisplayedAirports] =
    useState<VatsimAirports['airports']>();

  useEffect(() => {
    if (!vatsimPilots || !vatsimAirports || !viewportBounds) {
      return;
    }

    const aircraftOnScreen: VatsimData['pilots'] = [];
    const airportsOnScreen: VatsimAirports['airports'] = [];

    for (let i = 0; i < vatsimPilots.length; i++) {
      const position: LatLngExpression = [
        vatsimPilots[i].latitude,
        vatsimPilots[i].longitude,
      ];

      if (viewportBounds.contains(position)) {
        aircraftOnScreen.push(vatsimPilots[i]);
      }
    }

    for (let i = 0; i < vatsimAirports.length; i++) {
      const position: LatLngExpression = [
        vatsimAirports[i].latitude,
        vatsimAirports[i].longitude,
      ];

      if (viewportBounds.contains(position)) {
        airportsOnScreen.push(vatsimAirports[i]);
      }
    }

    setDisplayedAircraft(shuffleArray(aircraftOnScreen).slice(0, 1000));
    setDisplayedAirports(shuffleArray(airportsOnScreen).slice(0, 50));
  }, [vatsimPilots, vatsimAirports, viewportBounds]);

  return (
    <>
      <Aircraft displayedAircraft={displayedAircraft} onClick={onClick} selectedClient={selectedClient} />
      <Airports displayedAirports={displayedAirports} />
    </>
  );
}

export default VatsimLayer;
