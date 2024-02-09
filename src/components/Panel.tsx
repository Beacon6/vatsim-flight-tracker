import Offcanvas from 'react-bootstrap/Offcanvas';
import { VatsimPilot } from '../App';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Panel: React.FC<{
  show: boolean;
  onHide: () => void;
  selectedClient?: VatsimPilot['vatsimPilot'];
}> = (props) => {
  const { show, onHide, selectedClient } = props;

  return (
    <>
      <Offcanvas show={show} onHide={onHide} backdrop={false}>
        <Offcanvas.Header closeButton={false}>
          <Offcanvas.Title as={'h5'}>
            {selectedClient?.callsign} (
            {selectedClient?.flight_plan.aircraft_short})
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
              <Col>{selectedClient?.flight_plan.departure}</Col>
              <Col></Col>
              <Col>{selectedClient?.flight_plan.arrival}</Col>
            </Row>
          </Container>
          <Container>
            <Row>Alternate: {selectedClient?.flight_plan.alternate}</Row>
            <Row>Altitude: {selectedClient?.altitude}</Row>
            <Row>Ground speed: {selectedClient?.groundspeed}</Row>
            <Row>Transponder: {selectedClient?.transponder}</Row>
            <Row>Server: {selectedClient?.server}</Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Panel;
