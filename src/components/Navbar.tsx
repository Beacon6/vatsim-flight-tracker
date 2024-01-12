import ProgressBar from 'react-bootstrap/ProgressBar';

const Navbar: React.FC<{
  countTotal?: number;
  countView?: number;
  timer: number;
}> = (props) => {
  const { countTotal, countView, timer } = props;

  return (
    <>
      <nav className='nav'>
        <a href='/' className='home'>
          ADS-B Flight Tracker
        </a>
        Tracking {countTotal} aircraft - {countView} currently in view
        <ul>
          <ProgressBar variant='info' striped min={-15} max={-1} now={-timer} />
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
