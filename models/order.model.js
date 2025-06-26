const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, unique: true, index: true },
  customer_id: String,
  date_of_sale: Date,
  region: String,
  shipping_cost: Number,
  payment_method: String,
  marketing_campaign: String,
  items: [{
    product_id: String,
    product_name: String,
    category: String,
    quantity_sold: Number,
    unit_price: Number,
    discount: Number
  }],
  total_amount: Number,
  order_status: String
},{
      timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
