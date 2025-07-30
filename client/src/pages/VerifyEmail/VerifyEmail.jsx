import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Container, Box } from '@mui/material';
import { useAuth } from '@/context/AuthContext'; // ✅ Make sure this path matches your project

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const hasVerified = useRef(false); // ✅ Prevent double-fetch in React dev mode

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const token = searchParams.get('token');
    if (!token || typeof token !== 'string' || token.trim() === '') {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email?token=${token}`, {
          credentials: 'include',
        });

        if (res.ok) {
          setStatus('success');
          setMessage('✅ Email verified! Logging you in...');

          await refreshUser();

          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          const data = await res.json();
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        {status === 'loading' && <CircularProgress />}
        {status !== 'loading' && (
          <Typography variant="h5" gutterBottom>{message}</Typography>
        )}
      </Box>
    </Container>
  );
}
