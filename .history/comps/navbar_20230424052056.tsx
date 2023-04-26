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
import Add from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [valid, setValid] = useState(true);

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleInputSubmit = () => {
    fetch(`api/xportal/auth_init`, {
      body: JSON.stringify({
        email: inputValue
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }).then(() => {
      setInputValue("");
      setOpen(false);
    })
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setValid(event.target.validity.valid);
  };

  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {
              router.route !== "/" ? (
                <IconButton sx={{ 
                  color: 'white', 
                  backgroundColor: '#ab47bc',
                  "&:hover": { 
                    color: "#ab47bc",
                    backgroundColor: "white" 
                  } 
                }} onClick={() => router.back()}>
                  <ArrowBackIcon />
                </IconButton>    
              ) : ( null )
            }
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              <Box
                component="img"
                sx={{ 
                  height: 40,
                  margin: 3 
                }}
                src="/s4f-classic.png"
              />
            </Link>  
          </Typography>
          <Button sx={{ color: "white" }} onClick={handleModalOpen} endIcon={<WalletIcon />}>
            Connect to your wallet
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleModalClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">To connect please enter your email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            type="email"
            label="Email"
            value={inputValue}
            onChange={handleEmailChange}
            error={!valid}
            helperText={!valid ? 'Please enter a valid email address' : ''}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleInputSubmit} color="primary">
            Connect
          </Button>
        </DialogActions>  
      </Dialog>  
    </Box>
  )
}