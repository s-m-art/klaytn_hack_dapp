import Web3 from "web3";
import tictactoeABI from "../constants/tictactoe_abi.json";
import { TIC_TAC_TOE_CONTRACT_ADDRESS } from "../constants";

export const getGames = async () => {
  const web3 = new Web3(window.ethereum);
  const tictactoeContract = new web3.eth.Contract(
    tictactoeABI,
    TIC_TAC_TOE_CONTRACT_ADDRESS
  );
  const games = await tictactoeContract.methods.getGames().call();
  return games;
};

export const startGame = async (walletAddr, entryFee) => {
  const web3 = new Web3(window.ethereum);
  const tictactoeContract = new web3.eth.Contract(
    tictactoeABI,
    TIC_TAC_TOE_CONTRACT_ADDRESS
  );
  const result = await tictactoeContract.methods.startGame().send({
    from: walletAddr,
    value: web3.utils.toWei(entryFee, "ether"),
  });
  return result;
};

export const joinGame = async (walletAddr, gameId, entryFee) => {
  const web3 = new Web3(window.ethereum);
  const tictactoeContract = new web3.eth.Contract(
    tictactoeABI,
    TIC_TAC_TOE_CONTRACT_ADDRESS
  );
  const result = await tictactoeContract.methods.joinGame(gameId).send({
    from: walletAddr,
    value: web3.utils.toWei(entryFee, "ether"),
  });
  return result;
};

export const claimReward = async (walletAddr, amount) => {
  const web3 = new Web3(window.ethereum);
  const tictactoeContract = new web3.eth.Contract(
    tictactoeABI,
    TIC_TAC_TOE_CONTRACT_ADDRESS
  );
  const result = await tictactoeContract.methods.claimRewards(amount).send({
    from: walletAddr,
  });
  return result;
};
