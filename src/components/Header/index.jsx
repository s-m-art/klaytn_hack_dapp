import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material';
import logo from '../../assets/favicon.ico';
import { HeaderContainer } from './index.style';
import { Web3Button } from '@web3modal/react'
import { useNavigate } from 'react-router-dom';
import { useWalletClient } from 'wagmi';
import * as Account from 'viem/accounts';
import { formatTransactionRequest, publicActions } from 'viem';
import { MAX_SPEND_AMOUNT } from '../../constants';

const Header = ({ setTriggerFetch }) => {

  const navigate = useNavigate();
  const { data: walletClient, isSuccess } = useWalletClient();

  useEffect(() => {
    const sessionAccount = localStorage.getItem("account");
    console.log({sessionAccount});
    if (!isSuccess || JSON.parse(sessionAccount)?.validUntil <= Date.now()) return;
    const thisClient = isSuccess ? walletClient.extend((client) => ({
        ...publicActions(client),
        async requestSessionKey() {
          let address, isSet = true;
          const validAfter = Math.floor(Date.now() / 1e3);
          const validUntil = validAfter + 86400;
          if (!sessionAccount) {
            const privateKey = Account.generatePrivateKey();
            address = Account.privateKeyToAccount(privateKey).address;
            isSet = false;
            localStorage.setItem('account', JSON.stringify({ address, privateKey, validAfter, validUntil }));
          } else {
            address = JSON.parse(sessionAccount).address;
          }
          console.log({address,
              maxAmount: MAX_SPEND_AMOUNT,
              validAfter,
              validUntil,});
          await client.request({
            method: 'eth_requestSessionKey',
            params: [formatTransactionRequest({
              address,
              maxAmount: MAX_SPEND_AMOUNT,
              validAfter,
              validUntil,
            }), 'latest', {}]
          })
        }}
      )) : null
      thisClient.requestSessionKey();
    }, [isSuccess])

  return (
    <HeaderContainer>
      <Box>
        <Box className='left' sx={{ '>*': { cursor: 'pointer'} }}>
          <img src={logo} alt='logo' onClick={() => navigate('/')}/>
          <Typography onClick={() => navigate('/')}>Home</Typography>
          <Typography onClick={() => navigate('/new')}>New Game</Typography>
          <Typography onClick={() => navigate('/claim')}>Claim</Typography>
        </Box>
        <Box className='right'>
          <Web3Button />
        </Box>
      </Box>
    </HeaderContainer>
  )
}

export default Header