import { AirportInterface } from '../typings/AirportsInterface.ts';
import { CircleMarker } from 'react-leaflet';

const Airports: React.FC<{
  departure?: AirportInterface;
  arrival?: AirportInterface;
  isActive: boolean;
}> = (props) => {
  const { departure, arrival, isActive } = props;

  if (isActive && departure && arrival) {
    return (
      <>
        <CircleMarker
          center={[departure.latitude, departure.longitude]}
          radius={4}
        ></CircleMarker>
        <CircleMarker
          center={[arrival.latitude, arrival.longitude]}
          radius={4}
        ></CircleMarker>
      </>
    );
  } else {
    return null;
  }
};

export default Airports;
