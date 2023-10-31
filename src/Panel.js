import Offcanvas from 'react-bootstrap/Offcanvas';

function Panel(props) {
  return <Offcanvas show={props.show} onHide={props.onHide} backdrop={false}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>{props.selectedAircraft}</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <p>
        Callsign = {props.selectedAircraft}
      </p>
    </Offcanvas.Body>
  </Offcanvas>
}

export default Panel;
