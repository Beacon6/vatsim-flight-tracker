import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { VatsimDataInterface } from '../typings/VatsimDataInterface';
import { VatsimPilotInterface } from '../typings/VatsimDataInterface';

const Panel: React.FC<{
  panelActive: boolean;
  onHide: () => void;
  selectedClient?: string | number;
  vatsimData?: VatsimDataInterface;
}> = (props) => {
  const { panelActive, onHide, selectedClient, vatsimData } = props;

  const map = useMap();

  const [clientDetails, setClientDetails] =
    useState<VatsimPilotInterface['vatsimPilot']>();

  useEffect(() => {
    if (!selectedClient || !vatsimData) {
      return;
    }

    const containsCID = vatsimData?.pilots.some((client) => {
      return client.cid === Number(selectedClient);
    });
    const containsCallsign = vatsimData?.pilots.some((client) => {
      return client.callsign === String(selectedClient);
    });

    if (containsCID) {
      const filteredClient = vatsimData?.pilots.find((client) => {
        return client.cid === Number(selectedClient);
      });
      setClientDetails(filteredClient);
    } else if (containsCallsign) {
      const filteredClient = vatsimData?.pilots.find((client) => {
        return client.callsign === String(selectedClient);
      });
      setClientDetails(filteredClient);
    } else {
      setClientDetails(undefined);
    }
  }, [selectedClient, vatsimData]);

  const locateClient = () => {
    const clientLat = clientDetails?.latitude;
    const clientLon = clientDetails?.longitude;

    if (!clientLat || !clientLon) {
      return;
    } else {
      map.flyTo([clientLat, clientLon]);
    }
  };

  const [skyVectorUrl, setSkyVectorUrl] = useState<string | undefined>();

  useEffect(() => {
    if (
      !clientDetails?.flight_plan ||
      clientDetails.flight_plan.flight_rules === 'V'
    ) {
      setSkyVectorUrl(undefined);
      return;
    }

    const clientDeparture = clientDetails.flight_plan.departure;
    const clientArrival = clientDetails.flight_plan.arrival;
    const clientRoute = clientDetails.flight_plan.route;

    const encodedFlightPlan = encodeURIComponent(
      clientDeparture + ' ' + clientRoute + ' ' + clientArrival,
    );
    setSkyVectorUrl(
      `https://skyvector.com/?chart=304&fpl=${encodedFlightPlan}`,
    );
  }, [clientDetails]);

  return (
    <>
      <Offcanvas
        className='panel'
        show={panelActive && clientDetails}
        onHide={onHide}
        backdrop={false}
      >
        <Offcanvas.Header className='panel-header' closeButton={false}>
          <Container>
            <Row>
              <Col className='panel-title'>
                <Offcanvas.Title className='panel-title'>
                  {clientDetails?.callsign} (
                  {clientDetails?.flight_plan?.aircraft_short
                    ? clientDetails?.flight_plan.aircraft_short
                    : 'N/A'}
                  )
                </Offcanvas.Title>
              </Col>
              <Col className='panel-controls'>
                <Button
                  variant='outline-primary'
                  onClick={locateClient}
                  style={{ height: 44, width: 44 }}
                >
                  <i
                    className='bi bi-crosshair'
                    style={{ fontSize: '1.25rem' }}
                  ></i>
                </Button>
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
                  CID: {clientDetails?.cid}
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
                {clientDetails?.flight_plan?.departure
                  ? clientDetails?.flight_plan?.departure
                  : 'Not specified'}
              </Col>
              <Col className='panel-info'>
                {clientDetails?.flight_plan?.arrival
                  ? clientDetails?.flight_plan?.arrival
                  : 'Not specified'}
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col className='panel-info'>
                Altitude (MSL): {clientDetails?.altitude} feet
              </Col>
              <Col className='panel-info'>
                Speed (GS): {clientDetails?.groundspeed} knots
              </Col>
            </Row>
            <Row>
              <Col className='panel-info'>
                Latitude: {clientDetails?.latitude}
              </Col>
              <Col className='panel-info'>
                Longitude: {clientDetails?.longitude}
              </Col>
            </Row>
            <Row>
              <Col className='panel-info'>
                Flight rules:{' '}
                {clientDetails?.flight_plan?.flight_rules === 'I'
                  ? 'IFR'
                  : 'VFR'}
              </Col>
              <Col className='panel-info'>
                Squawk: {clientDetails?.transponder}
              </Col>
            </Row>
          </Container>
          <Accordion>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>Filed flight plan route</Accordion.Header>
              <Accordion.Body>
                {clientDetails?.flight_plan?.route
                  ? clientDetails?.flight_plan?.route
                  : 'No flight plan filed'}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Remarks</Accordion.Header>
              <Accordion.Body>
                {clientDetails?.flight_plan?.remarks
                  ? clientDetails?.flight_plan?.remarks
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
