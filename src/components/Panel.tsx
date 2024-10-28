import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";

import { IPilotDetails } from "../../types/IPilots";

interface Props {
  panelActive: boolean;
  selectedFlight?: IPilotDetails;
  handleClose: () => void;
}

function Panel(props: Props) {
  const { panelActive, selectedFlight, handleClose } = props;

  return (
    <>
      <Offcanvas className="panel" show={panelActive} handleClose={handleClose} backdrop={false} scroll={true}>
        <Offcanvas.Header className="panel-header" closeButton={false}>
          <Container>
            <Row>
              <Col className="panel-title">
                <Offcanvas.Title className="panel-title">
                  {selectedFlight?.pilot.callsign} (
                  {selectedFlight?.pilot.flight_plan?.aircraft_short
                    ? selectedFlight?.pilot.flight_plan.aircraft_short
                    : "N/A"}
                  )
                </Offcanvas.Title>
              </Col>
              <Col className="panel-controls">
                <Button variant="outline-primary" onClick={handleClose} style={{ height: 44, width: 44 }}>
                  <i className="bi bi-x-circle" style={{ fontSize: "1.25rem" }}></i>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className="panel-subtitle">
                <Offcanvas.Title className={"panel-subtitle"}>CID: {selectedFlight?.pilot.cid}</Offcanvas.Title>
              </Col>
            </Row>
          </Container>
        </Offcanvas.Header>
        <Offcanvas.Body className="panel-body">
          <Container>
            <Row>
              <Col className="panel-info">Departure</Col>
              <Col className="panel-info">Arrival</Col>
            </Row>
            <Row>
              <Col className="panel-info">
                <img src="../assets/departure.svg" height={48} width={48} />
              </Col>
              <Col className="panel-info">
                <img src="../assets/arrival.svg" height={48} width={48} />
              </Col>
            </Row>
            <Row>
              <Col className="panel-info">
                {selectedFlight?.pilot.flight_plan?.departure
                  ? selectedFlight?.pilot.flight_plan?.departure
                  : "Not specified"}
              </Col>
              <Col className="panel-info">
                {selectedFlight?.pilot.flight_plan?.arrival
                  ? selectedFlight?.pilot.flight_plan?.arrival
                  : "Not specified"}
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col className="panel-info">Altitude (MSL): {selectedFlight?.pilot.altitude} feet</Col>
              <Col className="panel-info">Speed (GS): {selectedFlight?.pilot.groundspeed} knots</Col>
            </Row>
            <Row>
              <Col className="panel-info">Latitude: {selectedFlight?.pilot.latitude}</Col>
              <Col className="panel-info">Longitude: {selectedFlight?.pilot.longitude}</Col>
            </Row>
            <Row>
              <Col className="panel-info">
                Flight rules: {selectedFlight?.pilot.flight_plan?.flight_rules === "I" ? "IFR" : "VFR"}
              </Col>
              <Col className="panel-info">Squawk: {selectedFlight?.pilot.transponder}</Col>
            </Row>
          </Container>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filed flight plan route</Accordion.Header>
              <Accordion.Body>
                {selectedFlight?.pilot.flight_plan?.route
                  ? selectedFlight?.pilot.flight_plan?.route
                  : "No flight plan filed"}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Remarks</Accordion.Header>
              <Accordion.Body>
                {selectedFlight?.pilot.flight_plan?.remarks ? selectedFlight?.pilot.flight_plan?.remarks : "No remarks"}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Panel;
