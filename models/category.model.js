const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: { type: String, unique: true },
  sub_categories: [String]
},{
      timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
