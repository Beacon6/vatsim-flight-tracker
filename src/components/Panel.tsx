import Offcanvas from 'react-bootstrap/Offcanvas';
import { VatsimPilot } from '../App';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

interface PanelProps {
  show: boolean;
  onHide: () => void;
  selectedClient?: VatsimPilot['vatsimPilot'];
}

const Panel: React.FC<PanelProps> = (props) => {
  const { show, onHide, selectedClient } = props;

  return (
    <>
      <Offcanvas show={show} onHide={onHide} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='panel'>
            {selectedClient?.callsign} (
            {selectedClient?.flight_plan.aircraft_short})
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='panel'>
          <Container>
            <Row>CID: {selectedClient?.cid}</Row>
            <Row>Departure: {selectedClient?.flight_plan.departure}</Row>
            <Row>Arrival: {selectedClient?.flight_plan.arrival}</Row>
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
