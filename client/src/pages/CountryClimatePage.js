import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, CircularProgress, Alert } from '@mui/material';
import { Thermostat, WbSunny, Water, Air, Agriculture } from '@mui/icons-material';
import MetricCard from '../components/Cards/MetricCard';
import { aiAPI, climateAPI } from '../utils/api';

const dash = (value, fallback = '—') => (value == null || value === '' ? fallback : value);

const CountryClimatePage = ({
  flag,
  name,
  season,
  subtitle,
  cities,
  beltTitle,
  beltCity,
  regions,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snapshots, setSnapshots] = useState({});
  const [forecast, setForecast] = useState(null);

  const cityKeys = cities.map((c) => c.key).join(',');

  useEffect(() => {
    const keys = cityKeys.split(',').filter(Boolean);
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await Promise.all(keys.map((key) => climateAPI.getCitySnapshot(key)));
        const next = {};
        keys.forEach((key, i) => {
          next[key] = results[i].data;
        });
        setSnapshots(next);
        const local = await aiAPI.getLocalForecast(beltCity || keys[0]);
        setForecast(local.data);
      } catch (err) {
        console.error(err);
        setError('Could not load live climate data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [beltCity, cityKeys]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const belt = snapshots[beltCity] || snapshots[cities[0]?.key];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#0f4c75' }}>
            {flag} {name}
          </Typography>
          <Chip label={season} color="primary" />
        </Box>
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {cities.map((city) => {
        const snap = snapshots[city.key] || {};
        return (
          <Card
            key={city.key}
            elevation={0}
            sx={{ mb: 4, border: city.featured ? '2px solid #0f4c75' : '1px solid #e0e0e0' }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                {city.label}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard title="Temperature" value={dash(snap.temperature)} unit="°C" icon={<Thermostat />} color="#f44336" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard title="Weather" value={dash(snap.weather)} icon={<WbSunny />} color="#ffc107" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard title="Humidity" value={dash(snap.humidity)} unit="%" icon={<Water />} color="#2196f3" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Air Quality (AQI)"
                    value={dash(snap.aqi)}
                    trendValue={snap.aqiMeta?.label}
                    trend={snap.aqi > 50 ? 'up' : 'down'}
                    icon={<Air />}
                    color={snap.aqi > 50 ? '#ff9800' : '#4caf50'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}

      <Card elevation={0} sx={{ mb: 4, border: '1px solid #1b5e20', backgroundColor: '#f1f8e9' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Agriculture sx={{ color: '#1b5e20', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1b5e20' }}>
              {beltTitle}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Soil Moisture
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  {dash(belt?.soilMoisturePct)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  0–7 cm layer from Open-Meteo
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Precipitation (7 days)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                  {dash(belt?.precip7dMm)}mm
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Forecast total
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Avg Temperature
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                  {dash(belt?.avgTemp7d)}°C
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  7-day mean
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {forecast && (
        <Card
          elevation={0}
          sx={{
            border: '2px solid #9c27b0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Agriculture />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI-Powered Local Impact Forecast
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
              {forecast.analysis}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
              {forecast.forecast}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {forecast.recommendation}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.9 }}>
              Based on live Open-Meteo weather, soil moisture, and rainfall totals
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f7fa', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Key Agricultural Regions
        </Typography>
        <Grid container spacing={2}>
          {regions.map((region) => (
            <Grid item xs={12} md={6} key={region.title}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {region.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {region.body}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CountryClimatePage;
