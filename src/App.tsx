
import useWallet from './components/wallet'
import { ethers } from 'ethers'
// import "index.css"



const App = () => {

  const { address, chainId,  ethereum} = useWallet();

  const isConnected = ethereum.isConnected();

  async function interactWithContract() {
    try {
      // Request account access if needed
      await ethereum.request({ method: 'eth_requestAccounts' });
  
      // Create an ethers provider
      const provider = new ethers.BrowserProvider(ethereum);
  
      // Get the signer
      const signer = await provider.getSigner();
  
      // Define the contract ABI and address
      const contractABI = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_interval",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "depositor",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "FundsDeposited",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "submitter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "musicUrl",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "theme",
              "type": "string"
            }
          ],
          "name": "SubmissionAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "submissionIndex",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "reward",
              "type": "uint256"
            }
          ],
          "name": "VoterRewarded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "winner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "musicUrl",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "theme",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "votes",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            }
          ],
          "name": "WinnerSelected",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "SUBMISSION_FEE",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "checkUpkeep",
          "outputs": [
            {
              "internalType": "bool",
              "name": "upkeepNeeded",
              "type": "bool"
            },
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "currentTheme",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getSubmissions",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "submitter",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "musicUrl",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "theme",
                  "type": "string"
                }
              ],
              "internalType": "struct MusicContest.SubmissionOverview[]",
              "name": "",
              "type": "tuple[]"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getWinners",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "submitter",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "musicUrl",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "theme",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "prompt",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "votes",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "payout",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
                }
              ],
              "internalType": "struct MusicContest.Winner[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "interval",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "lastTimeStamp",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "performUpkeep",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "processContest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_musicUrl",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_theme",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_prompt",
              "type": "string"
            }
          ],
          "name": "submitMusic",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalFunds",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_submissionIndex",
              "type": "uint256"
            }
          ],
          "name": "vote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
      const contractAddress = '0x3aF5aE5072a454e12444aE098D3a9239993F8DcB'; 
  
      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Interact with the contract
      const fee = ethers.parseEther("0.02"); 
      console.error('fee:', fee);
      const submissionFee = await contract.submitMusic('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Rick Roll', 'Rick Roll', {value: 20000000000000000});
      const receipt = await submissionFee.wait();



      alert(`Submission fee: ${receipt}`);
  
     
    } catch (error) {
      console.error('Error interacting with contract:', error);
    }
  }


  return (
    <div className='bg-[#27244A] h-screen w-screen flex justify-center items-center'>

      <div className='bg-[#160032] h-full max-h-[800px] w-full max-w-[500px]'>

      <div>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded w-full mt-2 text-lg"
        onClick={interactWithContract}

      >
        {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
      </button>
      {isConnected && <p className="mt-2" >Connected to chain ID: {chainId}</p>}
    </div>

        

      </div>




    </div>
  )
}

export default App