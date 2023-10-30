import { useEffect, useState } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import aircraft_icon from "./aircraft.png";
import Navbar from "./Navbar";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const mapProvider = maptiler("KR6OCyEjZD3WgFTla3Rv", "dataviz");

function App() {
  const [viewportBounds, setViewportBounds] = useState(undefined);

  function onBoundsChanged({ bounds }) {
    setViewportBounds(bounds);
    console.log({ requestAllowed });
  }

  const [timer, setTimer] = useState(30);
  const [requestAllowed, setRequestAllowed] = useState(true);

  useEffect(() => {
    console.log(timer);
    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    if (timer === 0) {
      setTimer(30);
      setRequestAllowed(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const [aircraftData, setAircraftData] = useState([]);

  useEffect(() => {
    if (!viewportBounds) return;

    if (requestAllowed === true) {
      console.log(viewportBounds);

      fetch("/aircraft_data", {
        method: "POST",
        body: JSON.stringify(viewportBounds),
        headers: { "Content-Type": "application/json" },
      })
        .then(response => response.json())
        .then(data => {
          if (data.request_successful === true) {
            setAircraftData(data.aircraft_data);
          } else {
            console.log("API timeout");
          }
        })
      setRequestAllowed(false);
    }
  }, [viewportBounds, requestAllowed]);

  const [show, setShow] = useState(false);
  const [selectedICAO, setSelectedICAO] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (icao24) => {
    setSelectedICAO(icao24);
    setShow(true);
  }

  return (
    <>
      <div style={{ height: "100vh" }}>
        <Button variant="primary" onClick={handleShow}>
          Launch
        </Button>
        <Navbar count={aircraftData.length} timer={timer} />
        <Map
          provider={mapProvider}
          dprs={[1, 2]}
          defaultCenter={[50, 10]}
          defaultZoom={6}
          minZoom={6}
          onBoundsChanged={onBoundsChanged}
        >
          {aircraftData.map(item => (
            <Marker anchor={[item.latitude, item.longitude]} key={item.icao24}
              onClick={() => handleShow(item.icao24)} >
              <img style={{ height: 24, width: 24, pointerEvents: "auto" }} src={aircraft_icon} alt="" />
            </Marker>
          ))}

          <ZoomControl
            style={{ top: "8px", left: "unset", right: "8px" }}
            buttonStyle={{ background: "#282c34", color: "#fff" }}
          />
        </Map>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>
            selectedICAO = {selectedICAO}
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default App;
