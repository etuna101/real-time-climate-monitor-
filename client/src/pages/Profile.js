import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { userAPI } from '../utils/api';

const Profile = () => {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [useCase, setUseCase] = useState('farming');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const resp = await userAPI.getProfile();
      const u = resp.data || resp;
      setName(u.name || '');
      setOrganization(u.profile?.organization || '');
      setCountry(u.profile?.country || 'Kenya');
      setUseCase(u.profile?.useCase || 'farming');
    })();
  }, []);

  const onSave = async () => {
    await userAPI.updateProfile({ name, profile: { organization, country, useCase } });
    setMessage('Saved');
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Profile</Typography>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Organization" fullWidth sx={{ mb: 2 }} value={organization} onChange={(e) => setOrganization(e.target.value)} />
          <TextField label="Country" fullWidth sx={{ mb: 2 }} value={country} onChange={(e) => setCountry(e.target.value)} />
          <TextField label="Use Case" fullWidth sx={{ mb: 2 }} value={useCase} onChange={(e) => setUseCase(e.target.value)} />
          <Button variant="contained" onClick={onSave}>Save</Button>
          {message && <Typography sx={{ ml: 2 }} color="success.main">{message}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;


