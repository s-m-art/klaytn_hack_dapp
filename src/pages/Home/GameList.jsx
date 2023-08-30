import React, { useState } from 'react'
import { Typography, Box } from '@mui/material';
import Web3 from 'web3';
import { GameTableContainer } from './index.style';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getShortenAddress } from '../../utils';
import { useAccount, useContractWrite, useContractEvent, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { TIC_TAC_TOE_CONTRACT_ADDRESS, TYPE_LIST } from '../../constants';
import contractAbi from '../../constants/tictactoe_abi.json';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const GameList = ({ title, data, type }) => {
  const web3 = new Web3(window.ethereum);

  const { address } = useAccount();
  const navigate = useNavigate();
  const [gameConfig, setGameConfig] = useState({
    isJoining: false,
    gameId: null,
    entryFee: null,
  });
  const debouncedGameConfig = useDebounce(gameConfig);

  const renderAction = (game) => {
    switch (type) {
      case TYPE_LIST.CURRENT: return {
        header: 'Action',
        label: 'View',
        action: () => {
          onViewGame(game.gameId.toString());
        },
        isClickable: true
      }
      case TYPE_LIST.AVAILABLE: return {
        header: 'Action',
        label: 'Join',
        action: () => {
          onJoinGame(game.gameId.toString(), game.rewardPool.toString());
        },
        isClickable: true
      }
      case TYPE_LIST.HISTORY:
        let winner;
        if (game.winner === 1) {
          winner = game.playerOne;
        } else {
          winner = game.playerTwo;
        }
        return {
          header: 'Result',
          label: winner === address ? "Victory" : "Defeat",
          action: null,
          isClickable: false
        }
      default: return null;
    }
  }

  const { config } = usePrepareContractWrite({
    address: TIC_TAC_TOE_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'joinGame',
    enabled: Boolean(debouncedGameConfig.isJoining),
    value: debouncedGameConfig.entryFee,
    args: [Number(debouncedGameConfig.gameId)],
  })


  const { data: txHash, write: joinGame } = useContractWrite(config);

  const onJoinGame = async (gameId, entryFee) => {
    setGameConfig({gameId, entryFee, isJoining: true});
    joinGame?.();
  }

  useWaitForTransaction({
    hash: txHash?.hash
  })

  const onViewGame = (gameId) => {
    navigate(`/game/${gameId}`)
  }

  useContractEvent({
    address: TIC_TAC_TOE_CONTRACT_ADDRESS,
    abi: contractAbi,
    eventName: 'JoinedGame',
    listener(log) {
        console.log(log);
        const [ex] = log;
        const { args: { gameId: thisGameId } } = ex;
        navigate(`/game/${thisGameId.toString()}`);
        toast.success('Join game successfully');
    },
    chainId: 1001,
  })

  return (
    <GameTableContainer>
      <Typography className='home__content__table-title'>{title}</Typography>
      <TableContainer component={Paper} sx={{height: 694, overflow: 'auto'}}>
        <Table stickyHeader>
          <TableHead className='home__content__table-header'>
            <TableRow>
              <TableCell align='center'>GameID</TableCell>
              <TableCell align='center'>Award</TableCell>
              <TableCell align='center'>Player One</TableCell>
              <TableCell align='right'>{type === TYPE_LIST.HISTORY ? 'Result' : 'Action'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.length === 0 ? <TableRow>
                <TableCell colSpan={4} align='center'>
                  No Records
                </TableCell>
              </TableRow> :
                data.map((game) => {
                const actions = renderAction(game);
                return(
                  <TableRow key={game.gameId.toString()}>
                    <TableCell align='center'>{game.gameId.toString()}</TableCell>
                    <TableCell align='center'>{Number(web3.utils.fromWei(game.rewardPool.toString(), 'ether'))} KLAY</TableCell>
                    <TableCell align='center'>{getShortenAddress(game.playerOne.toString(), 5)}</TableCell>
                    <TableCell align='right' onClick={actions.action} className={actions.isClickable ? 'clickable' : ''}>{actions.label}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </GameTableContainer>
  )
}
      
export default GameList