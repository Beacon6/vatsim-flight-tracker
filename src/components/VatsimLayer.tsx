import { LatLngBounds, LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import { VatsimDataInterface } from '../typings/VatsimDataInterface.ts';
import { AirportsInterface } from '../typings/AirportsInterface.ts';
import Aircraft from './Aircraft';
import Airports from './Airports.tsx';
import { shuffleArray } from '../helpers/shuffleArray';

const VatsimLayer: React.FC<{
  vatsimPilots?: VatsimDataInterface['pilots'];
  airportsData?: AirportsInterface;
  onClick: (client: string | number) => void;
  selectedClient?: string | number;
}> = (props) => {
  const { vatsimPilots, airportsData, onClick, selectedClient } = props;

  const map = useMap();

  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
  }

  const mapEventHandler = useMapEvent('moveend', () => {
    setViewportBounds(mapEventHandler.getBounds());
  });

  const [displayedAircraft, setDisplayedAircraft] =
    useState<VatsimDataInterface['pilots']>();

  useEffect(() => {
    if (!vatsimPilots || !viewportBounds) {
      return;
    }

    const aircraftOnScreen: VatsimDataInterface['pilots'] = [];

    for (let i = 0; i < vatsimPilots.length; i++) {
      const position: LatLngExpression = [
        vatsimPilots[i].latitude,
        vatsimPilots[i].longitude,
      ];

      if (viewportBounds.contains(position)) {
        aircraftOnScreen.push(vatsimPilots[i]);
      }
    }

    setDisplayedAircraft(shuffleArray(aircraftOnScreen).slice(0, 1000));
  }, [vatsimPilots, viewportBounds]);

  return (
    <>
      <Aircraft
        displayedAircraft={displayedAircraft}
        onClick={onClick}
        selectedClient={selectedClient}
      />
      <Airports
        selectedClient={selectedClient}
        airportsData={airportsData}
        vatsimData={vatsimPilots}
      />
    </>
  );
};

export default VatsimLayer;
