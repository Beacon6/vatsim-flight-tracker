import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { icon, LatLngExpression } from 'leaflet';
import 'leaflet-rotatedmarker';

import useViewportBounds from '../hooks/useViewportBounds.ts';

import { IPilotsSubset, IPilotDetails } from '../../types/IPilots.ts';

interface Props {
  onlinePilots?: IPilotsSubset['pilots'];
  selectFlight: (target: IPilotsSubset['pilots'][number]) => void;
  selectedFlight?: IPilotDetails['pilot'];
}

function Aircraft(props: Props) {
  const { onlinePilots, selectFlight, selectedFlight } = props;

  const map = useMap();
  const viewportBounds = useViewportBounds(map);

  const [displayedAircraft, setDisplayedAircraft] = useState<IPilotsSubset['pilots']>();

  useEffect(() => {
    if (!onlinePilots || !viewportBounds) {
      return;
    }
    const aircraftOnScreen: IPilotsSubset['pilots'] = [];

    for (const p of onlinePilots) {
      const position: LatLngExpression = [p.latitude, p.longitude];

      if (viewportBounds.contains(position)) {
        aircraftOnScreen.push(p);
      }
    }

    setDisplayedAircraft(aircraftOnScreen.slice(0, 1000));
  }, [onlinePilots, viewportBounds]);

  const airplaneIcon = icon({
    iconUrl: '../assets/airplane.svg',
    iconSize: [24, 24],
  });

  const airplaneIconFocus = icon({
    iconUrl: '../assets/airplane-focus.svg',
    iconSize: [24, 24],
  });

  return (
    <>
      {displayedAircraft?.map((item) => (
        <Marker
          icon={item.callsign === selectedFlight?.callsign ? airplaneIconFocus : airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.callsign}
          rotationAngle={item.heading}
          eventHandlers={{ click: () => selectFlight(item) }}
        >
          <Tooltip className='label' direction='right' sticky={true} opacity={1}>
            <Container>
              <Row>
                <Col className='label-info'>{item.callsign}</Col>
              </Row>
            </Container>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}

export default Aircraft;
