import { useEffect, useState, useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import airplane_icon from "./airplane.png";
import Navbar from "./Navbar";
import Panel from "./Panel";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Mapbox GL API token
mapboxgl.accessToken = "pk.eyJ1IjoiYmVhY29uNiIsImEiOiJjbHBsZGNnaHEwM2l2MnJvN2MxNTg5MG9mIn0.3Lo16H4bKYk2Mfsufr2IyQ";

function App() {
  // Initialize Mapbox GL map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });

  // Updating viewport bounds on each change
  const [viewportBounds, setViewportBounds] = useState(undefined);

  function onBoundsChanged({ bounds }) {
    setViewportBounds(bounds);

    if (timer < 20) {
      setRequestAllowed(true);
      setTimer(30);
    }
  }

  // Measuring time between API calls
  const [timer, setTimer] = useState(30);
  const [requestAllowed, setRequestAllowed] = useState(true);

  useEffect(() => {
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
  const [aircraftCount, setAircraftCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (!viewportBounds) return;

    if (requestAllowed === true) {
      console.log(viewportBounds);

      fetch("http://localhost:5000/aircraft_data", {
        method: "POST",
        body: JSON.stringify(viewportBounds),
        headers: { "Content-Type": "application/json" },
      })
        .then(response => response.json())
        .then(data => {
          if (data.request_successful === true) {
            setAircraftData(data.aircraft_data);
            setAircraftCount(data.aircraft_count_total);
            setDisplayedCount(data.aircraft_count_displayed);
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
  const [aircraftPhoto, setAircraftPhoto] = useState({});

  function handleShowPanel(selectedAircraft) {
    setSelectedAircraft(selectedAircraft);
    fetch("http://localhost:5000/aircraft_photo", {
      method: "POST",
      body: JSON.stringify(selectedAircraft.icao24),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(data => {
        if (data.aircraft_photo_exists === true) {
          setAircraftPhoto(data.aircraft_photo);
        } else {
          console.log("Could not find any photo for this aircraft");
        }
      })
    setShowPanel(true);
    console.log("Clicked on:", selectedAircraft);
  }

  function handleClosePanel() {
    setShowPanel(false);
  }

  return (
    <div className="app">
      <Navbar
        countTotal={aircraftCount}
        countView={displayedCount}
        countDisplayed={aircraftData.slice(0, 1000).length}
        timer={timer}
        variant={timer < 20 ? "success" : "danger"}
      />
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
      {/* <div className="map">
        <Map
          provider={mapProvider}
          dprs={[1, 2]}
          defaultCenter={[50, 10]}
          defaultZoom={6}
          minZoom={6}
          onBoundsChanged={onBoundsChanged}
        >
          {aircraftData.slice(0, 1000).map(item => (
            <Marker
              anchor={[item.latitude, item.longitude]}
              key={item.icao24}
              onClick={() => handleShowPanel(item)}
            >
              <img
                className="airplane-icon"
                style={{ transform: `rotate(${item.true_heading}deg)` }}
                src={airplane_icon}
                alt=""
              />
            </Marker>
          ))}

          <ZoomControl
            style={{ top: "8px", left: "unset", right: "8px" }}
            buttonStyle={{ background: "#282c34", color: "#fff" }}
          />
        </Map>
      </div> */}
      <Panel
        show={showPanel}
        onHide={handleClosePanel}
        selectedAircraftData={selectedAircraft}
        selectedAircraftPhoto={aircraftPhoto}
      />
    </div>
  );
}

export default App;
