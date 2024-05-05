import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer } from 'react-leaflet';
import Header from './components/Header.tsx';
import VatsimLayer from './components/VatsimLayer.tsx';
import Panel from './components/Panel.tsx';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { VatsimDataInterface } from './typings/VatsimDataInterface.ts';
import { AirportsInterface } from './typings/AirportsInterface.ts';

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

  const dev = true;

  const server = dev
    ? 'http://127.0.0.1:5000'
    : 'https://vatsim-flight-tracker-ux7ne3anoq-lz.a.run.app';

  const [vatsimData, setVatsimData] = useState<VatsimDataInterface>();
  const [airportsData, setAirportsData] = useState<AirportsInterface>();

  useEffect(() => {
    const socket = io(server);

    socket.on('vatsimData', (data) => {
      setVatsimData(data);
    });
  }, [server]);

  useEffect(() => {
    fetch('/airports')
      .then((res) => res.json())
      .then((data) => setAirportsData(data));
  }, []);

  // Displaying selected Client info
  const [selectedClient, setSelectedClient] = useState<string | number>();

  const getSelectedClient = (client?: string | number) => {
    setSelectedClient(client);
  };

  const [panelActive, setPanelActive] = useState(false);

  useEffect(() => {
    if (!selectedClient) {
      return;
    }

    setPanelActive(true);
  }, [selectedClient]);

  const handleClose = () => {
    setPanelActive(false);
    setSelectedClient(undefined);
  };

  return (
    <>
      <Header
        pilotsCount={vatsimData?.pilots.length}
        atcCount={vatsimData?.controllers.length}
        onSearch={getSelectedClient}
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
        <VatsimLayer
          vatsimPilots={vatsimData?.pilots}
          airportsData={airportsData}
          onClick={getSelectedClient}
          selectedClient={selectedClient}
        />
        <Panel
          panelActive={panelActive}
          onHide={handleClose}
          selectedClient={selectedClient}
          vatsimData={vatsimData}
        />
      </MapContainer>
    </>
  );
}

export default App;
