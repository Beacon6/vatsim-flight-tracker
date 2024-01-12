import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Navbar from './components/Navbar';

interface VatsimData {
  request_successful: boolean;
  aircraft_data: { general: any; pilots: any };
  tracked_aircraft_count: number;
}

function App() {
  // API call timer
  const [timer, setTimer] = useState(15);
  const [requestAllowed, setRequestAllowed] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    if (timer === 0) {
      setTimer(15);
      setRequestAllowed(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // Fetching VATSIM aircraft data from the Flask backend
  const [vatsimData, setVatsimData] = useState<VatsimData>();

  useEffect(() => {
    if (requestAllowed === true) {
      fetch('http://localhost:5000/aircraft_data')
        .then((response) => response.json())
        .then((data: VatsimData) => {
          if (data.request_successful === true) {
            setVatsimData(data);
          } else {
            console.log('API timeout');
          }
        });
      setRequestAllowed(false);
    }
  }, [requestAllowed]);

  // // Handling the 'Offcanvas' panel component
  // // Fetching aircraft photo and other data for the panel
  // const [selectedAircraft, setSelectedAircraft] = useState<any>();
  // const [showPanel, setShowPanel] = useState(false);
  // const [aircraftPhoto, setAircraftPhoto] = useState<any>();

  // function handleShowPanel(selectedAircraft: SetStateAction<any>) {
  //   setSelectedAircraft(selectedAircraft);
  //   fetch('http://localhost:5000/aircraft_photo', {
  //     method: 'POST',
  //     body: JSON.stringify(selectedAircraft.icao24),
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.aircraft_photo_exists === true) {
  //         setAircraftPhoto(data.aircraft_photo);
  //       } else {
  //         console.log('Could not find any photo for this aircraft');
  //       }
  //     });
  //   setShowPanel(true);
  //   console.log('Clicked on:', selectedAircraft);
  // }

  // const handleClosePanel: any = () => {
  //   setShowPanel(false);
  // };

  return (
    <>
      <Navbar
        countTotal={vatsimData?.tracked_aircraft_count}
        countView={vatsimData?.tracked_aircraft_count}
        variant='info'
        timer={timer}
      />
      <MapContainer
        className='map-container'
        center={[50, 10]}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ></TileLayer>
        {vatsimData?.aircraft_data.pilots.map((item: any) => (
          <Marker
            position={[item.latitude, item.longitude]}
            key={item.cid}
          ></Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default App;