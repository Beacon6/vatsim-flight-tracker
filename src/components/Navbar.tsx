const Navbar: React.FC<{
  pilotsCount?: number;
  atcCount?: number;
}> = (props) => {
  const { pilotsCount, atcCount } = props;

  return (
    <>
      <nav className='navbar'>
        <a href='/'>VATSIM Flight Tracker</a>
        <span>
          <img src='../assets/flights-light.svg' />
          Pilots connected: {pilotsCount} |{' '}
          <img src='../assets/radar-light.svg' /> ATC connected: {atcCount}
        </span>
      </nav>
    </>
  );
};

export default Navbar;
