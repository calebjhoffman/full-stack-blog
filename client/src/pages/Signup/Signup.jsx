import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/Auth/SignupForm';
import { Container, Typography, Paper, Box } from '@mui/material';

export default function Signup() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  //Turn the signup form on and off.. False = off
  const allowSignup = true;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(() => navigate('/dashboard'))
      .catch(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth) return null; // Optionally show a spinner

  return (
    <Container maxWidth="sm" sx={{ pt: '80px' }}>
      <Paper elevation={3} sx={{ padding: 4}}>
        <Typography variant="h4" gutterBottom align="center">
          Create Your Account
        </Typography>
        <Box mt={2}>
          {allowSignup ? (
            <SignupForm />
          ) : (
            <p>We aren't letting you sign up right now...sorry.</p>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

