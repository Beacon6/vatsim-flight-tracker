import { useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import { icon } from 'leaflet';
import 'leaflet-rotatedmarker';
import Airports from './Airports';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { VatsimDataInterface } from '../typings/VatsimDataInterface.ts';
import { AirportsInterface } from '../typings/AirportsInterface.ts';

const Aircraft: React.FC<{
  displayedAircraft?: VatsimDataInterface['pilots'];
  airportsData?: AirportsInterface['airports'];
  onClick: (client: string | number) => void;
  selectedClient?: string | number;
}> = (props) => {
  const { displayedAircraft, onClick, selectedClient, airportsData } = props;

  const [showAirports, setShowAirports] = useState(false);

  const switchActive = () => {
    setShowAirports(!showAirports);
  };

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
            click: () => {
              onClick(item.cid), switchActive();
            },
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
      <Airports
        isActive={showAirports}
        departure={airportsData![0]}
        arrival={airportsData![1]}
      />
    </>
  );
};

export default Aircraft;
