# 🌍 Climate Dashboard - Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (optional - app works without it in demo mode)

## Installation Steps

### 1. Install Root Dependencies
```bash
cd climate-dashboard
npm install
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

## Running the Application

### Option 1: Run Both (Recommended)
From the root directory:
```bash
npm run dev
```
This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Features Available

### ✅ Dashboard Page
- Global climate metrics (Temperature, CO₂, Sea Level, Glaciers)
- Real-time weather alerts
- AI-powered insights spotlight
- Beautiful card-based UI

### ✅ Analytics Page
- Historical climate trends
- Time range filters (10 years, 50 years, all data)
- AI correlation engine
- Multiple chart placeholders (ready for Chart.js integration)
- PDF report generation button

### ✅ Locations Page
- City/region search with autocomplete
- Current weather conditions
- 7-day forecast
- Historical climate data
- AI-powered local impact forecasts

### ✅ AI Insights Page
- Interactive AI chat interface
- Natural language Q&A
- Latest AI-generated insights
- Climate predictions (2050, 2100)
- Methodology explanations

### ✅ About Page
- Project overview
- Technology stack
- Data sources with links
- Open source information

## API Endpoints Available

### Climate Data
- `GET /api/climate/global` - Global climate metrics
- `GET /api/climate/historical` - Historical data
- `GET /api/climate/location/:id` - Location-specific data
- `GET /api/climate/alerts` - Weather alerts
- `GET /api/climate/air-quality/:location` - Air quality
- `GET /api/climate/sea-level` - Sea level data
- `GET /api/climate/glaciers` - Glacier data

### AI Features
- `GET /api/ai/insights` - AI-generated insights
- `POST /api/ai/ask` - Ask questions to AI
- `POST /api/ai/generate-report` - Generate reports
- `GET /api/ai/correlation` - Correlation analysis
- `GET /api/ai/predictions/:metric` - Predictions

## Troubleshooting

### MongoDB Connection Error
**Issue:** Server shows MongoDB connection error
**Solution:** The app works in demo mode without MongoDB. All endpoints return mock data.

To enable database:
1. Install MongoDB locally, OR
2. Use MongoDB Atlas (free cloud database), OR
3. Run `docker-compose up mongodb`

### Port Already in Use
**Issue:** Port 3000 or 5000 already in use
**Solution:** 
- Kill the process using the port, OR
- Change the port in `.env` (server) or package.json (client)

### Module Not Found
**Issue:** Missing dependencies
**Solution:** 
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps for Enhancement

### 1. Add Real Charts (Chart.js)
The placeholders in Analytics page are ready for Chart.js integration:
```javascript
import { Line, Bar, Scatter } from 'react-chartjs-2';
```

### 2. Add Interactive Map (Leaflet)
Create a GlobalMap component using react-leaflet:
```javascript
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
```

### 3. Connect Real APIs
Replace mock data with real climate APIs:
- OpenWeatherMap for weather data
- NASA APIs for climate data
- OpenAI for AI features

### 4. Add Authentication
Implement user authentication:
- JWT tokens
- User profiles
- Saved locations
- Custom alerts

### 5. Database Integration
Create MongoDB models for:
- User data
- Saved searches
- Historical data caching
- Custom alerts

## Environment Variables

Create `.env` in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/climate-dashboard
NODE_ENV=development
OPENAI_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
JWT_SECRET=your_secret_here
```

## Design System

### Colors
- Primary Blue: `#0f4c75`
- Ice Blue: `#3282b8`
- Eco Green: `#1b5e20`
- Teal: `#00bcd4`
- Amber (alerts): `#ff9800`
- Red (danger): `#f44336`

### Typography
- Font: Inter
- Headings: 600-700 weight
- Body: 400 weight

## Project Structure
```
climate-dashboard/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       │   ├── Layout/     # Layout components
│       │   ├── Cards/      # Card components
│       │   ├── Charts/     # Chart components (to be implemented)
│       │   ├── Map/        # Map components (to be implemented)
│       │   └── AIChat/     # AI chat components (to be implemented)
│       ├── pages/          # Page components
│       ├── utils/          # Utility functions
│       └── context/        # Context providers
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── config/             # Configuration files
└── docker-compose.yml      # Docker configuration
```

## Support & Resources

- **Documentation:** See README.md and SETUP_GUIDE.md
- **Progress:** See PROGRESS.md for completed features
- **Issues:** Report bugs or request features on GitHub

## License
MIT License - Feel free to use this project for learning and development!

---

**Built with ❤️ for a sustainable future** 🌱
