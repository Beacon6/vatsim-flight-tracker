import { useState } from 'react';
import { VatsimData } from '../typings/VatsimDataInterface';
import { LatLngBounds } from 'leaflet';
import { useMap, useMapEvent } from 'react-leaflet';

const Controllers: React.FC<{ vatsimData?: VatsimData }> = () => {
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
