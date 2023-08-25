import React, { useState } from 'react'
import { Typography, Box, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TokenIcon from '@mui/icons-material/Token';

import CustomModal from '../CustomModal';
import CustomInput from '../CustomInput';
import logo from '../../assets/favicon.ico';
import { claimReward, startGame } from '../../web3';

import { HeaderContainer } from './index.style';
import { getShortenAddress } from '../../utils';

const Header = () => {

  const [account, setAccount] = useState(null);
  const [open, setOpen] = useState(false);
  const [createGameInfo, setCreateGameInfo] = useState({
    entryFee: ''
  });

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
    const connectingAccount = accounts[0];
    setAccount(connectingAccount);
  }

  const onCreateGame = async () => {
    try {
      const result = await startGame(account, createGameInfo.entryFee);
      console.log({result});
    } catch (error) {
      console.log({error});
    }
  }

  const onClaimReward = async () => {
    try {
      const result = await claimReward(account, amount);
    } catch (error) {
      console.log({error});
    }
  }

  const onOpenModal = () => {
    setOpen(true);
  }

  const onCloseModal = () => {
    setOpen(false);
    setCreateGameInfo({entryFee: ''})
  }
  
  const onChangeCreateGameInfo = (e) => {
    setCreateGameInfo(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  return (
    <HeaderContainer>
      <Box>
        <Box className='left'>
          <img src={logo} alt='logo' />
          <Typography>Home</Typography>
        </Box>
        <Box className='right'>
          {
            account ?
              <Box>
                <TokenIcon onClick={onClaimReward} />
                <AddCircleIcon onClick={onOpenModal} />
                <Typography>Hi, {getShortenAddress(account, 5)}</Typography>
              </Box>
              :
              <Button variant='contained' onClick={connectWallet}>
                Connect Wallet
              </Button>
          }
        </Box>
      </Box>
      <CustomModal
        open={open}
        title={"Create New Game"}
        onConfirm={onCreateGame}
        onCancel={onCloseModal}
        onClose={onCloseModal}
        confirmMessage={"Submit"}
        cancelMessage={"Cancel"}
      >
        <Box>
          <CustomInput
            name="entryFee"
            label={'Entry Fee'}
            placeholder="Enter entry fee"
            value={createGameInfo.entryFee}
            onChange={onChangeCreateGameInfo}
            width="100%"
            required
          />
        </Box>
      </CustomModal>
    </HeaderContainer>
  )
}

export default Header