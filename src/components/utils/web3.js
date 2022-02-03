import Web3 from "web3";
import abi from "./contractABI";

async function InitialiseWeb3() {
  await window.ethereum.enable();
  const web3 = new Web3(
    Web3.givenProvider ||
      "https://polygon-mumbai.g.alchemy.com/v2/iiKsERYL7jzR-WQFV3P4tIRTbgbRXw3z"
  );
  const accounts = await web3.eth.getAccounts();
  const DMR = await new web3.eth.Contract(
    abi,
    "0xc94ca51Fc9ae6094bbDB1c3a72B3eBae183FdFFB"
  );
  return [DMR, accounts];
}

export default InitialiseWeb3;
