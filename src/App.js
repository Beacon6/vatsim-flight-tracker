import { useState, useEffect } from 'react';
import './App.css';
import { Map, Marker, ZoomControl } from "pigeon-maps"
import { maptiler } from 'pigeon-maps/providers'
import aircraft_icon from "./aircraft.png"

const maptilerProvider = maptiler('KR6OCyEjZD3WgFTla3Rv', 'dataviz')

function App() {

  const [bounds, setBounds] = useState(undefined)

  function onBoundsChanged({ bounds }) {
    setBounds(bounds)
  }

  useEffect(() => {
      if (!bounds) return;
      console.log(bounds)
      fetch('/aircraft_data', {method: 'POST', body: JSON.stringify(bounds), headers: {"Content-Type": "application/json"}})
      .then(response => response.json())
      .then(data => setAircraftData(data));
    },
  [bounds]
  )

  let [aircraftData, setAircraftData] = useState([]);

  return (
  <div style={{height: '100vh'}}>
    <Map
    provider={maptilerProvider}
    dprs={[1, 2]}
    defaultCenter={[50, 10]}
    defaultZoom={6}
    minZoom={4}
    onBoundsChanged={ onBoundsChanged }
    >
      <ZoomControl/>
      {aircraftData.map(item => (
        <Marker anchor={[item.latitude, item.longitude]} key={ item.icao24 }>
          <img style={{ height: 24, width: 24 }} src={ aircraft_icon } alt="" />
        </Marker>
      ))}
    </Map>
  </div>
  )
}

export default App;
