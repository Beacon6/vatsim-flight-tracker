import logo from './logo.svg';
import './App.css';
import { Map } from "pigeon-maps"
import { maptiler } from 'pigeon-maps/providers'

const maptilerProvider = maptiler('KR6OCyEjZD3WgFTla3Rv', 'dataviz')

export function MyMap() {
  return (
    <div style={{height: '100vh'}}>
    <Map
    provider={maptilerProvider}
    dprs={[1, 2]} // this provider supports HiDPI tiles
    defaultCenter={[50, 10]}
    defaultZoom={6}
  />
  </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default MyMap;
