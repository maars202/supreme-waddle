import BcExplorer from './BcExplorer'
import UsersContract from '../assets/Users.json';
import Web3 from 'web3'

export default {
    data() {
        return {
            bcConnected: false, // true when the connection with the blockchain is established, plus the contract ABI + address is correctli initialized
            bcConnectionError: false,
            errorConnectionMessage: null,
            bcSmartContractAddressError: false
        }
    },

    created() {
        this.init();
    },

    methods: {
        /**
         * Initialize the BcExplore object (this means the connection with the
         * blockchin and initialise the contracts).
         *
         * @return {void}
         */
        init() {
            // https://forum.openzeppelin.com/t/remix-uncaught-error-invalid-address/3029/3
            window.ethereum.enable();


            // when this file is imported to other component it checks if the BcExplorer
            // is instatiated.
            if (window.bc == undefined) {
                window.bc = new BcExplorer;

                // connecting to the blockchain and intializing the Users smart contract
                window.bc.initWithContractJson(UsersContract, 'http://127.0.0.1:7545')
                .then(async (error) => {
                    // handling the connection error
                    if (error) {
                        this.bcConnected = false;

                        this.showConnectionErrorMessage(error);
                    } else {
                        // calling a smart contract function in order to check the contract address
                        // is correct. NOTE: here you might be connected successfully.
                        // TODO: the check of the smart contract address validity it should be BcExplorer duty
                        console.log("[logs] going into method: isRegistered()")
                        // this.isRegistered()
                        this.getGreeting()

                        this.setGreeting("HIIIII NEW GREETING!")
                        await new Promise(r => setTimeout(r, 8000));
                        
                        this.getGreeting()
                        .then(res => {
                            this.bcConnectionError = false;
                            this.bcConnected = this.blockchainIsConnected();
                        })
                        .catch(error => {
                            this.showConnectionErrorMessage(error);
                            this.bcSmartContractAddressError = true;
                        });
                    }
                })
                .catch(error => this.showConnectionErrorMessage(error));
            } // end if (window.bc == undefined)
        },

        /**
         * Check if the user is registered.
         *
         * @return {Promise}
         */
        // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
        // copied from dappuni:
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider
      web3 = new Web3(Web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        Web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
        console.log("ethereum.enable() failed")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
},

        isRegistered() {
            return new Promise((resolve, reject) => {
                window.bc.getMainAccount()
                .then(account => {
                    console.log("!!![logs]: getting account: ", account)
                    console.log("[logs]: window.bc.contract(): ", window.bc.contractInst["Users"])
                    // Web3.utils.isAddress(account)
                    // console.log("!!![logs]: checking is address is valid by web3 lib: ", Web3.utils.isAddress(account))
                    
                    console.log("[logs]: loadWeb3 started")
                    this.loadWeb3()
                    console.log("[logs]: loadWeb3 ended")

                    console.log("!!![logs]Web3", window.bc.web3())
                    // window.bc.contract("Users").isRegistered({ from: account }, (error, res) => {
                    //     if (error) reject(error);

                    //     resolve(res);
                    // });
                    // window.bc.contractInst["Users"].setProvider(this.web3Provider)


                    // ok successfully calls if the account string is set as checksum -- check with etherscan:
                    // window.bc.contractInst["Users"].greet({from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}, (error, res) => {
                    //         if (error) reject(error);
                    //         console.log("greeting res: ", res)
                    //         // this.greetingVal = 
                    //         resolve(res);
                    //     })

                })
                .catch(error => reject(error));
            });
        },


        getGreeting() {
            window.bc.getMainAccount()
            .then(account => {
                window.bc.contractInst["Users"].greet({from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}, (error, res) => {
                    // if (error) reject(error);
                    if (error){
                        return
                    }
                    console.log("greeting response: ", res)
                    // this.greetingVal =
                    return res
                })
            })    
        },

        setGreeting(greeting) {
            window.bc.getMainAccount()
            .then(account => {
                window.bc.contractInst["Users"].setGreeting(greeting , {from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}, (error, res) => {
                    // if (error) reject(error);
                    if (error){
                        return
                    }
                    console.log("greeting res: ", res)
                    // this.greetingVal =
                    return res
                })
            })    
        },

        /**
         * Show the conntection error message on top of the main content.
         *
         * @param {object} error|null
         * @return {void}
         */
        showConnectionErrorMessage(error=null) {
            this.bcConnectionError = true;

            if (error) console.log(error);

            if (error && error.message) {
                this.errorConnectionMessage = error.message;
            }
        },

        /**
         * Check if the connection with the blockchain is established and if the smart
         * contract ABI + address are correctly initialized.
         *
         * @return {boolean}
         */
        blockchainIsConnected() {
            this.bcConnected = ((window.bc != undefined) && window.bc.isConnected());

            return this.bcConnected;
        },

        /**
         * Transform the parameter from bytes to string.
         *
         * @param {string} bytesStr
         * @return {string}
         */
        toAscii(bytesStr) {
            return window.bc.toAscii(bytesStr);
        },

        /**
         * Transform a timestamp number to date.
         *
         * @param {numeric} bytesStr
         * @return {string}
         */
        toDate(timestamp) {
            return new Date(timestamp * 1000).toISOString();
        }
    }
}