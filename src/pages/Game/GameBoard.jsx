import React, { useEffect, useState } from 'react'
import { GameBoardContainer, GameBoardSquare } from './index.style';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useAccount, useContractWrite } from 'wagmi';
import { TIC_TAC_TOE_CONTRACT_ADDRESS } from '../../constants';
import contractAbi from '../../constants/tictactoe_abi.json';
import accountContractAbi from '../../constants/account_abi.json';
import { toast } from 'react-toastify';
import { Contract, ethers } from 'ethers';

const GameBoard = ({ id, board }) => {
    
    const [boardArray, setBoardArray] = useState([]);
    const {isError, write} = useContractWrite({
        address: TIC_TAC_TOE_CONTRACT_ADDRESS,
        abi: contractAbi,
        functionName: 'makeMove'
    })
    const { address } = useAccount();

    const onMove = async (square, index) => {
        if (square !== 0) return;
        let row, column;
        switch (index) {
            case 0: row = 0; column = 0; break;
            case 1: row = 0; column = 1; break;
            case 2: row = 0; column = 2; break;
            case 3: row = 1; column = 0; break;
            case 4: row = 1; column = 1; break;
            case 5: row = 1; column = 2; break;
            case 6: row = 2; column = 0; break;
            case 7: row = 2; column = 1; break;
            case 8: row = 2; column = 2; break;
        }
        const account = JSON.parse(localStorage.getItem('account'));
        if (account) {

        const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net/');
        const signer = new ethers.Wallet(account.privateKey, provider);
        const contractGame = new Contract(TIC_TAC_TOE_CONTRACT_ADDRESS, contractAbi);
        const preparedTnx = await contractGame.populateTransaction.makeMove(row, column, id);
        console.log({address, preparedTnx});
        const accountContract = new Contract(address, accountContractAbi, signer);
        const tx = await accountContract.execute(TIC_TAC_TOE_CONTRACT_ADDRESS, '0', preparedTnx.data);
        await tx.wait();
        }
        // console.log({tx});
        write({
            args: [row, column, id],
            from: address
        });
    }

    const renderSquare = (square) => {
        switch (Number(square)) {
            case 0: return null;
            case 1: return <CloseIcon fontSize='1600px'/>
            case 2: return <RadioButtonUncheckedIcon fontSize='1600px'/>
            default: return null;
        }
    }

    useEffect(() => {
        if (!board) return;
        let temp = [];
        for (const rows in board) {
            const row = board[rows];
            temp = temp.concat(row);
        }
        setBoardArray(temp);
    }, [board])
    
    if (!board) {
        return null;
    }

    return (
            <GameBoardContainer>
                {
                    boardArray.map((square, index) => {
                        return <GameBoardSquare onClick={async () => await onMove(square, index)}>{renderSquare(square)}</GameBoardSquare>
                    })
                }
            </GameBoardContainer>
    )
}

export default GameBoard