import { useEffect, useState } from 'react';
import { Marker, Tooltip, useMap, useMapEvent } from 'react-leaflet';
import { icon, LatLngBounds, LatLngExpression } from 'leaflet';
import 'leaflet-rotatedmarker';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { VatsimData } from '../typings/VatsimData';

const Aircraft: React.FC<{
  vatsimPilots?: VatsimData['pilots'];
  onClick: (client: string | number) => void;
  selectedClient?: string | number;
}> = (props) => {
  const { vatsimPilots, onClick, selectedClient } = props;

  const map = useMap();

  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();

  if (!viewportBounds) {
    setViewportBounds(map.getBounds());
  }

  const mapEventHandler = useMapEvent('moveend', () => {
    setViewportBounds(mapEventHandler.getBounds());
  });

  const [displayedAircraft, setDisplayedAircraft] =
    useState<VatsimData['pilots']>();

  useEffect(() => {
    if (!vatsimPilots || !viewportBounds) {
      return;
    }

    const aircraftOnScreen: VatsimData['pilots'] = [];

    for (let i = 0; i < vatsimPilots.length; i++) {
      const position: LatLngExpression = [
        vatsimPilots[i].latitude,
        vatsimPilots[i].longitude,
      ];

      if (viewportBounds.contains(position)) {
        aircraftOnScreen.push(vatsimPilots[i]);
      }
    }

    setDisplayedAircraft(aircraftOnScreen.slice(0, 1000));
  }, [vatsimPilots, viewportBounds]);

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
          icon={
            item.cid === Number(selectedClient)
              ? airplaneIconFocus
              : item.callsign === String(selectedClient)
                ? airplaneIconFocus
                : airplaneIcon
          }
          zIndexOffset={
            item.cid === Number(selectedClient)
              ? 9000
              : item.callsign === String(selectedClient)
                ? 9000
                : 0
          }
          position={[item.latitude, item.longitude]}
          key={item.cid}
          rotationAngle={item.heading}
          eventHandlers={{
            click: () => onClick(item.cid),
          }}
        >
          <Tooltip
            className='label'
            direction='right'
            sticky={true}
            opacity={1}
          >
            <Container>
              <Row>
                <Col className='label-info'>
                  {item.callsign} (
                  {item.flight_plan?.aircraft_short
                    ? item.flight_plan.aircraft_short
                    : 'N/A'}
                  )
                </Col>
              </Row>
            </Container>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
};

export default Aircraft;
