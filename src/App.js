import { useState, useEffect } from 'react';
import './App.css';
import { Map, Marker, ZoomControl } from "pigeon-maps"
import { maptiler } from 'pigeon-maps/providers'
import aircraft_icon from "./aircraft.png"

const maptilerProvider = maptiler('KR6OCyEjZD3WgFTla3Rv', 'dataviz')

function App() {

  const [aircraftData, setAircraftData] = useState([]);

  useEffect(() => {
    fetch('/aircraft_data')
    .then(response => response.json())
    .then(data => setAircraftData(data));
  }, []);

  return (
  <div style={{height: '100vh'}}>
    <Map provider={maptilerProvider} dprs={[1, 2]} defaultCenter={[50, 10]} defaultZoom={6} minZoom={4} >
      <ZoomControl/>
      {aircraftData.map(item => (
        <Marker anchor={[item.latitude, item.longitude]}>
          <img style={{ height: 24, width: 24 }} src={ aircraft_icon } />
        </Marker>
      ))}
    </Map>
  </div>
  )
}

export default App;
