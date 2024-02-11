import { Offcanvas, Accordion, Container, Row, Col } from 'react-bootstrap';
import { VatsimPilot } from '../App';

const Panel: React.FC<{
  show: boolean;
  onHide: () => void;
  selectedClient?: VatsimPilot['vatsimPilot'];
}> = (props) => {
  const { show, onHide, selectedClient } = props;

  return (
    <>
      <Offcanvas show={show} onHide={onHide} backdrop={true}>
        <Offcanvas.Header closeButton={false}>
          <Offcanvas.Title as={'h5'}>
            {selectedClient?.callsign} (
            {selectedClient?.flight_plan?.aircraft_short
              ? selectedClient?.flight_plan.aircraft_short
              : 'Unknown'}
            )
          </Offcanvas.Title>
          <Offcanvas.Title as={'h6'}>
            CID: {selectedClient?.cid}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
            <Row>
              <Col>Departure</Col>
              <Col></Col>
              <Col>Arrival</Col>
            </Row>
            <Row>
              <Col>
                <img
                  src='../assets/departure-light.svg'
                  height={48}
                  width={48}
                />
              </Col>
              <Col></Col>
              <Col>
                <img src='../assets/arrival-light.svg' height={48} width={48} />
              </Col>
            </Row>
            <Row>
              <Col>
                {selectedClient?.flight_plan?.departure
                  ? selectedClient?.flight_plan?.departure
                  : 'Not specified'}
              </Col>
              <Col></Col>
              <Col>
                {selectedClient?.flight_plan?.arrival
                  ? selectedClient?.flight_plan?.arrival
                  : 'Not specified'}
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col>Altitude (MSL): {selectedClient?.altitude} feet</Col>
              <Col>Speed (GS): {selectedClient?.groundspeed} knots</Col>
            </Row>
            <Row>
              <Col>Latitude: {selectedClient?.latitude}</Col>
              <Col>Longitude: {selectedClient?.longitude}</Col>
            </Row>
            <Row>
              <Col>
                Flight rules:{' '}
                {selectedClient?.flight_plan?.flight_rules === 'I'
                  ? 'IFR'
                  : 'VFR'}
              </Col>
              <Col>Squawk: {selectedClient?.transponder}</Col>
            </Row>
          </Container>
          <Accordion>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>Filed flight plan route</Accordion.Header>
              <Accordion.Body>
                {selectedClient?.flight_plan?.route
                  ? selectedClient?.flight_plan?.route
                  : 'No flight plan filed'}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Remarks</Accordion.Header>
              <Accordion.Body>
                {selectedClient?.flight_plan?.remarks
                  ? selectedClient?.flight_plan?.remarks
                  : 'No remarks'}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Panel;
