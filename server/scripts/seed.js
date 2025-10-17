require('dotenv').config();
const mongoose = require('mongoose');
const ClimateReading = require('../models/ClimateReading');
const SeaLevel = require('../models/SeaLevel');
const WeatherAlert = require('../models/WeatherAlert');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/climate-dashboard';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Seed climate readings for last 5 years monthly for region east_africa
  const years = 5;
  const points = years * 12;
  const now = new Date();
  const readings = Array.from({ length: points }).map((_, i) => {
    const date = new Date(now);
    date.setMonth(now.getMonth() - (points - 1 - i));
    const tempAnomaly = Math.sin(i / 8) * 0.3 + 0.8 + (i / points) * 0.1;
    const precipAnomaly = Math.cos(i / 6) * 0.2 + (i % 12 >= 8 && i % 12 <= 10 ? 0.25 : 0);
    return {
      region: 'east_africa',
      date,
      temperatureAnomaly: Number(tempAnomaly.toFixed(2)),
      precipitationAnomaly: Number(precipAnomaly.toFixed(2)),
    };
  });
  await ClimateReading.deleteMany({ region: 'east_africa' });
  await ClimateReading.insertMany(readings);
  console.log(`Seeded ${readings.length} climate readings`);

  // Seed sea level 10 years monthly for Lake Victoria
  const months = 120;
  const seaSeries = Array.from({ length: months }).map((_, i) => {
    const date = new Date(now);
    date.setMonth(now.getMonth() - (months - 1 - i));
    const level = 1130 + i * 0.02 + Math.sin(i / 6) * 0.1;
    return { lake: 'Lake Victoria', date, level: Number(level.toFixed(2)) };
  });
  await SeaLevel.deleteMany({ lake: 'Lake Victoria' });
  await SeaLevel.insertMany(seaSeries);
  console.log(`Seeded ${seaSeries.length} sea level points`);

  // Seed weather alerts
  await WeatherAlert.deleteMany({});
  await WeatherAlert.insertMany([
    {
      type: 'heavy_rain',
      severity: 'moderate',
      location: 'Kenyan Highlands',
      description: 'Short rains intensifying in Central Highlands. Localized flooding possible in low-lying areas.',
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      type: 'drought',
      severity: 'high',
      location: 'Southern Tanzania',
      description: 'Developing drought conditions; hydropower generation affected by low inflows.',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log('Seeded weather alerts');

  await mongoose.disconnect();
  console.log('Done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


