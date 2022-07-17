import './App.css';

import brain0 from "./assets/brain.png";
import brain1 from "./assets/brain1.png";

// import logo0 from './assets/logo0.png';
import logo1 from './assets/logo1.png';

import twitterLogo from "./assets/twitter-circle.svg"
import openseaLogo from "./assets/opensea.svg"
import audioLogo from "./assets/audio.svg"

function App() {
  return (
    <div className="App">
        <div className="navbar">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <img className="icon" src={twitterLogo} alt="Twitter logo" />
          </a>
          <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer">
            <img className="icon" src={openseaLogo} alt="Opensea logo" />
          </a>
          <img className="icon" src={audioLogo} alt="Audio logo" />
        </div>
      <header className="App-header">
        <div id="cf">
          <img className="top" src={brain0} alt="brain0"/>
          <img className="bottom" src={brain1} alt="brain1"/>
        </div>
          <img className="logo" src={logo1} alt="logo"/>
        <button className="mint">
          Connect
        </button>
      </header>
    </div>
  );
}

export default App;
