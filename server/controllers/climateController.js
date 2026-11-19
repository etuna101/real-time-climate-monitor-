const axios = require('axios');
const { isDbReady } = require('../utils/db');
const memory = require('../utils/memoryStore');
const { CITY_COORDS, getCitySnapshot, getOverview, cache } = require('../utils/weather');

const WAQI_TOKEN = process.env.WAQI_TOKEN || '';

function mockHistorical(years) {
  const points = Number(years) * 12;
  const now = new Date();
  return Array.from({ length: points }).map((_, i) => {
    const date = new Date(now);
    date.setMonth(now.getMonth() - (points - 1 - i));
    const iso = date.toISOString().slice(0, 10);
    const tempAnomaly = Math.sin(i / 8) * 0.3 + 0.8 + (i / points) * 0.1;
    const precipAnomaly = Math.cos(i / 6) * 0.2 + (i % 12 >= 8 && i % 12 <= 10 ? 0.25 : 0);
    return {
      date: iso,
      temperatureAnomaly: Number(tempAnomaly.toFixed(2)),
      precipitationAnomaly: Number(precipAnomaly.toFixed(2)),
    };
  });
}

function mockLakeSeries() {
  const months = 120;
  const now = new Date();
  return Array.from({ length: months }).map((_, i) => {
    const date = new Date(now);
    date.setMonth(now.getMonth() - (months - 1 - i));
    const level = 1130 + i * 0.02 + Math.sin(i / 6) * 0.1;
    return { date: date.toISOString().slice(0, 10), level: Number(level.toFixed(2)) };
  });
}

