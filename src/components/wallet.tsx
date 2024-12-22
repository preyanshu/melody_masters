import { useState, useEffect } from 'react';
import { WalletTgSdk } from '@uxuycom/web3-tg-sdk';

const { ethereum } = new WalletTgSdk();

const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        let accounts = await ethereum.request({ method: 'eth_accounts' });

        console.error("accounts", accounts);
        if (!accounts[0]) {
          await ethereum.request({ method: 'eth_requestAccounts' });
        }

        console.log("accounts", accounts);

        // Get the current account and chain ID
        const currentChainId = await ethereum.request({ method: 'eth_chainId' });
        accounts = await ethereum.request({ method: 'eth_accounts' });
        const currentAddress = accounts[0];

        // console.log("currentChainId", currentChainId);

        // Set the account and chain ID in state
        setAddress(currentAddress);
        setChainId(currentChainId);

        // // Automatically switch to Binance Smart Chain Testnet if not already on it
        if (currentChainId !== '0x61') {
          await switchToBSC();
        }

        // Set up event listeners for account and chain changes
        ethereum.removeAllListeners();
        ethereum.on('accountsChanged', (accounts: string[]) => {
          setAddress(accounts[0]);
          console.log('Active account changed:', accounts[0]);
        });
        ethereum.on('chainChanged', (changedChainId: string) => {
          setChainId(changedChainId);
          console.log('Network changed to:', changedChainId);
        });
      } catch (error) {
        console.error('Error initializing wallet:', error);
      }
    };

    initializeWallet();

    // Cleanup listeners on component unmount
    return () => {
      ethereum.removeAllListeners();
    };
  }, []);

  const switchToBSC = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
      console.log('Switched to Binance Smart Chain');
      setChainId('0x61');
    } catch (error: any) {
      if (error.code === '4902') {
        // If BSC is not added, proceed to add it
        await addBinanceSmartChain();
      } else {
        console.error('Error switching to BSC:', error);
      }
    }
  };

  const addBinanceSmartChain = async () => {
    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x61', // Chain ID 97 in hex is 0x61
            chainName: 'BNB Chain Testnet',
            rpcUrls: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
            nativeCurrency: {
              name: 'tBNB',
              symbol: 'tBNB',
              decimals: 18,
            },
            blockExplorerUrls: ['https://testnet.bscscan.com'],
          },
        ],
      });
      setChainId('0x61');
      console.log('BNB Chain Testnet with tBNB added to MetaMask');
    } catch (error) {
      alert('Error adding BNB Chain Testnet: ' + JSON.stringify(error));
      console.error('Error adding BNB Chain Testnet:', error);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setChainId(null);
    ethereum.request({
      method: 'eth_requestAccounts', // Disconnect by clearing account data
      params: [],
    }).catch((error) => {
      console.error('Error disconnecting wallet:', error);
    });
  };

  return { address, chainId, switchToBSC, disconnectWallet, ethereum };
};

export default useWallet;
