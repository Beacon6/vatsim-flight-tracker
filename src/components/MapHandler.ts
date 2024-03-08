import { useState } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

const MapHandler: React.FC<{
  passData: (bounds?: LatLngBounds) => void
}> = (props) => {
  const { passData } = props;
  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();
  const map = useMap();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
    console.log('Set initial bounds');
  }

  const mapMove = useMapEvent('moveend', () => {
    const mapBound = mapMove.getBounds();
    setViewportBounds(mapBound);
    console.log('Set bounds');
  })

  passData(viewportBounds);

  return null;
}

export default MapHandler;
