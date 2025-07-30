import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailSent() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box mt={10} textAlign="center">
        <Typography variant="h4" gutterBottom>
          📩 Check Your Email
        </Typography>
        <Typography variant="body1" mb={4}>
          We've sent you a verification link. Please click it to activate your account.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </Box>
    </Container>
  );
}
