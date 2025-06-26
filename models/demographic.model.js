const mongoose = require('mongoose');

const demographicSchema = new mongoose.Schema({
  customer_id: String,
  age_group: String,
  gender: String,
  income_bracket: String,
  marital_status: String
},{
      timestamps: true
});

module.exports = mongoose.model('Demographic', demographicSchema);
