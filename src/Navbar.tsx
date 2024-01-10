import ProgressBar from 'react-bootstrap/ProgressBar';

interface NavbarProps {
  countTotal: number;
  countView: number;
  variant: string;
  timer: number;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { countTotal, countView, variant, timer } = props;

  return (
    <>
      <nav className='nav'>
        <a href='/' className='home'>
          ADS-B Flight Tracker
        </a>
        Tracking {countTotal} aircraft - displaying {countView}
        <ul>
          <ProgressBar variant={variant} striped min={-30} max={-1} now={-timer} />
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
