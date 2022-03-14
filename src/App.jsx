import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import Particles from "react-tsparticles";
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xF119D1Eb3FD658ca488F957Eac7300bDc25c7B24";
  const contractABI=abi.abi;
  let wavesCleaned = [];
  //getMessages();
  
  const getMessages = async() =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();
    waves.forEach(wave => {
          wavesCleaned.unshift({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
    setAllWaves(wavesCleaned);
  }
  const wave = async (message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();
        //original get messages
        const waveTxn = await wavePortalContract.wave(message,{ gasLimit: 300000 });
         console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        getMessages();
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        getMessages();
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        window.alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(event) {
      wave(this.state.value);
      event.preventDefault();
    }

    render() {
      return (
        <div>
        <form>
          <label>
            Message:
            <input className="input" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <button className="waveButton" onClick={this.handleSubmit} >
            Wave at me
          </button>
        </form>
        </div>
      )
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="container">
    <Particles 
            params={{
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 2000
                        }
                    },
                    color: {
                        value: '#000000'
                    },
                    opacity: {
                        value: 0.5,
                        anim: {
                            enable: true
                        }
                    },
                    size: {
                        value: 1,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 3
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 300,
                        color: '#000000',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
      
                    },
                 },
              interactivity: {
                    detect_on: 'window',
                    events:{
                      onClick:{
                        enable: true,
                        mode : 'push'
                      },
                    },
                    modes:{
                      push: {
                        quantity: 4,
                      },
                    }
                    
                  }
            }}    
        />
          
    <div className="mainContainer">
      
      <div className="dataContainer">
        <div className="header">
        🐼 Hey there!
        </div>

        <div className="bio">
        I am Yash
        </div>
        
        {currentAccount && (<NameForm/>)}
        <br/>
        {!currentAccount && (
      
          <button className="connectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
      {currentAccount && <div className="seperatorContainer">Messages</div>}
      <div className="messageDisplay">
        {currentAccount && 
          
          allWaves.map((wave, index) => {
          return (
            <div key={index} className="messageContainer">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })
          
        }
      </div>
      
    </div>
    </div>
    
  );
}

