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
    useState<VatsimData['vatsim_data']['pilots']>();

  useEffect(() => {
    let displayedAircraft: VatsimData['vatsim_data']['pilots'] = [];

    for (let i = 0; i < vatsimData?.vatsim_data.pilots.length; i++) {
      const aircraftPosition = [
        vatsimData?.vatsim_data.pilots[i].latitude,
        vatsimData?.vatsim_data.pilots[i].longitude,
      ];

      if (viewportBounds?.contains(aircraftPosition)) {
        displayedAircraft = [
          ...displayedAircraft,
          vatsimData?.vatsim_data.pilots[i],
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
      {filteredAircraft?.map((item: VatsimData['vatsim_data']['pilots']) => (
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
