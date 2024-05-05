import { Marker, Tooltip } from 'react-leaflet';
import { icon } from 'leaflet';
import 'leaflet-rotatedmarker';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { VatsimDataInterface } from '../typings/VatsimDataInterface.ts';

const Aircraft: React.FC<{
  displayedAircraft?: VatsimDataInterface['pilots'];
  onClick: (client: string | number) => void;
  selectedClient?: string | number;
}> = (props) => {
  const { displayedAircraft, onClick, selectedClient } = props;

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
