import React, { useState, useEffect, Suspense } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Thermostat,
  Air,
  WaterDrop,
  AcUnit,
} from '@mui/icons-material';
import MetricCard from '../components/Cards/MetricCard';
import AlertCard from '../components/Cards/AlertCard';
import AIInsightCard from '../components/Cards/AIInsightCard';
import { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { climateAPI, aiAPI } from '../utils/api';
const EastAfricaMap = lazy(() => import('../components/Map/EastAfricaMap'));

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [seaLevel, setSeaLevel] = useState(null);
  const [glacierData, setGlacierData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        globalResponse,
        alertsResponse,
        insightsResponse,
        seaLevelResponse,
        glacierResponse,
      ] = await Promise.all([
        climateAPI.getGlobalData(),
        climateAPI.getWeatherAlerts(),
        aiAPI.getInsights(),
        climateAPI.getSeaLevelData(),
        climateAPI.getGlacierData(),
      ]);

      setGlobalData(globalResponse.data);
      setAlerts(alertsResponse.data);
      setInsights(insightsResponse.data.insights);
      setSeaLevel(seaLevelResponse.data);
      setGlacierData(glacierResponse.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Page Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#0f4c75', 
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          East Africa Climate Overview
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Real-time monitoring for Kenya, Tanzania, and Uganda
        </Typography>
      </Box>

      {/* Regional Map */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} md={7}>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 600, mb: 1 }}
          >
            East Africa Map
          </Typography>
          <Suspense fallback={<Box sx={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map…</Box>}>
          <EastAfricaMap
            onCountrySelect={(id, route) => navigate(route)}
            tooltips={{
              kenya: 'Kenya — Nairobi AQI: 48 | Rainfall: +15% | Temp: 22°C',
              tanzania: 'Tanzania — Dar es Salaam AQI: 58 | Rainfall: -25% | Temp: 29°C',
              uganda: 'Uganda — Kampala AQI: 45 | Rainfall: ~ | Temp: 25°C',
            }}
          />
          </Suspense>
        </Grid>

        {/* Regional Key Metrics */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Regional Avg Temperature"
                value="24.5"
                unit="°C"
                trend="up"
                trendValue="+1.2°C above normal"
                icon={<Thermostat />}
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Regional Rainfall"
                value="85"
                unit="mm"
                trend="down"
                trendValue="-15% below average"
                icon={<WaterDrop />}
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Lake Victoria Level"
                value="1133.2"
                unit="m"
                trend="down"
                trendValue="-0.3m this month"
                icon={<WaterDrop />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <MetricCard
                title="Regional AQI (Key Cities)"
                value="NBO 48 | DAR 58 | KLA 45"
                unit=""
                trend="up"
                trendValue="Moderate"
                icon={<Air />}
                color="#4caf50"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Additional Regional Widgets */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Nairobi AQI"
            value="48"
            unit="AQI"
            trend="up"
            trendValue="Moderate"
            icon={<Air />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Dar es Salaam AQI"
            value="58"
            unit="AQI"
            trend="up"
            trendValue="Moderate"
            icon={<Air />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Kampala AQI"
            value="45"
            unit="AQI"
            trend="down"
            trendValue="Good"
            icon={<Air />}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      {/* AI Insight Spotlight */}
      {insights && insights.length > 0 && (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            AI Insight Spotlight
          </Typography>
          <AIInsightCard
            insight="AI Analysis: Elevated Indian Ocean Dipole suggests a high probability of above-average short rains in the Kenyan highlands over the next 4 weeks."
            timestamp={new Date().toISOString()}
            featured={true}
          />
        </Box>
      )}

      {/* Extreme Weather Alerts */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          Extreme Weather Alerts
        </Typography>
        {alerts && alerts.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 2 }}>
            {alerts.map((alert) => (
              <Grid item xs={12} sm={12} md={6} key={alert.id}>
                <AlertCard {...alert} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="success">No active weather alerts at this time.</Alert>
        )}
      </Box>

      {/* Additional Insights */}
      {insights && insights.length > 1 && (
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Recent AI Insights
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {insights.slice(1, 4).map((insight, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AIInsightCard
                  insight={insight}
                  timestamp={new Date().toISOString()}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Data Source Footer */}
      <Box sx={{ mt: { xs: 3, md: 4 }, pt: { xs: 2, md: 3 }, borderTop: '1px solid #e0e0e0' }}>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
        >
          Last updated: {globalData?.lastUpdated ? new Date(globalData.lastUpdated).toLocaleString() : 'Just now'}
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            mt: 0.5,
            fontSize: { xs: '0.7rem', sm: '0.75rem' }
          }}
        >
          Data sources: {globalData?.source || 'NASA GISS, NOAA, ESRL'}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
