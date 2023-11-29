import { ProgressBar } from "react-bootstrap";

function Navbar(props) {
  return <nav className="nav">
    <a href="/" className="home">
      ADS-B Flight Tracker
    </a>
    <p> Tracking {props.countTotal} aircraft - {props.countView} within view - displaying {props.countDisplayed} </p>
    <ul>
      <ProgressBar variant={props.variant} striped min={-30} max={-1} now={-props.timer} />
    </ul>
  </nav>
}

export default Navbar;
