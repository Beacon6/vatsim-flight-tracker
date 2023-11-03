import { useEffect, useState } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import aircraft_icon from "./aircraft.png";
import Navbar from "./Navbar";
import Panel from "./Panel";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Map styling
const mapProvider = maptiler("KR6OCyEjZD3WgFTla3Rv", "dataviz");

function App() {
  // Updating viewport bounds on each change
  const [viewportBounds, setViewportBounds] = useState(undefined);

  function onBoundsChanged({ bounds }) {
    setViewportBounds(bounds);
    console.log({ requestAllowed });
  }

  // Measuring time between API calls
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

  // Fetching aircraft data from the Flask backend
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

  // Handling the 'Offcanvas' panel component
  // Fetching aircraft photo and other data for the panel
  const [selectedAircraft, setSelectedAircraft] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [aircraftPhoto, setAircraftPhoto] = useState([]);

  function handleShowPanel(selectedAircraft) {
    setSelectedAircraft(selectedAircraft);
    fetch("/aircraft_photo", {
      method: "POST",
      body: JSON.stringify(selectedAircraft.icao24),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(data => setAircraftPhoto(data));
    setShowPanel(true);
    console.log("Clicked on:", selectedAircraft);
  }

  function handleClosePanel() {
    setShowPanel(false);
  }

  return (
    <div style={{ height: "100vh" }}>
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
          <Marker
            anchor={[item.latitude, item.longitude]}
            key={item.icao24}
            onClick={() => handleShowPanel(item)}
          >
            <img style={{ height: 24, width: 24, pointerEvents: "auto" }} src={aircraft_icon} alt="" />
          </Marker>
        ))}

        <ZoomControl
          style={{ top: "8px", left: "unset", right: "8px" }}
          buttonStyle={{ background: "#282c34", color: "#fff" }}
        />
      </Map>
      <Panel
        show={showPanel}
        onHide={handleClosePanel}
        selectedAircraftCallsign={selectedAircraft.callsign}
        selectedAircraftVelocity={selectedAircraft.velocity}
        selectedAircraftAltitude={selectedAircraft.baro_altitude}
        selectedAircraftPhoto={aircraftPhoto.img}
      />
    </div>
  );
}

export default App;
