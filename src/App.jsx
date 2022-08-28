import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ethers, BigNumber } from 'ethers';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import brain0 from "./assets/brain.webp";
import brain1 from "./assets/brain1.webp";

import logo0 from './assets/logo0.webp';

import twitterLogo from "./assets/twitter.webp"
import openseaLogo from "./assets/opensea.webp"
import discordLogo from "./assets/discord.webp"
import looksLogo from "./assets/looks.webp"
import termsLogo from "./assets/terms.webp"
import audioLogo from "./assets/audio.svg"

import music from "./assets/music.mp3";

import nft from "./assets/mosca1.webp"

import Icon from './components/Icon';

import abi from './constants/abi';

function App() {

  const [text, setText] = useState("Connect Wallet");
  const [isConnected, setIsConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("0x1c1a7c4332cA88F6e52ac63D058A67443E187F8e");
  const [networkId, setNetworkId] = useState('0x4');
  const [cost, setCost] = useState(6000000000000000);
  const [gasLimit, setGasLimit] = useState(285000);
  const [mintAmount, setMintAmount] = useState(1);
  const [freeMintedCount, setFreeMintedCount] = useState(0);
  const [pending, setPending] = useState(false);
  const [maxMintAmount, setMaxMintAmount] = useState(4);
  const [position, setPosition] = useState(window.scrollY)
  const [visible, setVisible] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const [isHover, setIsHover] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [warning, setWarning] = useState("");
  const [currentChainId, setCurrentChainId] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const [parent]  = useAutoAnimate({
    duration: 1000,
    delay: 0,
    ease: 'easeInOutQuad'
  });

  const connect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connected to Ethereum");
        setIsConnected(true);
        checkNetwork();
        if (currentChainId !== networkId) {
          await changeNetwork();
        }
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
      const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
      const count = await contract.freeMintedCount(signer.getAddress());
      setFreeMintedCount(count.toNumber());
    }
  }

  const listenForTxMined = async (txHash, provider) => {
    return new Promise((resolve, reject) => {
      provider.once(txHash, (txReceipt) => {
        resolve(txReceipt);
      }
      );
    }
    );
  }

  const changeNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networkId }]
    });
  }

  const checkNetwork = async () => {
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
    setCurrentChainId(currentChainId);
    if (currentChainId !== networkId) {
      setWarning("You are on the wrong network. Switch to the Ethereum Mainnet.");
    } else {
      setWarning("");
    }
  }

  const mint = async () => {
    if (isConnected) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const totalCost = BigNumber.from(cost).mul(BigNumber.from(mintAmount));
      const totalGas = BigNumber.from(gasLimit).mul(BigNumber.from(mintAmount));
      setPending(true);
      const txToast = toast.loading(`Minting...`);
      blinkBrain();
      await contract.mint_540(mintAmount, {
        gasLimit: totalGas.toString(),
        value: freeMintedCount !== 0 ? totalCost : BigNumber.from(totalCost).sub(cost).toString()
      }).then((tx) => {
        listenForTxMined(tx.hash, provider).then(() => {
          console.log(tx);
          toast.update(txToast, {
            render: <div>Welcome to the Brain Network!</div>,
            icon: "🧠",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          setPending(false);
        }
        ).catch((error) => {
          toast.update(txToast, {
            render: <div>Error: {error.message}</div>,
            type: "error",
            isLoading: false,
            autoClose: 3000
          });
          setPending(false);
        }
        );
      }
      ).catch(error => {
        console.log(error);
        toast.update(txToast, {
          render: <div>Error: {error.message}</div>,
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
        console.log(error);
        setPending(false);
      }
      );
    }
  }

  const blinkBrain = () => {
    setTimeout(() => {
      console.log("blink");
      if (opacity === 0) {
        setOpacity(1);
        console.log("opacity: " + opacity);
      } else {
        setOpacity(0);
        console.log("opacity: " + opacity);
      }
      console.log(pending);
      if (pending) {
        blinkBrain();
      } else {
        // break the loop
        clearTimeout(blinkBrain);
      }
    }
      , 1200);
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

  // const playAudio = () => {
  //   const audio = new Audio("/music.mp3");
  //   audio.play().then(() => {
  //     console.log("Audio played");
  //     setIsAudio(true);
  //   }
  //   ).catch(error => {
  //     console.log(error);
  //   }
  //   );
  // };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setPosition(window.scrollY);
    }
    );
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    }
    );
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        checkNetwork();
      }
      );
    }

    return () => {
      window.removeEventListener('scroll', () => {
        setPosition(window.scrollY);
      }
      );
      window.removeEventListener('resize', () => {
        setWidth(window.innerWidth);
      }
      );
    }
  }
  );

  useEffect(() => {
    if (position > 50) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    // if (position > 10 && !isAudio) {
    //   playAudio();
    // }
  }
    , [position]);

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
    <div className="App" ref={parent}>
      {!isClicked ? (
        <div className="App-header">
          <div className="App-header-text">
            <h1>Welcome to the Brain Network!</h1>
          <button onClick={() => { setIsClicked(true); }} className="button-connected">
            <span>Enter</span>
          </button>
          </div>
        </div>
      ) : (
        <div className="App-intro">
          <audio src="/music.mp3" autoPlay={true} loop={true} />
          <div className={`navbar ${width <= 1750 && !visible ? "hidden" : "visible"}`}>
            <Icon link="https://twitter.com" icon={twitterLogo} name="twitter" />
            <Icon link="https://discord.com" icon={discordLogo} name="discord" />
            <Icon link="https://opensea.io" icon={openseaLogo} name="opensea" />
            <Icon link="https://looksrare.org" icon={looksLogo} name="looks" />
            {/* <Icon link="" icon={termsLogo} name="terms" /> */}
          </div>
          <header className="App-header">
            <div id="cf">
              <img className="top" src={brain0} alt="brain0" />
              <img className="bottom" src={brain1} alt="brain1" />
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
                <img className="logo" src={logo0} alt="logo" />
              </div>
            )}
            <button onClick={isConnected ? mint : connect} className={isConnected ? "button-connected" : "button"} disabled={isConnected ? (networkId === currentChainId ? 0 : 1) : 0}>{text}</button>
            <p> {warning} </p>
          </header>
          <div className="content">
            <div className="content-left">
              <img className={isHover ? "nft-hover" : "nft"} src={nft} alt="nft" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} />
            </div>
            <div className="content-right">
              <h3 className='title'> Welcome to Brain Network 🧠 </h3>
              <p className='text'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
          </div>
          <ToastContainer
            position="top-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      )}
    </div>
  );
}

export default App;
