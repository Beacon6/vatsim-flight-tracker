import { Marker } from 'react-leaflet';
import { VatsimDataInterface } from '../typings/VatsimDataInterface.ts';
import { VatsimAirportsInterface } from '../typings/VatsimAirportsInterface.ts';
import { useEffect, useState } from 'react';

const Airports: React.FC<{
  selectedClient?: VatsimDataInterface['pilots'][number];
  vatsimAirports?: VatsimAirportsInterface['airports'];
}> = (props) => {
  const { selectedClient, vatsimAirports } = props;

  const [departureAirport, setDepartureAirport] = useState<[number, number]>();
  const [arrivalAirport, setArrivalAirport] = useState<[number, number]>();

  useEffect(() => {
    if (!selectedClient || !vatsimAirports) {
      setDepartureAirport(undefined);
      setArrivalAirport(undefined);
      return;
    }

    const dep = vatsimAirports.find((airport) => {
      return airport.icao === selectedClient.flight_plan?.departure;
    });
    const arr = vatsimAirports.find((airport) => {
      return airport.icao === selectedClient.flight_plan?.arrival;
    });

    if (dep && arr) {
      setDepartureAirport([dep?.latitude, dep?.longitude]);
      setArrivalAirport([arr?.latitude, arr?.longitude]);
    }
  }, [selectedClient, vatsimAirports]);

  if (departureAirport && arrivalAirport) {
    return (
      <>
        <Marker position={departureAirport} />
        <Marker position={arrivalAirport} />
      </>
    );
  } else {
    return null;
  }
};

export default Airports;
