const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  region_name: { type: String, unique: true },
  countries: [String],
  warehouse_location: String
});

module.exports = mongoose.model('Region', regionSchema);
