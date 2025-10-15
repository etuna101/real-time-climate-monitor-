import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  Thermostat,
  WbSunny,
  Water,
  Air,
  Agriculture,
} from '@mui/icons-material';
import MetricCard from '../components/Cards/MetricCard';

const Kenya = () => {
  return (
    <Box>
      {/* Country Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#0f4c75' }}>
            🇰🇪 Kenya
          </Typography>
          <Chip label="Long Rains Season" color="primary" />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Real-time climate monitoring for Kenya's agricultural and urban regions
        </Typography>
      </Box>

      {/* Capital City Monitor - Nairobi */}
      <Card elevation={0} sx={{ mb: 4, border: '2px solid #0f4c75' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Nairobi - Capital City Monitor
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Temperature"
                value="22"
                unit="°C"
                icon={<Thermostat />}
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Weather"
                value="Partly Cloudy"
                icon={<WbSunny />}
                color="#ffc107"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Humidity"
                value="68"
                unit="%"
                icon={<Water />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Air Quality (AQI)"
                value="48"
                icon={<Air />}
                color="#4caf50"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Agricultural Belt Dashboard */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #1b5e20', backgroundColor: '#f1f8e9' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Agriculture sx={{ color: '#1b5e20', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1b5e20' }}>
              Central Highlands Agricultural Belt
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Soil Moisture
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  72%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Optimal for maize cultivation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Precipitation (7 days)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                  125mm
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  +15% above average
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Avg Temperature
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                  19°C
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ideal for tea production
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AI-Powered Local Impact Forecast */}
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
            <strong>Current Analysis:</strong> Soil moisture levels in the Central Highlands are at 72%, 
            which is optimal for the current planting season. The recent rainfall pattern indicates favorable 
            conditions for maize and tea cultivation.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
            <strong>Short-term Forecast (4 weeks):</strong> The Indian Ocean Dipole positive phase suggests 
            continued above-average rainfall in the highlands. Farmers should prepare for optimal planting 
            conditions but monitor for potential waterlogging in low-lying areas.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            <strong>Recommendation:</strong> This is an ideal time for planting maize and beans. Ensure proper 
            drainage systems are in place. Tea farmers should expect good yields this season.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.9 }}>
            Based on IOD analysis, historical patterns, and current soil conditions
          </Typography>
        </CardContent>
      </Card>

      {/* Regional Summary */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f7fa', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Key Agricultural Regions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Central Highlands
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Tea, coffee, maize, beans | Status: Optimal conditions
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Rift Valley
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Wheat, barley, pyrethrum | Status: Monitoring drought risk
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Western Region
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Sugarcane, maize | Status: Good rainfall
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Coastal Region
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Coconut, cashew nuts | Status: Normal conditions
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Kenya;
