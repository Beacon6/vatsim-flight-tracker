import { useEffect, useState } from 'react';
import { VatsimData, VatsimPilot } from '../typings/VatsimData';
import { LatLngBounds, LatLngExpression, icon } from 'leaflet';
import { Marker, useMapEvent, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';

const Aircraft: React.FC<{
  vatsimData?: VatsimData;
  onClick: (selected: VatsimPilot['vatsimPilot']) => void;
}> = (props) => {
  const { vatsimData, onClick } = props;
  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();
  const map = useMap();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
  }

  const mapEvent = useMapEvent('moveend', () => {
    const mapBounds = mapEvent.getBounds();

    setViewportBounds(mapBounds);
  });

  const [filteredAircraft, setFilteredAircraft] =
    useState<VatsimData['pilots']>();

  useEffect(() => {
    if (vatsimData) {
      const displayedAircraft = [];

      for (let i = 0; i < vatsimData?.pilots.length; i++) {
        const aircraftPosition = [
          vatsimData?.pilots[i].latitude,
          vatsimData?.pilots[i].longitude,
        ];

        if (viewportBounds?.contains(aircraftPosition as LatLngExpression)) {
          displayedAircraft.push(vatsimData?.pilots[i]);
        }

        // Find better performance solution than slicing
        setFilteredAircraft(displayedAircraft.slice(0, 1000));
      }
    }
  }, [viewportBounds, vatsimData]);

  const airplaneIcon = icon({
    iconUrl: '../assets/airplane-dark.svg',
    iconSize: [24, 24],
  });

  return (
    <>
      {filteredAircraft?.map((item) => (
        <Marker
          icon={airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
          rotationAngle={item.heading}
          eventHandlers={{
            click: () => onClick(item),
          }}
        ></Marker>
      ))}
    </>
  );
};

export default Aircraft;
