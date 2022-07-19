import React, { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { ethers } from 'ethers';

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

import nft from "./assets/mosca1.jpeg"

import music from "./assets/music.mp3";

import Icon from './components/Icon';

import abi from './constants/abi';

function App() {

  const [text, setText] = useState("Connect Wallet");
  const [isConnected, setIsConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("0x1c1a7c4332cA88F6e52ac63D058A67443E187F8e");
  const [network, setNetwork] = useState(4);
  const [cost, setCost] = useState(6000000000000000);
  const [gasLimit, setGasLimit] = useState(285000);
  const [mintAmount, setMintAmount] = useState(1);
  const [freeMintedCount, setFreeMintedCount] = useState(0);
  const [pending, setPending] = useState(false);
  const [maxMintAmount, setMaxMintAmount] = useState(4);

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

  const getFreeMintedCount = async () => {
    if (isConnected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
      const count = await contract.freeMintedCount(signer.getAddress());
      console.log(count);
      setFreeMintedCount(count);
    }
  }

  const mint = async () => {
    if (isConnected) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const totalCost = cost * mintAmount;
        const totalGas = gasLimit * mintAmount
        setPending(true);
        await contract.mint_540(mintAmount, {
          gasLimit: gasLimit,
          value: freeMintedCount !== 0 ? totalCost : totalCost - cost
        }).then(() => {
          console.log("Minted");
        }
        ).catch(error => {
          console.log(error);
        }
        );
    }
  }

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > maxMintAmount) {
      newMintAmount = maxMintAmount;
    }
    setMintAmount(newMintAmount);
  };

  useEffect(() => {
    if (isConnected) {
      setText("Mint now");
    }
  }, [isConnected]);

  useEffect(() => {
    getFreeMintedCount();
  }
  , [isConnected, pending]);

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
        {isConnected ? (
          <div className="mint-text">
            <h3>FREE mint now live</h3>
            <p> Mint 1 free / First 2500 are free / Mint price is 0.008 ETH </p>
            <div className="mint-amount">
              <button disabled={mintAmount === 1 ? 1 : 0} onClick={decrementMintAmount} className="button-change">-</button>
              <p className="mint-value">{mintAmount}</p>
              <button disabled={mintAmount === maxMintAmount ? 1 : 0} onClick={incrementMintAmount} className="button-change">+</button>
            </div>
          </div>
        ) : (
          <div className="image">
            <img className="logo" src={logo0} alt="logo"/>
          </div>
        )}
        <button onClick={isConnected ? mint : connect} className= { isConnected ? "button-connected" : "button" }>{text}</button>
        {/* <audio src={music} autoPlay loop /> */}
      </header>
      <div className="content">
        <div className="content-left">
          <img className="nft" src={nft} alt="nft"/>
        </div>
        <div className="content-right">
          <h3 className='title'> Welcome to Brain Network! </h3>
          <p className='text'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          <button className="learn"> Learn more </button>
        </div>
      </div>  
    </div>
  );
}

export default App;
