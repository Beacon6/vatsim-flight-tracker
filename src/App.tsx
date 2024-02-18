import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Navbar from './components/Navbar';
import Aircraft from './components/Aircraft';
import Panel from './components/Panel';
import { NmScale } from '@marfle/react-leaflet-nmscale';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import Controllers from './components/Controllers';
import { VatsimData, VatsimPilot } from './typings/VatsimData';

const firebaseConfig = {
  apiKey: 'AIzaSyCOm3zhndPTuWbU0KLd3Jp6pZh2yXsfD24',
  authDomain: 'vatsim-flight-tracker.firebaseapp.com',
  projectId: 'vatsim-flight-tracker',
  storageBucket: 'vatsim-flight-tracker.appspot.com',
  messagingSenderId: '260478397514',
  appId: '1:260478397514:web:fe1e4ff32c012aab608ab3',
};

const app = initializeApp(firebaseConfig);
if (app) {
  console.log('Firebase App initialized');
}

const perf = getPerformance(app);
if (perf) {
  console.log('Firebase performance monitoring initialized');
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

  // Fetching VATSIM aircraft data from the Express backend
  const dev = false;

  const fetch_endpoint = dev
    ? 'http://localhost:5000/vatsim_data'
    : 'https://express-server-ux7ne3anoq-lz.a.run.app/vatsim_data';

  const [vatsimData, setVatsimData] = useState<VatsimData>();

  useEffect(() => {
    if (requestAllowed === true) {
      fetch(fetch_endpoint)
        .then((response) => response.json())
        .then((data: VatsimData) => {
          if (data.requestSuccessful === true) {
            setVatsimData(data);
          } else {
            console.log('API timeout');
          }
        });
      setRequestAllowed(false);
    }
  }, [requestAllowed, fetch_endpoint]);

  // Displaying selected Client info
  const [clientInfo, setClientInfo] = useState<VatsimPilot['vatsimPilot']>();
  const [showPanel, setShowPanel] = useState(false);

  const handleShow = (selected: VatsimPilot['vatsimPilot']) => {
    setClientInfo(selected);
    setShowPanel(true);
  };

  const handleClose = () => {
    setShowPanel(false);
  };

  return (
    <>
      <div className='navbar-container'>
        <Navbar
          pilotsCount={vatsimData?.pilotsCount}
          atcCount={vatsimData?.atcCount}
        />
      </div>
      <MapContainer
        className='map'
        center={[50, 10]}
        zoom={6}
        minZoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ></TileLayer>
        <Aircraft vatsimData={vatsimData} onClick={handleShow} />
        <Controllers vatsimData={vatsimData} />
        <Panel
          show={showPanel}
          onHide={handleClose}
          selectedClient={clientInfo}
        />
        <NmScale />
      </MapContainer>
    </>
  );
}

export default App;
