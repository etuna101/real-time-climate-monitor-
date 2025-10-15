import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Climate API endpoints
export const climateAPI = {
  getGlobalData: () => api.get('/climate/global'),
  getHistoricalData: (params) => api.get('/climate/historical', { params }),
  getLocationData: (locationId) => api.get(`/climate/location/${locationId}`),
  getWeatherAlerts: () => api.get('/climate/alerts'),
  getAirQuality: (location) => api.get(`/climate/air-quality/${location}`),
  getSeaLevelData: () => api.get('/climate/sea-level'),
  getGlacierData: () => api.get('/climate/glaciers'),
};

// AI API endpoints
export const aiAPI = {
  getInsights: () => api.get('/ai/insights'),
  askQuestion: (question) => api.post('/ai/ask', { question }),
  generateReport: (data) => api.post('/ai/generate-report', data),
  getCorrelation: (metric1, metric2) => 
    api.get('/ai/correlation', { params: { metric1, metric2 } }),
  getPredictions: (metric, years) => 
    api.get(`/ai/predictions/${metric}`, { params: { years } }),
};

// Health check
export const healthCheck = () => axios.get('http://localhost:5000/health');

export default api;
