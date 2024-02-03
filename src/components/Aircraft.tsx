import { Marker } from 'react-leaflet';
import { VatsimData } from '../App';
import { LatLngBounds, LatLngExpression, icon } from 'leaflet';
import { useMapEvent, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet-rotatedmarker';

const Aircraft: React.FC<{ vatsimData?: VatsimData; onClick: () => void }> = (
  props
) => {
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
    useState<VatsimData['vatsim_data']['pilots']>();

  useEffect(() => {
    if (vatsimData?.request_successful) {
      const displayedAircraft = [];

      for (let i = 0; i < vatsimData?.vatsim_data.pilots.length; i++) {
        const aircraftPosition = [
          vatsimData?.vatsim_data.pilots[i].latitude,
          vatsimData?.vatsim_data.pilots[i].longitude,
        ];

        if (viewportBounds?.contains(aircraftPosition as LatLngExpression)) {
          displayedAircraft.push(vatsimData?.vatsim_data.pilots[i]);
        }

        // Find better performance solution than slicing
        setFilteredAircraft(displayedAircraft.slice(0, 250));
      }
    }
  }, [viewportBounds, vatsimData]);

  const airplaneIcon = icon({
    iconUrl: '../public/assets/airplane.png',
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
            click: () => onClick(),
          }}
        ></Marker>
      ))}
    </>
  );
};

export default Aircraft;
