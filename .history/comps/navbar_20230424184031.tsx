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
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const validateEmail = (email: string) => {
    // email validation logic here
    return true;
  };

  const validateCode = (code: string) => {
    // code validation logic here
    return /^\d{6}$/.test(code);
  };

  const handleSubmit = () => {
    if (activeStep === 0 && validateEmail(email)) {
      fetch(`api/xportal/auth_init`, {
        body: JSON.stringify({
          email: email
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }).then(() => {
        handleNext();
      })
    } else if (activeStep === 1 && validateCode(code)) {
      handleClose();
      // submit email and code to server here
    }
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Email Validation</DialogTitle>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Enter Email</StepLabel>
          </Step>
          <Step>
            <StepLabel>Enter Code</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            error={!validateEmail(email)}
            helperText={!validateEmail(email) && "Invalid email format"}
          />
        )}
        {activeStep === 1 && (
          <TextField
            label="Code"
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={code}
            onChange={handleCodeChange}
            error={!validateCode(code)}
            helperText={
              !validateCode(code) && "Code must be 6 digits in length"
            }
          />
        )}
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {activeStep === 1 ? "Submit" : "Next"}
        </Button>
      </Dialog>
    </Box>
  )
}