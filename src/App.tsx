import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Navbar from './components/Navbar';
import Aircraft from './components/Aircraft';
import Panel from './components/Panel';
import { NmScale } from '@marfle/react-leaflet-nmscale';

export interface VatsimData {
  request_successful: boolean;
  vatsim_data: {
    pilots: {
      altitude: number;
      callsign: string;
      cid: number;
      groundspeed: number;
      heading: number;
      latitude: number;
      longitude: number;
      name: string;
      qnh_i_hq: number;
      qnh_mb: number;
      server: string;
      transponder: number;
    }[];
  };
  pilots_count: number;
  atc_count: number;
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
      fetch('http://localhost:5000/vatsim_data')
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

  // Displaying selected Client info
  const [showPanel, setShowPanel] = useState(false);

  const handleShow = () => {
    setShowPanel(true);
  };

  const handleClose = () => {
    setShowPanel(false);
  };

  return (
    <>
      <Navbar
        pilotsCount={vatsimData?.pilots_count}
        atcCount={vatsimData?.atc_count}
      />
      <MapContainer
        className='map-container'
        center={[50, 10]}
        zoom={6}
        minZoom={3}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ></TileLayer>
        <Aircraft vatsimData={vatsimData} onClick={handleShow} />
        <Panel
          show={showPanel}
          onHide={handleClose}
          selectedClient={vatsimData}
        />
        <NmScale />
      </MapContainer>
    </>
  );
}

export default App;
