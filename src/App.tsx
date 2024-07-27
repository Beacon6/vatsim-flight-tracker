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

  const [selectedFlight, setSelectedFlight] = useState<PilotsInterface['pilots'][number]>();
  const [selectedFlightId, setSelectedFlightId] = useState<number>();
  const [panelActive, setPanelActive] = useState(false);

  function selectFlight(flight: PilotsInterface['pilots'][number]) {
    setSelectedFlight(flight);
    setSelectedFlightId(flight.cid);
    setPanelActive(true);
    return;
  }

  function deselectFlight() {
    setPanelActive(false);
    setSelectedFlightId(undefined);
    return;
  }

  function searchFlight(input: string) {
    if (!vatsimPilots) {
      return;
    }

    if (isNaN(Number(input))) {
      const searchResult = vatsimPilots.find((p) => p.callsign === input);
      if (searchResult) {
        setSelectedFlightId(searchResult.cid);
        setSelectedFlight(searchResult);
        setPanelActive(true);
      }
    } else {
      const searchResult = vatsimPilots.find((p) => p.cid === Number(input));
      if (searchResult) {
        setSelectedFlightId(searchResult.cid);
        setSelectedFlight(searchResult);
        setPanelActive(true);
      }
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
      <Panel panelActive={panelActive} selectedFlight={selectedFlight} handleClose={deselectFlight} />
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
        <Aircraft vatsimPilots={vatsimPilots} selectFlight={selectFlight} selectedFlightId={selectedFlightId} />
      </MapContainer>
    </>
  );
}

export default App;
