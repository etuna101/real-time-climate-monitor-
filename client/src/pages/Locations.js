import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  LocationOn,
  Thermostat,
  WbSunny,
  Water,
  Air,
} from '@mui/icons-material';
import MetricCard from '../components/Cards/MetricCard';

const popularCities = [
  'New York', 'London', 'Tokyo', 'Paris', 'Sydney',
  'Mumbai', 'Cairo', 'São Paulo', 'Beijing', 'Moscow'
];

const Locations = () => {
  const [selectedCity, setSelectedCity] = useState('New York');

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f4c75', mb: 1 }}>
          Location-Specific Climate Data
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore climate conditions and forecasts for specific cities and regions
        </Typography>
      </Box>

      {/* Location Search */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOn sx={{ color: '#0f4c75' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Select Location
            </Typography>
          </Box>
          
          <Autocomplete
            value={selectedCity}
            onChange={(event, newValue) => setSelectedCity(newValue)}
            options={popularCities}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for a city or region"
                placeholder="Type to search..."
                fullWidth
              />
            )}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Popular:
            </Typography>
            {popularCities.slice(0, 5).map((city) => (
              <Chip
                key={city}
                label={city}
                onClick={() => setSelectedCity(city)}
                variant={selectedCity === city ? 'filled' : 'outlined'}
                color={selectedCity === city ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Current Conditions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Current Conditions - {selectedCity}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Temperature"
              value="22.5"
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
              value="65"
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
      </Box>

      {/* 7-Day Forecast */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            7-Day Forecast
          </Typography>
          <Grid container spacing={2}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <Grid item xs={12} sm={6} md key={day}>
                <Box
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: '#f5f7fa',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {day}
                  </Typography>
                  <WbSunny sx={{ color: '#ffc107', fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {23 + index}°
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {15 + index}°
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Historical Climate Data */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Historical Climate Data
          </Typography>
          <Box 
            sx={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f5f7fa',
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">
              Historical temperature and precipitation chart for {selectedCity}
            </Typography>
          </Box>
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
            <LocationOn />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI-Powered Local Impact Forecast
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            Based on current warming trends, heatwaves in {selectedCity} are projected to be 
            <strong> 3x more frequent by 2050</strong>. Average summer temperatures are expected 
            to increase by 2-3°C, with more extreme precipitation events during winter months.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.9 }}>
            Projection based on RCP 4.5 scenario (moderate emissions)
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Locations;
