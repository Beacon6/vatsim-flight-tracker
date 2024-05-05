import { useEffect, useState } from 'react';
import {
  AirportInterface,
  AirportsInterface,
} from '../typings/AirportsInterface.ts';
import { CircleMarker } from 'react-leaflet';
import { VatsimDataInterface } from '../typings/VatsimDataInterface.ts';

const Airports: React.FC<{
  selectedClient?: string | number;
  vatsimData?: VatsimDataInterface['pilots'];
  airportsData?: AirportsInterface;
}> = (props) => {
  const { selectedClient, vatsimData, airportsData } = props;

  const [departure, setDeparture] = useState<AirportInterface>();
  const [arrival, setArrival] = useState<AirportInterface>();

  useEffect(() => {
    if (!selectedClient || !vatsimData) {
      setDeparture(undefined);
      setArrival(undefined);
      return;
    }

    const filteredClient = vatsimData?.find((client) => {
      return client.cid === Number(selectedClient);
    });

    const departureIcao = filteredClient?.flight_plan?.departure;
    const arrivalIcao = filteredClient?.flight_plan?.arrival;

    const departureAirport = airportsData?.airports.find((client) => {
      console.log(client.icao);
      return client.icao === departureIcao;
    });
    const arrivalAirport = airportsData?.airports.find((client) => {
      console.log(client.icao);
      return client.icao === arrivalIcao;
    });

    if (filteredClient) {
      setDeparture(departureAirport);
      setArrival(arrivalAirport);
    }
  }, [selectedClient, vatsimData, airportsData?.airports]);

  useEffect(() => {
    console.log(departure, arrival);
  }, [departure, arrival]);

  if (departure && arrival) {
    return (
      <>
        <CircleMarker
          center={[departure.latitude, departure.longitude]}
          radius={20}
        ></CircleMarker>
        <CircleMarker
          center={[arrival.latitude, arrival.longitude]}
          radius={20}
        ></CircleMarker>
      </>
    );
  } else {
    return null;
  }
};

export default Airports;
