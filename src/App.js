import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }


class App extends Component{

  state = {manager:'', players:[], balance:'', value:'', message:''}

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager, players, balance});
  };

  onSubmit = async (event) =>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message:'Waiting on transaction success...'});

    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(this.state.value,'ether')
    });

    this.setState({message:'You have been entered!'});
  };

  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts();

    this.setState({message:'Waiting on transaction success...'});

    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });

    this.setState({message:'A winner has been picked!'});
  };

  render(){
      return (
   <div>
     <h2>Lottey Contract</h2>
      <p>this contract manager is by {this.state.manager}.
      There are currently {this.state.players.length} people entered, competing to win { web3.utils.fromWei(this.state.balance, 'ether')} ether!
      </p>
      <hr/>
      <form onSubmit={this.onSubmit}> 
        <h4>Want to try your luck</h4>
          <div>
            <label>Amount of ether to ether</label>
            <input
              value={this.state.value} 
              onChange={event => this.setState({value:event.target.value}) }>
            </input>
          </div>
          <button>Enter</button>
      </form>
      <hr/>
      <h4>Ready to pick a winner</h4>
      <button onClick={this.onClick}>Pick a winner</button>

      <hr/>
      <h1>{this.state.message}</h1>
   </div>



  );
  };
}

// class App extends Component {
//   state = { loaded: false,kycAddress: "0x123", tokenSaleAddress: "", tokenAddress:"",userTokens: 0 };

//   componentDidMount = async () => {
//     try {
//       this.isInstalled();
//       // Get network provider and web3 instance.
//       this.web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       this.accounts = await this.web3.eth.getAccounts();

//       // Get the contract instance.
//       this.networkId = await this.web3.eth.net.getId();
      
//       this.myToken = new this.web3.eth.Contract(
//         MyToken.abi,
//         MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
//       );

//       this.myTokenSale = new this.web3.eth.Contract(
//         MyTokenSale.abi,
//         MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
//       );

//       this.kycContract = new this.web3.eth.Contract(
//         KycContract.abi,
//         KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
     
//       this.listenToTokenTransfer();
//       this.setState({ loaded:true, tokenSaleAddress: this.myTokenSale._address, tokenAddress:this.myToken._address }, this.updateUserTokens);
//       } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // Stores a given value, 5 by default.
//     await contract.methods.set(5).send({ from: accounts[0] });

//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();

//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };

//   handleInputChange = (event) => {
//     const target = event.target;
//     const value = target.type === "checkbox" ? target.checked : target.value;
//     const name = target.name;
//     this.setState({
//     [name]: value
//     });
//   };

//   handleKycSubmit = async () => {
//     const {kycAddress} = this.state;
//     await this.kycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0
//     ]});
//     alert("Account "+ kycAddress +" is now whitelisted");
//   };

//   handleBuyToken = async () => {
//     await this.myTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1});
//     };

//     updateUserTokens = async() => {
//       let userTokens = await this.myToken.methods.balanceOf(this.accounts[0]).call();
//       this.setState({userTokens: userTokens});
//       };

//     listenToTokenTransfer = async() => {
//       this.myToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
//     };

//     isInstalled() {
//       if (typeof web3 !== 'undefined'){
//          console.log('MetaMask is installed')
//       } 
//       else{
//          console.log('MetaMask is not installed')
//       }
//    };




//   render() {
//     if (typeof web3 === 'undefined'){
//       return <div>This page requires MetaMask. Please visit <a href="https://metamask.io/">metamask.io</a> for download.</div>;
//    }

//     if (!this.state.loaded) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//       <h1>Capuccino Token for StarDucks</h1>
//       <h2>Enable your account</h2>
//       Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
//       <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelist</button>
//       <h2>Buy Cappucino-Tokens</h2>
//     <p>Send Ether to this address: {this.state.tokenSaleAddress}</p>
//     <p>You have: {this.state.userTokens}</p>
//     <p>add tokens to your wallet {this.state.tokenAddress}</p>

// <button type="button" onClick={this.handleBuyToken}>Buy more tokens</button>
//       </div>
//     );
//   }
// }


export default App;



