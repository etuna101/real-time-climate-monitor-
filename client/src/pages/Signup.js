import React, { useContext, useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Signup = () => {
  const { register, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError('Sign up failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', px: 2 }}>
      <Card sx={{ maxWidth: 480, width: '100%', border: '1px solid #e0e0e0' }} elevation={0}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f4c75' }}>Create your account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get personalized climate insights for East Africa
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} sx={{ mb: 2 }} />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>
            )}
            <Button disabled={loading} type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <RouterLink to="/login">Sign in</RouterLink>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;


