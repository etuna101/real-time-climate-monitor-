import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Kenya from './pages/Kenya';
import Tanzania from './pages/Tanzania';
import Uganda from './pages/Uganda';
import AIInsights from './pages/AIInsights';
import About from './pages/About';
import './App.css';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0f4c75',
      light: '#3282b8',
    },
    secondary: {
      main: '#1b5e20',
      light: '#00bcd4',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/kenya" element={<Kenya />} />
            <Route path="/tanzania" element={<Tanzania />} />
            <Route path="/uganda" element={<Uganda />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
