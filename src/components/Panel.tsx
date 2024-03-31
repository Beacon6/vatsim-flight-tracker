import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { VatsimData, VatsimPilot } from '../typings/VatsimData';

const Panel: React.FC<{
  panelActive: boolean;
  onHide: () => void;
  selectedClient?: string | number;
  vatsimData?: VatsimData;
}> = (props) => {
  const { panelActive, onHide, selectedClient, vatsimData } = props;

  const [clientDetails, setClientDetails] =
    useState<VatsimPilot['vatsimPilot']>();

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

  return (
    <>
      <Offcanvas
        show={panelActive && clientDetails}
        onHide={onHide}
        backdrop={false}
      >
        <Offcanvas.Header closeButton={false}>
          <Offcanvas.Title as={'h5'}>
            {clientDetails?.callsign} (
            {clientDetails?.flight_plan?.aircraft_short
              ? clientDetails?.flight_plan.aircraft_short
              : 'Unknown'}
            )
          </Offcanvas.Title>
          <Offcanvas.Title as={'h6'}>CID: {clientDetails?.cid}</Offcanvas.Title>
          <Button
            className='panel-close'
            variant='outline-primary'
            onClick={onHide}
          >
            Hide
          </Button>
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
                {clientDetails?.flight_plan?.departure
                  ? clientDetails?.flight_plan?.departure
                  : 'Not specified'}
              </Col>
              <Col></Col>
              <Col>
                {clientDetails?.flight_plan?.arrival
                  ? clientDetails?.flight_plan?.arrival
                  : 'Not specified'}
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col>Altitude (MSL): {clientDetails?.altitude} feet</Col>
              <Col>Speed (GS): {clientDetails?.groundspeed} knots</Col>
            </Row>
            <Row>
              <Col>Latitude: {clientDetails?.latitude}</Col>
              <Col>Longitude: {clientDetails?.longitude}</Col>
            </Row>
            <Row>
              <Col>
                Flight rules:{' '}
                {clientDetails?.flight_plan?.flight_rules === 'I'
                  ? 'IFR'
                  : 'VFR'}
              </Col>
              <Col>Squawk: {clientDetails?.transponder}</Col>
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
