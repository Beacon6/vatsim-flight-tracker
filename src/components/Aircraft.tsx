import { Marker, Tooltip } from 'react-leaflet';
import { icon } from 'leaflet';
import 'leaflet-rotatedmarker';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { VatsimDataInterface } from '../typings/VatsimDataInterface.ts';

const Aircraft: React.FC<{
  displayedAircraft?: VatsimDataInterface['pilots'];
  onClick: (client: VatsimDataInterface['pilots'][number]) => void;
  selectedClient?: VatsimDataInterface['pilots'][number];
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
          icon={item === selectedClient ? airplaneIconFocus : airplaneIcon}
          zIndexOffset={item === selectedClient ? 9000 : 0}
          position={[item.latitude, item.longitude]}
          key={item.cid}
          rotationAngle={item.heading}
          eventHandlers={{
            click: () => onClick(item),
          }}
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
};

export default Aircraft;
