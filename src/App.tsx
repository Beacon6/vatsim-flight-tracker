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

  // TODO : can probably simplify this
  const [selectedFlight, setSelectedFlight] = useState<PilotsInterface['pilots'][number]>();
  const [panelActive, setPanelActive] = useState(false);

  function selectFlight(flight: PilotsInterface['pilots'][number]) {
    if (!selectedFlight) {
      setSelectedFlight(flight);
      setPanelActive(true);
    } else {
      setSelectedFlight(undefined);
      setPanelActive(false);
    }

    return;
  }

  function closePanel() {
    setSelectedFlight(undefined);
    setPanelActive(false);

    return;
  }

  function searchFlight(input: string | number) {
    if (!vatsimPilots) {
      return;
    }

    setSelectedFlight(vatsimPilots?.find((flight) => flight.callsign === input));
    if (selectedFlight) {
      setPanelActive(true);
    }

    return;
  }

  return (
    <>
      <Header
        pilotsCount={vatsimPilots?.length}
        controllersCount={vatsimControllers?.length}
        handleSearch={searchFlight}
      />
      <Panel panelActive={panelActive} selectedFlight={selectedFlight} handleClose={closePanel} />
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
        <Aircraft vatsimPilots={vatsimPilots} selectFlight={selectFlight} />
      </MapContainer>
    </>
  );
}

export default App;
