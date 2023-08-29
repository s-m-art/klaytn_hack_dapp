import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material';

import GameList from './GameList';
import Header from '../../components/Header'
import contractAbi from '../../constants/tictactoe_abi.json';
import { useAccount, useContractRead } from "wagmi";
import { HomeContainer, HomeContentContainer } from './index.style'
import { EMPTY_ADDRESS, TIC_TAC_TOE_CONTRACT_ADDRESS, TYPE_LIST } from '../../constants';

const Home = () => {

    const [myGames, setMyGames] = useState([]);
    const [myEndedGames, setMyEndedGames] = useState([]);
    const [startedGames, setStartedGames] = useState([]);
    const [availableGames, setAvalailableGames] = useState([]);
    const [endedGames, setEndedGames] = useState([]);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const { isConnected, address } = useAccount();
    const { data, isError, isLoading } = useContractRead({ address: TIC_TAC_TOE_CONTRACT_ADDRESS, abi: contractAbi, functionName: 'getGames' });

    const getGameList = async () => {
        try {
            const _startedGames = data.filter(
                (game) => game.isStarted === true
            );
            const _endedGames = data.filter((game) => game.isStarted === false);
            const _availableGames = data.filter(
                (game) =>
                (game.playerOne.toString() != address && game.playerOne.toString() != EMPTY_ADDRESS) && game.playerTwo.toString() == EMPTY_ADDRESS
            );
            if (isConnected && !!address) {
                const playerGames = data.filter(
                    (game) =>
                        (game.playerOne.toString() === address || game.playerTwo.toString() === address) &&
                        game.winner === 0
                );

                const playerEndedGames = data.filter(
                    (game) =>
                        (game.playerOne.toString() === address || game.playerTwo.toString() === address) &&
                        game.winner !== 0
                );
                setMyGames(playerGames);
                setMyEndedGames(playerEndedGames);
            }
            setAvalailableGames(_availableGames);
            setStartedGames(_startedGames);
            setEndedGames(_endedGames);
        } catch (error) {
            console.log({error});
        }
    }

    useEffect(() => {
        if (!data) return;
        getGameList();
    }, [data, address, triggerFetch])

    return (
        <HomeContainer>
            <Header setTriggerFetch={setTriggerFetch} />
            <HomeContentContainer>
                <Typography className='home__content-mantra'>Play Tictactoe and Earn!</Typography>
                <Box display={'flex'}>
                    <GameList data={myGames} title={'Current Games'} type={TYPE_LIST.CURRENT} />
                    <GameList data={availableGames} title={'Available Games'} type={TYPE_LIST.AVAILABLE} />
                    <GameList data={myEndedGames} title={'History'} type={TYPE_LIST.HISTORY} />
                </Box>
            </HomeContentContainer>
        </HomeContainer>
    )
}

export default Home