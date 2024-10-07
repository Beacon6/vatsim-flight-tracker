import { useEffect, useState } from "react";

import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";

import { VatsimDataInterface } from "../../types/VatsimDataInterface";

interface Props {
    panelActive: boolean;
    selectedFlight?: VatsimDataInterface["pilots"][number];
    handleClose: () => void;
}

function Panel(props: Props) {
    const { panelActive, selectedFlight, handleClose } = props;

    const [skyVectorUrl, setSkyVectorUrl] = useState<string>();

    useEffect(() => {
        if (!selectedFlight?.flight_plan || selectedFlight.flight_plan.flight_rules === "V") {
            setSkyVectorUrl(undefined);
            return;
        }

        const clientDeparture = selectedFlight.flight_plan.departure;
        const clientArrival = selectedFlight.flight_plan.arrival;
        const clientRoute = selectedFlight.flight_plan.route;

        const encodedFlightPlan = encodeURIComponent(`${clientDeparture} ${clientRoute} ${clientArrival}`);
        setSkyVectorUrl(`https://skyvector.com/?chart=304&fpl=${encodedFlightPlan}`);
    }, [selectedFlight]);

    return (
        <>
            <Offcanvas className="panel" show={panelActive} handleClose={handleClose} backdrop={false} scroll={true}>
                <Offcanvas.Header className="panel-header" closeButton={false}>
                    <Container>
                        <Row>
                            <Col className="panel-title">
                                <Offcanvas.Title className="panel-title">
                                    {selectedFlight?.callsign} (
                                    {selectedFlight?.flight_plan?.aircraft_short
                                        ? selectedFlight?.flight_plan.aircraft_short
                                        : "N/A"}
                                    )
                                </Offcanvas.Title>
                            </Col>
                            <Col className="panel-controls">
                                <Button variant="outline-primary" style={{ height: 44, width: 44 }}>
                                    <a
                                        href={skyVectorUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "inherit" }}
                                    >
                                        <i className="bi bi-map" style={{ fontSize: "1.25 rem" }}></i>
                                    </a>
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    onClick={handleClose}
                                    style={{ height: 44, width: 44 }}
                                >
                                    <i className="bi bi-x-circle" style={{ fontSize: "1.25rem" }}></i>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="panel-subtitle">
                                <Offcanvas.Title className={"panel-subtitle"}>
                                    CID: {selectedFlight?.cid}
                                </Offcanvas.Title>
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
                                {selectedFlight?.flight_plan?.departure
                                    ? selectedFlight?.flight_plan?.departure
                                    : "Not specified"}
                            </Col>
                            <Col className="panel-info">
                                {selectedFlight?.flight_plan?.arrival
                                    ? selectedFlight?.flight_plan?.arrival
                                    : "Not specified"}
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Row>
                            <Col className="panel-info">Altitude (MSL): {selectedFlight?.altitude} feet</Col>
                            <Col className="panel-info">Speed (GS): {selectedFlight?.groundspeed} knots</Col>
                        </Row>
                        <Row>
                            <Col className="panel-info">Latitude: {selectedFlight?.latitude}</Col>
                            <Col className="panel-info">Longitude: {selectedFlight?.longitude}</Col>
                        </Row>
                        <Row>
                            <Col className="panel-info">
                                Flight rules: {selectedFlight?.flight_plan?.flight_rules === "I" ? "IFR" : "VFR"}
                            </Col>
                            <Col className="panel-info">Squawk: {selectedFlight?.transponder}</Col>
                        </Row>
                    </Container>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Filed flight plan route</Accordion.Header>
                            <Accordion.Body>
                                {selectedFlight?.flight_plan?.route
                                    ? selectedFlight?.flight_plan?.route
                                    : "No flight plan filed"}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Remarks</Accordion.Header>
                            <Accordion.Body>
                                {selectedFlight?.flight_plan?.remarks
                                    ? selectedFlight?.flight_plan?.remarks
                                    : "No remarks"}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Panel;
