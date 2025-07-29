import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TextField,
  Button,
  Stack
} from '@mui/material';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let res;
    try {
      res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      alert(`Login status: ${res.status}`);
    } catch (err) {
      alert('Login failed: Network error');
      setError('Network error. Please try again.');
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      const text = await res.text();
      alert('❌ JSON parse error. Raw response:\n' + text);
      setError('Unexpected server response');
      return;
    }

    // TEMP: Check if refreshUser works
    if (res.ok) {
      const metaRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/meta`, {
        credentials: 'include',
      });
      alert(`Meta fetch after login: ${metaRes.status}`);
      
      await refreshUser();
      navigate('/dashboard');
    } else {
      alert(`Login failed: ${data.error || 'unknown error'}`);
      setError(data.error || 'Login failed');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          fullWidth
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Create one
        </Link>
      </p>
    </form>
  );
}
