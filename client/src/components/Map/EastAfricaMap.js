import React from 'react';
import { Box, Tooltip } from '@mui/material';

// Simple, lightweight SVG map focusing on Kenya, Tanzania, and Uganda.
// Paths are schematic placeholders for interactivity and layout; can be replaced with detailed SVG later.
const countryShapes = [
  {
    id: 'kenya',
    name: 'Kenya',
    d: 'M160,80 L220,80 L240,120 L220,160 L160,160 L140,120 Z',
    fill: '#e3f2fd',
    stroke: '#0f4c75',
  },
  {
    id: 'uganda',
    name: 'Uganda',
    d: 'M140,60 L180,60 L190,80 L180,100 L140,100 L130,80 Z',
    fill: '#e8f5e9',
    stroke: '#0f4c75',
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    d: 'M180,160 L240,160 L260,200 L230,230 L180,220 L160,190 Z',
    fill: '#fff8e1',
    stroke: '#0f4c75',
  },
];

const countryPathToRoute = {
  kenya: '/kenya',
  tanzania: '/tanzania',
  uganda: '/uganda',
};

const EastAfricaMap = ({ onCountrySelect, tooltips = {} }) => {
  const handleClick = (id) => {
    if (onCountrySelect) onCountrySelect(id, countryPathToRoute[id]);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 380,
        borderRadius: 2,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f8fbff 0%, #f5f7fa 100%)',
        border: '1px solid #e0e0e0',
      }}
    >
      <svg viewBox="100 40 200 220" width="100%" height="100%">
        {/* Lake Victoria simplified */}
        <ellipse cx="170" cy="120" rx="16" ry="12" fill="#bbdefb" opacity="0.6" />

        {countryShapes.map((c) => (
          <Tooltip
            key={c.id}
            title={tooltips[c.id] || c.name}
            arrow
            placement="top"
          >
            <path
              d={c.d}
              fill={c.fill}
              stroke={c.stroke}
              strokeWidth={1.5}
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick(c.id)}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
            />
          </Tooltip>
        ))}

        {/* Labels */}
        <text x="185" y="120" fontSize="8" fill="#0f4c75">Lake Victoria</text>
        <text x="175" y="95" fontSize="9" fill="#0f4c75">Uganda</text>
        <text x="185" y="140" fontSize="9" fill="#0f4c75">Kenya</text>
        <text x="205" y="195" fontSize="9" fill="#0f4c75">Tanzania</text>
      </svg>
    </Box>
  );
};

export default EastAfricaMap;



