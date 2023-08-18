import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import WalletIcon from '@mui/icons-material/Wallet';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import LoginModal from './tools/LoginModal';

import useUser from "../lib/useUser";

const NavBar = () => {
  const router = useRouter();

  const BackButton = () => {
    return (
      <IconButton sx={{ 
        color: 'white', 
        backgroundColor: '#ab47bc',
        opacity: router.route !== "/" ? 1 : 0,
        "&:hover": { 
          color: "#ab47bc",
          backgroundColor: "white" 
        }
      }} onClick={() => router.back()}>
        <ArrowBackIcon />
      </IconButton>    
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <BackButton />
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <Box
                component="img"
                sx={{ 
                  height: 40,
                  marginY: 3,
                  marginLeft: 21, 
                }}
                src="/s4f_white.png"
              />
            </Link>  
          </Typography>
          <LoginModal />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar;