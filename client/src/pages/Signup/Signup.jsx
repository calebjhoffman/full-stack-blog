import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/Auth/SignupForm';
import { Container, Typography, Paper, Box } from '@mui/material';

export default function Signup() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create Your Account
        </Typography>
        <Box mt={2}>
          <SignupForm />
        </Box>
      </Paper>
    </Container>
  );
}

