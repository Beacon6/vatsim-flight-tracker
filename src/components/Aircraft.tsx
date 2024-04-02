import { useEffect, useState } from 'react';
import { Marker, useMap, useMapEvent } from 'react-leaflet';
import { icon, LatLngBounds, LatLngExpression } from 'leaflet';
import 'leaflet-rotatedmarker';
import { VatsimData } from '../typings/VatsimData';

const Aircraft: React.FC<{
  vatsimPilots?: VatsimData['pilots'];
  onClick: (client: string | number) => void;
}> = (props) => {
  const { vatsimPilots, onClick } = props;

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

  useEffect(() => {
    if (!vatsimPilots || !viewportBounds) {
      return;
    }

    const aircraftOnScreen: VatsimData['pilots'] = [];

    for (let i = 0; i < vatsimPilots.length; i++) {
      const position: LatLngExpression = [
        vatsimPilots[i].latitude,
        vatsimPilots[i].longitude,
      ];

      if (viewportBounds.contains(position)) {
        aircraftOnScreen.push(vatsimPilots[i]);
      }
    }

    setDisplayedAircraft(aircraftOnScreen.slice(0, 1000));
  }, [vatsimPilots, viewportBounds]);

  const airplaneIcon = icon({
    iconUrl: '../assets/airplane.svg',
    iconSize: [24, 24],
  });

  return (
    <>
      {displayedAircraft?.map((item) => (
        <Marker
          icon={airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
          rotationAngle={item.heading}
          eventHandlers={{
            click: () => onClick(item.cid),
          }}
        ></Marker>
      ))}
    </>
  );
};

export default Aircraft;
