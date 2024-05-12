import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer } from 'react-leaflet';
import Header from './components/Header.tsx';
import VatsimLayer from './components/VatsimLayer.tsx';
import Panel from './components/Panel.tsx';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { VatsimDataInterface } from './typings/VatsimDataInterface.ts';
import { VatsimAirportsInterface } from './typings/VatsimAirportsInterface.ts';

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

  const dev = false;

  const server = dev
    ? 'http://127.0.0.1:5000'
    : 'https://vatsim-flight-tracker-ux7ne3anoq-lz.a.run.app';

  const [vatsimData, setVatsimData] = useState<VatsimDataInterface>();
  const [vatsimPilots, setVatsimPilots] =
    useState<VatsimDataInterface['pilots']>();
  const [vatsimControllers, setVatsimControllers] =
    useState<VatsimDataInterface['controllers']>();
  const [vatsimAirports, setVatsimAirports] =
    useState<VatsimAirportsInterface['airports']>();

  useEffect(() => {
    const socket = io(server);

    socket.on('vatsimData', (data) => {
      setVatsimData(data);
    });
  }, [server]);

  useEffect(() => {
    if (!vatsimData) {
      return;
    }

    setVatsimPilots(vatsimData['pilots']);
    setVatsimControllers(vatsimData['controllers']);
  }, [vatsimData]);

  useEffect(() => {
    fetch('/vatsim_airports')
      .then((res) => res.json())
      .then((data) => setVatsimAirports(data['airports']));
  }, []);

  const [selectedClient, setSelectedClient] =
    useState<VatsimDataInterface['pilots'][number]>();
  const [selectedClientCallsign, setSelectedClientCallsign] =
    useState<string>();

  const selectClient = (client: VatsimDataInterface['pilots'][number]) => {
    setSelectedClient(client);
    setSelectedClientCallsign(client.callsign);
  };

  const [panelActive, setPanelActive] = useState(false);

  useEffect(() => {
    if (!selectedClient) {
      setPanelActive(false);
    } else {
      setPanelActive(true);
    }
  }, [selectedClient]);

  const deselectClient = () => {
    setSelectedClient(undefined);
    setSelectedClientCallsign(undefined);
  };

  const searchClient = (searchValue?: string | number) => {
    if (
      vatsimPilots &&
      searchValue &&
      vatsimPilots.some((client) => {
        return client.callsign === searchValue || client.cid === searchValue;
      })
    ) {
      setSelectedClient(
        vatsimPilots.find((client) => {
          return client.callsign === searchValue || client.cid === searchValue;
        }),
      );
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!selectedClientCallsign) {
      return;
    }

    const client = vatsimPilots?.find((client) => {
      return client.callsign === selectedClientCallsign;
    });

    selectClient(client!);
  }, [vatsimPilots, selectedClientCallsign]);

  return (
    <>
      <Header
        pilotsCount={vatsimPilots?.length}
        controllersCount={vatsimControllers?.length}
        onSearch={searchClient}
        isDev={dev}
      />
      <Panel
        panelActive={panelActive}
        onHide={deselectClient}
        selectedClient={selectedClient}
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
          vatsimPilots={vatsimPilots}
          vatsimAirports={vatsimAirports}
          onClick={selectClient}
          selectedClient={selectedClient}
        />
      </MapContainer>
    </>
  );
}

export default App;
