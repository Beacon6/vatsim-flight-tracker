import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import Aircraft from "./components/Aircraft.tsx";
import Header from "./components/Header.tsx";
import Panel from "./components/Panel.tsx";
import { IPilotDetails, IPilotsSubset } from "../types/IPilots.ts";

function App() {
  const VITE_SERVER: string = import.meta.env.VITE_SERVER!;

  const [onlinePilots, setOnlinePilots] = useState<IPilotsSubset["pilots"]>();

  useEffect((): void => {
    try {
      const socket = io(VITE_SERVER);
      socket.on("vatsimDataSubset", (data: IPilotsSubset): void => {
        setOnlinePilots(data.pilots);
      });
    } catch (err: any) {
      console.error(err.message);
    }
  }, [VITE_SERVER]);

  const [selectedFlight, setSelectedFlight] = useState<IPilotDetails>();
  // const [selectedFlightId, setSelectedFlightId] = useState<number>();
  const [panelActive, setPanelActive] = useState(false);

  function selectFlight(target: IPilotsSubset["pilots"][number]): void {
    fetchFlightInfo(target).then((res: IPilotDetails): void => setSelectedFlight(res));
    // setSelectedFlightId(flight.cid);
    setPanelActive(true);
    return;
  }

  function deselectFlight() {
    setPanelActive(false);
    setSelectedFlight(undefined);
    // setSelectedFlightId(undefined);
    return;
  }

  function searchFlight(input: string) {
    if (!onlinePilots) {
      return;
    }

    if (isNaN(Number(input))) {
      const flight = onlinePilots.find((p) => p.callsign === input);
      if (flight) {
        selectFlight(flight);
      }
    }

    return;
  }

  async function fetchFlightInfo(target: IPilotsSubset["pilots"][number]): Promise<IPilotDetails> {
    const response: Response = await fetch(`/flight?callsign=${target.callsign}`);
    return response.json();
  }

  return (
    <>
      <Header pilotsCount={onlinePilots?.length} handleSearch={searchFlight} />
      <Panel panelActive={panelActive} selectedFlight={selectedFlight} handleClose={deselectFlight} />
      <MapContainer
        className="map-container"
        center={[50, 10]}
        zoom={6}
        minZoom={3}
        zoomControl={false}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></TileLayer>
        <Aircraft onlinePilots={onlinePilots} selectFlight={selectFlight} />
      </MapContainer>
    </>
  );
}

export default App;
