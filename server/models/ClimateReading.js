const mongoose = require('mongoose');

const ClimateReadingSchema = new mongoose.Schema(
  {
    region: { type: String, index: true },
    date: { type: Date, index: true },
    temperatureAnomaly: { type: Number },
    precipitationAnomaly: { type: Number },
  },
  { timestamps: true }
);

ClimateReadingSchema.index({ region: 1, date: 1 });

module.exports = mongoose.model('ClimateReading', ClimateReadingSchema);


