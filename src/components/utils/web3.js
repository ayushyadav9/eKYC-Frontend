import Web3 from "web3";
// import { abi as DMR_ABI } from "./KYC.json";
// import { networks } from "./KYC.json";
import abi from "./contractABI";

async function InitialiseWeb3() {
  await window.ethereum.enable();
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const accounts = await web3.eth.getAccounts();
  // const netId = await web3.eth.net.getId();
  // const DMR = await new web3.eth.Contract(DMR_ABI, networks[netId].address);
  const DMR = await new web3.eth.Contract(
    abi,
    "0xCb153e1A5211a16FDCB1c0BD77CD4D87b0c450bB"
  );
  return [DMR, accounts];
}

export default InitialiseWeb3;
