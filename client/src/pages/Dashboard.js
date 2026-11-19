import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { Thermostat, Air, WaterDrop } from '@mui/icons-material';
import MetricCard from '../components/Cards/MetricCard';
import AlertCard from '../components/Cards/AlertCard';
import AIInsightCard from '../components/Cards/AIInsightCard';
import { useNavigate } from 'react-router-dom';
import { climateAPI, aiAPI } from '../utils/api';

const EastAfricaMap = lazy(() => import('../components/Map/EastAfricaMap'));

const fmt = (v, suffix = '') => (v == null || v === '' ? '—' : `${v}${suffix}`);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [insights, setInsights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [overviewResponse, insightsResponse] = await Promise.all([
          climateAPI.getOverview(),
          aiAPI.getInsights(),
        ]);
        setOverview(overviewResponse.data);
        setInsights(insightsResponse.data?.insights || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const cities = overview?.cities || {};
  const nairobi = cities.nairobi || {};
  const dar = cities.dar || {};
  const kampala = cities.kampala || {};
  const alerts = overview?.alerts || [];
  const lake = overview?.lakeVictoria?.currentLevel;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f4c75', mb: 1, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
          East Africa Climate Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live Open-Meteo monitoring for Kenya, Tanzania, and Uganda
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            East Africa Map
          </Typography>
          <Suspense fallback={<Box sx={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map…</Box>}>
            <EastAfricaMap
              onCountrySelect={(id, route) => navigate(route)}
              tooltips={{
                kenya: `Kenya — Nairobi ${fmt(nairobi.temperature, '°C')} | ${nairobi.weather || '—'} | AQI ${fmt(nairobi.aqi)}`,
                tanzania: `Tanzania — Dar ${fmt(dar.temperature, '°C')} | ${dar.weather || '—'} | AQI ${fmt(dar.aqi)}`,
                uganda: `Uganda — Kampala ${fmt(kampala.temperature, '°C')} | ${kampala.weather || '—'} | AQI ${fmt(kampala.aqi)}`,
              }}
            />
          </Suspense>
        </Grid>

        <Grid item xs={12} md={5}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Regional Avg Temperature"
                value={fmt(overview?.regionalAvgTemp)}
                unit="°C"
                icon={<Thermostat />}
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Regional 7-day Rainfall"
                value={fmt(overview?.regionalRainfall)}
                unit="mm"
                icon={<WaterDrop />}
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Lake Victoria Level"
                value={fmt(lake)}
                unit="m"
                icon={<WaterDrop />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Regional AQI (Key Cities)"
                value={`NBO ${fmt(nairobi.aqi)} | DAR ${fmt(dar.aqi)} | KLA ${fmt(kampala.aqi)}`}
                icon={<Air />}
                color="#4caf50"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {[
          { title: 'Nairobi AQI', snap: nairobi },
          { title: 'Dar es Salaam AQI', snap: dar },
          { title: 'Kampala AQI', snap: kampala },
        ].map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <MetricCard
              title={item.title}
              value={fmt(item.snap.aqi)}
              unit="AQI"
              trend={item.snap.aqi > 50 ? 'up' : 'down'}
              trendValue={item.snap.aqiMeta?.label || item.snap.weather}
              icon={<Air />}
              color={item.snap.aqi > 50 ? '#ff9800' : '#4caf50'}
            />
          </Grid>
        ))}
      </Grid>

      {insights.length > 0 && (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            AI Insight Spotlight
          </Typography>
          <AIInsightCard insight={insights[0]} timestamp={overview?.lastUpdated} featured />
        </Box>
      )}

      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Extreme Weather Alerts
        </Typography>
        {alerts.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 2 }}>
            {alerts.map((alert) => (
              <Grid item xs={12} md={6} key={alert._id || alert.id || alert.location}>
                <AlertCard {...alert} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="success">No active weather alerts at this time.</Alert>
        )}
      </Box>

      {insights.length > 1 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Recent AI Insights
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {insights.slice(1, 4).map((insight, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AIInsightCard insight={insight} timestamp={overview?.lastUpdated} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: { xs: 3, md: 4 }, pt: { xs: 2, md: 3 }, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {overview?.lastUpdated ? new Date(overview.lastUpdated).toLocaleString() : 'Just now'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Data sources: Open-Meteo weather and air quality
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
