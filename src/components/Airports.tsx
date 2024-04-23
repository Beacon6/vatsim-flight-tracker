import { VatsimAirports } from '../typings/VatsimData';
import { CircleMarker } from 'react-leaflet';

const Airports: React.FC<{ displayedAirports?: VatsimAirports['airports'] }> = (props) => {
  const { displayedAirports } = props;

  return (
    <>
      {displayedAirports?.map((item) => (
        <CircleMarker
          center={[item.latitude, item.longitude]}
          radius={4}
        ></CircleMarker>
      ))}
    </>
  );
};

export default Airports;
