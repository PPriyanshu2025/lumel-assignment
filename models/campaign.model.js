const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, unique: true, index: true },
  description: String,
  start_date: Date,
  end_date: Date,
  targeted_region: String,
  targeted_gender: [String],
  source_channel: String
},{
      timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema);
