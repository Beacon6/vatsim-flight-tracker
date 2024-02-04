import Offcanvas from 'react-bootstrap/Offcanvas';
import { VatsimPilot } from '../App';

interface PanelProps {
  show: boolean;
  onHide: () => void;
  selectedClient?: VatsimPilot['vatsimPilot'];
}

const Panel: React.FC<PanelProps> = (props) => {
  const { show, onHide, selectedClient } = props;

  return (
    <>
      <Offcanvas show={show} onHide={onHide}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{selectedClient?.callsign}</Offcanvas.Title>
        </Offcanvas.Header>
      </Offcanvas>
    </>
  );
};

export default Panel;
