import React from 'react'
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

const GameList = ({ title, data, isHistory = false }) => {
  const web3 = new Web3(window.ethereum);
  const account = '0x61DE9D2A70425E110046C21d00F0b48523123a72';
  const onJoinGame = async (gameId) => {

  }
  return (
    <GameTableContainer>
      <Typography className='home__content__table-title'>{title}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className='home__content__table-header'>
            <TableRow>
              <TableCell align='center'>GameID</TableCell>
              <TableCell align='center'>Award</TableCell>
              <TableCell align='center'>Player One</TableCell>
              <TableCell align='right'>{isHistory ? 'Result' : 'Join'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data?.length === 0 ? <TableRow>
                <TableCell colSpan={4} align='center'>
                  No Records
                </TableCell>
              </TableRow> :
                data.map((game) => {
                console.log(game.rewardPool);
                return(
                  <TableRow key={game.gameId.toString()}>
                    <TableCell align='center'>{game.gameId.toString()}</TableCell>
                    <TableCell align='center'>{Number(web3.utils.fromWei(game.rewardPool.toString(), 'ether'))} KLAY</TableCell>
                    <TableCell align='center'>{getShortenAddress(game.playerOne.toString(), 5)}</TableCell>
                    <TableCell align='right'>{isHistory ? (account === game.winner.toString() ? 'Win' : 'Lose') : 'Join'}</TableCell>
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