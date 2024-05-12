import { LatLngBounds, LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import Aircraft from './Aircraft';
import { shuffleArray } from '../helpers/shuffleArray';
import { VatsimDataInterface } from '../typings/VatsimDataInterface.ts';
import { VatsimAirportsInterface } from '../typings/VatsimAirportsInterface.ts';

const VatsimLayer: React.FC<{
  vatsimPilots?: VatsimDataInterface['pilots'];
  vatsimAirports?: VatsimAirportsInterface['airports'];
  onClick: (client: VatsimDataInterface['pilots'][number]) => void;
  selectedClient: VatsimDataInterface['pilots'][number] | undefined;
}> = (props) => {
  const { vatsimPilots, onClick, selectedClient } = props;

  const map = useMap();

  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
  }

  const mapEventHandler = useMapEvent('moveend', () => {
    setViewportBounds(mapEventHandler.getBounds());
  });

  useEffect(() => {
    const clientLat = selectedClient?.latitude;
    const clientLon = selectedClient?.longitude;

    if (!clientLat || !clientLon) {
      return;
    } else {
      map.flyTo([clientLat, clientLon]);
    }
  }, [selectedClient, map]);

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
    </>
  );
};

export default VatsimLayer;
