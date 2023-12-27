import { useEffect, useState, useRef } from 'react';
import { Map, Marker, Source, Layer } from 'react-map-gl';
import airplane_icon from './airplane.png';
import Navbar from './Navbar';
import Panel from './Panel';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Mapbox GL API token
const api_key = process.env.REACT_APP_API_KEY;

function App() {
  // Updating viewport bounds on each change
  const mapRef = useRef();
  const [viewportBounds, setViewportBounds] = useState();

  function onBoundsChanged() {
    const bounds = mapRef.current.getBounds();
    const boundsObject = {};

    boundsObject['sw'] = [bounds['_sw']['lat'], bounds['_sw']['lng']];
    boundsObject['ne'] = [bounds['_ne']['lat'], bounds['_ne']['lng']];

    setViewportBounds(boundsObject);

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
  const [trackedCount, setTrackedCount] = useState(0);

  useEffect(() => {
    if (!viewportBounds) return;

    if (requestAllowed === true) {
      console.log('Fetching aircraft data for:')
      console.log(viewportBounds);

      fetch('http://localhost:5000/aircraft_data', {
        method: 'POST',
        body: JSON.stringify(viewportBounds),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          if (data.request_successful === true) {
            setAircraftData(data.aircraft_data);
            setTrackedCount(data.tracked_aircraft_count);
          } else {
            console.log('API timeout');
          }
        })
      setRequestAllowed(false);
    }
  }, [viewportBounds, requestAllowed]);

  // Handling the 'Offcanvas' panel component
  // Fetching aircraft photo and other data for the panel
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [aircraftPhoto, setAircraftPhoto] = useState({});

  function handleShowPanel(selectedAircraft) {
    setSelectedAircraft(selectedAircraft);
    fetch('http://localhost:5000/aircraft_photo', {
      method: 'POST',
      body: JSON.stringify(selectedAircraft.icao24),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.aircraft_photo_exists === true) {
          setAircraftPhoto(data.aircraft_photo);
        } else {
          console.log('Could not find any photo for this aircraft');
        }
      })
    setShowPanel(true);
    console.log('Clicked on:', selectedAircraft);
  }

  function handleClosePanel() {
    setShowPanel(false);
  }

  const layerStyle = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  };

  return (
    <div className='app'>
      <Navbar
        countTotal={trackedCount}
        countView={aircraftData.length}
        timer={timer}
        variant={timer < 20 ? 'success' : 'danger'}
      />
      <div className='map-container'>
        <Map
          mapboxAccessToken={api_key}
          initialViewState={{
            latitude: 50,
            longitude: 10,
            zoom: 4,
          }}
          mapStyle='mapbox://styles/mapbox/streets-v12'
          onMoveEnd={onBoundsChanged}
          ref={mapRef}
        >
          <Source id="my-data" type="geojson" data={aircraftData}>
            <Layer {...layerStyle} />
          </Source>
          {/* {aircraftData.slice(0, 1000).map(item => (
            <Marker
              latitude={item.geometry.coordinates[1]}
              longitude={item.geometry.coordinates[0]}
              key={item.properties.icao24}
              onClick={() => handleShowPanel(item.properties)}
            >
              <img
                className='airplane-icon'
                style={{ transform: `rotate(${item.properties.true_heading}deg)` }}
                src={airplane_icon}
                alt=''
              />
            </Marker>
          ))} */}
        </Map>
      </div>
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
