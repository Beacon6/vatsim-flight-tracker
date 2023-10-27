function Navbar(props) {
  return <nav className="nav">
    <a href="/" className="home">
      ADS-B Flight Tracker
    </a>
    <ul>
      <li>
        <p>
          Currently tracking {props.count} aircraft
        </p>
      </li>
      <li>
        <p>
          Next refresh in {props.timer} seconds
        </p>
      </li>
    </ul>
  </nav>
}

export default Navbar;
