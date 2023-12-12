import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Footer = () => {
    return (
        <Box sx={{ 
            flexGrow: 1,
            mt: 15,
            mb: 0,
            pt: 8,
            height: 40
          }}
          className="footer"
        >
            {/* <Grid container spacing={2}> */}
            {/* <Grid xs={6} pl={10}>
            </Grid> */}
            <Grid  pr={10}>
                <Typography variant="body2" sx={{ fontWeight: 100 }} align='right' display="block" gutterBottom>
                    @2023, Sense4FIT
                </Typography>
            </Grid>
            {/* </Grid> */}
        </Box>
    )
}

export default Footer;

