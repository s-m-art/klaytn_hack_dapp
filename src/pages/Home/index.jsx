import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material';

import { getGames } from '../../web3';
import GameList from './GameList';
import Header from '../../components/Header'

import { HomeContainer, HomeContentContainer } from './index.style'
import { EMPTY_ADDRESS } from '../../constants';

const Home = () => {

    const [loading, setLoading] = useState(false);
    const [myGames, setMyGames] = useState([]);
    const [myEndedGames, setMyEndedGames] = useState([]);
    const [startedGames, setStartedGames] = useState([]);
    const [availableGames, setAvalailableGames] = useState([]);
    const [endedGames, setEndedGames] = useState([]);
    const address = '0x61DE9D2A70425E110046C21d00F0b48523123a72'
    
    const getGameList = async () => {
        try {
            setLoading(true);
            const result = await getGames();
            const _startedGames = result.filter(
                (game) => game.isStarted === true
            );
            const _endedGames = result.filter((game) => game.isStarted === false);
            const _availableGames = result.filter(
                (game) =>
                game.playerOne != EMPTY_ADDRESS && game.playerTwo == EMPTY_ADDRESS
            );
            if (true) {
                const playerGames = result.filter(
                    (game) =>
                        (game.playerOne.toString() === address || game.playerTwo.toString() === address) &&
                        game.winner.toString() === EMPTY_ADDRESS
                );

                const playerEndedGames = result.filter(
                    (game) =>
                        (game.playerOne.toString() === address || game.playerTwo.toString() === address) &&
                        game.winner.toString() !== EMPTY_ADDRESS
                );
                setMyGames(playerGames);
                setMyEndedGames(playerEndedGames);
            }
            setAvalailableGames(_availableGames);
            setStartedGames(_startedGames);
            setEndedGames(_endedGames);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log({error});
        }
    }

    console.log({myGames, myEndedGames, availableGames, startedGames, endedGames});

    useEffect(() => {
        getGameList();
    }, [])

    return (
        <HomeContainer>
            <Header />
            <HomeContentContainer>
                <Typography className='home__content-mantra'>Play Tictactoe and Earn!</Typography>
                <Box display={'flex'}>
                    <GameList data={myGames} title={'Current Games'}/>
                    <GameList data={availableGames} title={'Available Games'} />
                    <GameList data={endedGames} title={'History'} isHistory={true} />
                </Box>
            </HomeContentContainer>
        </HomeContainer>
    )
}

export default Home