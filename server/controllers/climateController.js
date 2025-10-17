const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const OPEN_METEO_BASE = process.env.OPEN_METEO_BASE || 'https://api.open-meteo.com/v1';
const WAQI_TOKEN = process.env.WAQI_TOKEN || '';

// City coordinates for Open-Meteo calls
const CITY_COORDS = {
  nairobi: { lat: -1.286389, lon: 36.817223 },
  dar: { lat: -6.792354, lon: 39.208328 },
  kampala: { lat: 0.347596, lon: 32.58252 },
};

// @desc    Get global climate data
// @route   GET /api/climate/global
// @access  Public
exports.getGlobalData = async (req, res) => {
  try {
    // Mock data - in a real app, this would come from a database or external API
    const globalData = {
      currentTemp: 14.8, // in °C
      tempAnomaly: 1.1, // in °C from pre-industrial
      co2Level: 417.2, // in ppm
      seaLevelRise: 98, // in mm since 1900
      lastUpdated: new Date().toISOString(),
      source: 'NASA GISS, NOAA, ESRL'
    };
    
    res.status(200).json({
      success: true,
      data: globalData
    });
  } catch (error) {
    console.error('Error getting global data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get historical climate data
// @route   GET /api/climate/historical
// @access  Public
exports.getHistoricalData = async (req, res) => {
  try {
    const { region = 'east_africa', metric = 'temperature', years = 5 } = req.query;
    const ClimateReading = require('../models/ClimateReading');
    const since = new Date();
    since.setFullYear(since.getFullYear() - Number(years));
    const rows = await ClimateReading.find({ region, date: { $gte: since } }).sort({ date: 1 }).lean();

    if (rows.length === 0) {
      // Fallback to mock if DB empty
      const points = Number(years) * 12;
      const now = new Date();
      const data = Array.from({ length: points }).map((_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - (points - 1 - i));
        const iso = date.toISOString().slice(0, 10);
        const tempAnomaly = Math.sin(i / 8) * 0.3 + 0.8 + (i / points) * 0.1;
        const precipAnomaly = Math.cos(i / 6) * 0.2 + (i % 12 >= 8 && i % 12 <= 10 ? 0.25 : 0);
        return { date: iso, temperatureAnomaly: Number(tempAnomaly.toFixed(2)), precipitationAnomaly: Number(precipAnomaly.toFixed(2)) };
      });
      return res.status(200).json({ success: true, data: { region, metric, series: data } });
    }

    const series = rows.map((r) => ({
      date: new Date(r.date).toISOString().slice(0, 10),
      temperatureAnomaly: r.temperatureAnomaly,
      precipitationAnomaly: r.precipitationAnomaly,
    }));

    res.status(200).json({ success: true, data: { region, metric, series } });
  } catch (error) {
    console.error('Error getting historical data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get location-specific climate data
// @route   GET /api/climate/location/:locationId
// @access  Public
exports.getLocationData = async (req, res) => {
  try {
    const { locationId } = req.params;
    // Implementation would fetch data for the specific location
    
    res.status(200).json({
      success: true,
      data: {
        location: locationId,
        currentTemp: 22.5,
        weatherCondition: 'Clear',
        airQuality: 45, // AQI
        forecast: [] // Would contain forecast data
      }
    });
  } catch (error) {
    console.error('Error getting location data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get weather alerts
// @route   GET /api/climate/alerts
// @access  Public
exports.getWeatherAlerts = async (req, res) => {
  try {
    const WeatherAlert = require('../models/WeatherAlert');
    const now = new Date();
    const active = await WeatherAlert.find({ endTime: { $gte: now } }).sort({ startTime: -1 }).lean();
    res.status(200).json({ success: true, data: active });
  } catch (error) {
    console.error('Error getting weather alerts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get air quality data
// @route   GET /api/climate/air-quality/:location
// @access  Public
exports.getAirQuality = async (req, res) => {
  try {
    const { location } = req.params;
    const cacheKey = `waqi:${location}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, data: cached });
    }

    const url = `https://api.waqi.info/feed/${encodeURIComponent(location)}/?token=${WAQI_TOKEN}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    if (data.status !== 'ok') {
      return res.status(502).json({ success: false, message: 'WAQI error', details: data?.data });
    }

    const payload = {
      location,
      aqi: data.data.aqi,
      mainPollutant: data.data.dominentpol,
      timestamp: data.data.time?.iso || new Date().toISOString(),
      components: data.data.iaqi || {},
    };

    cache.set(cacheKey, payload, 60); // 1 minute
    res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error('Error getting air quality data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get modeled air quality forecast (Open-Meteo)
// @route   GET /api/climate/air-quality-modeled/:city
// @access  Public
exports.getModeledAirQuality = async (req, res) => {
  try {
    const { city } = req.params;
    const key = city.toLowerCase();
    const coords = CITY_COORDS[key];
    if (!coords) return res.status(400).json({ success: false, message: 'Unsupported city' });

    const cacheKey = `om-aq:${key}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: cached });

    const url = `${OPEN_METEO_BASE}/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm10,pm2_5,carbon_monoxide,ozone,nitrogen_dioxide,sulphur_dioxide&timezone=auto`;
    const { data } = await axios.get(url, { timeout: 8000 });
    cache.set(cacheKey, data, 300); // 5 minutes
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error getting modeled air quality:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get short-term weather and soil moisture (Open-Meteo)
// @route   GET /api/climate/weather/:city
// @access  Public
exports.getCityWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const key = city.toLowerCase();
    const coords = CITY_COORDS[key];
    if (!coords) return res.status(400).json({ success: false, message: 'Unsupported city' });

    const cacheKey = `om-weather:${key}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json({ success: true, data: cached });

    const url = `${OPEN_METEO_BASE}/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,precipitation,soil_moisture_0_to_7cm&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;
    const { data } = await axios.get(url, { timeout: 8000 });
    cache.set(cacheKey, data, 300); // 5 minutes
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error getting city weather:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get sea level data
// @route   GET /api/climate/sea-level
// @access  Public
exports.getSeaLevelData = async (req, res) => {
  try {
    const SeaLevel = require('../models/SeaLevel');
    const rows = await SeaLevel.find({ lake: 'Lake Victoria' }).sort({ date: 1 }).lean();
    if (rows.length === 0) {
      const months = 120;
      const now = new Date();
      const series = Array.from({ length: months }).map((_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - (months - 1 - i));
        const level = 1130 + i * 0.02 + Math.sin(i / 6) * 0.1;
        return { date: date.toISOString().slice(0, 10), level: Number(level.toFixed(2)) };
      });
      return res.status(200).json({ success: true, data: { lake: 'Lake Victoria', currentLevel: series[series.length - 1].level, series, source: 'Mock Regional Hydro Service', lastUpdated: new Date().toISOString() } });
    }
    const series = rows.map((r) => ({ date: new Date(r.date).toISOString().slice(0, 10), level: r.level }));
    const seaLevelData = { lake: 'Lake Victoria', currentLevel: series[series.length - 1]?.level, series, source: 'Hydro Service', lastUpdated: new Date().toISOString() };
    res.status(200).json({ success: true, data: seaLevelData });
  } catch (error) {
    console.error('Error getting sea level data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get glacier mass balance data
// @route   GET /api/climate/glaciers
// @access  Public
exports.getGlacierData = async (req, res) => {
  try {
    // Mock data - in a real app, this would come from a database or external API
    const glacierData = {
      annualMassChange: -0.8, // meters water equivalent per year
      cumulativeChange: -24.5, // meters water equivalent since 1961
      source: 'WGMS',
      lastUpdated: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: glacierData
    });
  } catch (error) {
    console.error('Error getting glacier data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
