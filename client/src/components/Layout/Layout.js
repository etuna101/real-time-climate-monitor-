import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box className="layout-container">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      <Box className="main-content" sx={{ marginLeft: sidebarOpen && !isMobile ? '260px' : '0' }}>
        <Header toggleSidebar={toggleSidebar} />
        <Box className="content-area">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
