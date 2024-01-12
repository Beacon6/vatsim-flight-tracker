import { Marker } from 'react-leaflet';
import { VatsimData } from '../App';
import { icon } from 'leaflet';

const Aircrafts: React.FC<{ vatsimData?: VatsimData }> = (props) => {
  const { vatsimData } = props;

  const airplaneIcon = icon({
    iconUrl: '../public/assets/airplane.png',
    iconSize: [24, 24],
  });

  return (
    <>
      {vatsimData?.aircraft_data.pilots.map((item: any) => (
        <Marker
          icon={airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
        ></Marker>
      ))}
    </>
  );
};

export default Aircrafts;
