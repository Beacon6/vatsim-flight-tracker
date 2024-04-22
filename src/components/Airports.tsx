import { VatsimAirports } from '../typings/VatsimData';
import { CircleMarker } from 'react-leaflet';

const Airports: React.FC<{ airportsData?: VatsimAirports }> = (props) => {
  const { airportsData } = props;

  return (
    <>
      {airportsData?.airports
        .slice(0, 1000)
        .map((item) => (
          <CircleMarker
            center={[item.latitude, item.longitude]}
            radius={10}
          ></CircleMarker>
        ))}
    </>
  );
};

export default Airports;
