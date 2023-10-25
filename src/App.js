import { useState, useEffect } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import aircraft_icon from "./aircraft.png";

const mapProvider = maptiler("KR6OCyEjZD3WgFTla3Rv", "dataviz");

function App() {
  const [viewportBounds, setViewportBounds] = useState(undefined);

  function onBoundsChanged({ bounds }) {
    setViewportBounds(bounds);
    console.log({ requestAllowed });
  }

  const [timer, setTimer] = useState(10);
  const [requestAllowed, setRequestAllowed] = useState(true);

  useEffect(() => {
    console.log(timer);
    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    if (timer === 0) {
      setTimer(10);
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
        .then(data => setAircraftData(data))
        .catch((error) => {
          console.log(error);
        });
      setRequestAllowed(false);
    }
  }, [viewportBounds, requestAllowed]);

  return (
    <div style={{ height: "100vh" }}>
      <Map
        provider={mapProvider}
        dprs={[1, 2]}
        defaultCenter={[50, 10]}
        defaultZoom={6}
        minZoom={6}
        onBoundsChanged={onBoundsChanged}
      >
        {aircraftData.map(item => (
          <Marker anchor={[item.latitude, item.longitude]} key={item.icao24}>
            <img style={{ height: 24, width: 24 }} src={aircraft_icon} alt="" />
          </Marker>
        ))}

        <ZoomControl />
      </Map>
    </div>
  );
}

export default App;
