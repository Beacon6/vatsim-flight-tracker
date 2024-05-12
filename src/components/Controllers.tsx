import { useState } from 'react';
import { LatLngBounds } from 'leaflet';
import { useMap, useMapEvent } from 'react-leaflet';
import { VatsimDataInterface } from '../typings/VatsimDataInterface';

const Controllers: React.FC<{
  vatsimControllers?: VatsimDataInterface['controllers'];
}> = () => {
  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();
  const map = useMap();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
  }

  const mapEvent = useMapEvent('moveend', () => {
    const mapBounds = mapEvent.getBounds();

    setViewportBounds(mapBounds);
  });

  return <></>;
};

export default Controllers;
