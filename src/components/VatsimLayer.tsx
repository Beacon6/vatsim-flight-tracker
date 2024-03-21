import { useEffect, useState } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import Aircraft from './Aircraft';
import Panel from './Panel';
import { LatLngBounds, LatLngExpression } from 'leaflet';
import { VatsimData, VatsimPilot } from '../typings/VatsimData';

const VatsimLayer: React.FC<{
  vatsimData?: VatsimData;
  searchValue?: string;
}> = (props) => {
  const { vatsimData, searchValue } = props;
  const map = useMap();

  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
  }

  const mapEventHandler = useMapEvent('moveend', () => {
    setViewportBounds(mapEventHandler.getBounds());
  });

  const [visibleObjects, setVisibleObjects] = useState<VatsimData['pilots']>();

  useEffect(() => {
    if (!vatsimData || !viewportBounds) {
      return;
    }

    const visibleAircraft: VatsimData['pilots'] = [];

    for (let i = 0; i < vatsimData.pilots.length; i++) {
      const position: LatLngExpression = [
        vatsimData.pilots[i].latitude,
        vatsimData.pilots[i].longitude,
      ];

      if (viewportBounds.contains(position)) {
        visibleAircraft.push(vatsimData.pilots[i]);
      }
    }

    setVisibleObjects(visibleAircraft.slice(0, 1000));
  }, [vatsimData, viewportBounds]);

  // Displaying selected Client info
  const [clientInfo, setClientInfo] = useState<VatsimPilot['vatsimPilot']>();
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!searchValue) {
      return;
    }
    console.log(searchValue);

    if (vatsimData?.pilots.some((client) => client.callsign === searchValue)) {
      console.log('found matching callsign');
    } else if (
      vatsimData?.pilots.some((client) => client.cid === Number(searchValue))
    ) {
      console.log('found matching cid');
    } else {
      console.log('no match');
      return;
    }
  }, [searchValue, vatsimData]);

  const handleShow = (selected: VatsimPilot['vatsimPilot']) => {
    setClientInfo(selected);
    setShowPanel(true);
  };

  const handleClose = () => {
    setShowPanel(false);
  };

  return (
    <>
      <Aircraft visibleAircraft={visibleObjects} onClick={handleShow} />
      <Panel
        show={showPanel}
        selectedClient={clientInfo}
        onHide={handleClose}
      />
    </>
  );
};

export default VatsimLayer;
