import Offcanvas from 'react-bootstrap/Offcanvas';
import { VatsimData } from '../App';

interface PanelProps {
  show: boolean;
  onHide: () => void;
  selectedClient?: VatsimData;
}

const Panel: React.FC<PanelProps> = (props) => {
  const { show, onHide, selectedClient } = props;

  return (
    <>
      <Offcanvas show={show} onHide={onHide} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {selectedClient?.vatsim_data.pilots[6].callsign}
          </Offcanvas.Title>
        </Offcanvas.Header>
      </Offcanvas>
    </>
  );
};

export default Panel;
