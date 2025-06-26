const mongoose = require('mongoose');
const Category = require('./models/category.model');

mongoose.connect('mongodb://localhost:27017/lumel-devDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedCategories = async () => {
  try {
    const categories = [
      {
        category_name: "Shoes",
        sub_categories: ["Running", "Casual", "Formal"]
      },
      {
        category_name: "Electronics",
        sub_categories: ["Smartphones", "Laptops", "Tablets"]
      }
    ];

    await Category.insertMany(categories);
    console.log("✅ Seeded Categories Successfully");
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedCategories();
