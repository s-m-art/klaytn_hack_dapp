import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { NewGameContentContainer } from './index.style'
import CustomInput from '../../components/CustomInput'
import { useAccount, useContractEvent, useContractWrite, usePrepareContractWrite, useTransaction, useWaitForTransaction } from 'wagmi'
import { TIC_TAC_TOE_CONTRACT_ADDRESS } from '../../constants'
import contractAbi from '../../constants/tictactoe_abi.json'
import { parseEther } from 'viem'
import { useDebounce } from '../../hooks/useDebounce'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const Claim = () => {
    const [loading, setLoading] = useState(false);
    const {address} = useAccount();
    useContractEvent({
        address: TIC_TAC_TOE_CONTRACT_ADDRESS,
        abi: contractAbi,
        eventName: 'ClaimReward',
        listener(log) {
          const [ex] = log;
          const { args: { player } } = ex;
          if (player.toString() === address.toString()) {
            toast.success('Claim reward successfully')
          }
        },
        chainId: 1001,
    })
    
    const [claimAmount, setClaimAmount] = useState('');
    const debouncedClaimAmount = useDebounce(claimAmount);

    const { config } = usePrepareContractWrite({
      address: TIC_TAC_TOE_CONTRACT_ADDRESS,
      abi: contractAbi,
      functionName: 'claimRewards',
      args: [parseEther(claimAmount)],
      enabled: Boolean(debouncedClaimAmount),
    });

    const { data, write } = useContractWrite(config);

    const { isLoading } = useWaitForTransaction({
          hash: data?.hash
    });
    
    const onChangeEntryFee = (e) => {
        setClaimAmount(e.target.value)
    }

    useEffect(() => {
      setLoading(false);
      setClaimAmount('');
    }, [isLoading])

    return (
        <Box>
            <Header />
            <NewGameContentContainer onSubmit={(e) => {
                e.preventDefault();
                write?.();
                setLoading(true);
            }}>
                <CustomInput
                    label={'Amount'}
                    placeholder="Enter amount"
                    value={claimAmount}
                    onChange={onChangeEntryFee}
                    width="100%"
                    required
                />
                <button disabled={loading}>{loading ? <CircularProgress size={16}/> : 'Claim'}</button>
                {/* {isSuccess ? <Typography>New game ID: {gameId?.[0]?.args?.gameId} </Typography> : null} */}
            </NewGameContentContainer>
        </Box>
    )
}

export default Claim