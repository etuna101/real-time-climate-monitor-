const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
const OPEN_METEO_BASE = process.env.OPEN_METEO_BASE || 'https://api.open-meteo.com/v1';
const OPEN_METEO_AIR = process.env.OPEN_METEO_AIR_BASE || 'https://air-quality-api.open-meteo.com/v1';

const CITY_COORDS = {
  nairobi: { lat: -1.286389, lon: 36.817223, label: 'Nairobi', country: 'Kenya' },
  dar: { lat: -6.792354, lon: 39.208328, label: 'Dar es Salaam', country: 'Tanzania' },
  dodoma: { lat: -6.163, lon: 35.7516, label: 'Dodoma', country: 'Tanzania' },
  kampala: { lat: 0.347596, lon: 32.58252, label: 'Kampala', country: 'Uganda' },
};

const WEATHER_TEXT = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Snow',
  80: 'Rain showers',
  81: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
};

function weatherCodeToText(code) {
  return WEATHER_TEXT[code] || 'Mixed conditions';
}

function aqiCategory(aqi) {
  if (aqi == null || Number.isNaN(Number(aqi))) return { label: 'Unknown', tone: 'info' };
  const n = Number(aqi);
  if (n <= 50) return { label: 'Good', tone: 'good' };
  if (n <= 100) return { label: 'Moderate', tone: 'moderate' };
  if (n <= 150) return { label: 'Unhealthy for sensitive groups', tone: 'high' };
  return { label: 'Unhealthy', tone: 'extreme' };
}

function soilMoisturePct(m3) {
  if (m3 == null) return null;
  return Math.max(0, Math.min(100, Math.round(Number(m3) * 100)));
}

function latestHourly(hourly, key) {
  if (!hourly || !Array.isArray(hourly[key]) || !hourly[key].length) return null;
  const times = hourly.time || [];
  const now = Date.now();
  let idx = hourly[key].length - 1;
  for (let i = 0; i < times.length; i += 1) {
    if (new Date(times[i]).getTime() <= now) idx = i;
  }
  return hourly[key][idx];
}

function sumNextHours(hourly, key, hours = 168) {
  if (!hourly || !Array.isArray(hourly[key])) return 0;
  return hourly[key].slice(0, hours).reduce((sum, v) => sum + (Number(v) || 0), 0);
}

async function fetchJson(url, ttl = 300) {
  const cached = cache.get(url);
  if (cached) return cached;
  const { data } = await axios.get(url, { timeout: 8000 });
  cache.set(url, data, ttl);
  return data;
}

async function getCitySnapshot(cityKey) {
  const key = String(cityKey || '').toLowerCase();
  const coords = CITY_COORDS[key];
  if (!coords) return null;

  const cacheKey = `snapshot:${key}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const weatherUrl =
    `${OPEN_METEO_BASE}/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code` +
    `&hourly=temperature_2m,precipitation,soil_moisture_0_to_7cm` +
    `&daily=precipitation_sum,temperature_2m_mean` +
    `&timezone=auto&forecast_days=7`;
  const airUrl =
    `${OPEN_METEO_AIR}/air-quality?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone&timezone=auto`;

  const [weather, air] = await Promise.all([
    fetchJson(weatherUrl, 300),
    fetchJson(airUrl, 300).catch(() => null),
  ]);

  const aqi = air?.current?.european_aqi ?? null;
  const soil = soilMoisturePct(latestHourly(weather.hourly, 'soil_moisture_0_to_7cm'));
  const precip7d = weather.daily?.precipitation_sum
    ? weather.daily.precipitation_sum.reduce((s, v) => s + (Number(v) || 0), 0)
    : sumNextHours(weather.hourly, 'precipitation', 168);
  const temps = weather.daily?.temperature_2m_mean || [];
  const avgTemp = temps.length
    ? temps.reduce((s, v) => s + Number(v), 0) / temps.length
    : weather.current?.temperature_2m;

  const snapshot = {
    city: key,
    label: coords.label,
    country: coords.country,
    temperature: weather.current?.temperature_2m ?? null,
    humidity: weather.current?.relative_humidity_2m ?? null,
    precipitation: weather.current?.precipitation ?? 0,
    weatherCode: weather.current?.weather_code,
    weather: weatherCodeToText(weather.current?.weather_code),
    soilMoisturePct: soil,
    precip7dMm: Number(precip7d.toFixed(1)),
    avgTemp7d: avgTemp != null ? Number(Number(avgTemp).toFixed(1)) : null,
    aqi: aqi != null ? Math.round(aqi) : null,
    aqiMeta: aqiCategory(aqi),
    source: 'Open-Meteo',
    lastUpdated: weather.current?.time || new Date().toISOString(),
  };

  cache.set(cacheKey, snapshot, 300);
  return snapshot;
}

async function getOverview() {
  const keys = ['nairobi', 'dar', 'kampala'];
  const cities = {};
  await Promise.all(
    keys.map(async (k) => {
      cities[k] = await getCitySnapshot(k);
    })
  );
  const temps = keys.map((k) => cities[k]?.temperature).filter((v) => v != null);
  const rains = keys.map((k) => cities[k]?.precip7dMm).filter((v) => v != null);
  const regionalAvgTemp = temps.length
    ? Number((temps.reduce((s, v) => s + v, 0) / temps.length).toFixed(1))
    : null;
  const regionalRainfall = rains.length
    ? Number((rains.reduce((s, v) => s + v, 0) / rains.length).toFixed(1))
    : null;
  return { cities, regionalAvgTemp, regionalRainfall, lastUpdated: new Date().toISOString() };
}

module.exports = {
  CITY_COORDS,
  weatherCodeToText,
  aqiCategory,
  getCitySnapshot,
  getOverview,
  cache,
};
