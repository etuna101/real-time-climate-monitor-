import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import './Header.css';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        color: '#212121',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          East Africa Climate Monitor
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!token ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Sign in</Button>
              <Button variant="contained" onClick={() => navigate('/signup')}>Create account</Button>
            </>
          ) : (
            <>
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={() => navigate('/notifications')}>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton color="inherit" onClick={() => navigate('/settings')}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Profile">
                <IconButton sx={{ ml: 1 }} onClick={() => navigate('/profile')}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: '#0f4c75',
                      fontSize: '0.875rem',
                    }}
                  >
                    U
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
