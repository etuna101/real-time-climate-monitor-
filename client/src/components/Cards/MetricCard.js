import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

const MetricCard = ({ title, value, unit, trend, trendValue, icon, color = '#0f4c75' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp fontSize="small" />;
    if (trend === 'down') return <TrendingDown fontSize="small" />;
    return <TrendingFlat fontSize="small" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#f44336';
    if (trend === 'down') return '#4caf50';
    return '#757575';
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ color: color, opacity: 0.8 }}>
              {icon}
            </Box>
          )}
        </Box>

        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            color: color,
            mb: 1,
          }}
        >
          {value}
          {unit && (
            <Typography 
              component="span" 
              variant="h6" 
              sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 400 }}
            >
              {unit}
            </Typography>
          )}
        </Typography>

        {trendValue && (
          <Chip
            icon={getTrendIcon()}
            label={trendValue}
            size="small"
            sx={{
              backgroundColor: `${getTrendColor()}15`,
              color: getTrendColor(),
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: getTrendColor(),
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
