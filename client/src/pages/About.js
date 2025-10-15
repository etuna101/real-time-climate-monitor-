import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Link,
  Divider,
} from '@mui/material';
import {
  Public,
  Code,
  DataObject,
  Psychology,
  GitHub,
} from '@mui/icons-material';

const About = () => {
  const technologies = [
    'React', 'Node.js', 'Express', 'MongoDB', 'Material-UI',
    'Chart.js', 'Leaflet', 'Axios', 'Docker'
  ];

  const dataSources = [
    { name: 'NASA GISS', description: 'Global temperature data', url: 'https://data.giss.nasa.gov/' },
    { name: 'NOAA', description: 'Climate and weather data', url: 'https://www.noaa.gov/' },
    { name: 'IPCC', description: 'Climate change assessments', url: 'https://www.ipcc.ch/' },
    { name: 'ESRL', description: 'CO₂ monitoring data', url: 'https://www.esrl.noaa.gov/' },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f4c75', mb: 1 }}>
          About Climate Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A comprehensive platform for real-time climate monitoring and AI-powered insights
        </Typography>
      </Box>

      {/* Project Overview */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Public sx={{ color: '#0f4c75', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Project Overview
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
            The Climate Dashboard is a full-stack MERN application designed to provide 
            real-time climate data visualization, historical trend analysis, and AI-powered 
            predictions. Our mission is to make climate science accessible and actionable 
            for researchers, businesses, and the general public.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            By aggregating data from trusted sources like NASA, NOAA, and the IPCC, we offer 
            a comprehensive view of our changing climate. Our AI integration provides intelligent 
            insights and helps users understand complex climate relationships through natural 
            language interactions.
          </Typography>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Key Features
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DataObject sx={{ color: '#2196f3', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Real-Time Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Live monitoring of global temperature, CO₂ levels, sea level rise, 
                    and other critical climate indicators.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Psychology sx={{ color: '#9c27b0', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    AI Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered analysis, predictions, and natural language Q&A to help 
                    understand complex climate patterns.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Public sx={{ color: '#4caf50', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Location-Specific
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detailed climate data and forecasts for specific cities and regions 
                    around the world.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Code sx={{ color: '#ff9800', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Interactive Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Explore historical trends, correlations between metrics, and generate 
                    custom reports.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Code sx={{ color: '#0f4c75' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Technology Stack
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {technologies.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Frontend
              </Typography>
              <Typography variant="body2" color="text.secondary">
                React, Material-UI, Chart.js, Leaflet
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Backend
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Node.js, Express, MongoDB, RESTful API
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Deployment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Docker, Docker Compose, CI/CD Ready
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card elevation={0} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DataObject sx={{ color: '#0f4c75' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Data Sources
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We aggregate data from the world's most trusted climate research organizations:
          </Typography>
          <Grid container spacing={2}>
            {dataSources.map((source) => (
              <Grid item xs={12} sm={6} key={source.name}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#0f4c75',
                      backgroundColor: '#f5f7fa',
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {source.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {source.description}
                  </Typography>
                  <Link
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    Visit Website →
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* GitHub & Contact */}
      <Card 
        elevation={0} 
        sx={{ 
          border: '1px solid #e0e0e0',
          background: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 100%)',
          color: 'white',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <GitHub sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Open Source
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            This project is open source and available on GitHub. Contributions, issues, 
            and feature requests are welcome!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label="View on GitHub"
              onClick={() => window.open('https://github.com', '_blank')}
              sx={{
                backgroundColor: 'white',
                color: '#0f4c75',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
            <Chip
              label="Report an Issue"
              variant="outlined"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ for a sustainable future
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          © 2025 Climate Dashboard. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default About;
