import React from 'react'
import { Box, Typography } from '@mui/material';
import logo from '../../assets/favicon.ico';
import { HeaderContainer } from './index.style';
import { Web3Button } from '@web3modal/react'
import { useNavigate } from 'react-router-dom';

const Header = ({ setTriggerFetch }) => {

  const navigate = useNavigate();

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