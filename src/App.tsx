import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer } from 'react-leaflet';
import Header from './components/Header.tsx';
import Aircraft from './components/Aircraft.tsx';
import Panel from './components/Panel.tsx';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { VatsimData, VatsimPilot } from './typings/VatsimData';

function App() {
  useEffect(() => {
    const firebaseConfig = {
      apiKey: 'AIzaSyCOm3zhndPTuWbU0KLd3Jp6pZh2yXsfD24',
      authDomain: 'vatsim-flight-tracker.firebaseapp.com',
      projectId: 'vatsim-flight-tracker',
      storageBucket: 'vatsim-flight-tracker.appspot.com',
      messagingSenderId: '260478397514',
      appId: '1:260478397514:web:fe1e4ff32c012aab608ab3',
    };

    const app = initializeApp(firebaseConfig);
    const perf = getPerformance(app);

    if (app && perf) {
      console.log('Firebase App initialized successfully');
    }
  }, []);

  // Remember to switch to 'false' before deploying
  const dev = true;

  const server = dev
    ? 'http://localhost:5000'
    : 'https://vatsim-flight-tracker-ux7ne3anoq-lz.a.run.app';

  const [vatsimData, setVatsimData] = useState<VatsimData>();

  useEffect(() => {
    const socket = io(server);

    socket.on('vatsimData', (data) => {
      setVatsimData(data);
    });
  }, [server]);

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

  // Search functionality
  const [searchValue, setSearchValue] = useState<string>();

  const searchSubmit = (value?: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (searchValue) {
      console.log(`Searching for ${searchValue}`);
    }
  }, [searchValue]);

  return (
    <>
      <Header
        pilotsCount={vatsimData?.pilots.length}
        atcCount={vatsimData?.controllers.length}
        onSearch={searchSubmit}
        isDev={dev}
      />
      <MapContainer
        className='map-container'
        center={[50, 10]}
        zoom={6}
        minZoom={3}
        zoomControl={false}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ></TileLayer>
        <Aircraft vatsimPilots={vatsimData?.pilots} onClick={handleShow} />
      </MapContainer>
      <Panel
        show={showPanel}
        selectedClient={clientInfo}
        onHide={handleClose}
      />
    </>
  );
}

export default App;
