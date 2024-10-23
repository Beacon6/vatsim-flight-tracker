import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { io } from "socket.io-client";

import Aircraft from "./components/Aircraft.tsx";
import Header from "./components/Header.tsx";
import Panel from "./components/Panel.tsx";

import { IPilots } from "../types/IPilots.ts";
import { IControllers } from "../types/IControllers.ts";
import { IVatsimData } from "../types/IVatsimData.ts";

function App() {
  const SERVER = import.meta.env.VITE_API_SERVER;

  const [vatsimPilots, setVatsimPilots] = useState<IPilots["pilots"]>();
  const [vatsimControllers, setVatsimControllers] = useState<IControllers["controllers"]>();

  useEffect(() => {
    const socket = io(SERVER);

    try {
      socket.on("vatsimData", (data: IVatsimData) => {
        setVatsimPilots(data.pilots);
        setVatsimControllers(data.controllers);
      });
    } catch (err) {
      console.error(err);
    }
  }, [SERVER]);

  const [selectedFlight, setSelectedFlight] = useState<IPilots["pilots"][number]>();
  const [selectedFlightId, setSelectedFlightId] = useState<number>();
  const [panelActive, setPanelActive] = useState(false);

  function selectFlight(flight: IPilots["pilots"][number]) {
    fetchFlightInfo(flight);
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
      const flight = vatsimPilots.find((p) => p.callsign === input);
      if (flight) {
        selectFlight(flight);
      }
    } else {
      const flight = vatsimPilots.find((p) => p.cid === Number(input));
      if (flight) {
        selectFlight(flight);
      }
    }

    return;
  }

  async function fetchFlightInfo(flight: IPilots["pilots"][number]) {
    await fetch(`${SERVER}/flight?callsign=${flight.callsign}`);
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
        <Aircraft vatsimPilots={vatsimPilots} selectFlight={selectFlight} selectedFlightId={selectedFlightId} />
      </MapContainer>
    </>
  );
}

export default App;
