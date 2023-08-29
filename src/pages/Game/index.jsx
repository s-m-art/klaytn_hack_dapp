import React from 'react'
import { useParams } from 'react-router-dom'
import { useAccount, useContractReads } from 'wagmi';
import { TIC_TAC_TOE_CONTRACT_ADDRESS } from '../../constants';
import contractAbi from '../../constants/tictactoe_abi.json';
import GameBoard from './GameBoard';
import { GameDetailContainer } from './index.style';
import Header from '../../components/Header';
import { Box, Typography } from '@mui/material';
import { getShortenAddress } from '../../utils';
import { formatEther } from 'viem';

const Game = () => {

  const { id } = useParams();
  const tictactoeContract = {
    address: TIC_TAC_TOE_CONTRACT_ADDRESS,
    abi: contractAbi,
  }
  const {address} = useAccount();
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...tictactoeContract,
        functionName: 'games',
        args: [id]
      },
      {
        ...tictactoeContract,
        functionName: 'getGameBoard',
        args: [id]
      },
      {
        ...tictactoeContract,
        functionName: 'commission'
      },
      {
        ...tictactoeContract,
        functionName: 'isGameFinished'
      }
    ]
  })

  if (!data) {
    return null;
  }

  console.log(data[0].result[2]);
  console.log(address);

  return (
    <GameDetailContainer>
      <Header />
      <Box sx={{position: 'absolute', left: '50%', top: '20%', transform: 'translate(-50%, -50%)', width: '100%'}}>
        <Typography className='home__content-mantra'>Play Tictactoe and Earn!</Typography>
        <Box width={'100%'} display={'flex'} justifyContent={'center'} marginTop={'24px'}>
          <Box display={'flex'} width={'70%'} alignItems={'center'} justifyContent={'space-evenly'}>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography sx={{fontWeight: 700}}>GameID</Typography>
              <Typography>{id}</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography sx={{fontWeight: 700}}>Prize pool</Typography>
              <Typography>{formatEther(data[0].result[4].toString())} KLAY</Typography>
            </Box>
          </Box>
        </Box>
        <Box width={'100%'} display={'flex'} justifyContent={'center'}>
          <Box display={'flex'} width={'70%'} alignItems={'center'} justifyContent={'space-evenly'}>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography sx={{fontWeight: 700}}>Player 1</Typography>
              <Typography>{getShortenAddress(data[0].result[2], 5)}</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography sx={{fontWeight: 700}}>Player Turn</Typography>
              <Typography>{getShortenAddress(data[0].result[6], 5)} ({data[0].result[6] === data[0].result[2] ? 'X' : 'O'})</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography sx={{fontWeight: 700}}>Player 2</Typography>
              <Typography>{getShortenAddress(data[0].result[3], 5)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <GameBoard id={id} board={data[1].result} />
      {
        data[0].result[7] > 0 ?
          <Box sx={{position: 'absolute', left: '50%', top: '75%', transform: 'translate(-50%, -50%)'}}>
            <Typography fontSize={24}>{data[0].result[data[0].result[7] + 1] === address ? 'Congratulation!' : 'Defeated!'}</Typography>
            <Typography fontSize={18}>The winner is: {data[0].result[data[0].result[7] + 1]}</Typography>
          </Box>
          : null
      }
    </GameDetailContainer>
  )
}

export default Game