const express = require('express');
const router = express.Router();
const climateController = require('../controllers/climateController');

// Get global climate data
router.get('/global', climateController.getGlobalData);

// Get historical data
router.get('/historical', climateController.getHistoricalData);

// Get location-specific data
router.get('/location/:locationId', climateController.getLocationData);

// Get extreme weather alerts
router.get('/alerts', climateController.getWeatherAlerts);

// Get air quality data
router.get('/air-quality/:location', climateController.getAirQuality);
router.get('/air-quality-modeled/:city', climateController.getModeledAirQuality);
router.get('/weather/:city', climateController.getCityWeather);

// Get sea level data
router.get('/sea-level', climateController.getSeaLevelData);

// Get glacier mass balance data
router.get('/glaciers', climateController.getGlacierData);

module.exports = router;
