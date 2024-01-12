import ProgressBar from 'react-bootstrap/ProgressBar';

const Navbar: React.FC<{
  countTotal?: number;
  countView?: number;
  variant: string;
  timer: number;
}> = (props) => {
  const { countTotal, countView, variant, timer } = props;

  return (
    <>
      <nav className='nav'>
        <a href='/' className='home'>
          ADS-B Flight Tracker
        </a>
        Tracking {countTotal} aircraft - displaying {countView}
        <ul>
          <ProgressBar
            variant={variant}
            striped
            min={-15}
            max={-1}
            now={-timer}
          />
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
