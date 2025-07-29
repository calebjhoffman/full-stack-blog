import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/Auth/LoginForm';
import { Container, Paper, Typography, Box } from '@mui/material';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [loading, user]);

  if (loading) return null;

  return (
    <Container maxWidth="sm" paddingTop="80px">
      <Paper sx={{ padding: 4}}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome Back 👋
        </Typography>
        <Box mt={2}>
          <LoginForm />
        </Box>
      </Paper>
    </Container>
  );
}
