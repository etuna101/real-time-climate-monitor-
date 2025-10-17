const mongoose = require('mongoose');

const SeaLevelSchema = new mongoose.Schema(
  {
    lake: { type: String, default: 'Lake Victoria', index: true },
    date: { type: Date, index: true },
    level: { type: Number },
  },
  { timestamps: true }
);

SeaLevelSchema.index({ lake: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SeaLevel', SeaLevelSchema);


