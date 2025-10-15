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

const Uganda = () => {
  return (
    <Box>
      {/* Country Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#0f4c75' }}>
            🇺🇬 Uganda
          </Typography>
          <Chip label="First Rainy Season" color="primary" />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Real-time climate monitoring for Uganda's agricultural and urban regions
        </Typography>
      </Box>

      {/* Capital City Monitor - Kampala */}
      <Card elevation={0} sx={{ mb: 4, border: '2px solid #0f4c75' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Kampala - Capital City Monitor
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Temperature"
                value="25"
                unit="°C"
                icon={<Thermostat />}
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Weather"
                value="Scattered Showers"
                icon={<WbSunny />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Humidity"
                value="75"
                unit="%"
                icon={<Water />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Air Quality (AQI)"
                value="45"
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
              Central Region Agricultural Belt
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Soil Moisture
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                  62%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  15% below 10-year average
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Precipitation (7 days)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                  95mm
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Near average for this period
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Avg Temperature
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                  24°C
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ideal for banana and coffee
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
            <strong>Current Analysis:</strong> Current soil moisture levels in the Central Region are 62%, 
            which is 15% below the 10-year average for this period. While recent rainfall has been near normal, 
            the soil moisture deficit suggests water stress for maturing crops.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
            <strong>Short-term Forecast (4 weeks):</strong> Weather models indicate continued scattered rainfall 
            patterns typical of the first rainy season. However, the intensity may be insufficient to fully 
            replenish soil moisture levels in some areas.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            <strong>Recommendation:</strong> Farmers should implement water conservation measures for maturing 
            crops, especially maize and beans. Consider mulching to retain soil moisture. Coffee and banana 
            plantations should be monitored closely. Supplemental irrigation may be needed for high-value crops.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.9 }}>
            Based on soil moisture analysis, rainfall patterns, and crop water requirements
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
              Central Region
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Banana, coffee, maize | Status: Monitoring soil moisture
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Eastern Region
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Coffee, cotton, millet | Status: Good conditions
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Western Region
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Tea, banana, beans | Status: Optimal rainfall
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Northern Region
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Main crops: Sorghum, millet, cassava | Status: Fair conditions
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Uganda;
