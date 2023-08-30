import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { NewGameContentContainer } from './index.style'
import CustomInput from '../../components/CustomInput'
import { useContractEvent, useContractWrite, usePrepareContractWrite, useTransaction, useWaitForTransaction } from 'wagmi'
import { TIC_TAC_TOE_CONTRACT_ADDRESS } from '../../constants'
import contractAbi from '../../constants/tictactoe_abi.json'
import { parseEther } from 'viem'
import { useDebounce } from '../../hooks/useDebounce'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

const NewGame = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useContractEvent({
        address: TIC_TAC_TOE_CONTRACT_ADDRESS,
        abi: contractAbi,
        eventName: 'GameStarted',
        listener(log) {
            console.log(log);
            const [ex] = log;
            const { args: { gameId: thisGameId } } = ex;
            navigate(`/game/${thisGameId.toString()}`);
            toast('Start game successfully')
        },
        chainId: 1001,
    })
    
    const [entryFee, setEntryFee] = useState('');
    const debouncedEntryFee = useDebounce(entryFee);

    const { config } = usePrepareContractWrite({
        address: TIC_TAC_TOE_CONTRACT_ADDRESS, abi: contractAbi, functionName: 'startGame', value: parseEther(debouncedEntryFee), enabled: Boolean(debouncedEntryFee)
    });

    const { data, write, isError } = useContractWrite(config);

    useWaitForTransaction({
        hash: data?.hash
    });

    const onChangeEntryFee = (e) => {
        setEntryFee(e.target.value)
    }

    useEffect(() => {
        setLoading(false);
    }, [isError])

    return (
        <Box>
            <Header />
            <NewGameContentContainer onSubmit={(e) => {
                e.preventDefault();
                write?.();
                setLoading(true);
            }}>
                <CustomInput
                    label={'Entry Fee'}
                    placeholder="Enter amount"
                    value={entryFee}
                    onChange={onChangeEntryFee}
                    width="100%"
                    required
                />
                <button disabled={loading}>{loading ? <CircularProgress size={16}/> : 'Create'}</button>
                {/* {isSuccess ? <Typography>New game ID: {gameId?.[0]?.args?.gameId} </Typography> : null} */}
            </NewGameContentContainer>
        </Box>
    )
}

export default NewGame