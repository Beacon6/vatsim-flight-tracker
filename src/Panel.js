import Offcanvas from 'react-bootstrap/Offcanvas';

function Panel(props) {
  return <Offcanvas
    show={props.show}
    onHide={props.onHide}
    backdrop={false}
  >
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>{props.selectedAircraftCallsign}</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <img src={props.selectedAircraftPhoto} alt="Selected aircraft" />
      <p> CALLSIGN = {props.selectedAircraftCallsign} </p>
      <p> GND SPEED = {Math.round(props.selectedAircraftVelocity * 1.94384)} </p>
      <p> BARO ALT = {Math.round(props.selectedAircraftAltitude * 3.28084)} </p>
    </Offcanvas.Body>
  </Offcanvas>
}

export default Panel;
