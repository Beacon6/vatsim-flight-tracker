import Offcanvas from 'react-bootstrap/Offcanvas';

function Panel(props) {
  return <Offcanvas show={props.show} onHide={props.onHide}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Offcanvas</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <p>
        selectedICAO = {props.selectedICAO}
      </p>
    </Offcanvas.Body>
  </Offcanvas>
}

export default Panel;
