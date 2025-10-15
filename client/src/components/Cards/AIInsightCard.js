import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Psychology, AutoAwesome } from '@mui/icons-material';

const AIInsightCard = ({ insight, timestamp, featured = false }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: featured ? '2px solid #9c27b0' : '1px solid #e0e0e0',
        borderRadius: 2,
        background: featured 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'white',
        color: featured ? 'white' : 'inherit',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {featured ? (
            <AutoAwesome sx={{ color: 'white' }} />
          ) : (
            <Psychology sx={{ color: '#9c27b0' }} />
          )}
          <Chip
            label="AI Insight"
            size="small"
            sx={{
              backgroundColor: featured ? 'rgba(255,255,255,0.2)' : '#9c27b015',
              color: featured ? 'white' : '#9c27b0',
              fontWeight: 600,
              border: featured ? '1px solid rgba(255,255,255,0.3)' : 'none',
            }}
          />
        </Box>

        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 500,
            lineHeight: 1.6,
            mb: 2,
            color: featured ? 'white' : 'text.primary',
          }}
        >
          {insight}
        </Typography>

        {timestamp && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: featured ? 'rgba(255,255,255,0.8)' : 'text.secondary',
              display: 'block',
            }}
          >
            Generated: {new Date(timestamp).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
