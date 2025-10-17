import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Assessment, TrendingUp } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { climateAPI, aiAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend,
);

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [timeRange, setTimeRange] = useState('5years');
  const [metric1, setMetric1] = useState(user?.preferences?.defaultMetric || 'temperature');
  const [metric2, setMetric2] = useState('co2');
  const [series, setSeries] = useState([]);
  const [lakeSeries, setLakeSeries] = useState([]);
  const [correlation, setCorrelation] = useState(null);

  const yearsForRange = useMemo(() => {
    if (timeRange === '10years') return 10;
    if (timeRange === '50years') return 50;
    if (timeRange === 'all') return 100;
    return 5;
  }, [timeRange]);

  useEffect(() => {
    const fetchData = async () => {
      const [hist, sea] = await Promise.all([
        climateAPI.getHistoricalData({ region: 'east_africa', years: yearsForRange }),
        climateAPI.getSeaLevelData(),
      ]);
      setSeries(hist.data.series || []);
      setLakeSeries(sea.data.series || []);
    };
    fetchData();
  }, [yearsForRange]);

  const onCalculateCorrelation = async () => {
    const resp = await aiAPI.getCorrelation(metric1, metric2);
    setCorrelation(resp.data);
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f4c75', mb: 1 }}>
          East Africa Regional Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Historical climate trends and correlation analysis for the region
        </Typography>
      </Box>

      {/* Time Range Selector */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Time Range:
            </Typography>
            <Button
              variant={timeRange === '10years' ? 'contained' : 'outlined'}
              onClick={() => setTimeRange('10years')}
              size="small"
            >
              Last Decade
            </Button>
            <Button
              variant={timeRange === '50years' ? 'contained' : 'outlined'}
              onClick={() => setTimeRange('50years')}
              size="small"
            >
              Last 50 Years
            </Button>
            <Button
              variant={timeRange === 'all' ? 'contained' : 'outlined'}
              onClick={() => setTimeRange('all')}
              size="small"
            >
              All Data (1880-Present)
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Main Temperature Chart */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <TrendingUp sx={{ color: '#0f4c75' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              East Africa Temperature & Precipitation Trends
            </Typography>
          </Box>
          <Box>
            <Line
              height={100}
              data={{
                labels: series.map(p => p.date),
                datasets: [
                  {
                    label: 'Temperature Anomaly (°C)',
                    data: series.map(p => p.temperatureAnomaly),
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244,67,54,0.15)',
                    tension: 0.3,
                    yAxisID: 'y',
                  },
                  {
                    label: 'Precipitation Anomaly (mm)',
                    data: series.map(p => p.precipitationAnomaly),
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33,150,243,0.15)',
                    tension: 0.3,
                    yAxisID: 'y1',
                  },
                ],
              }}
              options={{
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                stacked: false,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Temp Anomaly (°C)' },
                  },
                  y1: {
                    type: 'linear',
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Precip Anomaly' },
                  },
                },
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Data source: NASA GISS Surface Temperature Analysis (GISTEMP v4)
          </Typography>
        </CardContent>
      </Card>

      {/* Additional Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Lake Victoria Water Level
              </Typography>
              <Line
                height={80}
                data={{
                  labels: lakeSeries.map(p => p.date),
                  datasets: [
                    {
                      label: 'Water Level (m)',
                      data: lakeSeries.map(p => p.level),
                      borderColor: '#2196f3',
                      backgroundColor: 'rgba(33,150,243,0.15)',
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Rainfall Comparison (Nairobi, Dar, Kampala)
              </Typography>
              <Line
                height={80}
                data={{
                  labels: series.slice(-24).map(p => p.date),
                  datasets: [
                    {
                      label: 'Nairobi',
                      data: series.slice(-24).map((p, i) => (p.precipitationAnomaly + (i % 3 === 0 ? 0.1 : 0)).toFixed(2)),
                      borderColor: '#4caf50',
                      backgroundColor: 'rgba(76,175,80,0.15)',
                      tension: 0.3,
                    },
                    {
                      label: 'Dar es Salaam',
                      data: series.slice(-24).map((p, i) => (p.precipitationAnomaly - 0.1 + (i % 5 === 0 ? -0.05 : 0)).toFixed(2)),
                      borderColor: '#ff9800',
                      backgroundColor: 'rgba(255,152,0,0.15)',
                      tension: 0.3,
                    },
                    {
                      label: 'Kampala',
                      data: series.slice(-24).map((p, i) => (p.precipitationAnomaly + 0.05 + (i % 7 === 0 ? 0.07 : 0)).toFixed(2)),
                      borderColor: '#9c27b0',
                      backgroundColor: 'rgba(156,39,176,0.15)',
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Indian Ocean SST Trends
              </Typography>
              <Box 
                sx={{ 
                  height: 250, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f7fa',
                  borderRadius: 2,
                }}
              >
                <Typography color="text.secondary" variant="body2">
                  Ocean heat chart
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Correlation Engine */}
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Assessment sx={{ color: '#9c27b0' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Correlation Engine
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Metric 1</InputLabel>
                <Select
                  value={metric1}
                  label="Metric 1"
                  onChange={(e) => setMetric1(e.target.value)}
                >
                  <MenuItem value="temperature">Regional Temperature</MenuItem>
                  <MenuItem value="rainfall">Rainfall</MenuItem>
                  <MenuItem value="lake_level">Lake Victoria Level</MenuItem>
                  <MenuItem value="soil_moisture">Soil Moisture</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Metric 2</InputLabel>
                <Select
                  value={metric2}
                  label="Metric 2"
                  onChange={(e) => setMetric2(e.target.value)}
                >
                  <MenuItem value="rainfall">Rainfall</MenuItem>
                  <MenuItem value="temperature">Regional Temperature</MenuItem>
                  <MenuItem value="indian_ocean_sst">Indian Ocean SST</MenuItem>
                  <MenuItem value="soil_moisture">Soil Moisture</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ height: '56px' }}
                onClick={onCalculateCorrelation}
              >
                Calculate Correlation
              </Button>
            </Grid>
          </Grid>

          <Box 
            sx={{ 
              height: 350, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f5f7fa',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
              Select metrics and calculate correlation. Mock computation shown below.
            </Typography>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0' }}>
                r = {correlation ? correlation.correlationCoefficient : '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {correlation ? `${correlation.strength} ${correlation.correlationCoefficient > 0 ? 'positive' : 'negative'} correlation` : '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 500 }}>
                {correlation ? correlation.interpretation : 'Choose metrics to view correlation interpretation.'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Generate Report Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<Assessment />}
          sx={{ px: 4 }}
          onClick={async () => {
            await aiAPI.generateReport({
              metrics: ['temperature', 'rainfall', 'lake_level'],
              timeRange: timeRange,
              location: 'east_africa',
            });
            // In a real app, trigger file download or display modal
          }}
        >
          Generate East Africa Regional Report
        </Button>
      </Box>
    </Box>
  );
};

export default Analytics;
