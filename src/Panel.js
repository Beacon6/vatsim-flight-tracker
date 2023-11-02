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
      <img src={props.selectedAircraftPhoto} alt="Selected aircraft photo" />
      <p>
        Callsign = {props.selectedAircraftHex}
      </p>
    </Offcanvas.Body>
  </Offcanvas>
}

export default Panel;
