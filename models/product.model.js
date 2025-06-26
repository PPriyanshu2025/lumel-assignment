const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, unique: true, index: true },
  name: String,
  brand: String,
  description: String,
  category: String,
  sub_category: String,
  unit_price: Number,
  inventory_status: String,
  launch_date: Date
},{
      timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
