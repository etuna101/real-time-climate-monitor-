import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Flag as FlagIcon,
  Psychology as AIIcon,
  Info as InfoIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import './Sidebar.css';

const menuItems = [
  { text: 'East Africa Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Regional Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Kenya', icon: <FlagIcon />, path: '/kenya' },
  { text: 'Tanzania', icon: <FlagIcon />, path: '/tanzania' },
  { text: 'Uganda', icon: <FlagIcon />, path: '/uganda' },
  { text: 'AI Insights', icon: <AIIcon />, path: '/ai-insights' },
  { text: 'About', icon: <InfoIcon />, path: '/about' },
];

const Sidebar = ({ open, onClose, isMobile }) => {
  const location = useLocation();

  const drawerContent = (
    <Box className="sidebar-content">
      <Box className="sidebar-header">
        <PublicIcon sx={{ fontSize: 40, color: '#0f4c75', marginBottom: 1 }} />
        <Typography variant="h6" className="sidebar-title">
          East Africa Climate Monitor
        </Typography>
        <Typography variant="caption" className="sidebar-subtitle">
          Real-Time Regional Monitoring
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={isMobile ? onClose : undefined}
              sx={{
                borderRadius: '8px',
                margin: '4px 8px',
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  '&:hover': {
                    backgroundColor: '#bbdefb',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#0f4c75' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <Divider sx={{ my: 2 }} />
      
      <Box className="sidebar-footer">
        <Typography variant="caption" color="text.secondary">
          Data sources: NASA, NOAA, IPCC
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          © 2025 Climate Dashboard
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor="left"
          open={open}
          onClose={onClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: 260,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: 260,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 260,
              boxSizing: 'border-box',
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
