import React, { useContext, useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Link } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('farmer@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', px: 2 }}>
      <Card sx={{ maxWidth: 420, width: '100%', border: '1px solid #e0e0e0' }} elevation={0}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f4c75' }}>Sign in</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Access customized dashboards and saved preferences
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>
            )}
            <Button disabled={loading} type="submit" variant="contained" fullWidth>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Don’t have an account? <Link href="/signup">Create one</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;


