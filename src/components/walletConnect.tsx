import React from "react";
import { useEthereum } from "./context/EthereumContext"; // Path to your context file

const WalletConnectButton: React.FC = () => {
  const { connected, address, handleConnect } = useEthereum();

  const connectWallet = async () => {
    const userAddress = await handleConnect();
    if (userAddress) {
        alert('Wallet connected:'+userAddress);
      console.error("Wallet connected:", userAddress);
    }
  };

  return (
    <div className="bg-[red]">
      {connected ? (
        <div>
            <p>Wallet connected</p>
          <p>Connected to: {address}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnectButton;
