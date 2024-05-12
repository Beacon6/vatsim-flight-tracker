import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { VatsimDataInterface } from '../typings/VatsimDataInterface';

const Panel: React.FC<{
  panelActive: boolean;
  onHide: () => void;
  selectedClient?: VatsimDataInterface['pilots'][number];
}> = (props) => {
  const { panelActive, onHide, selectedClient } = props;

  const [skyVectorUrl, setSkyVectorUrl] = useState<string>();

  useEffect(() => {
    if (
      !selectedClient?.flight_plan ||
      selectedClient.flight_plan.flight_rules === 'V'
    ) {
      setSkyVectorUrl(undefined);
      return;
    }

    const clientDeparture = selectedClient.flight_plan.departure;
    const clientArrival = selectedClient.flight_plan.arrival;
    const clientRoute = selectedClient.flight_plan.route;

    const encodedFlightPlan = encodeURIComponent(
      clientDeparture + ' ' + clientRoute + ' ' + clientArrival,
    );
    setSkyVectorUrl(
      `https://skyvector.com/?chart=304&fpl=${encodedFlightPlan}`,
    );
  }, [selectedClient]);

  return (
    <>
      <Offcanvas
        className='panel'
        show={panelActive && selectedClient}
        onHide={onHide}
        backdrop={false}
      >
        <Offcanvas.Header className='panel-header' closeButton={false}>
          <Container>
            <Row>
              <Col className='panel-title'>
                <Offcanvas.Title className='panel-title'>
                  {selectedClient?.callsign} (
                  {selectedClient?.flight_plan?.aircraft_short
                    ? selectedClient?.flight_plan.aircraft_short
                    : 'N/A'}
                  )
                </Offcanvas.Title>
              </Col>
              <Col className='panel-controls'>
                <Button
                  variant='outline-primary'
                  style={{ height: 44, width: 44 }}
                >
                  <a
                    href={skyVectorUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: 'inherit' }}
                  >
                    <i
                      className='bi bi-map'
                      style={{ fontSize: '1.25 rem' }}
                    ></i>
                  </a>
                </Button>
                <Button
                  variant='outline-primary'
                  onClick={onHide}
                  style={{ height: 44, width: 44 }}
                >
                  <i
                    className='bi bi-x-circle'
                    style={{ fontSize: '1.25rem' }}
                  ></i>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className='panel-subtitle'>
                <Offcanvas.Title className={'panel-subtitle'}>
                  CID: {selectedClient?.cid}
                </Offcanvas.Title>
              </Col>
            </Row>
          </Container>
        </Offcanvas.Header>
        <Offcanvas.Body className='panel-body'>
          <Container>
            <Row>
              <Col className='panel-info'>Departure</Col>
              <Col className='panel-info'>Arrival</Col>
            </Row>
            <Row>
              <Col className='panel-info'>
                <img src='../assets/departure.svg' height={48} width={48} />
              </Col>
              <Col className='panel-info'>
                <img src='../assets/arrival.svg' height={48} width={48} />
              </Col>
            </Row>
            <Row>
              <Col className='panel-info'>
                {selectedClient?.flight_plan?.departure
                  ? selectedClient?.flight_plan?.departure
                  : 'Not specified'}
              </Col>
              <Col className='panel-info'>
                {selectedClient?.flight_plan?.arrival
                  ? selectedClient?.flight_plan?.arrival
                  : 'Not specified'}
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col className='panel-info'>
                Altitude (MSL): {selectedClient?.altitude} feet
              </Col>
              <Col className='panel-info'>
                Speed (GS): {selectedClient?.groundspeed} knots
              </Col>
            </Row>
            <Row>
              <Col className='panel-info'>
                Latitude: {selectedClient?.latitude}
              </Col>
              <Col className='panel-info'>
                Longitude: {selectedClient?.longitude}
              </Col>
            </Row>
            <Row>
              <Col className='panel-info'>
                Flight rules:{' '}
                {selectedClient?.flight_plan?.flight_rules === 'I'
                  ? 'IFR'
                  : 'VFR'}
              </Col>
              <Col className='panel-info'>
                Squawk: {selectedClient?.transponder}
              </Col>
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
