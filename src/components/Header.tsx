import { Navbar } from 'react-bootstrap';

const Header: React.FC<{
  pilotsCount?: number;
  atcCount?: number;
}> = (props) => {
  const { pilotsCount, atcCount } = props;

  return (
    <>
      <Navbar>
        <a href='/'>VATSIM Flight Tracker</a>
        <span>
          <img src='../assets/flights-light.svg' height={32} width={32} />
          Pilots connected: {pilotsCount} |{' '}
          <img src='../assets/radar-light.svg' height={32} width={32} /> ATC
          connected: {atcCount}
        </span>
      </Navbar>
    </>
  );
};

export default Header;
