import Offcanvas from 'react-bootstrap/Offcanvas';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface PanelProps {
  show: boolean;
  onHide: void;
  selectedAircraftData: {
    callsign: string;
    groundSpeed: number;
    altitude: number;
    heading: number;
    squawk: number;
  };
  selectedAircraftPhoto: {
    link: string;
    img: string;
    author: string;
  };
}

const Panel: React.FC<PanelProps> = (props) => {
  const { show, onHide, selectedAircraftData, selectedAircraftPhoto } = props;

  return (
    <>
      <Offcanvas show={show} onHide={onHide} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{selectedAircraftData.callsign}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <div className='photo-container mb-3'>
              <a href={selectedAircraftPhoto.link} className='aircraft-photo'>
                <img src={selectedAircraftPhoto.img} alt='Selected aircraft' />
                <Badge pill bg='secondary' className='photo-attribution'>
                  Photo: {selectedAircraftPhoto.author}
                </Badge>
              </a>
            </div>
          </Row>
          <Row>
            <Col>CALLSIGN</Col>
            <Col>{selectedAircraftData.callsign}</Col>
          </Row>
          <Row>
            <Col>GND SPEED</Col>
            <Col>{Math.round(selectedAircraftData.groundSpeed * 0.53996)}</Col>
          </Row>
          <Row>
            <Col>BARO ALT</Col>
            <Col>{Math.round(selectedAircraftData.altitude * 3.28084)}</Col>
          </Row>
          <Row>
            <Col>TRUE HDG</Col>
            <Col>{Math.round(selectedAircraftData.heading)}</Col>
          </Row>
          <Row>
            <Col>SQUAWK</Col>
            <Col>{selectedAircraftData.squawk}</Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Panel;
