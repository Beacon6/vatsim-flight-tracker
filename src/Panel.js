import { Offcanvas } from "react-bootstrap";
import { Badge } from "react-bootstrap";

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
      <div className="photo-container">
        <a href={props.selectedAircraftPhotoLink} >
          <img src={props.selectedAircraftPhoto} alt="Selected aircraft" />
          <Badge className="photo-attribution">
            Photo: {props.selectedAircraftPhotoAuthor}
          </Badge>
        </a>
      </div>
      <p> CALLSIGN = {props.selectedAircraftCallsign} </p>
      <p> GND SPEED = {Math.round(props.selectedAircraftVelocity * 1.94384)} </p>
      <p> BARO ALT = {Math.round(props.selectedAircraftAltitude * 3.28084)} </p>
      <p> TRUE TRACK = {Math.round(props.selectedAircraftTrueTrack)} </p>
      <p> SQUAWK = {props.selectedAircraftSquawk} </p>
    </Offcanvas.Body>
  </Offcanvas>
}

export default Panel;
