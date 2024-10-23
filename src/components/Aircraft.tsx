import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Marker, Tooltip, useMap } from "react-leaflet";
import { icon, LatLngExpression } from "leaflet";
import "leaflet-rotatedmarker";

import useViewportBounds from "../hooks/useViewportBounds.ts";

import { IPilots } from "../../types/IPilots.ts";

interface Props {
  vatsimPilots?: IPilots["pilots"];
  selectFlight: (flight: IPilots["pilots"][number]) => void;
  selectedFlightId?: number;
}

function Aircraft(props: Props) {
  const { vatsimPilots, selectFlight, selectedFlightId } = props;

  const map = useMap();
  const viewportBounds = useViewportBounds(map);

  const [displayedAircraft, setDisplayedAircraft] = useState<IPilots["pilots"]>();

  useEffect(() => {
    if (!vatsimPilots || !viewportBounds) {
      return;
    }
    const aircraftOnScreen: IPilots["pilots"] = [];

    for (const p of vatsimPilots) {
      const position: LatLngExpression = [p.latitude, p.longitude];

      if (viewportBounds.contains(position)) {
        aircraftOnScreen.push(p);
      }
    }

    setDisplayedAircraft(aircraftOnScreen.slice(0, 1000));
  }, [vatsimPilots, viewportBounds]);

  const airplaneIcon = icon({
    iconUrl: "../assets/airplane.svg",
    iconSize: [24, 24],
  });

  const selectedAirplaneIcon = icon({
    iconUrl: "../assets/airplane-focus.svg",
    iconSize: [24, 24],
  });

  return (
    <>
      {displayedAircraft?.map((item) => (
        <Marker
          icon={item.cid === selectedFlightId ? selectedAirplaneIcon : airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
          rotationAngle={item.heading}
          eventHandlers={{ click: () => selectFlight(item) }}
        >
          <Tooltip className="label" direction="right" sticky={true} opacity={1}>
            <Container>
              <Row>
                <Col className="label-info">
                  {item.callsign} ({item.flight_plan?.aircraft_short ? item.flight_plan.aircraft_short : "N/A"})
                </Col>
              </Row>
            </Container>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}

export default Aircraft;
