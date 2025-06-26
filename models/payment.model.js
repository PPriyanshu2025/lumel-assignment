const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payment_method: { type: String, unique: true },
  provider: String,
  processing_fee_percent: Number,
  supported_countries: [String]
},{
      timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
