import { Marker } from 'react-leaflet';
import { VatsimData } from '../App';
import { icon } from 'leaflet';
import { useMapEvent } from 'react-leaflet';
import { useState } from 'react';

interface ViewportBounds {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
}

const Aircrafts: React.FC<{ vatsimData?: VatsimData }> = (props) => {
  const { vatsimData } = props;
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds>();

  const map = useMapEvent('moveend', () => {
    const mapBounds = map.getBounds();
    setViewportBounds({
      northEast: mapBounds.getNorthEast(),
      southWest: mapBounds.getSouthWest(),
    });
    console.log(viewportBounds);
  });

  const airplaneIcon = icon({
    iconUrl: '../public/assets/airplane.png',
    iconSize: [24, 24],
  });

  return (
    <>
      {vatsimData?.aircraft_data.pilots.map((item: any) => (
        <Marker
          icon={airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
        ></Marker>
      ))}
    </>
  );
};

export default Aircrafts;
