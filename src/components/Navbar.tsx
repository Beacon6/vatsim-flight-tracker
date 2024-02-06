const Navbar: React.FC<{
  pilotsCount?: number;
  atcCount?: number;
}> = (props) => {
  const { pilotsCount, atcCount } = props;

  return (
    <>
      <nav className='navbar'>
        <a href='/'>VATSIM Flight Tracker</a>
        Pilots connected: {pilotsCount} | ATC connected: {atcCount}
      </nav>
    </>
  );
};

export default Navbar;
