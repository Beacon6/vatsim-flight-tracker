import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { io } from 'socket.io-client';

import Aircraft from './components/Aircraft.tsx';
import Header from './components/Header.tsx';
import Panel from './components/Panel.tsx';

import { PilotsInterface } from '../types/PilotsInterface.ts';
import { ControllersInterface } from '../types/ControllersInterface.ts';

function App() {
  const [vatsimPilots, setVatsimPilots] = useState<PilotsInterface['pilots']>();
  const [vatsimControllers, setVatsimControllers] = useState<ControllersInterface['controllers']>();

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    try {
      socket.on('vatsimData', (data: PilotsInterface & ControllersInterface) => {
        setVatsimPilots(data.pilots);
        setVatsimControllers(data.controllers);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const [selectedClient, setSelectedClient] = useState<PilotsInterface['pilots'][number]>();
  const [selectedClientCallsign, setSelectedClientCallsign] = useState<string>();

  const selectClient = (client: PilotsInterface['pilots'][number]) => {
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
      <Header pilotsCount={vatsimPilots?.length} controllersCount={vatsimControllers?.length} onSearch={searchClient} />
      <Panel panelActive={panelActive} onHide={deselectClient} selectedClient={selectedClient} />
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
        <Aircraft vatsimPilots={vatsimPilots} />
      </MapContainer>
    </>
  );
}

export default App;
