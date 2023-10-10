import { useState, useEffect } from 'react';
import './App.css';
import { Map, Marker } from "pigeon-maps"
import { maptiler } from 'pigeon-maps/providers'

const maptilerProvider = maptiler('KR6OCyEjZD3WgFTla3Rv', 'dataviz')

function App() {

  const [aircraftState, setAircraftState] = useState([]);

  useEffect(() => {
    fetch('/state')
    .then(response => response.json())
    .then(data => setAircraftState(data))
  }, []);

  return (
  <div style={{height: '100vh'}}>
    <Map provider={maptilerProvider} dprs={[1, 2]} defaultCenter={[50, 10]} defaultZoom={6}>
      <Marker
        width={50}
        anchor={[50, 10]}
      />
    </Map>
  </div>
  )
}

export default App;
