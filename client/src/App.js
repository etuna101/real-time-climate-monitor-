import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
// Route-level code splitting to reduce initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Kenya = lazy(() => import('./pages/Kenya'));
const Tanzania = lazy(() => import('./pages/Tanzania'));
const Uganda = lazy(() => import('./pages/Uganda'));
const AIInsights = lazy(() => import('./pages/AIInsights'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const RequireAuth = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
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
      <AuthProvider>
        <Router>
          <Layout>
            <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
                <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
                <Route path="/kenya" element={<RequireAuth><Kenya /></RequireAuth>} />
                <Route path="/tanzania" element={<RequireAuth><Tanzania /></RequireAuth>} />
                <Route path="/uganda" element={<RequireAuth><Uganda /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
                <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
