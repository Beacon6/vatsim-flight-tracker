import ProgressBar from 'react-bootstrap/ProgressBar';

const Navbar: React.FC<{
  pilotsCount?: number;
  atcCount?: number;
  timer: number;
}> = (props) => {
  const { pilotsCount, atcCount, timer } = props;

  return (
    <>
      <nav className='nav'>
        <a href='/' className='home'>
          ADS-B Flight Tracker
        </a>
        Pilots connected: {pilotsCount} | ATC connected: {atcCount}
        <ul>
          <ProgressBar variant='info' striped min={-15} max={-1} now={-timer} />
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
