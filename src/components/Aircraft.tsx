import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { icon, LatLngExpression } from 'leaflet';
import 'leaflet-rotatedmarker';

import useViewportBounds from '../hooks/useViewportBounds.ts';

import { PilotsInterface } from '../../types/PilotsInterface.ts';

interface Props {
  vatsimPilots?: PilotsInterface['pilots'];
  selectFlight: (flight: PilotsInterface['pilots'][number]) => void;
}

function Aircraft(props: Props) {
  const { vatsimPilots, selectFlight } = props;

  const map = useMap();
  const viewportBounds = useViewportBounds(map);

  const [displayedAircraft, setDisplayedAircraft] = useState<PilotsInterface['pilots']>();

  useEffect(() => {
    if (!vatsimPilots || !viewportBounds) {
      return;
    }
    const aircraftOnScreen: PilotsInterface['pilots'] = [];

    for (const p of vatsimPilots) {
      const position: LatLngExpression = [p.latitude, p.longitude];

      if (viewportBounds.contains(position)) {
        aircraftOnScreen.push(p);
      }
    }

    setDisplayedAircraft(aircraftOnScreen.slice(0, 1000));
  }, [vatsimPilots, viewportBounds]);

  const airplaneIcon = icon({
    iconUrl: '../assets/airplane.svg',
    iconSize: [24, 24],
  });

  return (
    <>
      {displayedAircraft?.map((item) => (
        <Marker
          icon={airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
          rotationAngle={item.heading}
          eventHandlers={{ click: () => selectFlight(item) }}
        >
          <Tooltip className='label' direction='right' sticky={true} opacity={1}>
            <Container>
              <Row>
                <Col className='label-info'>
                  {item.callsign} ({item.flight_plan?.aircraft_short ? item.flight_plan.aircraft_short : 'N/A'})
                </Col>
              </Row>
            </Container>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}

export default Aircraft;
