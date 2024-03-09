import { Marker } from 'react-leaflet';
import { icon } from 'leaflet';
import 'leaflet-rotatedmarker';
import { VatsimData, VatsimPilot } from '../typings/VatsimData';

const Aircraft: React.FC<{
  visibleAircraft?: VatsimData['pilots'];
  onClick: (selected: VatsimPilot['vatsimPilot']) => void;
}> = (props) => {
  const { visibleAircraft, onClick } = props;

  const airplaneIcon = icon({
    iconUrl: '../assets/airplane-dark.svg',
    iconSize: [24, 24],
  });

  return (
    <>
      {visibleAircraft?.map((item) => (
        <Marker
          icon={airplaneIcon}
          position={[item.latitude, item.longitude]}
          key={item.cid}
          rotationAngle={item.heading}
          eventHandlers={{
            click: () => onClick(item),
          }}
        ></Marker>
      ))}
    </>
  );
};

export default Aircraft;