exports.getGlobalData = async (req, res) => {
  try {
    const overview = await getOverview();
    const globalData = {
      currentTemp: overview.regionalAvgTemp,
      tempAnomaly: 1.1,
      co2Level: 417.2,
      seaLevelRise: 98,
      lastUpdated: overview.lastUpdated,
      source: 'Open-Meteo, NASA GISS, NOAA',
    };
    res.status(200).json({ success: true, data: globalData });
  } catch (error) {
    console.error('Error getting global data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getHistoricalData = async (req, res) => {
  try {
    const { region = 'east_africa', metric = 'temperature', years = 5 } = req.query;
    if (isDbReady()) {
      const ClimateReading = require('../models/ClimateReading');
      const since = new Date();
      since.setFullYear(since.getFullYear() - Number(years));
      const rows = await ClimateReading.find({ region, date: { $gte: since } }).sort({ date: 1 }).lean();
      if (rows.length) {
        const series = rows.map((r) => ({
          date: new Date(r.date).toISOString().slice(0, 10),
          temperatureAnomaly: r.temperatureAnomaly,
          precipitationAnomaly: r.precipitationAnomaly,
        }));
        return res.status(200).json({ success: true, data: { region, metric, series } });
      }
    }
    res.status(200).json({
      success: true,
      data: { region, metric, series: mockHistorical(years) },
    });
  } catch (error) {
    console.error('Error getting historical data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getLocationData = async (req, res) => {
  try {
    const snapshot = await getCitySnapshot(req.params.locationId);
    if (!snapshot) {
      return res.status(400).json({ success: false, message: 'Unsupported location' });
    }
    res.status(200).json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error getting location data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCitySnapshot = async (req, res) => {
  try {
    const snapshot = await getCitySnapshot(req.params.city);
    if (!snapshot) return res.status(400).json({ success: false, message: 'Unsupported city' });
    res.status(200).json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error getting city snapshot:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRegionalOverview = async (req, res) => {
  try {
    const overview = await getOverview();
    const alerts = isDbReady()
      ? await require('../models/WeatherAlert').find({ endTime: { $gte: new Date() } }).sort({ startTime: -1 }).lean()
      : memory.getAlerts();
    let lake;
    if (isDbReady()) {
      const SeaLevel = require('../models/SeaLevel');
      const rows = await SeaLevel.find({ lake: 'Lake Victoria' }).sort({ date: 1 }).lean();
      if (rows.length) {
        const series = rows.map((r) => ({ date: new Date(r.date).toISOString().slice(0, 10), level: r.level }));
        lake = { lake: 'Lake Victoria', currentLevel: series[series.length - 1]?.level, series };
      }
    }
    if (!lake) {
      const series = mockLakeSeries();
      lake = { lake: 'Lake Victoria', currentLevel: series[series.length - 1].level, series };
    }
    res.status(200).json({
      success: true,
      data: { ...overview, alerts, lakeVictoria: lake },
    });
  } catch (error) {
    console.error('Error getting regional overview:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getWeatherAlerts = async (req, res) => {
  try {
    if (isDbReady()) {
      const WeatherAlert = require('../models/WeatherAlert');
      const active = await WeatherAlert.find({ endTime: { $gte: new Date() } }).sort({ startTime: -1 }).lean();
      if (active.length) return res.status(200).json({ success: true, data: active });
    }
    res.status(200).json({ success: true, data: memory.getAlerts() });
  } catch (error) {
    console.error('Error getting weather alerts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAirQuality = async (req, res) => {
  try {
    const { location } = req.params;
    const snapshot = await getCitySnapshot(location).catch(() => null);
    if (WAQI_TOKEN && WAQI_TOKEN !== 'your_waqi_token_here') {
      try {
        const url = `https://api.waqi.info/feed/${encodeURIComponent(location)}/?token=${WAQI_TOKEN}`;
        const { data } = await axios.get(url, { timeout: 8000 });
        if (data.status === 'ok') {
          return res.status(200).json({
            success: true,
            data: {
              location,
              aqi: data.data.aqi,
              mainPollutant: data.data.dominentpol,
              timestamp: data.data.time?.iso || new Date().toISOString(),
              components: data.data.iaqi || {},
            },
          });
        }
      } catch (err) {
        console.warn('WAQI fallback to Open-Meteo:', err.message);
      }
    }
    if (!snapshot) return res.status(502).json({ success: false, message: 'Air quality unavailable' });
    res.status(200).json({
      success: true,
      data: {
        location,
        aqi: snapshot.aqi,
        mainPollutant: 'pm2.5',
        timestamp: snapshot.lastUpdated,
        components: {},
      },
    });
  } catch (error) {
    console.error('Error getting air quality data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getModeledAirQuality = async (req, res) => {
  try {
    const snapshot = await getCitySnapshot(req.params.city);
    if (!snapshot) return res.status(400).json({ success: false, message: 'Unsupported city' });
    res.status(200).json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error getting modeled air quality:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCityWeather = async (req, res) => {
  try {
    const snapshot = await getCitySnapshot(req.params.city);
    if (!snapshot) return res.status(400).json({ success: false, message: 'Unsupported city' });
    res.status(200).json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error getting city weather:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSeaLevelData = async (req, res) => {
  try {
    if (isDbReady()) {
      const SeaLevel = require('../models/SeaLevel');
      const rows = await SeaLevel.find({ lake: 'Lake Victoria' }).sort({ date: 1 }).lean();
      if (rows.length) {
        const series = rows.map((r) => ({ date: new Date(r.date).toISOString().slice(0, 10), level: r.level }));
        return res.status(200).json({
          success: true,
          data: {
            lake: 'Lake Victoria',
            currentLevel: series[series.length - 1]?.level,
            series,
            source: 'Hydro Service',
            lastUpdated: new Date().toISOString(),
          },
        });
      }
    }
    const series = mockLakeSeries();
    res.status(200).json({
      success: true,
      data: {
        lake: 'Lake Victoria',
        currentLevel: series[series.length - 1].level,
        series,
        source: 'Modeled regional hydro series',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error getting sea level data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getGlacierData = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        annualMassChange: -0.8,
        cumulativeChange: -24.5,
        source: 'WGMS',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error getting glacier data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.CITY_COORDS = CITY_COORDS;
exports.cache = cache;
