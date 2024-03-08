import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngBounds, LatLngExpression } from 'leaflet';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import MapHandler from './components/MapHandler.ts';
import Aircraft from './components/Aircraft.tsx';
import Navbar from './components/Navbar.tsx';
import Panel from './components/Panel.tsx';
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
  // Remember to switch to 'false' before deploying
  const dev = true;

  const server = dev
    ? 'http://localhost:5000'
    : 'https://vatsim-flight-tracker-ux7ne3anoq-lz.a.run.app';

  const [vatsimData, setVatsimData] = useState<VatsimData>();

  useEffect(() => {
    if (dev) { console.log('Running on a development server'); }

    const socket = io(server);
    console.log('Connected to WebSocket');
    console.log('Using latest version');

    socket.on('vatsimData', (data) => {
      setVatsimData(data);
    });
  }, [server, dev]);

  const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();
  const getViewportBounds = (bounds?: LatLngBounds) => {
    setViewportBounds(bounds);
    console.log(viewportBounds);
  }

  const [visibleObjects, setVisibleObjects] = useState<VatsimData['pilots']>();

  useEffect(() => {
    if (!vatsimData || !viewportBounds) { return; }

    const visibleAircraft: VatsimData['pilots'] = [];

    for (let i = 0; i < vatsimData.pilots.length; i++) {
      const position: LatLngExpression = [
        vatsimData.pilots[i].latitude,
        vatsimData.pilots[i].longitude,
      ];

      if (viewportBounds.contains(position)) {
        visibleAircraft.push(vatsimData.pilots[i]);
      }
    }
    setVisibleObjects(visibleAircraft);
  }, [vatsimData, viewportBounds]);

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
          pilotsCount={vatsimData?.pilots.length}
          atcCount={vatsimData?.controllers.length}
        />
      </div>
      <MapContainer
        className='map'
        center={[50, 10]}
        zoom={6}
        minZoom={3}
        zoomControl={false}
        worldCopyJump={true}
      >
        <MapHandler passData={getViewportBounds} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ></TileLayer>
        <Panel
          show={showPanel}
          onHide={handleClose}
          selectedClient={clientInfo}
        />
      </MapContainer>
    </>
  );
}

export default App;
