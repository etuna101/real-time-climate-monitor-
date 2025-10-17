import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { userAPI } from '../utils/api';

const Settings = () => {
  const [favoriteCountry, setFavoriteCountry] = useState('kenya');
  const [defaultMetric, setDefaultMetric] = useState('temperature');
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const resp = await userAPI.getProfile();
      const u = resp.data || resp;
      setFavoriteCountry(u.preferences?.favoriteCountry || 'kenya');
      setDefaultMetric(u.preferences?.defaultMetric || 'temperature');
      setTheme(u.preferences?.theme || 'light');
    })();
  }, []);

  const onSave = async () => {
    await userAPI.updateSettings({ favoriteCountry, defaultMetric, theme });
    setMessage('Saved');
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Settings</Typography>
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <TextField label="Favorite Country" fullWidth sx={{ mb: 2 }} value={favoriteCountry} onChange={(e) => setFavoriteCountry(e.target.value)} />
          <TextField label="Default Metric" fullWidth sx={{ mb: 2 }} value={defaultMetric} onChange={(e) => setDefaultMetric(e.target.value)} />
          <TextField label="Theme" fullWidth sx={{ mb: 2 }} value={theme} onChange={(e) => setTheme(e.target.value)} />
          <Button variant="contained" onClick={onSave}>Save</Button>
          {message && <Typography sx={{ ml: 2 }} color="success.main">{message}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;


