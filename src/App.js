import { useState, useEffect } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import aircraft_icon from "./aircraft.png";

const mapProvider = maptiler("KR6OCyEjZD3WgFTla3Rv", "dataviz");

function App() {
  const [viewportBounds, setViewportBounds] = useState(undefined);

  function onBoundsChanged({ bounds }) {
    setViewportBounds(bounds);
  }

  const [aircraftData, setAircraftData] = useState([]);

  useEffect(() => {
    if (!viewportBounds) return;

    console.log(viewportBounds);

    fetch("/aircraft_data", {
      method: "POST",
      body: JSON.stringify(viewportBounds),
      headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => setAircraftData(data));
  }, [viewportBounds]);

  return (
    <div style={{ height: "100vh" }}>
      <Map
        provider={mapProvider}
        dprs={[1, 2]}
        defaultCenter={[50, 10]}
        defaultZoom={6}
        minZoom={4}
        onBoundsChanged={onBoundsChanged}
      >
        {aircraftData.map(item => (
          <Marker anchor={[item.latitude, item.longitude]} key={item.icao24}>
            <img style={{ height: 24, width: 24 }} src={aircraft_icon} alt="" />
          </Marker>
        ))}

        <ZoomControl/>
      </Map>
    </div>
    );
}

export default App;
