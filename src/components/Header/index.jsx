import React, { useState } from 'react'
import { Typography, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TokenIcon from '@mui/icons-material/Token';

import CustomModal from '../CustomModal';
import CustomInput from '../CustomInput';
import logo from '../../assets/favicon.ico';
import { claimReward } from '../../web3';
import { HeaderContainer } from './index.style';
import { Web3Button } from '@web3modal/react'
import { useAccount, useContractWrite } from 'wagmi'
import contractAbi from '../../constants/tictactoe_abi.json'
import { parseEther } from 'viem';
import { TIC_TAC_TOE_CONTRACT_ADDRESS } from '../../constants';

const Header = () => {

  const [open, setOpen] = useState(false);
  const [createGameInfo, setCreateGameInfo] = useState({
    entryFee: ''
  });
  const { writeAsync } = useContractWrite({ address: TIC_TAC_TOE_CONTRACT_ADDRESS, abi: contractAbi, functionName: 'startGame' });
  const { address } = useAccount();

  const onCreateGame = async () => {
    try {
      await writeAsync({ from: address, value: parseEther(createGameInfo.entryFee) });
      setOpen(false);
    } catch (error) {
      console.log({ error });
      setOpen(false);
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
          <TokenIcon onClick={onClaimReward} />
          <AddCircleIcon onClick={onOpenModal} />
          <Web3Button />
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