import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer } from 'react-leaflet';
import Header from './components/Header.tsx';
import VatsimLayer from './components/VatsimLayer.tsx';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { VatsimData } from './typings/VatsimData';

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
  // Remember to switch to 'false' before deploying
  const dev = true;

  const server = dev
    ? 'http://localhost:5000'
    : 'https://vatsim-flight-tracker-ux7ne3anoq-lz.a.run.app';

  const [vatsimData, setVatsimData] = useState<VatsimData>();

  useEffect(() => {
    if (dev) {
      console.log('Running on a development server');
    }

    const socket = io(server);
    console.log('Connected to WebSocket');

    socket.on('vatsimData', (data) => {
      setVatsimData(data);
    });
  }, [server, dev]);

  return (
    <>
      <Header
        pilotsCount={vatsimData?.pilots.length}
        atcCount={vatsimData?.controllers.length}
      />
      <MapContainer
        className='map'
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
        <VatsimLayer vatsimData={vatsimData} />
      </MapContainer>
    </>
  );
}

export default App;
