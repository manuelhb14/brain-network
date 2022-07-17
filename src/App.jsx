import React, { useState, useEffect } from 'react';

import './App.css';

import brain0 from "./assets/brain.png";
import brain1 from "./assets/brain1.png";

import logo0 from './assets/logo0.png';

import twitterLogo from "./assets/twitter.png"
import openseaLogo from "./assets/opensea.png"
import discordLogo from "./assets/discord.png"
import looksLogo from "./assets/looks.png"
import termsLogo from "./assets/terms.png"
import audioLogo from "./assets/audio.svg"

import Icon from './components/Icon';

function App() {

  const [text, setText] = useState("Connect Wallet");
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connected to Ethereum");
        setIsConnected(true);
      } catch (error) {
        console.log("User denied account access");
        setIsConnected(false);
      }
    }
  }

  useEffect(() => {
    if (isConnected) {
      setText("Connected");
    }
  }, [isConnected]);

  return (
    <div className="App">
        <div className="navbar">
          <Icon link="https://twitter.com" icon={twitterLogo} name="twitter" />
          <Icon link="https://discord.com" icon={discordLogo} name="discord" />
          <Icon link="https://opensea.io" icon={openseaLogo} name="opensea" />
          <Icon link="https://looksrare.org" icon={looksLogo} name="looks" />
        </div>
      <header className="App-header">
        <div id="cf">
          <img className="top" src={brain0} alt="brain0"/>
          <img className="bottom" src={brain1} alt="brain1"/>
        </div>
          <img className="logo" src={logo0} alt="logo"/>
        <button onClick={connect} className="button">
          {text}
        </button>
      </header>
    </div>
  );
}

export default App;
