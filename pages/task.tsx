import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

export default function Task() {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mt: 5
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>
          TASK 1
        </Typography>
        <Typography variant="h3" color="error" gutterBottom>
          INCOMPLETE
        </Typography>
      </Box>

      <Box sx={{ 
          flexGrow: 1,
          mt: 20,
          px: 30
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography 
              gutterBottom 
              variant="body 1" 
              component="div"
            >
              Nunc eu sollicitudin ex. Nunc tortor quam, interdum nec molestie eget, fringilla sit amet nunc. Praesent facilisis ipsum in nunc feugiat accumsan. Vestibulum viverra eros id odio vulputate, sed semper libero scelerisque. Aenean et eros enim. Aenean laoreet, augue non congue feugiat, nulla sapien mollis nisi, in tempor nulla lectus sit amet ex. Nulla vitae posuere lectus, porttitor placerat ex. Donec malesuada rhoncus enim non semper. Praesent tempor est a urna pharetra tempor. In iaculis, diam non aliquet pharetra, libero dui lacinia ante, ut tempus dui sem at felis.

Aenean ut nisl dictum lacus pharetra molestie vitae a nisl. Donec bibendum purus ut dolor bibendum rutrum. Aliquam iaculis velit sed feugiat consequat. Mauris dictum urna vitae risus commodo consequat. Duis lobortis libero et commodo gravida. Vivamus auctor sapien vel enim venenatis, a egestas dolor lacinia. Ut erat ex, cursus et vehicula at, venenatis sed mi. Praesent eleifend erat eget magna feugiat luctus. Proin finibus auctor risus luctus tempor. Cras dolor ligula, hendrerit ac suscipit eget, venenatis non lectus. Duis non mi ut felis viverra pulvinar.
            </Typography>
          </CardContent>
          <CardActions style={{justifyContent: 'center'}}>
              <Button variant="contained" color="secondary">
                Start
              </Button>
          </CardActions>
        </Card>
      </Box>

    </Container>
  )
}