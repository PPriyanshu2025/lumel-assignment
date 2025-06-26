const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id: { type: String, unique: true, index: true },
  name: String,
  email: String,
  address: String,
  region: String,
  demographics: {
    gender: String,
    age_group: String,
    income_bracket: String
  },
  loyalty_status: String,
  registered_on: Date
},{
      timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
