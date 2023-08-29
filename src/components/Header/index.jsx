import React, { useState } from 'react'
import { Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TokenIcon from '@mui/icons-material/Token';

import CustomModal from '../CustomModal';
import CustomInput from '../CustomInput';
import logo from '../../assets/favicon.ico';
import { HeaderContainer } from './index.style';
import { Web3Button } from '@web3modal/react'
import { useAccount, useContractWrite } from 'wagmi'
import contractAbi from '../../constants/tictactoe_abi.json'
import { parseEther } from 'viem';
import { TIC_TAC_TOE_CONTRACT_ADDRESS } from '../../constants';
import { useNavigate } from 'react-router-dom';

const Header = ({setTriggerFetch}) => {

  const DISPLAYING_MODAL = {
    START: 1,
    CLAIM: 2,
    NONE: 0,
  }
  const [displayModal, setDisplayModal] = useState(false);
  const [entryFee, setEntryFee] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const navigate = useNavigate();

  const { isLoading, isSuccess, write: startGame } = useContractWrite({
    address: TIC_TAC_TOE_CONTRACT_ADDRESS, abi: contractAbi, functionName: 'startGame'
  });

  const { write: claimReward } = useContractWrite({
    address: TIC_TAC_TOE_CONTRACT_ADDRESS, abi: contractAbi, functionName: 'claimRewards'
  });

  const { address } = useAccount();

  const onCreateGame = () => {
    try {
      startGame({ from: address, value: parseEther(entryFee) });
      if (isSuccess) {
        setDisplayModal(DISPLAYING_MODAL.NONE);
        setTriggerFetch(prev => !prev);
      }
    } catch (error) {
      console.log({ error });
      setDisplayModal(DISPLAYING_MODAL.NONE);
    }
  }

  const onClaimReward = async () => {
    try {
      claimReward({ from: address, args: parseEther(claimAmount) });
      if (isSuccess) {
        setDisplayModal(DISPLAYING_MODAL.NONE);
        setTriggerFetch(prev => !prev);
      }
    } catch (error) {
      console.log({error});
    }
  }

  const onRequestToCreateGame = () => {
    setDisplayModal(DISPLAYING_MODAL.START);
  }

  const onRequestToClaimRewards = () => {
    setDisplayModal(DISPLAYING_MODAL.CLAIM);
  }

  const onCloseModal = () => {
    setDisplayModal(DISPLAYING_MODAL.NONE);
    setEntryFee('');
    setClaimAmount('');
  }
  
  const onChangeEntryFee = (e) => {
    setEntryFee(e.target.value)
  }

  const onChangeClaimAmount = (e) => {
    setClaimAmount(e.target.value)
  }

  const renderModal = () => {
    switch (displayModal) {
      case DISPLAYING_MODAL.START:
        return (
          <CustomModal
            open={true}
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
                value={entryFee}
                onChange={onChangeEntryFee}
                width="100%"
                required
              />
            </Box>
          </CustomModal>
        )
      case DISPLAYING_MODAL.CLAIM:
        return (
          <CustomModal
            open={true}
            title={"Claim Rewards"}
            onConfirm={() => onClaimReward()}
            onCancel={onCloseModal}
            onClose={onCloseModal}
            confirmMessage={"Submit"}
            cancelMessage={"Cancel"}
          >
            <Box>
              <CustomInput
                name="claimAmount"
                label={'Amount'}
                placeholder="Enter amount"
                value={claimAmount}
                onChange={onChangeClaimAmount}
                width="100%"
                required
              />
            </Box>
          </CustomModal>
        )
      case DISPLAYING_MODAL.NONE:
        return null;
    }
  }

  return (
    <HeaderContainer>
      <Box>
        <Box className='left' sx={{ '>*': { cursor: 'pointer'} }}>
          <img src={logo} alt='logo' onClick={() => navigate('/')}/>
          {/* <Typography onClick={() => navigate('/')}>Home</Typography> */}
        </Box>
        <Box className='right'>
          <TokenIcon onClick={onRequestToClaimRewards} />
          <AddCircleIcon onClick={onRequestToCreateGame} />
          <Web3Button />
        </Box>
      </Box>
      {renderModal()}
    </HeaderContainer>
  )
}

export default Header