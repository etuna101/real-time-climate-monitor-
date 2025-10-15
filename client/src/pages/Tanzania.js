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

const Tanzania = () => {
  return (
    <Box>
      {/* Country Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#0f4c75' }}>
            🇹🇿 Tanzania
          </Typography>
          <Chip label="Masika Season" color="primary" />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Real-time climate monitoring for Tanzania's agricultural and urban regions
        </Typography>
      </Box>

      {/* Capital City Monitor - Dodoma */}
      <Card elevation={0} sx={{ mb: 4, border: '2px solid #0f4c75' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Dodoma - Capital City Monitor
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Temperature"
                value="26"
                unit="°C"
                icon={<Thermostat />}
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Weather"
                value="Clear"
                icon={<WbSunny />}
                color="#ffc107"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Humidity"
                value="55"
                unit="%"
                icon={<Water />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Air Quality (AQI)"
                value="42"
                icon={<Air />}
                color="#4caf50"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dar es Salaam Monitor */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Dar es Salaam - Economic Hub
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Temperature"
                value="29"
                unit="°C"
                icon={<Thermostat />}
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Weather"
                value="Humid"
                icon={<WbSunny />}
                color="#ffc107"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Humidity"
                value="78"
                unit="%"
                icon={<Water />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Air Quality (AQI)"
                value="58"
                icon={<Air />}
                color="#ff9800"
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
              Southern Highlands Agricultural Belt
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Soil Moisture
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                  58%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Below optimal - irrigation recommended
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Precipitation (7 days)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                  45mm
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  -25% below average
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Avg Temperature
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                  23°C
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Suitable for coffee and tea
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
            <strong>Current Analysis:</strong> The Southern Highlands are experiencing below-average rainfall 
            this season. Soil moisture at 58% is below optimal levels for most crops. Drought conditions are 
            developing in some areas.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
            <strong>Short-term Forecast (4 weeks):</strong> Weather models suggest limited rainfall in the 
            coming weeks. The current drought in Tanzania is affecting hydropower generation at major dams, 
            with reservoir levels 18% below normal.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            <strong>Recommendation:</strong> Farmers should implement water conservation measures immediately. 
            Consider drought-resistant crop varieties for the next planting season. Irrigation systems should 
            be prioritized for high-value crops like coffee and tea.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.9 }}>
            Based on regional rainfall patterns, reservoir levels, and soil moisture data
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
              Southern Highlands
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Coffee, tea, pyrethrum | Status: Drought risk - monitoring
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Northern Zone
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Maize, wheat, beans | Status: Fair conditions
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Lake Zone
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Cotton, rice, cassava | Status: Normal conditions
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Coastal Zone
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Coconut, cashew, sisal | Status: Good conditions
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Tanzania;
