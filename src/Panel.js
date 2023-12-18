import { Offcanvas, Badge, Container, Row, Col } from 'react-bootstrap';

function Panel(props) {
  return <Offcanvas
    show={props.show}
    onHide={props.onHide}
    backdrop={false}
  >
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>{props.selectedAircraftData.callsign}</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <Container>
        <Row>
          <div className='photo-container mb-3'>
            <a href={props.selectedAircraftPhoto.link} className='aircraft-photo' >
                <img src={props.selectedAircraftPhoto.img} alt='Selected aircraft' />
                <Badge pill bg='secondary' className='photo-attribution'>
                  Photo: {props.selectedAircraftPhoto.author}
                </Badge>
            </a>
          </div>
        </Row>
        <Row>
          <Col>CALLSIGN</Col><Col>{props.selectedAircraftData.callsign}</Col>
        </Row>
        <Row>
          <Col>GND SPEED</Col><Col>{Math.round(props.selectedAircraftData.ground_speed * 0.53996)}</Col>
        </Row>
        <Row>
          <Col>BARO ALT</Col><Col>{Math.round(props.selectedAircraftData.baro_altitude * 3.28084)}</Col>
        </Row>
        <Row>
          <Col>TRUE HDG</Col><Col>{Math.round(props.selectedAircraftData.true_heading)}</Col>
        </Row>
        <Row>
          <Col>SQUAWK</Col><Col>{props.selectedAircraftData.squawk}</Col>
        </Row>
      </Container>
    </Offcanvas.Body>
  </Offcanvas>
}

export default Panel;
