import { Marker } from 'react-leaflet';
import { VatsimData } from '../App';
import { LatLngBounds, icon } from 'leaflet';
import { useMapEvent } from 'react-leaflet';
import { useEffect, useState } from 'react';

const Aircraft: React.FC<{ vatsimData?: VatsimData }> = (props) => {
  const { vatsimData } = props;
  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();

  const map = useMapEvent('moveend', () => {
    const mapBounds = map.getBounds();

    setViewportBounds(mapBounds);
  });

  const [filteredAircraft, setFilteredAircraft] =
    useState<VatsimData['aircraft_data']['pilots']>();

  useEffect(() => {
    let displayedAircraft: VatsimData['aircraft_data']['pilots'] = [];

    for (let i = 0; i < vatsimData?.aircraft_data.pilots.length; i++) {
      const aircraftPosition = [
        vatsimData?.aircraft_data.pilots[i].latitude,
        vatsimData?.aircraft_data.pilots[i].longitude,
      ];

      if (viewportBounds?.contains(aircraftPosition)) {
        displayedAircraft = [
          ...displayedAircraft,
          vatsimData?.aircraft_data.pilots[i],
        ];
      }

      setFilteredAircraft(displayedAircraft);
    }
  }, [viewportBounds, vatsimData]);

  const airplaneIcon = icon({
    iconUrl: '../public/assets/airplane.png',
    iconSize: [24, 24],
  });

  return (
    <>
      {filteredAircraft?.map((item: VatsimData['aircraft_data']['pilots']) => (
        <Marker
          icon={airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
        ></Marker>
      ))}
    </>
  );
};

export default Aircraft;
