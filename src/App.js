import { useState, useEffect } from 'react';
import './App.css';
import { Map, Marker, ZoomControl } from "pigeon-maps"
import { maptiler } from 'pigeon-maps/providers'

const maptilerProvider = maptiler('KR6OCyEjZD3WgFTla3Rv', 'dataviz')

function App() {

  const [aircraftState, setAircraftState] = useState([]);

  useEffect(() => {
    fetch('/state')
    .then(response => response.json())
    .then(data => setAircraftState(data));

    const interval = setInterval(() => {
    fetch('/state')
    .then(response => response.json())
    .then(data => setAircraftState(data));
    }, 10000);

    return() => clearInterval(interval);
  }, []);

  return (
  <div style={{height: '100vh'}}>
    <Map provider={maptilerProvider} dprs={[1, 2]} defaultCenter={[50, 10]} defaultZoom={6} minZoom={4} >
      <ZoomControl/>
        {aircraftState.map(item => (
            <Marker key={item.callsign}
              anchor={[item.latitude, item.longitude]}
            />
        ))}
    </Map>
  </div>
  )
}

export default App;
