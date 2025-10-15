import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';

const AlertCard = ({ type, severity, location, description, startTime }) => {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'extreme':
        return { color: '#f44336', icon: <Error />, label: 'Extreme' };
      case 'high':
        return { color: '#ff9800', icon: <Warning />, label: 'High' };
      case 'moderate':
        return { color: '#ffc107', icon: <Info />, label: 'Moderate' };
      default:
        return { color: '#2196f3', icon: <Info />, label: 'Info' };
    }
  };

  const config = getSeverityConfig();

  return (
    <Card 
      elevation={0}
      sx={{ 
        border: `2px solid ${config.color}`,
        borderRadius: 2,
        backgroundColor: `${config.color}08`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ color: config.color, mt: 0.5 }}>
            {config.icon}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={config.label}
                size="small"
                sx={{
                  backgroundColor: config.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {location}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {description}
            </Typography>

            {startTime && (
              <Typography variant="caption" color="text.secondary">
                Started: {new Date(startTime).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
