import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import Aircraft from './components/Aircraft.tsx';
import Header from './components/Header.tsx';
import Panel from './components/Panel.tsx';
import { IPilotDetails } from '../types/IPilots.ts';
import { IVatsimDataSubset } from '../types/IVatsimData.ts';

const VITE_SERVER: string = import.meta.env.VITE_SERVER!;

function App() {
  const [vatsimData, setVatsimData] = useState<IVatsimDataSubset>();

  useEffect((): void => {
    try {
      const socket = io(VITE_SERVER);
      socket.on('vatsimDataSubset', (data: IVatsimDataSubset): void => {
        setVatsimData(data);
      });
    } catch (err: any) {
      console.error(err.message);
    }
  }, []);

  const [selectedFlight, setSelectedFlight] = useState<IPilotDetails>();
  const [panelActive, setPanelActive] = useState(false);

  function selectFlight(target: IVatsimDataSubset['pilots'][number]): void {
    fetchFlightInfo(target).then((res: IPilotDetails): void => setSelectedFlight(res));
    setPanelActive(true);
    return;
  }

  function deselectFlight() {
    setPanelActive(false);
    setSelectedFlight(undefined);
    return;
  }

  function searchFlight(input: string) {
    if (!vatsimData) {
      return;
    }

    if (isNaN(Number(input))) {
      const flight = vatsimData.pilots.find((p) => p.callsign === input);
      if (flight) {
        selectFlight(flight);
      }
    }

    return;
  }

  async function fetchFlightInfo(
    target: IVatsimDataSubset['pilots'][number],
  ): Promise<IPilotDetails> {
    const response: Response = await fetch(`/flight?callsign=${target.callsign}`);
    return response.json();
  }

  return (
    <>
      <Header
        pilotsCount={vatsimData?.pilots?.length}
        controllersCount={vatsimData?.controllers.length}
        handleSearch={searchFlight}
      />
      <Panel
        panelActive={panelActive}
        selectedFlight={selectedFlight}
        handleClose={deselectFlight}
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
        <Aircraft
          onlinePilots={vatsimData?.pilots}
          selectFlight={selectFlight}
          selectedFlight={selectedFlight?.pilot}
        />
      </MapContainer>
    </>
  );
}

export default App;
