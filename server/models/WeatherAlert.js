const mongoose = require('mongoose');

const WeatherAlertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    severity: { type: String, required: true },
    location: { type: String, required: true, index: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeatherAlert', WeatherAlertSchema);


